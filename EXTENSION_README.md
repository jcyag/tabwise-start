
# Elegant New Tab - Chrome 扩展安装指南

这是一个美观的新标签页扩展，提供搜索栏、最近浏览历史和书签管理功能。

## 直接安装方式

### 运行脚本创建扩展包

```bash
# 直接运行脚本创建扩展包
node build-extension.js
```

如果出现错误提示找不到 archiver 模块，请先安装：

```bash
npm install archiver
```

### 在Chrome中安装扩展

1. 打开Chrome浏览器，访问 chrome://extensions/
2. 开启右上角的"开发者模式"
3. 将生成的 `elegant-new-tab.zip` 文件直接拖放到Chrome扩展页面

## 功能

- **搜索栏**: 方便快速搜索
- **最近历史**: 显示最近访问的网站
- **书签管理**: 创建分组并管理您的书签
- **拖放功能**: 拖放重新排序书签和书签组

## 分享扩展

想与他人分享此扩展，只需分享生成的 `elegant-new-tab.zip` 文件，让他们按照安装说明进行安装即可。

## 注意事项

如果在运行脚本时遇到问题：
- 确保Node.js已正确安装
- 确保已安装archiver模块：`npm install archiver`
- 确保文件路径正确，脚本文件位于项目根目录

