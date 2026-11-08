# Xv Yan

个人网站与博客，记录开发、分享作品，也写一点日常。

网站地址：[xvyan.cn](https://xvyan.cn/)。首页集中展示作品、文章列表、收藏与关于，导航通过锚点滚动定位，并随当前阅读区域切换高亮；内容滚动进入时轻微淡入上移。减少动态效果与键盘导航不播放入场动效。文章详情独立阅读，原栏目地址会跳到首页对应区域。部分文章为标注过的预览文案，正式内容待确认或替换。

## 本地查看

需要 Python 3.10 或更新版本，无需安装第三方包。

```powershell
py build.py
py -m http.server 4173 --bind 127.0.0.1 --directory dist
```

浏览器打开 http://127.0.0.1:4173/ 。停止预览按 Ctrl+C。

## 更新内容

- 首页、作品和关于区域：编辑 `build.py` 中对应文案。
- 文章：编辑 `content/posts.json`，列表按已发布文章和预览文章分区，每个分区内按数组顺序显示。`slug` 仅用小写英文、数字和短横线，且不可重复。
- `body` 是作者自己维护的 HTML 正文，不接受未经审核的外部 HTML。标题、分类与摘要会自动转义。
- `preview: true` 会显示预览文案提示。确认正文后设为 `false`，同时填写 `date`（例如 `2026-10-21`）。预览分区与提示会按内容自动显示。
- 收藏：运行 `py sync_stars.py` 从 GitHub 更新 `content/stars.json`，再重新构建。中文简介在 `content/star-intros.json` 中单独维护，每条最多 64 字，不会被同步覆盖。新项目尚无中文简介时显示待整理提示。本地可选设置 `GITHUB_TOKEN` 避免匿名访问限额；获取失败时原快照不变。
- 样式：`assets/style.css`，参考 [StyleKit Editorial](https://www.stylekit.top/zh/styles/editorial) 的暖米白、单色衬线排版。网站不展示或发布个人头像。
- 修改后重新运行 `py build.py`。

## 检查

```powershell
py -m unittest discover -s tests -v
node tests/test_motion.cjs
```

动效逻辑检查使用 Node.js 内置模块，不需要安装 npm 包。

测试会重新构建，检查导航、文章、片段定位、资源引用、标题与说明、预览提示、元数据转义、非法文章路径和页面内容无需 JavaScript 也能阅读，动效脚本只在首页本地加载。

## 自动部署

推送到 `main` 后，GitHub Actions 使用 Python 3.12 同步公开星标、执行检查并构建，仅将 `dist/` 发布到 GitHub Pages。工作流还会每天运行一次，也可以在 Actions 页面手动运行。同步或检查失败不会部署，原线上页面保留。自动同步更新部署内容，不修改仓库中的快照文件。

自定义域名为 `xvyan.cn`，在仓库 Settings → Pages 管理。仓库中保留 `CNAME`，构建时复制到发布目录。

`content/`、`design/` 与测试文件不作为网页发布。公开仓库本身仍可被浏览，不放私人资料。无账号、评论、统计脚本或第三方字体请求。
