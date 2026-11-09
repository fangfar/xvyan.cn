"""Build the local preview using only Python's standard library."""
import hashlib
import json
import re
import shutil
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "dist"
NAV = [("home", "首页"), ("works", "作品"), ("stars", "收藏"), ("about", "关于")]


def load_stars():
    data = json.loads((ROOT / "content/stars.json").read_text(encoding="utf-8"))
    validate_stars(data)
    intros = json.loads((ROOT / "content/star-intros.json").read_text(encoding="utf-8"))
    for repo in data["repositories"]:
        intro = intros.get(repo["name"], "中文简介待整理，可前往仓库查看项目说明。")
        if not isinstance(intro, str) or not 1 <= len(intro.strip()) <= 64:
            raise ValueError(f"Invalid Chinese introduction for {repo['name']}")
        repo["description"] = intro
    return data


def validate_stars(data):
    seen = set()
    for repo in data["repositories"]:
        name = repo["name"]
        if not isinstance(name, str) or not re.fullmatch(r"[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+", name) or any(part in ('.', '..') for part in name.split('/')) or name.lower() in seen:
            raise ValueError(f"Invalid or duplicate repository name: {name}")
        if not isinstance(repo["description"], str):
            raise ValueError(f"Invalid description for {name}")
        seen.add(name.lower())


def layout(title, description, active, body, prefix=""):
    style_version = hashlib.sha256((ROOT / "assets/style.css").read_bytes()).hexdigest()[:12]
    script = ""
    if not prefix and not active:
        motion_version = hashlib.sha256((ROOT / "assets/motion.js").read_bytes()).hexdigest()[:12]
        script = f'<script src="assets/motion.js?v={motion_version}" defer></script>'
    nav = "".join(f'<a href="{prefix}#{key}"' + (' aria-current="location"' if key == active else '') + f'>{label}</a>' for key, label in NAV)
    theme_version = hashlib.sha256((ROOT / "assets/theme.js").read_bytes()).hexdigest()[:12]
    return f'''<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="description" content="{escape(description, quote=True)}">
  <meta name="theme-color" content="#FAF6EF">
  <title>{escape(title)} · Xv Yan</title>
  <script src="{prefix}assets/theme.js?v={theme_version}"></script>
  <link rel="stylesheet" href="{prefix}assets/style.css?v={style_version}">
  {script}
</head>
<body id="top">
  <a class="skip-link" href="#main">跳到正文</a>
  <div class="page">
  <header class="site-head site-header">
    <a class="brand" href="{prefix or './'}" aria-label="Xv Yan 首页">Xv Yan</a>
    <nav class="site-nav" aria-label="主导航">{nav}</nav>
    <button class="theme-toggle" type="button" aria-label="切换为深色模式" aria-pressed="false" title="切换为深色模式">
      <svg class="theme-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 13A8.5 8.5 0 0 1 11 3.5 8.5 8.5 0 1 0 20.5 13Z"/></svg>
      <svg class="theme-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg>
    </button>
  </header>
  <main id="main" tabindex="-1">{body}</main>
  <footer><span>Xv Yan · xvyan.cn</span><a href="{prefix}#home">回到顶部</a></footer>
  </div>
</body>
</html>
'''


def write(path, content):
    target = OUT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content, encoding="utf-8")


def build():
    stars = load_stars()
    OUT.mkdir(exist_ok=True)
    if (OUT / "articles").exists():
        shutil.rmtree(OUT / "articles")
    shutil.copytree(ROOT / "assets", OUT / "assets", dirs_exist_ok=True)
    (OUT / "assets/avatar.webp").unlink(missing_ok=True)
    repositories = ''.join(f'''<li data-search="{escape(repo['name'].lower() + ' ' + repo['description'].lower(), quote=True)}"><a class="star-repo" href="https://github.com/{escape(repo['name'], quote=True)}">{escape(repo['name'])}</a><span class="star-desc">{escape(repo['description'])}</span></li>''' for repo in stars['repositories'])
    home = (ROOT / "home.html").read_text(encoding="utf-8")
    home = home.replace("__REPOSITORIES__", repositories).replace("__COUNT__", str(len(stars['repositories']))).replace("__UPDATED__", escape(stars['updated'], quote=True))
    write("index.html", layout("首页", "Xv Yan 的个人网站，分享作品与收藏。", "", home))
    for key, label in NAV[1:]:
        target = f"../#{key}"
        body = f'<section class="page-intro"><h1>{label}</h1><p><a class="text-link" href="{target}">前往首页的{label}区域</a></p></section>'
        page = layout(label, f"Xv Yan 的{label}。", key, body, "../")
        page = page.replace('</head>', f'<meta http-equiv="refresh" content="0;url={target}"><link rel="canonical" href="https://xvyan.cn/#{key}"></head>')
        write(f"{key}/index.html", page)
    write("404.html", layout("页面未找到", "这个页面暂时不存在。", "", f'<section class="not-found"><p>404</p><h1>这一页，还没写到。</h1><p>地址可能有误，也可能已经移动。回首页看看吧。</p><a class="text-link" href="/">返回首页</a></section>', "/"))
    write(".nojekyll", "")
    shutil.copyfile(ROOT / "CNAME", OUT / "CNAME")
    print(f"Built {len(list(OUT.rglob('*.html')))} pages in {OUT}")


if __name__ == "__main__":
    build()
