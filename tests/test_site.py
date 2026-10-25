import importlib.util
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
        self.assertEqual(len(self.pages), 8)
        for path, doc in self.pages.items():
            with self.subTest(page=str(path)):
                self.assertEqual(sum(tag == "h1" for tag, _ in doc.tags), 1)
                self.assertEqual(sum(tag == "main" for tag, _ in doc.tags), 1)
                self.assertTrue(any(tag == "html" and a.get("lang") == "zh-CN" for tag, a in doc.tags))
                self.assertTrue(any(tag == "meta" and a.get("name") == "description" and a.get("content") for tag, a in doc.tags))
                self.assertTrue(any(tag == "meta" and a.get("name") == "viewport" for tag, a in doc.tags))
                self.assertFalse(any(tag == "script" for tag, _ in doc.tags))
                for tag, attrs in doc.tags:
                    if tag == "img":
                        self.assertIn("alt", attrs)
                        self.assertIn("width", attrs)
                        self.assertIn("height", attrs)
                    if tag in ("img", "link"):
                        self.assertFalse(urlsplit(attrs.get("src", attrs.get("href", ""))).scheme)

    def test_every_preview_article_is_labeled(self):
        for post in site.load_posts():
            text = (site.OUT / "articles" / post["slug"] / "index.html").read_text(encoding="utf-8")
            self.assertIn("正式内容待确认", text)
            self.assertIn(post["title"], text)

    def test_metadata_is_escaped(self):
        result = site.layout('<script>alert(1)</script>', '" onload="bad', "home", "<h1>正文</h1>")
        self.assertNotIn('<title><script>', result)
        self.assertIn('&lt;script&gt;', result)
        self.assertIn('&quot; onload=&quot;bad', result)

    def test_invalid_or_duplicate_slug_rejected(self):
        post = site.load_posts()[0]
        for items in ([dict(post, slug="../../secret")], [post, post]):
            with self.subTest(items=items), TemporaryDirectory() as folder:
                root = Path(folder)
                (root / "content").mkdir()
                (root / "content/posts.json").write_text(json.dumps(items), encoding="utf-8")
                with patch.object(site, "ROOT", root), self.assertRaises(ValueError):
                    site.load_posts()

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


if __name__ == "__main__":
    unittest.main()
