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
| [docs/SEO_GUIDE.md](./docs/SEO_GUIDE.md) | Google SEO 指南与本项目落地规范 |
| [docs/DEVELOPMENT_TASKS.md](./docs/DEVELOPMENT_TASKS.md) | **分步任务清单** |

## 技术栈

- Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- shadcn/ui 4（base-nova 风格，Base UI 原语）
- google-play-scraper + app-store-scraper（Task 5 起安装）
- Firebase Web Analytics（page view 与商店按钮点击统计）

## 开发流程

按 [DEVELOPMENT_TASKS.md](./docs/DEVELOPMENT_TASKS.md) 逐步执行，**每步完成后需确认再进行下一步**。

```bash
npm run dev      # 本地开发 http://localhost:3000
npm run lint     # ESLint
npm run build    # 生产静态导出 → out/（会先检查 data/）
npm run validate:config  # 校验 apps.config.json
npm run fetch    # 抓取商店数据 → data/
```

## Firebase 统计

`.env.local` 中保存 Firebase Console 的 Web App 配置。该文件已允许提交，GitHub Actions checkout 后会由 Next.js 自动读取。缺少配置时统计会自动禁用，不影响构建。

## 部署

已提供 `.github/workflows/deploy.yml`。推送到 `main` 后，GitHub Actions 会执行：

```bash
npm ci
npm run validate:config
npm run fetch
npm run build
```

并将 `out/` 部署到 GitHub Pages。首次上线前：

1. 将 `apps.config.json` 里的 `username` 替换为真实 GitHub 用户名。
2. 在 GitHub 仓库 Settings → Pages 中选择 **GitHub Actions**。
3. 确认 `.env.local` 已随代码提交，以便线上构建启用 Firebase 统计。

## 每周 SEO 优化 PR

已提供 `.github/workflows/weekly-seo-pr.yml`。该 workflow 每周一北京时间 09:00 运行，调用 `npm run seo:weekly` 更新 `apps.config.json` 的 SEO 词和 `keywordIntro`，然后创建 PR，不直接推送 `main`。

需要在 GitHub 仓库 Settings → Secrets and variables → Actions 中配置：

- Secret: `OPENAI_API_KEY`（必需，用于生成 SEO 建议）
- Secret: `SERPAPI_API_KEY`（可选，用于 Google SERP 搜索上下文）
- Variable: `OPENAI_BASE_URL`（可选，OpenAI 兼容中转地址，默认 `https://api.openai.com/v1`）
- Variable: `OPENAI_MODEL`（可选，默认 `gpt-5.5`）

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
