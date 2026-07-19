# Lotus-Site

这是 `lotusshared.cn` 的 VitePress 静态站点项目。

站点正文会从以下仓库自动同步，不需要维护第二份 Markdown：

- `MOPELotus/Lotus-ReFactor`（网站显示名：Lotus-Plugin，分支 `main`）
- `MOPELotus/MusicHud-Paper`（分支 `1.21.11`）
- `MOPELotus/TuneWeave`（分支 `main`）

## 本地首次运行

需要 Node.js 22 或更高版本，以及 Git。

```powershell
npm install
npm run docs:sync
npm run docs:dev
```

浏览器打开终端显示的地址，一般是：

```text
http://localhost:5173/
```

## 构建静态文件

```powershell
npm run docs:sync
npm run docs:build
```

构建结果位于：

```text
docs\.vitepress\dist
```

这个目录中的文件可以直接交给 Apache 静态托管，不需要 PHP、数据库或 Node.js 常驻进程。

## 推送到 GitHub

建议创建仓库：

```text
MOPELotus/Lotus-Site
```

然后执行：

```powershell
git init
git add .
git commit -m "Initialize Lotus VitePress site"
git branch -M main
git remote add origin https://github.com/MOPELotus/Lotus-Site.git
git push -u origin main
```

`.github/workflows/build.yml` 会每 6 小时以及每次主站仓库更新时：

1. 拉取三个项目仓库的最新 Markdown；
2. 构建 VitePress；
3. 上传名为 `lotus-site-dist` 的静态网站工件。

## 文件职责

- `docs/index.md`：首页
- `docs/.vitepress/config.mts`：导航、侧栏和站点配置
- `docs/.vitepress/theme/custom.css`：外观
- `scripts/sync-docs.mjs`：自动同步三个项目仓库
- `docs/projects/*/index.md`：每个项目的入口包装页

项目仓库的 README 会同步为 `README.source.md`，再由入口页包含，因此正文仍只在原项目仓库维护。
