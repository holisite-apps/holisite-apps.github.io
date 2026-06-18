# GitHub Pages 部署规格

## 托管类型

**用户站：** 仓库 `username/username.github.io`  
**站点 URL：** `https://username.github.io`  
**basePath：** 空字符串（非 `/repo-name/` 项目页）

## Next.js 配置要点

```js
// next.config.ts（实现时写入）
{
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  // basePath / assetPrefix 不需要（用户站根路径）
}
```

## 构建产物

- 输出目录：`out/`
- 部署内容：`out/` 全部文件到 `gh-pages` 分支或 GitHub Actions Pages artifact

## URL 映射

| 路由 | 静态文件 |
|------|----------|
| `/` | `out/index.html` |
| `/apps/{slug}/` | `out/apps/{slug}/index.html` |
| `/sitemap.xml` | `out/sitemap.xml` |

`apps.config.json` 中 `site.url` 必须为 `https://username.github.io`（无尾斜杠）。

## GitHub Actions 工作流（概念）

```yaml
# .github/workflows/deploy.yml（后续任务实现）
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run fetch   # 联网抓取，生成 data/
      - run: npm run build   # 或 fetch 已含在 build script
      - uses: actions/upload-pages-artifact@v3
        with:
          path: out
      - uses: actions/deploy-pages@v4
```

### 权限

Repository Settings → Actions → General → Workflow permissions: Read and write  
Settings → Pages → Source: GitHub Actions

## 本地预览静态站

```bash
npm run fetch
npm run build
npx serve out
```

## 自定义域名（可选）

1. 仓库根目录 `public/CNAME` 写入域名
2. DNS CNAME 指向 `username.github.io`
3. `site.githubPages.customDomain` 与 `site.url` 改为自定义域

## 注意事项

- GitHub Pages **仅静态文件**，无 Node 服务端、无 ISR
- 每次内容更新需重新 fetch + build + deploy
- `data/` 不提交 git，**CI 必须联网 fetch**
- 确保 `robots.txt` 与 `sitemap.xml` 在 build 时从 config 生成

## canonical 与 OG

所有 App 页 canonical：

```
https://username.github.io/apps/{slug}/
```

与 `trailingSlash: true` 保持一致。
