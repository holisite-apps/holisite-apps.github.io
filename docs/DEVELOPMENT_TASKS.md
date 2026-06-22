# 开发任务清单

> **流程：** 每次只执行一个任务 → 自检 → **等待用户确认** → 再进行下一任务。  
> 状态：`⬜ 待办` | `🔄 进行中` | `✅ 完成` | `⏸ 等待确认`

---

## Task 1 — 输出项目规格与开发参考文档 ✅

**目标：** 在 `docs/` 下建立完整规格，避免后续实现偏差。

**交付物：**
- [x] `docs/PROJECT_SPEC.md`
- [x] `docs/APPS_CONFIG.md`
- [x] `docs/TEMPLATES.md`
- [x] `docs/DATA_FETCH.md`
- [x] `docs/DEPLOYMENT.md`
- [x] `docs/DEVELOPMENT_TASKS.md`（本文件）
- [x] 根目录 `README.md`

**自检：**
- [x] 文档覆盖：一 App 一页、iOS 优先、三套模板、fetch 流程、GitHub Pages 用户站
- [x] `apps.config.json` 字段与先前沟通一致
- [x] 模板 section 与线框与先前沟通一致
- [x] 明确 `data/` 不提交 git

**状态：** ✅ 完成

---

## Task 2 — create-next-app 创建标准 Next.js 项目 ✅

**目标：** 使用官方 CLI 初始化项目，App Router + TypeScript + Tailwind + ESLint。

**命令（实际）：**
```bash
# 目录非空，先暂存 docs/ 与 README.md 再执行
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes
```

**交付物：**
- [x] Next.js 16.2.9 + React 19 + Tailwind CSS 4 标准目录
- [x] `src/app/` App Router 结构
- [x] `.gitignore` 补充 `data/`、`public/assets/apps/`、`.cache/`（`out/` 已由 CLI 包含）
- [x] 保留 `docs/` 与项目 `README.md`

**自检：**
- [x] `npm run dev` 可启动（localhost:3000 返回 200）
- [x] `npm run build` 成功，静态页 `/` 已生成
- [x] `npm run lint` 无报错

**状态：** ✅ 完成，⏸ **等待用户确认后进入 Task 3**

---

## Task 3 — 初始化 shadcn/ui ✅

**目标：** 安装 shadcn/ui，配置与 Tailwind 集成。

**交付物：**
- [x] `components.json`（style: base-nova, Tailwind v4, RSC）
- [x] `src/lib/utils.ts`（`cn()`）
- [x] `src/components/ui/`：button, card, badge, accordion, separator
- [x] `src/app/globals.css` — shadcn 主题 CSS 变量
- [x] `src/components/dev/shadcn-smoke-test.tsx` — 渲染自检（Task 9 移除）

**依赖：** `@base-ui/react`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `tw-animate-css`

**自检：**
- [x] Button / Card / Badge / Accordion / Separator 在首页可渲染
- [x] `npm run lint` 通过
- [x] `npm run build` 通过

**状态：** ✅ 完成，⏸ **等待用户确认后进入 Task 4**

---

## Task 4 — apps.config.json + Zod 校验 ✅

**目标：** 创建示例配置与 schema 校验模块。

**交付物：**
- [x] `apps.config.json` — 4 个示例 App（3 enabled + 1 disabled），覆盖三套 template
- [x] `src/lib/config.schema.ts` — Zod schema + 导出类型
- [x] `src/lib/config.ts` — `loadAppsConfig`, `getEnabledApps`, `getAppCanonicalUrl` 等
- [x] `scripts/validate-config.ts` + `npm run validate:config`

**自检：**
- [x] 合法 config 通过 `validate:config`
- [x] 重复 slug / 非法 slug / 未知 template 均拒绝
- [x] `npm run lint` / `npm run build` 通过

**状态：** ✅ 完成，⏸ **等待用户确认后进入 Task 5**

---

## Task 5 — fetch 脚本 ✅

**目标：** `npm run fetch` 抓取商店数据写入 `data/`。

**交付物：**
- [x] `scripts/fetch-apps.ts`
- [x] 安装 `google-play-scraper`、`app-store-scraper`
- [x] merge 逻辑（iOS 优先，iOS 截图为空时回退 Android 截图）
- [x] 图片下载至 `public/assets/apps/{slug}/`
- [x] 生成 `data/apps/{slug}.json` 与 `data/manifest.json`

**自检：**
- [x] 对 5 个真实 appId 能生成 `data/apps/{slug}.json`
- [x] manifest.json 正确，errors 为空
- [x] 截图先去重再最多保留 8 张；当前 5 个 App 各产出 5–6 张不重复截图
- [x] `npm run validate:config` / `npm run lint` / `npm run build` 通过

**状态：** ✅ 完成，⏸ **等待用户确认后进入 Task 6**

---

## Task 6 — Next.js 静态导出配置 ✅

**目标：** 配置 SSG + static export，适配 GitHub Pages。

**交付物：**
- [x] `next.config.ts`：`output: 'export'`, `trailingSlash: true`, `images.unoptimized`
- [x] `src/lib/app-data.schema.ts` — generated data / manifest Zod schema
- [x] `src/lib/app-data.ts` — 读取 `data/` 的 loader 工具函数
- [x] `scripts/check-data.ts` + `prebuild` — build 前检查 `data/`

**自检：**
- [x] 无 `data/` 时 build 报友好错误：先运行 `npm run fetch`
- [x] 有 `data/` 时 `out/` 生成正确
- [x] `npm run validate:config` / `npm run lint` / `npm run build` 通过

**状态：** ✅ 完成，⏸ **等待用户确认后进入 Task 7**

---

## Task 7 — 共用 landing 组件 ✅

**目标：** StoreButtons、ScreenshotCarousel、AppFooter 等。

**交付物：**
- [x] `src/components/landing/shared/StoreButtons` — 官方商店按钮逻辑
- [x] `src/components/landing/shared/ScreenshotCarousel` — 横向截图展示
- [x] `src/components/landing/shared/AppHeader` — App 顶栏
- [x] `src/components/landing/shared/AppFooter` — 页脚链接
- [x] `src/components/landing/shared/RatingDisplay` — 评分展示
- [x] `src/components/dev/landing-components-smoke-test.tsx` — 临时 smoke test

**自检：**
- [x] 单平台 / 双平台按钮逻辑正确
- [x] 外链属性正确：`target="_blank"` + `rel="noopener noreferrer"`
- [x] 真实 generated data 可渲染到首页 smoke test
- [x] `npm run lint` / `npm run build` 通过
- [x] dev server 首页返回 HTTP 200

**状态：** ✅ 完成，⏸ **等待用户确认后进入 Task 8**

---

## Task 8 — 三套模板 + App 动态路由 ✅

**目标：** `app/apps/[slug]/page.tsx` + generateStaticParams + 三模板。

**交付物：**
- [x] `src/components/landing/templates/BibleTemplate`
- [x] `src/components/landing/templates/WomenBibleTemplate`
- [x] `src/components/landing/templates/ShoppingTemplate`
- [x] `src/components/landing/templates/AppTemplate` — template 映射
- [x] `src/app/apps/[slug]/page.tsx` — SSG 动态路由
- [x] App metadata：title、description、canonical、Open Graph、Twitter
- [x] JSON-LD：`SoftwareApplication`

**自检：**
- [x] 每个 enabled slug 生成静态页（5 个 `/apps/{slug}/index.html`）
- [x] template 映射正确
- [x] metadata + JSON-LD 已输出
- [x] `npm run lint` / `npm run build` 通过
- [x] dev server `/apps/niv-bible/` 返回 HTTP 200 且 prerender 命中

**状态：** ✅ 完成，⏸ **等待用户确认后进入 Task 9**

---

## Task 9 — 品牌首页 ✅

**目标：** `/` 品牌页，读 `site.home`，无 App 列表。

**交付物：**
- [x] `src/app/page.tsx` — 正式品牌首页
- [x] `src/app/layout.tsx` — 使用 `site` 配置输出根 metadata 与 `lang`
- [x] 删除 Task 7 临时 smoke test 组件

**自检：**
- [x] 无 App 网格；导出首页不包含具体 App slug
- [x] 内容与 `apps.config.json` 的 `site.home` 一致
- [x] `npm run lint` / `npm run build` 通过
- [x] dev server `/` 返回 HTTP 200

**状态：** ✅ 完成，⏸ **等待用户确认后进入 Task 10**

---

## Task 10 — sitemap / robots ✅

**目标：** 从 config 生成 SEO 文件。

**交付物：**
- [x] `src/app/sitemap.ts`
- [x] `src/app/robots.ts`
- [x] Sitemap 包含首页、5 个 App 页与图片 URL
- [x] Robots 允许全站抓取并指向 sitemap

**自检：**
- [x] 所有 enabled app 在 sitemap 中（共 6 个 `<loc>`：首页 + 5 App）
- [x] canonical URL 正确，均使用 `https://username.github.io/...`
- [x] `out/sitemap.xml` / `out/robots.txt` 成功导出
- [x] `npm run lint` / `npm run build` 通过

**状态：** ✅ 完成，⏸ **等待用户确认后进入 Task 11**

---

## Task 11 — GitHub Actions 部署 ✅

**目标：** push main 自动 fetch + build + deploy Pages。

**交付物：**
- [x] `.github/workflows/deploy.yml`
- [x] CI 步骤：checkout → setup-node → npm ci → validate:config → fetch → build → upload artifact → deploy Pages
- [x] `docs/DEPLOYMENT.md` 更新 workflow 与上线前 `username` 替换说明

**自检：**
- [x] 本地模拟 CI 核心流程：`validate:config` → `fetch` → `build` 通过
- [x] `.github/workflows/deploy.yml` 存在
- [x] `npm run lint` / `npm run build` 通过
- [ ] CI 绿（需 push 到 GitHub 后确认）
- [ ] Pages 可访问（需仓库 Settings → Pages 设为 GitHub Actions 后确认）

**状态：** ✅ 本地完成，⏸ **等待 GitHub 端配置与首次运行确认**

---

## 变更记录

| 日期 | 任务 | 说明 |
|------|------|------|
| 2026-06-18 | Task 1 | 初始文档输出 |
| 2026-06-18 | Task 2 | create-next-app 16.2.9，lint/build/dev 自检通过 |
| 2026-06-18 | Task 3 | shadcn/ui base-nova，5 个基础组件，lint/build 通过 |
| 2026-06-18 | Task 4 | apps.config.json + Zod + validate:config |
| 2026-06-22 | Task 5 | fetch 脚本，5 个真实 App 抓取与图片落盘通过 |
| 2026-06-22 | Task 6 | static export + generated data loader + prebuild 检查 |
| 2026-06-22 | Task 7 | 共享 landing 组件 + 首页 smoke test |
| 2026-06-22 | Task 8 | 三套模板 + `/apps/[slug]` SSG 路由 |
| 2026-06-22 | Task 9 | 正式品牌首页，移除临时 smoke tests |
| 2026-06-22 | Task 10 | sitemap.xml + robots.txt 静态导出 |
| 2026-06-22 | Task 11 | GitHub Actions Pages 部署 workflow |
