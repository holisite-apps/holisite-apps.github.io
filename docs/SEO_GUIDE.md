# Holisite App Landing Pages SEO 指南

> 基于 Google Search Central《SEO 新手指南：基础知识》（最后更新时间：2025-12-18）整理，并结合本项目的 Next.js SSG、App Store / Google Play 数据抓取、多 App 落地页架构制定。

## 目标

本项目的 SEO 目标不是“堆关键词”，而是让 Google 和用户都能清楚理解：

- Holisite 是什么品牌。
- 每个 App 解决什么问题。
- App 支持哪些平台。
- 页面是否可靠、可抓取、可索引、可分享。
- 用户从搜索结果点击进入后，能否快速找到下载入口。

Google 明确说明：没有任何秘诀可以保证排名第一。SEO 的核心是帮助搜索引擎理解内容，并帮助用户判断是否访问页面。

## Google 指南要点

### 让 Google 发现页面

Google 主要通过链接发现网页，也可以通过 sitemap 发现重点 URL。本项目已经提供：

- `/` 品牌首页。
- `/apps/` App 列表页。
- `/apps/{slug}/` 单个 App 落地页。
- `/sitemap.xml`，包含首页、App 列表页、App 详情页和图片 sitemap。
- `/robots.txt`，允许抓取并声明 sitemap。

上线后需要在 Google Search Console 中提交：

```text
https://holisite-apps.github.io/sitemap.xml
```

### 保持用户和 Google 看到同一页面

Google 抓取页面时应能访问与用户浏览器相同的 HTML、CSS、JavaScript 和图片资源。本项目使用 Next.js 静态导出，核心内容在构建时生成，有利于抓取。

检查点：

- 不要用登录、地区弹窗或全屏遮罩阻挡主要内容。
- 不要把核心文案只放在客户端异步请求里。
- `public/assets/apps/` 中的图片应可公开访问。
- Firebase Analytics 只做统计，不应影响内容渲染。

### 使用清晰 URL

Google 会从 URL 中理解页面结构。当前结构符合 Google 建议：

```text
/apps/
/apps/kakobuy/
/apps/womens-bible/
/apps/nkjv-bible/
```

新增 App 时，`slug` 应该：

- 小写英文。
- 使用连字符。
- 可读、简短、稳定。
- 不使用随机 ID。
- 不频繁更改。

推荐：

```json
"slug": "womens-bible-nlt-edition"
```

避免：

```json
"slug": "app-12345"
```

### 减少重复内容

Google 会为重复内容选择一个规范网址。本项目每个 App 页面会生成 canonical：

```text
https://holisite-apps.github.io/apps/{slug}/
```

维护要求：

- 同一个 App 不要创建多个不同 slug 的相似页面。
- 如果 App 改名，优先保留原 slug，避免损失已有索引。
- 如果必须更改 URL，应规划重定向；GitHub Pages 静态站不天然支持服务端重定向，需要额外方案。

### 写给用户，而不是搜索引擎

Google 强调“实用、可靠、以用户为中心的内容”。本项目中最重要的内容来源是：

- App Store / Google Play 官方描述。
- `apps.config.json` 中的 `seo.description`。
- `seo.keywordIntro`。
- 模板内可见的功能、亮点、FAQ、下载入口。

不要为了覆盖关键词而重复堆砌词语。特别是购物类竞品词，只能表达“适用于相关购物工作流 / 相关搜索”，不要暗示官方关系。

推荐：

```json
"keywordIntro": "Kakobuy helps organize finds, product links, and shopping lists for Kakobuy, Oopbuy, Mulebuy, CNFans, Hoobuy, and similar China shopping workflows."
```

避免：

```json
"keywordIntro": "Official Oopbuy Mulebuy best Oopbuy app Oopbuy alternative Oopbuy download."
```

## 本项目已具备的 SEO 能力

### 静态页面生成

`npm run fetch` 从应用商店抓取数据，并写入 `data/`。`npm run build` 使用这些数据静态生成页面。

优势：

- 搜索引擎无需等待接口响应。
- 页面内容稳定。
- GitHub Pages 可直接托管。

### Metadata

App 详情页会生成：

- `<title>`
- meta description
- canonical
- robots noindex（可选）
- Open Graph
- Twitter card
- keywords metadata

说明：Google 搜索不使用 `keywords` meta 作为排名因素，但这些字段仍可作为项目内部关键词管理和其他搜索系统参考。真正重要的是可见正文、标题、摘要、结构化数据和页面质量。

### 可见关键词区块

模板会渲染 `SeoKeywordSection`，使用：

- `seo.keywordIntro`
- `seo.targetKeywords`
- `seo.relatedTerms`

使用原则：

- `keywordIntro` 写成自然语言。
- `targetKeywords` 放核心搜索意图。
- `relatedTerms` 放相关版本、场景、竞品、工具名。
- 关键词数量保持克制，每个 App 通常 5-12 个足够。

### 结构化数据

App 落地页会输出 `SoftwareApplication` JSON-LD，帮助 Google 理解这是一个软件/App 页面。

维护要求：

- App 名称应准确。
- 评分信息来自官方商店或人工覆盖。
- 下载 URL 应指向 App Store / Google Play 官方页面。
- 不要伪造评分、评价数量或平台信息。

### Sitemap 与 Robots

当前实现：

- `/sitemap.xml`：包含首页、App 列表页、App 详情页和图片。
- `/robots.txt`：允许所有抓取工具访问，并声明 sitemap。

新增页面后需要检查 sitemap 是否包含该页面。

## 新增 App 的 SEO 配置规范

每个 App 至少应配置：

```json
{
  "slug": "example-app",
  "name": "Example App",
  "template": "shopping",
  "enabled": true,
  "stores": {
    "android": {
      "appId": "com.example.app",
      "country": "us",
      "lang": "en"
    }
  },
  "seo": {
    "title": "Example App - Organize Shopping Finds",
    "description": "Example App helps organize product links, shopping finds, and deal lists for everyday buying workflows.",
    "keywords": ["Example App", "shopping finds", "deal list"],
    "targetKeywords": ["shopping finds app", "deal list app"],
    "relatedTerms": ["Taobao finds", "DHgate finds"],
    "keywordIntro": "Example App helps shoppers organize product links, finds, and deal lists across related shopping workflows."
  },
  "overrides": {
    "developer": "Holisite"
  }
}
```

### Title 规则

建议：

- 每页唯一。
- 简短清晰。
- 包含 App 名和核心用途。
- 一般控制在 50-60 个英文字符附近。

示例：

```text
Kakobuy - Shopping Finds and Spreadsheet Lists
```

### Description 规则

建议：

- 每页唯一。
- 用 1-2 句话说明用户价值。
- 一般控制在 140-160 个英文字符附近。
- 不要只列关键词。

示例：

```text
Kakobuy helps organize product links, shopping finds, and deal lists for China shopping workflows on iOS and Android.
```

### Keyword Intro 规则

`keywordIntro` 会显示在页面正文中，应写给用户看。

购物类：

- 可以包含竞品词或相关工具词。
- 不要冒充竞品官方。
- 不要写误导性下载承诺。

Bible 类：

- 优先覆盖 Bible version、daily verse、offline Bible、Bible study、devotional、prayer 等真实使用场景。
- 不要对宗教内容做夸大承诺。

## 图片 SEO

Google 建议图片应高质量、靠近相关文字，并具备描述性替代文本。

本项目要求：

- App icon alt：`{app.name} icon`。
- 截图 alt 应表达截图属于哪个 App 和用途。
- 图片文件应使用稳定路径：`/assets/apps/{slug}/...`。
- 不要使用低清、重复、与 App 无关的图片。

当前 fetch 脚本已做截图去重，并优先使用 iOS 数据，Android 作为补充。

## 内链策略

Google 通过链接发现新页面。当前内链结构：

- 首页链接到 `/apps/`。
- `/apps/` 链接到每个 `/apps/{slug}/`。
- 每个 App 页面显示商店下载按钮。
- Footer 可显示 privacy / terms / support / website。

后续可以增强：

- 在 App 详情页底部增加“Related apps”区块。
- Bible 模板互链其他 Bible 版本。
- Shopping 模板互链其他购物工具。

内链文字应描述目标页面，不要使用模糊文字。

推荐：

```text
View Women's Bible landing page
```

避免：

```text
Click here
```

## 索引控制

如某个页面暂时不希望被索引，可在配置中设置：

```json
"seo": {
  "noindex": true
}
```

效果：

- 页面 metadata 会输出 noindex。
- sitemap 会排除该页面。

使用场景：

- App 尚未上线。
- 页面内容未完成。
- 临时测试页。

## 上线前 SEO 检查清单

### 配置检查

- `apps.config.json` 中 `site.url` 是正式域名。
- `githubPages.repository` 是真实仓库。
- 每个 App `slug` 唯一且稳定。
- 每个 App 至少有一个 store 平台。
- 每个 App 有唯一 `seo.title` 和 `seo.description`。
- 重要 App 配置了 `targetKeywords`、`relatedTerms`、`keywordIntro`。

### 构建检查

运行：

```bash
npm run validate:config
npm run fetch
npm run build
npm run lint
```

检查：

- `out/sitemap.xml` 包含首页、`/apps/` 和所有应索引 App。
- `out/robots.txt` 指向正确 sitemap。
- `out/apps/{slug}/index.html` 中有标题、description、JSON-LD 和正文关键词。

### Search Console 检查

上线后：

- 添加资源：`https://holisite-apps.github.io/`
- 提交 sitemap。
- 使用 URL Inspection 检查首页、`/apps/`、重点 App 页面。
- 观察 Coverage / Pages 报告。
- 观察 Performance 查询词，迭代 `seo.description` 和正文内容。

### Analytics 检查

Firebase Analytics 已记录：

- `page_view`
- `store_click`

建议在 GA4 / Firebase 中重点看：

- App 页面访问量。
- 商店按钮点击率。
- 不同页面的下载点击差异。
- UTM campaign 是否正确进入商店链接。

## 不应重点关注的事项

根据 Google 指南，以下事项不应作为主要 SEO 策略：

- 关键词 meta 标签：Google 搜索不使用它作为排名因素。
- 关键词堆砌：会降低用户体验，且可能违反垃圾内容政策。
- 固定字数目标：内容长度本身不是排名关键。
- 为了 SEO 强行改域名或 URL 塞关键词。
- 重复内容“处罚”恐慌：重点是减少重复和设置 canonical，而不是过度担心。
- 把 E-E-A-T 当作单一排名因素；更应该关注内容是否可靠、实用、以用户为中心。

## 持续优化节奏

SEO 变化需要时间。Google 指南建议，有些变化可能数小时生效，有些需要数周到数月。

建议节奏：

1. 每次新增 App 后运行完整构建检查。
2. 每周查看 Search Console 覆盖率和热门查询。
3. 每两周根据真实查询更新 `targetKeywords` / `relatedTerms`。
4. 每月检查 App Store / Google Play 描述是否变化，并重新 fetch。
5. 对高曝光低点击页面优化 title 和 description。
6. 对高访问低 store click 页面优化首屏 CTA 和页面内容。

## 参考资料

- Google Search Central: SEO 新手指南：`https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=zh-cn`
- Google Search Console: `https://search.google.com/search-console`
- Rich Results Test: `https://search.google.com/test/rich-results`
- PageSpeed Insights: `https://pagespeed.web.dev/`
