import importlib.util
import io
import json
import unittest
from html.parser import HTMLParser
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("site_builder", ROOT / "build.py")
site = importlib.util.module_from_spec(spec)
spec.loader.exec_module(site)
import sync_stars


class Document(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.links, self.ids, self.tags = [], set(), []
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.tags.append((tag, attrs))
        if "id" in attrs:
            if attrs["id"] in self.ids:
                raise AssertionError(f"Duplicate id: {attrs['id']}")
            self.ids.add(attrs["id"])
        if tag in ("a", "link", "img", "script"):
            self.links.append(attrs.get("href", attrs.get("src", "")))


class SiteTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        site.build()
        cls.pages = {p: Document(p.read_text(encoding="utf-8")) for p in site.OUT.rglob("*.html")}

    def test_all_local_links_and_fragments_resolve(self):
        for path, doc in self.pages.items():
            for link in doc.links:
                with self.subTest(page=path.name, link=link):
                    self.assertTrue(link, "Empty link")
                    url = urlsplit(link)
                    if url.scheme or url.netloc:
                        self.assertEqual(url.scheme, "https")
                        continue
                    target = (site.OUT / unquote(url.path.lstrip("/"))) if url.path.startswith("/") else (path.parent / unquote(url.path))
                    if not url.path:
                        target = path
                    if target.is_dir():
                        target /= "index.html"
                    target = target.resolve()
                    self.assertTrue(target.is_relative_to(site.OUT.resolve()))
                    self.assertTrue(target.is_file(), str(target))
                    if url.fragment:
                        target_doc = self.pages.get(target) or Document(target.read_text(encoding="utf-8"))
                        self.assertIn(unquote(url.fragment), target_doc.ids)

    def test_page_structure_and_no_external_runtime_dependencies(self):
        self.assertEqual(len(self.pages), 5)
        for path, doc in self.pages.items():
            with self.subTest(page=str(path)):
                self.assertEqual(sum(tag == "h1" for tag, _ in doc.tags), 1)
                self.assertEqual(sum(tag == "main" for tag, _ in doc.tags), 1)
                self.assertTrue(any(tag == "html" and a.get("lang") == "zh-CN" for tag, a in doc.tags))
                self.assertTrue(any(tag == "meta" and a.get("name") == "description" and a.get("content") for tag, a in doc.tags))
                self.assertTrue(any(tag == "meta" and a.get("name") == "viewport" for tag, a in doc.tags))
                scripts = [attrs for tag, attrs in doc.tags if tag == "script"]
                if path == site.OUT / "index.html":
                    self.assertEqual(len(scripts), 1)
                    self.assertTrue(scripts[0]["src"].startswith("assets/motion.js?v="))
                    self.assertIn("defer", scripts[0])
                else:
                    self.assertEqual(scripts, [])
                for tag, attrs in doc.tags:
                    if tag == "img":
                        self.assertIn("alt", attrs)
                        self.assertIn("width", attrs)
                        self.assertIn("height", attrs)
                    if tag in ("img", "script") or (tag == "link" and attrs.get("rel") == "stylesheet"):
                        self.assertFalse(urlsplit(attrs.get("src", attrs.get("href", ""))).scheme)

    def test_articles_are_removed_from_build(self):
        home = self.pages[site.OUT / "index.html"]
        self.assertNotIn("articles", home.ids)
        self.assertNotIn("#articles", home.links)
        self.assertFalse((site.OUT / "articles").exists())
        with TemporaryDirectory() as folder, patch.object(site, "OUT", Path(folder)):
            (site.OUT / "articles").mkdir()
            (site.OUT / "articles" / "old.html").write_text("old", encoding="utf-8")
            site.build()
            self.assertFalse((site.OUT / "articles").exists())

    def test_metadata_is_escaped(self):
        result = site.layout('<script>alert(1)</script>', '" onload="bad', "home", "<h1>正文</h1>")
        self.assertNotIn('<title><script>', result)
        self.assertIn('&lt;script&gt;', result)
        self.assertIn('&quot; onload=&quot;bad', result)

    def test_stars_page_uses_snapshot_and_escapes_descriptions(self):
        links = self.pages[site.OUT / "index.html"].links
        for repo in site.load_stars()["repositories"]:
            self.assertIn("https://github.com/" + repo["name"], links)
        stars = {"updated": "2026-11-04", "repositories": [
            {"name": "example/project", "description": '<script>bad</script>'},
            {"name": "example/empty", "description": ''},
        ]}
        with TemporaryDirectory() as folder, patch.object(site, "OUT", Path(folder)), patch.object(site, "load_stars", return_value=stars):
            site.build()
            page = (site.OUT / "index.html").read_text(encoding="utf-8")
            self.assertIn('共 2 个项目', page)
            self.assertIn('https://github.com/example/project', page)
            self.assertIn('&lt;script&gt;bad&lt;/script&gt;', page)
            self.assertNotIn('<script>bad</script>', page)

    def test_invalid_or_duplicate_star_names_rejected(self):
        for names in (["example/../bad"], ["example/.."], ["example/repo", "Example/Repo"]):
            with self.subTest(names=names), TemporaryDirectory() as folder:
                root = Path(folder)
                (root / "content").mkdir()
                data = {"updated": "2026-11-04", "repositories": [{"name": name, "description": ""} for name in names]}
                (root / "content/stars.json").write_text(json.dumps(data), encoding="utf-8")
                with patch.object(site, "ROOT", root), self.assertRaises(ValueError):
                    site.load_stars()

    def test_navigation_targets_home_sections_and_legacy_urls_redirect(self):
        home = self.pages[site.OUT / "index.html"]
        for key, _ in site.NAV:
            self.assertIn(key, home.ids)
            self.assertIn("#" + key, home.links)
            if key != "home":
                old = self.pages[site.OUT / key / "index.html"]
                self.assertTrue(any(tag == "meta" and attrs.get("http-equiv") == "refresh"
                                    and attrs.get("content") == f"0;url=../#{key}"
                                    for tag, attrs in old.tags))
    def test_chinese_intros_and_new_stars_survive_sync(self):
        intros_path = ROOT / "content/star-intros.json"
        original = intros_path.read_bytes()
        intros = json.loads(original)
        for name, intro in intros.items():
            with self.subTest(repo=name):
                self.assertLessEqual(len(intro), 64)
                self.assertRegex(intro, r"[\u4e00-\u9fff]")
        with TemporaryDirectory() as folder:
            root = Path(folder)
            (root / "content").mkdir()
            (root / "content/star-intros.json").write_bytes(original)
            response = io.BytesIO(json.dumps([{"full_name": "openai/codex", "description": "Changed upstream"},
                                            {"full_name": "example/new", "description": "x" * 10000}]).encode())
            with patch.object(sync_stars, "urlopen", return_value=response):
                sync_stars.sync(root / "content/stars.json")
            with patch.object(site, "ROOT", root):
                repos = site.load_stars()["repositories"]
            self.assertEqual(repos[0]["description"], intros["openai/codex"])
            self.assertEqual(repos[1]["description"], "中文简介待整理，可前往仓库查看项目说明。")
            self.assertEqual((root / "content/star-intros.json").read_bytes(), original)

    def test_sync_fetches_all_pages_and_preserves_snapshot_on_failure(self):
        first = [{"full_name": f"owner/repo-{i}", "description": None} for i in range(100)]
        last = [{"full_name": "owner/last", "description": "Last"}]
        response = lambda data: io.BytesIO(json.dumps(data).encode("utf-8"))
        with TemporaryDirectory() as folder:
            target = Path(folder) / "stars.json"
            target.write_text("original", encoding="utf-8")
            with patch.object(sync_stars, "urlopen", side_effect=[response(first), OSError("offline")]):
                with self.assertRaises(OSError):
                    sync_stars.sync(target)
            self.assertEqual(target.read_text(encoding="utf-8"), "original")
            with patch.object(sync_stars, "urlopen", side_effect=[response(first), response(last)]) as fetch:
                sync_stars.sync(target)
            data = json.loads(target.read_text(encoding="utf-8"))
            self.assertEqual(fetch.call_count, 2)
            self.assertEqual(len(data["repositories"]), 101)
            self.assertEqual(data["repositories"][-1]["name"], "owner/last")

    def test_original_photo_and_design_are_not_deployed(self):
        self.assertFalse((site.OUT / "design").exists())
        self.assertFalse((site.OUT / "content").exists())
        self.assertFalse(list(site.OUT.rglob("*.jpg")))
        self.assertFalse((site.OUT / "assets/avatar.webp").exists())
        for doc in self.pages.values():
            for tag, attrs in doc.tags:
                if tag == "img":
                    self.assertNotIn("avatar", attrs.get("src", "").lower())
                    self.assertNotIn("头像", attrs.get("alt", ""))

    def test_deployment_domain_matches_repository(self):
        self.assertEqual((site.OUT / "CNAME").read_text(encoding="utf-8").strip(), "xvyan.cn")

    def test_morrow_links_use_current_domain_and_repository(self):
        links = [link for doc in self.pages.values() for link in doc.links]
        self.assertIn("https://morrow.xvyan.cn/", links)
        self.assertIn("https://github.com/fangfar/Morrow", links)
        for link in links:
            self.assertNotIn("courselens.xvyan.cn", link)
            self.assertNotIn("/CourseLens-public", link)


if __name__ == "__main__":
    unittest.main()
