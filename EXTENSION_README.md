
# Elegant New Tab - Chrome 扩展安装指南

这是一个美观的新标签页扩展，提供搜索栏、最近浏览历史和书签管理功能。

## 简易安装方法

### 方法一：直接运行脚本（不需要npm）

```bash
# 直接运行以下命令创建扩展包
node simple-pack.js
```

### 方法二：手动创建扩展包

如果脚本运行出错，您可以手动创建扩展包：

1. 创建一个新文件夹（例如`dist`）
2. 复制以下文件到该文件夹：
   - `public/manifest.json`
   - `public/background.js`
   - `public/favicon.ico`
   - `public/index.html`
3. 将整个`src`目录复制到该文件夹
4. 压缩该文件夹为zip格式

### 在Chrome中安装扩展

1. 打开Chrome浏览器，访问 `chrome://extensions/`
2. 开启右上角的"开发者模式"
3. 将生成的 `chrome-extension.zip` 文件直接拖放到Chrome扩展页面

## 功能

- **搜索栏**: 方便快速搜索
- **最近历史**: 显示最近访问的网站
- **书签管理**: 创建分组并管理您的书签
- **拖放功能**: 拖放重新排序书签和书签组

## 分享扩展

想与他人分享此扩展，只需分享生成的 `chrome-extension.zip` 文件，让他们按照安装说明进行安装即可。

## 常见问题解决

如果遇到"MODULE_NOT_FOUND"错误：
- 确保使用的是Node.js版本14或更高版本
- 尝试使用simple-pack.js脚本，它不依赖外部模块
- 如果一切都失败了，请使用手动创建扩展包的方法
