
# Elegant New Tab - Chrome 扩展安装指南

这是一个美观的新标签页扩展，提供搜索栏、最近浏览历史和书签管理功能。

## 快速安装（推荐）

### 1. 构建并打包扩展

```bash
# 安装所有依赖
npm install

# 安装archiver包（用于创建zip文件）
npm install archiver

# 构建并打包扩展
node build-extension.js
```

### 2. 在Chrome中安装扩展

方法一：直接安装zip
1. 打开Chrome浏览器，访问 chrome://extensions/
2. 开启右上角的"开发者模式"
3. 将生成的 `elegant-new-tab.zip` 文件直接拖放到Chrome扩展页面

方法二：加载文件夹
1. 打开Chrome浏览器
2. 在地址栏输入 `chrome://extensions/` 并访问
3. 在右上角启用"开发者模式"
4. 点击"加载已解压的扩展程序"按钮
5. 选择项目的 `dist` 目录
6. 扩展将被安装到Chrome浏览器中

### 3. 使用扩展

安装后，每次打开新标签页时将显示Elegant New Tab页面：

- 在顶部搜索栏搜索网页
- 查看最近的浏览历史
- 管理和组织您的书签

## 功能

- **搜索栏**: 方便快速搜索
- **最近历史**: 显示最近访问的网站
- **书签管理**: 创建分组并管理您的书签
- **拖放功能**: 拖放重新排序书签和书签组

## 分享扩展

想与他人分享此扩展，只需分享生成的 `elegant-new-tab.zip` 文件，让他们按照"方法一"进行安装。
