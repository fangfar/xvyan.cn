# Xv Yan

个人网站，记录开发、分享作品，也写一点日常。

网站地址：[xvyan.cn](https://xvyan.cn/)。首页集中展示作品、收藏与关于，导航通过锚点滚动定位，并随当前阅读区域切换高亮；内容滚动进入时轻微淡入上移。减少动态效果与键盘导航不播放入场动效。原栏目地址会跳到首页对应区域。

## 本地查看

需要 Python 3.10 或更新版本，无需安装第三方包。

```powershell
py build.py
py -m http.server 4173 --bind 127.0.0.1 --directory dist
```

浏览器打开 http://127.0.0.1:4173/ 。停止预览按 Ctrl+C。

## 更新内容

- 首页、作品和关于区域：编辑 `build.py` 中对应文案。
- 收藏：运行 `py sync_stars.py` 从 GitHub 更新 `content/stars.json`，再重新构建。中文简介在 `content/star-intros.json` 中单独维护，每条最多 64 字，不会被同步覆盖。新项目尚无中文简介时显示待整理提示。本地可选设置 `GITHUB_TOKEN` 避免匿名访问限额；获取失败时原快照不变。
- 样式：`assets/style.css`，参考 [StyleKit Editorial](https://www.stylekit.top/zh/styles/editorial) 的暖米白、衬线排版，并按补充规范采用 1200px 容器、两栏收藏、反色主按钮和少量陈玫色选中态；主按钮保留用户要求的 6px 圆角。网站不展示或发布个人头像。
- 修改后重新运行 `py build.py`。

## 检查

```powershell
py -m unittest discover -s tests -v
node tests/test_motion.cjs
```

动效逻辑检查使用 Node.js 内置模块，不需要安装 npm 包。

测试会重新构建，检查导航、片段定位、资源引用、标题与说明、元数据转义和页面内容无需 JavaScript 也能阅读，动效脚本只在首页本地加载。

## 自动部署

推送到 `main` 后，GitHub Actions 使用 Python 3.12 同步公开星标、执行检查并构建，仅将 `dist/` 发布到 GitHub Pages。工作流还会每天运行一次，也可以在 Actions 页面手动运行。同步或检查失败不会部署，原线上页面保留。自动同步更新部署内容，不修改仓库中的快照文件。

自定义域名为 `xvyan.cn`，在仓库 Settings → Pages 管理。仓库中保留 `CNAME`，构建时复制到发布目录。

`content/`、`design/` 与测试文件不作为网页发布。公开仓库本身仍可被浏览，不放私人资料。无账号、评论、统计脚本或第三方字体请求。
