# Demo Gateway 部署指南

将本项目发布到互联网，让其他用户通过浏览器访问。项目为 Vite + React 单页应用，可按以下方式部署。

---

## 一、本地构建

部署前请先确保能成功构建：

```bash
cd demo-gateway
npm install
npm run build
```

构建产物在 `dist/` 目录。本地预览：

```bash
npm run preview
```

---

## 二、推荐部署方式

### 方式 1：Vercel（推荐，免费且简单）

1. **注册**：[vercel.com](https://vercel.com) 用 GitHub/GitLab 登录。
2. **导入项目**：点击 “Add New Project”，选择本仓库或上传 `demo-gateway` 目录。
3. **配置**：
   - **Root Directory**：如仓库根目录不是 `demo-gateway`，填 `demo-gateway`。
   - **Build Command**：`npm run build`
   - **Output Directory**：`dist`
4. **部署**：点击 Deploy，等待完成即可获得一个 `xxx.vercel.app` 的访问地址。

项目已包含 `vercel.json`，SPA 路由会正确回退到 `index.html`。

**命令行部署**（需先安装 Vercel CLI）：

```bash
npm i -g vercel
cd demo-gateway
vercel
```

---

### 方式 2：Netlify

1. **注册**：[netlify.com](https://netlify.com) 用 GitHub 登录。
2. **新建站点**： “Add new site” → “Import an existing project”，选仓库。
3. **构建设置**：
   - **Base directory**：`demo-gateway`
   - **Build command**：`npm run build`
   - **Publish directory**：`demo-gateway/dist`
4. 部署后即可获得 `xxx.netlify.app` 地址。

项目已包含 `netlify.toml`，无需额外配置 SPA 重定向。

**拖拽部署**：本地执行 `npm run build` 后，将 `dist` 文件夹拖到 [Netlify Drop](https://app.netlify.com/drop) 即可。

---

### 方式 3：Cloudflare Pages

1. **注册**：[dash.cloudflare.com](https://dash.cloudflare.com) → Pages。
2. **创建项目**：连接 Git 或 “直接上传”。
3. **构建设置**（若用 Git）：
   - **项目路径**：`demo-gateway`
   - **构建命令**：`npm run build`
   - **构建输出**：`dist`
4. 部署后获得 `xxx.pages.dev` 地址。

SPA 需在 Pages 设置里添加 “Single Page Application” 或自定义重定向：`/*` → `/index.html`（200）。

---

### 方式 4：GitHub Pages

1. 在仓库 **Settings → Pages** 中，Source 选 “GitHub Actions”。
2. 在项目根目录创建 `.github/workflows/deploy.yml`（见下方示例）。
3. 推送代码后，Actions 会自动构建并部署到 `https://<用户名>.github.io/<仓库名>/`。

若部署在子路径（如 `/<仓库名>/`），需在 `vite.config.ts` 中设置 `base: '/<仓库名>/'`，否则资源路径会错误。

**示例 workflow**（放在仓库根目录 `.github/workflows/deploy.yml`）：

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: demo-gateway/package-lock.json
      - run: cd demo-gateway && npm ci && npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: demo-gateway/dist
```

---

### 方式 5：自有服务器 / 云主机

1. 在服务器上执行：
   ```bash
   cd demo-gateway
   npm ci
   npm run build
   ```
2. 用 Nginx 托管 `dist/` 目录，并配置 SPA 回退：

```nginx
server {
  listen 80;
  server_name 你的域名;
  root /path/to/demo-gateway/dist;
  index index.html;
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

3. 如需 HTTPS，可使用 Let’s Encrypt（如 `certbot`）申请证书。

---

## 三、部署后检查

- 首页和子路径（如 `/gateway/models`、`/gateway/rate-limit`）能正常打开。
- 刷新页面不会 404，说明 SPA 重定向已生效。
- 若页面调用了后端 API，需确保 API 地址可被公网访问，并在前端配置正确的 base URL 或环境变量。

---

## 四、简要对比

| 方式           | 难度 | 免费额度     | 适合场景           |
|----------------|------|--------------|--------------------|
| Vercel         | 低   | 有           | 个人/团队前端项目  |
| Netlify        | 低   | 有           | 同上               |
| Cloudflare     | 低   | 有           | 需要 CDN/海外访问  |
| GitHub Pages   | 中   | 有           | 开源项目展示       |
| 自有服务器     | 中高 | 看服务器成本 | 需完全自控环境     |

建议优先尝试 **Vercel** 或 **Netlify**，按上述步骤即可在几分钟内发布到互联网。
