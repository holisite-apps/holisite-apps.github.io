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

- Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- shadcn/ui 4（base-nova 风格，Base UI 原语）
- google-play-scraper + app-store-scraper（Task 5 起安装）

## 开发流程

按 [DEVELOPMENT_TASKS.md](./docs/DEVELOPMENT_TASKS.md) 逐步执行，**每步完成后需确认再进行下一步**。

```bash
npm run dev      # 本地开发 http://localhost:3000
npm run lint     # ESLint
npm run build    # 生产静态导出 → out/（会先检查 data/）
npm run validate:config  # 校验 apps.config.json
npm run fetch    # 抓取商店数据 → data/
```

## 项目结构（当前）

```
app-seo/
├── docs/                 # 规格与任务文档
├── components.json       # shadcn/ui 配置
├── src/
│   ├── app/             # 品牌首页与 /apps/[slug]
│   ├── components/
│   │   ├── landing/      # 落地页共享组件
│   │   └── ui/           # shadcn 组件
│   └── lib/
│       ├── app-data.ts
│       ├── app-data.schema.ts
│       ├── config.ts
│       └── config.schema.ts
├── public/
├── apps.config.json      # App 列表与模板配置
├── scripts/
│   ├── check-data.ts
│   ├── fetch-apps.ts
│   └── validate-config.ts
└── package.json
```

## 站点结构

```
https://username.github.io/              品牌首页
https://username.github.io/apps/{slug}/  App 落地页
https://username.github.io/sitemap.xml   Sitemap
https://username.github.io/robots.txt    Robots
```

> 将 `username` 替换为你的 GitHub 用户名。
