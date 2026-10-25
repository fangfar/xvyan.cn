"""Build the local preview using only Python's standard library."""
import json
import re
import shutil
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "dist"
ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>'
EXTERNAL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M14 4h6v6M20 4 10 14M10 5H5a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-5"/></svg>'
NAV = [("home", "首页", ""), ("articles", "文章", "articles/"), ("works", "作品", "works/"), ("about", "关于", "about/")]


def load_posts():
    posts = json.loads((ROOT / "content/posts.json").read_text(encoding="utf-8"))
    seen = set()
    for post in posts:
        slug = post["slug"]
        if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug) or slug in seen:
            raise ValueError(f"Invalid or duplicate article slug: {slug}")
        seen.add(slug)
        for field in ("title", "category", "summary", "body"):
            if not isinstance(post[field], str) or not post[field].strip():
                raise ValueError(f"Missing {field} for {slug}")
    return posts


def layout(title, description, active, body, prefix="", article=False):
    nav = "".join(f'<a href="{prefix}{path or "./"}"' + (' aria-current="page"' if key == active else '') + f'>{label}</a>' for key, label, path in NAV)
    return f'''<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="{escape(description, quote=True)}">
  <meta name="theme-color" content="#ffffff">
  <title>{escape(title)} · Xv Yan</title>
  <link rel="stylesheet" href="{prefix}assets/style.css">
</head>
<body>
  <a class="skip-link" href="#main">跳到正文</a>
  <header class="site-header wrap">
    <a class="brand" href="{prefix or './'}" aria-label="Xv Yan 首页">Xv Yan</a>
    <nav aria-label="主导航">{nav}</nav>
  </header>
  <main id="main" class="wrap{' reading-wrap' if article else ''}">{body}</main>
  <footer class="site-footer wrap"><a href="{prefix or './'}">Xv Yan</a><span>xvyan.cn</span></footer>
</body>
</html>
'''


def calendar():
    days = ''.join(f'<span>{day}</span>' for day in ['周一', '周二', '周三', '周四', '周五', '周六', '周日'])
    hours = ''.join(f'<span>{hour}:00</span>' for hour in ['08', '10', '12', '14', '16', '18'])
    blocks = ''.join(f'<i class="lesson lesson-{i}"></i>' for i in range(1, 11))
    return f'<div class="calendar" aria-hidden="true"><div class="weekdays">{days}</div><div class="hours">{hours}</div><div class="calendar-grid">{blocks}</div></div>'


def project(heading="h3"):
    return f'''<section class="project" id="courselens" aria-labelledby="project-name"><div class="project-copy">
      <{heading} id="project-name">morrow</{heading}><p class="project-subtitle">课表与学习任务应用</p>
      <p class="muted">从日常需要出发，持续打磨使用体验。</p>
      <a class="text-link" href="https://courselens.xvyan.cn/">访问官网 {EXTERNAL}</a>
    </div>{calendar()}</section>'''


def rows(posts, prefix="", expanded=False):
    items = []
    heading = "h2" if expanded else "h3"
    for post in posts:
        label = '预览文章' if post.get('preview') else escape(post.get('date', ''))
        items.append(f'''<li><a class="post-row{' expanded' if expanded else ''}" href="{prefix}articles/{post['slug']}/">
          <span class="post-meta">{label}<span class="meta-separator"> / </span>{escape(post['category'])}</span>
          <div class="post-text"><{heading}>{escape(post['title'])}</{heading}>{'<p>' + escape(post['summary']) + '</p>' if expanded else ''}</div>
          <span class="row-arrow">{ARROW}</span></a></li>''')
    return '<ul class="post-list">' + ''.join(items) + '</ul>'


def write(path, content):
    target = OUT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content, encoding="utf-8")


def build():
    posts = load_posts()
    OUT.mkdir(exist_ok=True)
    shutil.copytree(ROOT / "assets", OUT / "assets", dirs_exist_ok=True)
    (OUT / "assets/avatar.webp").unlink(missing_ok=True)
    home = f'''<section class="hero" aria-labelledby="hello"><div class="hero-copy">
      <h1 id="hello">你好，我是 Xv Yan。</h1>
      <p class="hero-lead">做一些自己需要、<br class="mobile-break">也希望对别人有用的东西。</p>
      <p class="hero-description">在这里记录开发、分享作品，也写一点日常。</p>
      <div class="hero-links"><a class="text-link" href="works/">看看我的作品 {ARROW}</a><a class="text-link" href="articles/">读读最近的文章 {ARROW}</a></div>
    </div></section>
    <section class="home-section" aria-labelledby="works-title"><div class="section-heading"><h2 id="works-title">正在做的作品</h2><span class="heading-line"></span></div>{project()}</section>
    <section class="home-section" aria-labelledby="posts-title"><div class="section-heading"><h2 id="posts-title">最近的记录</h2><span class="heading-line"></span><a class="text-link" href="articles/">全部文章 {ARROW}</a></div>{rows(posts[:3])}</section>
    <section class="other-work" aria-labelledby="other-title"><div class="section-heading"><h2 id="other-title">也在尝试</h2><span class="heading-line"></span></div><p>写故事，做科普动画，把想法变成作品。</p></section>'''
    write("index.html", layout("首页", "Xv Yan 的个人网站与博客，记录开发、分享作品，也写一点日常。", "home", home))
    articles = f'''<header class="page-intro"><h1>文章</h1><p>记录做过的事，和一路上的想法。</p></header>
      <section aria-label="文章列表">{rows(posts, '../', True)}</section>
      <p class="page-note">这里先放了三篇预览文章，正式内容会慢慢补上。</p>'''
    write("articles/index.html", layout("文章", "开发记录、网站搭建与日常随笔。", "articles", articles, "../"))
    works = f'''<header class="page-intro"><h1>作品</h1><p>从一个小需要开始，把想法做出来。</p></header>{project("h2")}
      <section class="work-notes prose"><h2>关于这个项目</h2><p>morrow 是我在做的 Android 应用，围绕课表与学习任务，持续打磨日常使用体验。</p><p>应用介绍、下载与使用说明都放在它自己的官网。这里记录项目，也记录做它的过程。</p><a class="text-link" href="https://github.com/fangfar/CourseLens-public">查看 GitHub 仓库 {EXTERNAL}</a></section>
      <section class="other-work"><div class="section-heading"><h2>其他创作</h2><span class="heading-line"></span></div><p>也在尝试写故事、做科普动画。有可以分享的作品时，会放在这里。</p></section>'''
    write("works/index.html", layout("作品", "Xv Yan 的项目与创作，包含 morrow。", "works", works, "../"))
    about = f'''<header class="about-intro"><div><h1>关于我</h1><p>你好，我是 Xv Yan。</p></div></header>
      <div class="prose about-prose"><p class="opening">做一些自己需要、也希望对别人有用的东西。</p><p>目前在做 morrow，也在尝试写故事、做科普动画。这个网站是放这些作品和记录的地方。</p><h2>关于这里</h2><p>这里会有开发中遇到的问题、做作品时的想法，也会有一点日常。不急着把每个想法都写成结论，先把值得留下的东西记下来。</p><h2>找到我</h2><p>可以在 GitHub 看看我的项目，也可以访问 morrow 官网了解应用。</p><div class="about-links"><a class="text-link" href="https://github.com/fangfar">GitHub {EXTERNAL}</a><a class="text-link" href="https://courselens.xvyan.cn/">morrow 官网 {EXTERNAL}</a></div></div>'''
    write("about/index.html", layout("关于", "关于 Xv Yan 和这个个人网站。", "about", about, "../"))
    for index, post in enumerate(posts):
        notice = '<aside class="preview-note">这是一篇用于预览版式的示例文章，正式内容待确认。</aside>' if post.get('preview') else ''
        following = posts[(index + 1) % len(posts)] if len(posts) > 1 else None
        next_link = f'<a class="next-post" href="../{following["slug"]}/"><span>继续阅读</span><strong>{escape(following["title"])}</strong>{ARROW}</a>' if following else ''
        body = f'''<article><header class="article-header"><a class="back-link" href="../">{ARROW} 全部文章</a><p class="article-category">{escape(post['category'])}</p><h1>{escape(post['title'])}</h1><p class="article-summary">{escape(post['summary'])}</p></header>{notice}<div class="prose article-body">{post['body']}</div><footer class="article-end"><span>写在 Xv Yan</span><a href="../../about/">关于作者</a></footer>{next_link}</article>'''
        write(f"articles/{post['slug']}/index.html", layout(post['title'], post['summary'], "articles", body, "../../", True))
    write("404.html", layout("页面未找到", "这个页面暂时不存在。", "", f'<section class="not-found"><p>404</p><h1>这一页，还没写到。</h1><p>地址可能有误，也可能已经移动。回首页看看吧。</p><a class="text-link" href="/">返回首页 {ARROW}</a></section>', "/"))
    write(".nojekyll", "")
    shutil.copyfile(ROOT / "CNAME", OUT / "CNAME")
    print(f"Built {len(list(OUT.rglob('*.html')))} pages in {OUT}")


if __name__ == "__main__":
    build()
