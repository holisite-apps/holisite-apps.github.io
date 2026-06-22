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

复制 `.env.example` 为 `.env.local`，填入 Firebase Console 里的 Web App 配置。缺少配置时统计会自动禁用，不影响构建。

部署到 GitHub Pages 时，在仓库 Settings → Secrets and variables → Actions → Variables 中添加同名变量：

```bash
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
```

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
3. 如需启用 Firebase 统计，添加上方 `NEXT_PUBLIC_FIREBASE_*` Variables。

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
