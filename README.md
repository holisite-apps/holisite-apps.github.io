# App SEO Landing Pages

多个 App 的 SEO 落地页：JSON 配置驱动，构建时从 App Store / Google Play 抓取素材，Next.js SSG 静态导出，部署至 GitHub Pages。

## 文档（开发前必读）

| 文档 | 说明 |
|------|------|
| [docs/PROJECT_SPEC.md](./docs/PROJECT_SPEC.md) | 项目总规格 |
| [docs/APPS_CONFIG.md](./docs/APPS_CONFIG.md) | `apps.config.json` 字段 |
| [docs/TEMPLATES.md](./docs/TEMPLATES.md) | 三套模板线框 |
| [docs/DATA_FETCH.md](./docs/DATA_FETCH.md) | fetch 与 `data/` |
| [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) | GitHub Pages |
| [docs/DEVELOPMENT_TASKS.md](./docs/DEVELOPMENT_TASKS.md) | **分步任务清单** |

## 技术栈

- Next.js (App Router) + TypeScript + Tailwind CSS
- shadcn/ui
- google-play-scraper + app-store-scraper

## 开发流程

按 [DEVELOPMENT_TASKS.md](./docs/DEVELOPMENT_TASKS.md) 逐步执行，**每步完成后需确认再进行下一步**。

```bash
# 后续任务完成后可用：
npm run fetch    # 抓取商店数据 → data/
npm run build    # SSG 构建 → out/
```

## 站点结构

```
https://username.github.io/              品牌首页
https://username.github.io/apps/{slug}/  App 落地页
```

> 将 `username` 替换为你的 GitHub 用户名。
