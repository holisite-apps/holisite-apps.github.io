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

**状态：** ✅ 完成，⏸ **等待用户确认后进入 Task 2**

---

## Task 2 — create-next-app 创建标准 Next.js 项目 ⬜

**目标：** 使用官方 CLI 初始化项目，App Router + TypeScript + Tailwind + ESLint。

**命令（计划）：**
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes
```

**交付物：**
- Next.js 标准目录结构
- `package.json` scripts 占位
- `.gitignore` 补充 `data/`、`out/`、`public/assets/apps/`

**自检：**
- [ ] `npm run dev` 可启动
- [ ] `npm run build` 可构建（初始空页）
- [ ] TypeScript / ESLint 无报错

**状态：** ⬜ 待办（需 Task 1 确认）

---

## Task 3 — 初始化 shadcn/ui ⬜

**目标：** 安装 shadcn/ui，配置与 Tailwind 集成。

**交付物：**
- `components/ui/` 基础组件（Button, Card, Badge, Accordion, Separator）
- `lib/utils.ts`

**自检：**
- [ ] 示例 Button 可渲染
- [ ] 主题变量正常

**状态：** ⬜ 待办

---

## Task 4 — apps.config.json + Zod 校验 ⬜

**目标：** 创建示例配置与 schema 校验模块。

**交付物：**
- `apps.config.json`（示例，含 3 类 app 占位）
- `src/lib/config.ts` + `src/lib/config.schema.ts`
- 单元测试或 `npm run validate:config` 脚本

**自检：**
- [ ] 合法 config 通过
- [ ] 非法 slug / 缺 stores 报错清晰

**状态：** ⬜ 待办

---

## Task 5 — fetch 脚本 ⬜

**目标：** `npm run fetch` 抓取商店数据写入 `data/`。

**交付物：**
- `scripts/fetch-apps.ts`
- 安装 `google-play-scraper`、`app-store-scraper`
- merge 逻辑（iOS 优先）
- 图片下载至 `public/assets/apps/{slug}/`

**自检：**
- [ ] 对示例 appId 能生成 `data/apps/{slug}.json`
- [ ] manifest.json 正确
- [ ] 失败时 exit 1

**状态：** ⬜ 待办

---

## Task 6 — Next.js 静态导出配置 ⬜

**目标：** 配置 SSG + static export，适配 GitHub Pages。

**交付物：**
- `next.config.ts`：`output: 'export'`, `trailingSlash: true`, `images.unoptimized`
- 读取 `data/` 的 loader 工具函数

**自检：**
- [ ] 无 `data/` 时 build 报友好错误
- [ ] 有 `data/` 时 `out/` 生成正确

**状态：** ⬜ 待办

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
