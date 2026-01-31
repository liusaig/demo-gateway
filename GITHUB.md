# 把 demo-gateway 提交到 GitHub

## 一、在 GitHub 上新建仓库

1. 打开 [github.com/new](https://github.com/new)
2. **Repository name** 填：`demo-gateway`（或你喜欢的名字）
3. 选 **Public**
4. **不要**勾选 “Add a README file”
5. 点 **Create repository**

## 二、在本地提交并推送

在终端里执行（把 `你的用户名` 换成你的 GitHub 用户名）：

```bash
cd /Users/liusai/Downloads/workspace/zhaoshangju/demo-gateway

# 在当前目录初始化 Git（仅针对 demo-gateway）
git init

# 添加所有文件
git add .

# 第一次提交
git commit -m "Initial commit: Vite + React demo gateway"

# 添加远程仓库（替换成你在 GitHub 上创建的仓库地址）
git remote add origin https://github.com/你的用户名/demo-gateway.git

# 推送到 main 分支
git branch -M main
git push -u origin main
```

若使用 **SSH** 地址：

```bash
git remote add origin git@github.com:你的用户名/demo-gateway.git
git push -u origin main
```

## 三、之后修改代码再提交

```bash
cd /Users/liusai/Downloads/workspace/zhaoshangju/demo-gateway

git add .
git commit -m "描述你的修改"
git push
```

## 说明

- 当前目录的 `.gitignore` 已忽略 `node_modules` 和 `dist`，不会提交到 GitHub。
- 首次 `git push` 时如提示登录，按提示在浏览器或终端完成 GitHub 认证即可。
