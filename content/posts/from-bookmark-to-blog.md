---
title: "从浏览器主页到博客：我折腾了什么"
slug: "from-bookmark-to-blog"
date: 2026-06-07T18:30:00+08:00
draft: false
tags: ["技术", "Hugo", "建站", "折腾"]
categories: ["技术"]
description: "用 Hugo + PaperMod + GitHub Pages 搭了一个静态博客，记录过程。"
weight: 2
---

## 起因

之前这个 `personal-page` 仓库是一个**浏览器主页**（就是那种打开浏览器看到的导航页）。
但我发现**打开浏览器**和**写博客**是完全不同的需求。

**所以全删了，从零开始。**

## 技术选型

我考虑过几个方案：

| 方案 | 优点 | 缺点 |
|------|------|------|
| Hexo | Node 生态，主题多 | 需要 npm，慢 |
| Jekyll | GitHub 原生支持 | Ruby，国内慢 |
| Hugo | **极快，零依赖** | 主题少一点 |
| 手写 HTML | 完全可控 | 文章多了就累 |

**最后选 Hugo**：

- **构建快** — 200 篇文章 < 1 秒
- **零依赖运行时** — 只需要一个二进制
- **主题够用** — PaperMod 已经很漂亮

## 安装过程

服务器是 CentOS，没有 `apt-get`，但有 `yum`。
直接下二进制最快：

```bash
# 国内镜像 30 秒搞定
curl -fsSL --max-time 30 https://gh-proxy.com/https://github.com/gohugoio/hugo/releases/download/v0.144.2/hugo_extended_0.144.2_linux-amd64.tar.gz -o hugo.tar.gz

tar xzf hugo.tar.gz hugo
mv hugo ~/bin/hugo
~/bin/hugo version
# hugo v0.144.2 extended linux/amd64
```

## 初始化

```bash
cd /home/admin/personal-page
hugo new site . --force  # 强制在已有目录建站
cd themes
curl -L .../PaperMod.tar.gz | tar xz
mv hugo-PaperMod-master PaperMod
```

## 写配置

`hugo.toml` 写得**很详细**，主要是：

- 站点信息（标题、作者、描述）
- 菜单（首页/文章/归档/关于/友链）
- 主题参数（深色模式、TOC、代码高亮）
- 主页 Hero（欢迎语）

## 写文章

文章是**Markdown** 文件，放在 `content/posts/`。

**Front Matter** 是 Hugo 的元数据：

```yaml
---
title: "文章标题"
date: 2026-06-07T19:00:00+08:00
draft: false
tags: ["技术", "Hugo"]
categories: ["技术"]
description: "描述会出现在列表页"
---
```

下面就是正文，**正常写 Markdown 就行**。

## 部署

```bash
# 本地预览
hugo server -D

# 构建
hugo  # 输出到 public/

# 推 GitHub
git add .
git commit -m "feat: add new post"
git push origin main
```

GitHub Pages 配置好之后，**push 即部署**。

## 踩过的坑

### 1. 主题下载超时

GitHub 直连慢，**用 gh-proxy.com 中转**，30 秒下完 18MB。

### 2. hugo.toml 格式

第一次写错了 `[params]` 嵌套，新版 Hugo 用 **TOML 表格**语法。
要写成 `[params.cover]` 而不是 `params.cover = {...`。

### 3. PaperMod 默认主页

PaperMod 默认**只显示最新一篇文章**，要在 `hugo.toml` 加：

```toml
[params.homeInfoParams]
  Title = "..."
  Content = "..."
```

才会显示**Hero 区块 + 文章列表**。

## 成果

- ✅ 静态博客，**0 依赖运行时**
- ✅ GitHub Pages 免费托管
- ✅ 深色/浅色自适应
- ✅ 移动端友好
- ✅ 加载速度 < 1s

## 下一步

- [ ] 加评论（Giscus）
- [ ] 加搜索（Pagefind）
- [ ] 把之前的随笔补回来
- [ ] 接 WebDAV 自动备份

完。✌️
