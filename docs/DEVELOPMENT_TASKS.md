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

## Task 7 — 共用 landing 组件 ⬜

**目标：** StoreButtons、ScreenshotCarousel、AppFooter 等。

**自检：**
- [ ] 单平台 / 双平台按钮逻辑正确
- [ ] 外链属性正确

**状态：** ⬜ 待办

---

## Task 8 — 三套模板 + App 动态路由 ⬜

**目标：** `app/apps/[slug]/page.tsx` + generateStaticParams + 三模板。

**自检：**
- [ ] 每个 enabled slug 生成静态页
- [ ] template 映射正确
- [ ] metadata + JSON-LD 正确

**状态：** ⬜ 待办

---

## Task 9 — 品牌首页 ⬜

**目标：** `/` 品牌页，读 `site.home`，无 App 列表。

**自检：**
- [ ] 无 App 网格
- [ ] 内容与 config 一致

**状态：** ⬜ 待办

---

## Task 10 — sitemap / robots ⬜

**目标：** 从 config 生成 SEO 文件。

**自检：**
- [ ] 所有 enabled app 在 sitemap 中
- [ ] canonical URL 正确

**状态：** ⬜ 待办

---

## Task 11 — GitHub Actions 部署 ⬜

**目标：** push main 自动 fetch + build + deploy Pages。

**自检：**
- [ ] CI 绿
- [ ] Pages 可访问

**状态：** ⬜ 待办

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
