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
    return f'''<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="{escape(description, quote=True)}">
  <meta name="theme-color" content="#F9F8F6">
  <title>{escape(title)} · Xv Yan</title>
  <link rel="stylesheet" href="{prefix}assets/style.css?v={style_version}">
  {script}
</head>
<body>
  <a class="skip-link" href="#main">跳到正文</a>
  <header class="site-header wrap">
    <a class="brand" href="{prefix or './'}" aria-label="Xv Yan 首页">Xv Yan</a>
    <nav aria-label="主导航">{nav}</nav>
  </header>
  <main id="main" tabindex="-1" class="wrap">{body}</main>
  <footer class="site-footer"><div class="wrap footer-inner"><a href="{prefix or './'}">Xv Yan</a><span>xvyan.cn</span></div></footer>
</body>
</html>
'''


def calendar():
    days = ''.join(f'<span>{day}</span>' for day in ['周一', '周二', '周三', '周四', '周五', '周六', '周日'])
    hours = ''.join(f'<span>{hour}:00</span>' for hour in ['08', '10', '12', '14', '16', '18'])
    blocks = '<span class="calendar-cell"></span>' * 35 + ''.join(f'<i class="lesson lesson-{i}"></i>' for i in range(1, 11))
    return f'<div class="calendar" aria-hidden="true"><div class="weekdays">{days}</div><div class="hours">{hours}</div><div class="calendar-grid">{blocks}</div></div>'


def project(heading="h3"):
    return f'''<section class="project" id="courselens" aria-labelledby="project-name"><div class="project-copy">
      <{heading} id="project-name">morrow</{heading}><p class="project-subtitle">课表与学习任务应用</p>
      <p class="muted">课表、任务与快递，整理在一个应用里。</p>
      <div class="project-links"><a class="text-link primary-link" href="https://morrow.xvyan.cn/">访问官网</a><a class="text-link" href="https://github.com/fangfar/Morrow">GitHub 仓库</a></div>
    </div>{calendar()}</section>'''


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
    repositories = ''.join(f'''<li><a class="star-repo" href="https://github.com/{escape(repo['name'], quote=True)}"><h3>{escape(repo['name'])}</h3><p>{escape(repo["description"])}</p></a></li>''' for repo in stars['repositories'])
    home = f'''<section id="home" tabindex="-1" class="hero" aria-labelledby="hello"><div class="hero-copy">
      <p class="section-label">个人主页</p>
      <h1 id="hello"><span>你好，我是</span> <span>Xv Yan。</span></h1>
      <p class="hero-lead">做一些自己需要、也希望对别人有用的东西。</p>
      <p class="hero-description">在这里记录开发、分享作品，也写一点日常。</p>
      <div class="hero-links"><a class="text-link primary-link" href="#works">看看我的作品</a></div>
    </div><div class="hero-media"><img src="assets/editorial-desk.webp" width="1200" height="900" alt="窗边暖调书桌上的笔记本电脑、布面笔记本与铅笔" fetchpriority="high" decoding="async"></div></section>
    <section id="works" tabindex="-1" class="home-section" aria-labelledby="works-title"><div class="section-heading"><p class="section-label">作品</p><h2 id="works-title">正在做的作品</h2></div>{project()}
      <p class="section-note">也在尝试写故事、做科普动画。有可以分享的作品时，会放在这里。</p></section>
    <section id="stars" tabindex="-1" class="home-section" aria-labelledby="stars-title"><div class="section-heading"><p class="section-label">收藏</p><h2 id="stars-title">我的收藏</h2></div>
      <div class="stars-meta"><p>GitHub 星标 · 共 <span class="number">{len(stars['repositories'])}</span> 个项目 · 更新于 <time datetime="{escape(stars['updated'], quote=True)}">{escape(stars['updated'])}</time></p><a class="text-link" href="https://github.com/fangfar?tab=stars">在 GitHub 查看</a></div>
      {f'<ul class="star-list">{repositories}</ul>' if repositories else '<p class="page-note">暂时没有收藏的仓库。</p>'}</section>
    <section id="about" tabindex="-1" class="home-section" aria-labelledby="about-title"><div class="section-heading"><p class="section-label">关于</p><h2 id="about-title">关于我</h2></div>
      <div class="prose about-prose"><p class="opening">你好，我是 Xv Yan。</p><p>目前在做 morrow，也在尝试写故事、做科普动画。这里是放这些作品和记录的地方。</p><blockquote><p>不急着把每个想法都写成结论，先把值得留下的东西记下来。</p></blockquote><div class="about-links"><a class="text-link" href="https://github.com/fangfar">GitHub</a><a class="text-link" href="https://morrow.xvyan.cn/">morrow 官网</a></div></div></section>'''
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
