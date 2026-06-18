# 数据抓取规格 — fetch 脚本与 data/ 结构

## 命令

| 命令 | 说明 |
|------|------|
| `npm run fetch` | 读取 `apps.config.json`，抓取商店数据，写入 `data/` 和图片 |
| `npm run build` | 应先有 `data/`；CI 中 `fetch && next build` |
| `npm run build:local` | 跳过 fetch，仅用已有 `data/` 构建（本地调试） |

## 依赖库

- [google-play-scraper](https://github.com/facundoolano/google-play-scraper) — `gplay.app({ appId, lang, country })`
- [app-store-scraper](https://github.com/facundoolano/app-store-scraper) — `store.app({ id, appId, country, ratings: true })`

## 抓取流程

```
1. 加载并 Zod 校验 apps.config.json
2. 过滤 enabled === true 的 apps
3. 对每个 app：
   a. 若有 stores.ios → fetch App Store（主数据源）
   b. 若有 stores.android → fetch Google Play
   c. merge（iOS 优先，见 PROJECT_SPEC.md §7）
   d. 应用 config 中 overrides / seo / features / links 等
   e. 下载 icon、screenshots → public/assets/apps/{slug}/
   f. 写入 data/apps/{slug}.json
4. 写入 data/manifest.json
5. 任一 enabled app 失败 → exit code 1（CI 失败）
```

## 限流与缓存

- Play 频繁请求可能 503；构建时顺序抓取，可加 delay
- 可选用 scraper 自带 `memoized()` 作为进程内缓存
- `.cache/` 可选作原始响应调试目录（不提交 git）

## 目录结构

```
data/
├── manifest.json
└── apps/
    ├── holy-bible-daily.json
    └── ...

public/assets/apps/
└── holy-bible-daily/
    ├── icon.png
    ├── screenshot-1.webp
    └── ...
```

## data/manifest.json

```json
{
  "fetchedAt": "2026-06-18T10:00:00.000Z",
  "siteUrl": "https://username.github.io",
  "apps": [
    { "slug": "holy-bible-daily", "status": "ok" }
  ],
  "errors": []
}
```

## data/apps/{slug}.json（fetch 产出）

Next.js 页面**只读此文件**，不直接调 scraper。

```json
{
  "slug": "holy-bible-daily",
  "template": "bible",
  "fetchedAt": "2026-06-18T10:00:00.000Z",
  "primarySource": "ios",

  "name": "Holy Bible Daily",
  "tagline": "Scripture for every moment of your day",
  "description": "...",
  "version": "2.1.0",
  "updatedAt": "2026-05-01T00:00:00.000Z",
  "developer": "Example Dev",
  "category": "Reference",
  "rating": { "score": 4.8, "count": 12500 },
  "releaseNotes": "...",

  "stores": {
    "ios": {
      "url": "https://apps.apple.com/...",
      "appId": "com.example.holybible",
      "id": 1234567890
    },
    "android": {
      "url": "https://play.google.com/store/apps/details?id=...",
      "appId": "com.example.holybible"
    }
  },

  "media": {
    "icon": "/assets/apps/holy-bible-daily/icon.png",
    "screenshots": [
      "/assets/apps/holy-bible-daily/screenshot-1.webp"
    ],
    "headerImage": null
  },

  "seo": {
    "title": "...",
    "description": "...",
    "canonical": "https://username.github.io/apps/holy-bible-daily/",
    "ogImage": "/assets/apps/holy-bible-daily/icon.png"
  },

  "features": [],
  "valueProps": [],
  "faq": [],
  "links": {
    "privacy": "...",
    "support": "..."
  },

  "hasIos": true,
  "hasAndroid": true
}
```

### 字段说明

| 字段 | 说明 |
|------|------|
| `primarySource` | `"ios"` 或 `"android"`（单平台时） |
| `hasIos` / `hasAndroid` | 供 StoreButtons 渲染 |
| `media.*` | 均为站点内路径（已本地化） |
| `seo` | 已合并 config.seo 与 fallback |

## 图片处理

- icon：PNG，建议 512px
- screenshots：WebP 优先，宽度 max 1290px
- 文件名：`icon.png`，`screenshot-{n}.webp`
- Next 静态导出使用 `images.unoptimized: true`

## .gitignore 相关

```
data/
public/assets/apps/
.cache/
out/
```

## 失败策略

| 场景 | 行为 |
|------|------|
| config 校验失败 | 立即 exit 1，打印 Zod 错误 |
| 单个 app 商店 404 | 记入 manifest.errors，exit 1 |
| 图片下载失败 | 同左 |
| 本地无 data/ 执行 build | 明确报错：请先 `npm run fetch` |

> 不提交 `data/` 时，CI **必须**在 build 前执行 fetch 且联网。
