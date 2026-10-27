# Xv Yan

个人网站与博客，记录开发、分享作品，也写一点日常。

网站地址：[xvyan.cn](https://xvyan.cn/)。包含首页、文章列表与详情、作品、关于、404 页面。部分文章为标注过的预览文案，正式内容待确认或替换。

## 本地查看

需要 Python 3.10 或更新版本，无需安装第三方包。

```powershell
py build.py
py -m http.server 4173 --bind 127.0.0.1 --directory dist
```

浏览器打开 http://127.0.0.1:4173/ 。停止预览按 Ctrl+C。

## 更新内容

- 首页、作品和关于页：编辑 `build.py` 中对应文案。
- 文章：编辑 `content/posts.json`，数组顺序就是显示顺序。`slug` 仅用小写英文、数字和短横线，且不可重复。
- `body` 是作者自己维护的 HTML 正文，不接受未经审核的外部 HTML。标题、分类与摘要会自动转义。
- `preview: true` 会显示预览文案提示。确认正文后设为 `false`，同时填写 `date`（例如 `2026-10-21`）。所有预览文章转为正式内容后，需移除列表中的预览提示。
- 样式：`assets/style.css`。网站不展示或发布个人头像。
- 修改后重新运行 `py build.py`。

## 检查

```powershell
py -m unittest discover -s tests -v
```

测试会重新构建，检查导航、文章、片段定位、资源引用、标题与说明、预览提示、元数据转义、非法文章路径和无 JavaScript 的可读性。

## 自动部署

推送到 `main` 后，GitHub Actions 使用 Python 3.12 执行检查并构建，仅将 `dist/` 发布到 GitHub Pages。检查失败不会部署。也可以在 Actions 页面手动运行工作流。

自定义域名为 `xvyan.cn`，在仓库 Settings → Pages 管理。仓库中保留 `CNAME`，构建时复制到发布目录。

`content/`、`design/` 与测试文件不作为网页发布。公开仓库本身仍可被浏览，不放私人资料。无账号、评论、统计脚本或第三方字体请求。
