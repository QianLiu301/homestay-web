# 民宿入住指引 - 网站版

## 本地运行

1. 安装 Node.js (https://nodejs.org)

2. 安装依赖：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm run dev
```

4. 打开浏览器访问 http://localhost:3000

## 部署到 Vercel

### 方式一：通过 GitHub

1. 将代码上传到 GitHub 仓库
2. 访问 https://vercel.com
3. 用 GitHub 账号登录
4. 点击 "New Project"
5. 选择你的仓库
6. 点击 "Deploy"

### 方式二：通过 Vercel CLI

1. 安装 Vercel CLI：
```bash
npm install -g vercel
```

2. 登录：
```bash
vercel login
```

3. 部署：
```bash
vercel
```

## 功能说明

- **首页**：需要密码才能访问，管理员可以查看所有房源
- **详情页**：不需要密码，可以直接分享给客户
- **密码**：和小程序使用同一个密码（guisu123）

## 分享链接格式

```
https://你的域名/detail/房源ID
```
