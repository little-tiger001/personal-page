# 帅小虎的博客

个人博客，基于 **Hugo + PaperMod**。

🌐 访问：[http://47.100.21.148:8080](http://47.100.21.148:8080)

## 技术栈

- **Hugo** 0.148.2 (extended) - 静态站点生成器
- **PaperMod** 主题 - 简洁、响应式、深色模式
- **GitHub Pages** - 部署托管（待开启）
- **阿里云 ECS** - 预览环境

## 本地开发

```bash
# 安装 Hugo extended (v0.146+)
# 见 https://gohugo.io/installation/

# 启动本地预览服务器
~/bin/hugo server -D

# 构建静态文件
~/bin/hugo --minify
# 输出到 public/ 目录
```

## 部署

### 方式 1：本地预览（8080 端口）

```bash
cd public
python3 -m http.server 8080 --bind 0.0.0.0
```

### 方式 2：GitHub Pages

1. 推送到 `main` 分支
2. 在仓库 Settings → Pages 启用
3. 选择 `main` 分支作为源
4. 等待 1-2 分钟

URL: `https://little-tiger001.github.io/personal-page/`

## 目录结构

```
.
├── archetypes/    # 内容模板
├── content/       # 文章内容
│   ├── posts/     # 博客文章
│   ├── about/     # 关于页
│   └── links/     # 友链页
├── static/        # 静态资源（favicon 等）
├── themes/        # 主题
│   └── PaperMod/
├── hugo.toml      # Hugo 配置
└── README.md
```

## 写新文章

```bash
~/bin/hugo new content posts/my-new-post.md
# 编辑文件，draft: false 后发布
```

## 许可

博客内容采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可。
