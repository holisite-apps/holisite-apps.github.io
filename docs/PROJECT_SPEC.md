# App SEO Landing Pages — 项目规格说明

> 本文档为开发权威参考。实现前如有冲突，以本文档及 `docs/` 下各专项文档为准。

## 1. 项目目标

为多个 App 生成 **SEO 友好的英文落地页**，数据主要来自 App Store / Google Play（通过 scraper 构建时抓取），部署到 GitHub Pages。

### 核心原则

| 原则 | 说明 |
|------|------|
| 一 App 一页 | 每个 App 独立落地页 `/apps/{slug}/` |
| 一域多页 | 单站点 `https://username.github.io`，非项目子路径 |
| iOS 优先 | 双端 App 的文案、截图、图标以 App Store 为准 |
| 仅官方商店 | 只提供 App Store / Google Play 按钮，无 APK/IPA 直链 |
| 构建时抓取 | 运行时不对商店发请求；SSG 静态页 |
| JSON 驱动 | `apps.config.json` 配置 App 列表与模板 |

## 2. 技术栈

| 层级 | 选型 |
|------|------|
| 框架 | Next.js（App Router）+ SSG |
| UI | shadcn/ui + Tailwind CSS |
| 数据抓取 | `app-store-scraper` + `google-play-scraper` |
| 配置校验 | Zod（build / fetch 前校验） |
| 托管 | GitHub Pages（`username.github.io` 用户站） |
| 静态导出 | `output: 'export'` |

## 3. 页面结构

```
/                          → 品牌首页（无 App 列表）
/apps/{slug}/              → App 落地页（三套模板之一）
/privacy/                  → 可选，全站隐私政策
/terms/                    → 可选，全站条款
/sitemap.xml
/robots.txt
```

## 4. App 类型与模板

| template key | 品类 | 视觉气质 |
|--------------|------|----------|
| `bible` | 经典圣经类 | 沉静、可读、经典 |
| `women-bible` | 女性圣经类 | 柔和、居中 Hero、暖色 |
| `shopping` | 电商导购 Sheet 类 | 工具感、转化导向 |

每个 App 在 `apps.config.json` 中通过 `template` 字段指定模板。

## 5. 平台与商店按钮规则

| 配置 | 页面表现 |
|------|----------|
| 仅有 `stores.ios` | 仅 App Store 按钮 |
| 仅有 `stores.android` | 仅 Google Play 按钮 |
| 两者都有 | 两个按钮；**展示内容仍 iOS 优先** |
| 单平台 App | 主内容来自已配置平台商店数据 |

## 6. 数据流

```
apps.config.json
       ↓
npm run fetch  （联网，写入 data/ + public/assets/apps/）
       ↓
data/apps/{slug}.json  +  本地化图片
       ↓
npm run build  （Next.js SSG 读 data/）
       ↓
out/  →  GitHub Pages
```

### Git 策略

**提交：** `apps.config.json`、源码、文档  
**不提交：** `data/`、`public/assets/apps/`、`.cache/`、`out/`

## 7. 数据合并优先级

合并顺序（后者覆盖前者）：

1. Android 商店 raw — 仅补 `stores.android.url` 等 Android 特有字段
2. **iOS 商店 raw — 主内容来源**
3. `apps.config.json` → `overrides`
4. `apps.config.json` → `seo`（用于 meta，不一定改可见 H1）
5. `features` / `links` / `valueProps` / `faq` — 来自 config

显示名：`overrides.name` → config `name` → iOS `title` → Android `title`

## 8. 语言与市场

- 主要语言：**英文**
- 默认商店区域：`country: us`
- Play 可选 `lang: en`

## 9. 相关文档索引

| 文档 | 内容 |
|------|------|
| [APPS_CONFIG.md](./APPS_CONFIG.md) | `apps.config.json` 完整字段 |
| [TEMPLATES.md](./TEMPLATES.md) | 三套模板 section 与线框 |
| [DATA_FETCH.md](./DATA_FETCH.md) | fetch 脚本与 `data/` 结构 |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | GitHub Pages 部署 |
| [DEVELOPMENT_TASKS.md](./DEVELOPMENT_TASKS.md) | 分步开发任务清单 |

## 10. GitHub Pages 站点 URL

| 项 | 值 |
|----|-----|
| 仓库 | `username/username.github.io` |
| 站点 URL | `https://username.github.io` |
| basePath | `""`（空） |
| App 页示例 | `https://username.github.io/apps/holy-bible-daily/` |

> 开发时将 `username` 替换为实际 GitHub 用户名。
