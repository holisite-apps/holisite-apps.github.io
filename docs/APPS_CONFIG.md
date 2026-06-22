# apps.config.json 字段规格

> 单一配置文件，位于项目根目录。build / fetch 前须通过 Zod 校验。

## 顶层结构

```json
{
  "site": { },
  "templates": { },
  "apps": [ ]
}
```

---

## site（站点级，必填）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | ✅ | 品牌名，页脚、OG site_name |
| `url` | string | ✅ | Canonical 根 URL，如 `https://username.github.io` |
| `locale` | string | 建议 | 默认 `en` |
| `description` | string | 可选 | 品牌首页 meta description |
| `githubPages` | object | 建议 | GitHub Pages 配置 |
| `tracking` | object | 建议 | 商店跳转归因参数配置 |

### site.githubPages

| 字段 | 类型 | 说明 |
|------|------|------|
| `repository` | string | 如 `username/username.github.io` |
| `basePath` | string | 用户站为 `""` |
| `customDomain` | string | 可选自定义域 |

### site.home（品牌首页内容，可选）

| 字段 | 类型 | 说明 |
|------|------|------|
| `headline` | string | Hero 主标题 |
| `subheadline` | string | Hero 副标题 |
| `intro` | string | 品牌介绍段落 |
| `values` | array | `[{ "title": "", "description": "" }]`，最多 3 项 |

### site.tracking（商店跳转归因，可选）

| 字段 | 类型 | 说明 |
|------|------|------|
| `enabled` | boolean | 是否启用跳转追踪，默认 `true` |
| `utmSource` | string | 默认 `holisite` |
| `utmMedium` | string | 默认 `landing_page` |
| `campaign` | string | 可选；不填时每个 App 使用自己的 `slug` |
| `iosProviderToken` | string | 可选 Apple Provider Token；有值时 App Store URL 会追加 `pt` |

Android Google Play URL 会追加 `referrer`，内容类似：

```text
utm_source=holisite&utm_medium=landing_page&utm_campaign=kakobuy&utm_content=google_play_button
```

iOS App Store URL 会追加：

```text
utm_source=holisite&utm_medium=landing_page&utm_campaign=kakobuy&utm_content=app_store_button&ct=kakobuy_app_store_button
```

如果某个 App 需要覆盖 campaign，可在 `apps[]` 条目里写同名 `tracking` 字段。

---

## templates（模板注册，必填）

键名即 `apps[].template` 的合法值。

```json
"templates": {
  "bible": { "label": "Bible" },
  "women-bible": { "label": "Women Bible" },
  "shopping": { "label": "Shopping Sheet" }
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `label` | string | ✅ | 可读名称 |
| `description` | string | 可选 | 备注 |

合法 `template` 值：`bible` | `women-bible` | `shopping`

---

## apps[]（每个 App 一条）

### 基础字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `slug` | string | ✅ | URL 段 `/apps/{slug}/`，小写+连字符，唯一 |
| `template` | string | ✅ | 必须是 `templates` 的 key |
| `enabled` | boolean | 建议 | 默认 `true`；`false` 时不 fetch、不生成页 |
| `name` | string | 可选 | 覆盖显示名 |
| `priority` | number | 可选 | 内部排序用（首页不展示列表时可忽略） |
| `tracking` | object | 可选 | 覆盖 `site.tracking`，常用于单 App 自定义 campaign |

### slug 规则

- 仅 `[a-z0-9-]`
- 不以 `-` 开头或结尾
- 全站唯一

---

### stores（至少 iOS 或 Android 之一）

#### stores.ios

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | number | 二选一 | App Store trackId |
| `appId` | string | 二选一 | Bundle ID |
| `country` | string | 可选 | 默认 `us` |
| `lang` | string | 可选 | 一般省略 |

#### stores.android

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `appId` | string | ✅* | Package name |
| `country` | string | 可选 | 默认 `us` |
| `lang` | string | 可选 | 默认 `en` |

\* 仅当存在 `stores.android` 时必填。

---

### seo（可选）

| 字段 | 类型 | 说明 |
|------|------|------|
| `title` | string | `<title>`，建议 ≤ 60 字符 |
| `description` | string | meta description，建议 ≤ 160 字符 |
| `keywords` | string[] | 可选 |
| `targetKeywords` | string[] | 可见正文关键词，模板会渲染到关键词区块 |
| `relatedTerms` | string[] | 相关搜索词 / 竞品词 / 场景词，模板会渲染到关键词区块 |
| `keywordIntro` | string | 关键词区块的自然语言说明，避免纯堆词 |
| `canonical` | string | 默认 `{site.url}/apps/{slug}/` |
| `ogImage` | string | 默认 icon 或首张 screenshot |
| `noindex` | boolean | 临时禁止索引 |

#### SEO 关键词使用建议

`keywords` 会进入 metadata；`targetKeywords` / `relatedTerms` 会进入页面可见正文。现代搜索引擎更重视正文语义，建议优先写自然语言的 `keywordIntro`，再列关键词。

购物类可以覆盖竞品或相关工具名，但不要写误导性表述，例如不要使用 `Official Oopbuy`。推荐写法：

```json
"seo": {
  "targetKeywords": ["Oopbuy finds", "Mulebuy finds", "Kakobuy spreadsheet"],
  "relatedTerms": ["CNFans", "Hoobuy", "Taobao product links"],
  "keywordIntro": "Kakobuy helps organize finds, links, and shopping lists for Kakobuy, Oopbuy, Mulebuy, CNFans, Hoobuy, and similar China shopping workflows."
}
```

Bible / Women Bible 类建议覆盖版本、场景和使用意图：

```json
"seo": {
  "targetKeywords": ["offline NIV Bible", "daily Bible verse", "women devotional app"],
  "relatedTerms": ["Bible study app", "daily scripture", "prayer app"],
  "keywordIntro": "A Bible app for daily scripture reading, devotionals, prayer, and study."
}
```

---

### overrides（可选）

| 字段 | 类型 | 说明 |
|------|------|------|
| `tagline` | string | Hero 一行标语 |
| `description` | string | 正文描述（纯文本） |
| `descriptionHtml` | string | 富文本描述 |
| `icon` | string | 覆盖 icon URL/路径 |
| `screenshots` | string[] | 覆盖截图列表 |
| `rating` | object | `{ "score": number, "count": number }` |
| `developer` | string | 开发者名 |
| `category` | string | 分类展示名 |
| `releaseNotes` | string | 更新说明 |

---

### features（可选）

```json
"features": [
  { "title": "Daily Reading Plans", "description": "Structured plans for every book." }
]
```

用于模板功能卡片区块。不填则模板隐藏或从描述截取。

---

### valueProps（可选，shopping 模板优先）

```json
"valueProps": [
  { "icon": "wallet", "title": "Save Money", "description": "Track deals in one place." }
]
```

`icon` 为内置图标 key，非 URL。

---

### faq（可选，shopping 模板）

```json
"faq": [
  { "question": "Is it free?", "answer": "Yes, free to download." }
]
```

---

### links（可选）

| 字段 | 类型 | 说明 |
|------|------|------|
| `privacy` | string | 隐私政策 URL |
| `terms` | string | 服务条款 URL |
| `support` | string | 支持邮箱 mailto: 或 URL |
| `website` | string | 非商店官网 |

---

## 完整示例

```json
{
  "site": {
    "name": "Faith Apps Studio",
    "url": "https://username.github.io",
    "locale": "en",
    "description": "Bible and lifestyle apps for daily inspiration.",
    "githubPages": {
      "repository": "username/username.github.io",
      "basePath": "",
      "customDomain": ""
    },
    "home": {
      "headline": "Faith Apps Studio",
      "subheadline": "Thoughtful apps for daily life",
      "intro": "We build Bible and lifestyle apps with care for reading, reflection, and everyday tools.",
      "values": [
        { "title": "Scripture focused", "description": "Apps designed around daily reading and devotion." },
        { "title": "Designed for you", "description": "Clear, accessible experiences on iOS and Android." },
        { "title": "Privacy first", "description": "We respect your data and privacy." }
      ]
    }
  },
  "templates": {
    "bible": { "label": "Bible" },
    "women-bible": { "label": "Women Bible" },
    "shopping": { "label": "Shopping Sheet" }
  },
  "apps": [
    {
      "slug": "holy-bible-daily",
      "template": "bible",
      "enabled": true,
      "priority": 1,
      "stores": {
        "ios": { "appId": "com.example.holybible", "country": "us" },
        "android": { "appId": "com.example.holybible", "country": "us", "lang": "en" }
      },
      "seo": {
        "title": "Holy Bible Daily - Scripture & Devotion App",
        "description": "Read the Bible daily with plans, audio, and offline access."
      },
      "overrides": {
        "tagline": "Scripture for every moment of your day"
      },
      "features": [
        { "title": "Daily Reading Plans", "description": "Structured plans for every book of the Bible." },
        { "title": "Offline Access", "description": "Read anywhere without an internet connection." }
      ],
      "links": {
        "privacy": "https://example.com/privacy",
        "support": "mailto:support@example.com"
      }
    },
    {
      "slug": "women-bible-journey",
      "template": "women-bible",
      "enabled": true,
      "stores": {
        "ios": { "id": 1234567890, "country": "us" }
      }
    },
    {
      "slug": "somebuy-sheet",
      "template": "shopping",
      "enabled": true,
      "stores": {
        "ios": { "appId": "com.example.somebuy" },
        "android": { "appId": "com.example.somebuy" }
      },
      "valueProps": [
        { "icon": "wallet", "title": "Save Money", "description": "Track deals in one place." },
        { "icon": "list", "title": "Organize", "description": "Keep shopping sheets in one app." },
        { "icon": "bell", "title": "Alerts", "description": "Never miss a price drop." }
      ],
      "faq": [
        { "question": "Is SomeBuy Sheet free?", "answer": "Yes, the app is free to download." }
      ]
    }
  ]
}
```

---

## 校验规则摘要

- `apps[].slug` 唯一
- 每个 enabled app 至少配置 `stores.ios` 或 `stores.android`
- `template` 必须是已注册 key
- `site.url` 无尾部斜杠
- iOS：`id` 与 `appId` 至少一个
