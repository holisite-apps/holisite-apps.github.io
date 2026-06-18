# 落地页模板规格 — section 清单与线框

> 三套模板共用底层组件，独立布局与 CSS theme tokens。

## 共用组件

| 组件 | 职责 |
|------|------|
| `AppHeader` | 顶栏：icon + 名 + Privacy 链 |
| `StoreButtons` | 条件渲染 App Store / Google Play 官方 badge |
| `ScreenshotCarousel` | 截图横滑 |
| `RatingDisplay` | 星级 + 评分数 |
| `AppFooter` | 开发者、Privacy、Support、© |
| `SeoHead` | metadata + JSON-LD |

### StoreButtons 规则

```
有 stores.ios     → App Store 按钮
有 stores.android → Google Play 按钮
仅单平台          → 只显示一个
```

外链：`target="_blank"` + `rel="noopener noreferrer"`

---

## 品牌首页 `/`

**不做 App 列表。** 内容来自 `site.home` + `site.name`。

| # | Section | 必填 |
|---|---------|------|
| 1 | Header | ✅ |
| 2 | Hero（headline + subheadline + intro） | ✅ |
| 3 | Brand Values（3 列） | 可选 |
| 4 | Footer | ✅ |

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]  Faith Apps Studio                                  │
├─────────────────────────────────────────────────────────────┤
│              Faith Apps Studio                              │
│         Thoughtful apps for daily life                      │
│     We build Bible and lifestyle apps with care...          │
├─────────────────────────────────────────────────────────────┤
│   [Scripture focused]  [Designed for you]  [Privacy first]  │
├─────────────────────────────────────────────────────────────┤
│  © 2026 · Privacy · Terms · Contact                         │
└─────────────────────────────────────────────────────────────┘
```

---

## template: `bible`

**气质：** 沉静、经典、可读。Hero **左文右 icon**。

| # | Section ID | 必填 | 说明 |
|---|------------|------|------|
| 1 | header | ✅ | |
| 2 | hero | ✅ | 名、tagline、Rating、StoreButtons |
| 3 | screenshots | ✅ | 手机框横滑 3–6 张 |
| 4 | features | 建议 | 3–4 Card，来自 config.features |
| 5 | about | 建议 | 完整 iOS 描述 |
| 6 | trust | 可选 | 评分 + 版本 + 更新日期 |
| 7 | download-cta | ✅ | 深色全宽条 + StoreButtons |
| 8 | footer | ✅ | |

### 视觉 tokens

| Token | 值 |
|-------|-----|
| 背景 | 暖米白 `#faf8f5` 或深海军 `#0f172a`（全站 bible 类统一选一） |
| 主色 | 金 `#c9a227` 或 burgundy `#7c2d12` |
| 圆角 | `rounded-lg` |
| Hero | 左文右图 |

```
┌─────────────────────────────────────────────────────────────┐
│ [icon] Holy Bible Daily                         Privacy     │
├─────────────────────────────────────────────────────────────┤
│  Holy Bible Daily              ┌─────────────┐              │
│  tagline...                    │  App Icon   │              │
│  ★★★★★ 4.8 · 12.5k            └─────────────┘              │
│  [App Store]  [Google Play]                                 │
├─────────────────────────────────────────────────────────────┤
│  Screenshots → scroll                                       │
├─────────────────────────────────────────────────────────────┤
│  Features (3 cards)                                         │
├─────────────────────────────────────────────────────────────┤
│  About (long description)                                   │
├─────────────────────────────────────────────────────────────┤
│  Trust bar: rating · version · updated                      │
├─────────────────────────────────────────────────────────────┤
│ ▓ Download CTA + StoreButtons ▓                             │
├─────────────────────────────────────────────────────────────┤
│ Footer                                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## template: `women-bible`

**气质：** 柔和、亲近。Hero **居中**布局。

| # | Section ID | 必填 | 与 bible 差异 |
|---|------------|------|----------------|
| 1 | header | ✅ | 同 |
| 2 | hero | ✅ | **居中** icon + 文 |
| 3 | highlights | 建议 | 2–3 pill 标签 |
| 4 | screenshots | ✅ | 更大圆角帧 |
| 5 | features | 建议 | 2 列 Card |
| 6 | about | 建议 | 较短段落、大行距 |
| 7 | download-cta | ✅ | **浅色卡片** CTA |
| 8 | footer | ✅ | |

### 视觉 tokens

| Token | 值 |
|-------|-----|
| 背景 | 暖白 `#fffbf7` + 浅渐变 |
| 主色 | 玫瑰 `#be185d` 或 soft plum `#9333ea`（低饱和） |
| 圆角 | `rounded-2xl` |
| Hero | 居中 |

```
┌─────────────────────────────────────────────────────────────┐
│                        [App Icon]                           │
│                  Women Bible Journey                        │
│              A daily devotion made for you                │
│              ★ rating · [Store buttons]                     │
├─────────────────────────────────────────────────────────────┤
│  ○ Devotion   ○ Community   ○ Offline                       │
├─────────────────────────────────────────────────────────────┤
│  Screenshots (rounded)                                      │
├─────────────────────────────────────────────────────────────┤
│  Features (2-col)                                           │
├─────────────────────────────────────────────────────────────┤
│  About                                                      │
├─────────────────────────────────────────────────────────────┤
│  ┌ Light card CTA + StoreButtons ┐                          │
├─────────────────────────────────────────────────────────────┤
│ Footer                                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## template: `shopping`

**气质：** 工具感、转化。Hero **左文右 screenshot**。

| # | Section ID | 必填 | 说明 |
|---|------------|------|------|
| 1 | header | ✅ | 可选 Badge「Shopping」 |
| 2 | hero | ✅ | 标题 + 3 bullet + StoreButtons |
| 3 | value-props | ✅ | 3 列，config.valueProps |
| 4 | screenshots | ✅ | 可选 caption |
| 5 | how-it-works | 建议 | Install → Open → Save |
| 6 | about | 可选 | 缩短至 2 段 |
| 7 | faq | 可选 | Accordion，config.faq |
| 8 | download-cta | ✅ | 高对比色条 |
| 9 | footer | ✅ | |

### 视觉 tokens

| Token | 值 |
|-------|-----|
| 背景 | 白 + 浅灰 section 交替 |
| 主色 | 绿 `#16a34a` 或 蓝 `#2563eb` |
| Hero | 左文右图 + bullet list |
| CTA | 高对比、按钮略大 |

```
┌─────────────────────────────────────────────────────────────┐
│ [icon] SomeBuy Sheet    [Shopping]              Privacy     │
├─────────────────────────────────────────────────────────────┤
│  Title + bullets              ┌──────────────┐            │
│  [Store buttons]              │ screenshot   │            │
│                               └──────────────┘            │
├─────────────────────────────────────────────────────────────┤
│  💰 Save    📋 Organize    🔔 Alerts                        │
├─────────────────────────────────────────────────────────────┤
│  Screenshots + captions                                     │
├─────────────────────────────────────────────────────────────┤
│  How it works: 1 → 2 → 3                                    │
├─────────────────────────────────────────────────────────────┤
│  FAQ accordion                                              │
├─────────────────────────────────────────────────────────────┤
│ █ High contrast CTA + StoreButtons █                        │
├─────────────────────────────────────────────────────────────┤
│ Footer                                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 三模板对比

| 维度 | bible | women-bible | shopping |
|------|-------|-------------|----------|
| Hero 布局 | 左文右 icon | 居中 | 左文右 screenshot |
| 独有区块 | trust bar | highlight pills | value-props, how-it-works, FAQ |
| CTA 风格 | 深色全宽条 | 浅色卡片 | 高对比色条 |
| 描述长度 | 完整 | 中等 | 短版 |

---

## SEO（每 App 页统一）

- `title`：`seo.title` 或 `{App Name} - Download on App Store & Google Play`
- `canonical`：`{site.url}/apps/{slug}/`
- Open Graph：title, description, image
- JSON-LD：`SoftwareApplication` + `AggregateRating` + `offers`
- 截图 alt：`"{App Name} screenshot {n}"`

---

## 组件目录（实现参考）

```
components/landing/
  shared/
    AppHeader.tsx
    StoreButtons.tsx
    ScreenshotCarousel.tsx
    AppFooter.tsx
    RatingDisplay.tsx
  templates/
    BibleTemplate.tsx
    WomenBibleTemplate.tsx
    ShoppingTemplate.tsx
  themes/
    bible.css
    women-bible.css
    shopping.css
```
