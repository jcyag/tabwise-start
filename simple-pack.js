
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('开始创建Chrome扩展包...');

// 主函数
function main() {
  try {
    // 确保目录存在
    const distDir = path.join(__dirname, 'dist');
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }

    // 复制必要文件到dist目录
    const publicFiles = [
      'manifest.json',
      'background.js',
      'favicon.ico',
      'index.html'
    ];

    console.log('复制文件到dist目录...');
    
    // 从public目录复制到dist
    const publicDir = path.join(__dirname, 'public');
    for (const file of publicFiles) {
      const sourcePath = path.join(publicDir, file);
      const destPath = path.join(distDir, file);
      
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`已复制: ${file}`);
      } else {
        console.warn(`警告: 未找到文件 ${file}`);
      }
    }

    // 复制src目录到dist
    const srcDir = path.join(__dirname, 'src');
    if (fs.existsSync(srcDir)) {
      copyDirectory(srcDir, path.join(distDir, 'src'));
      console.log('已复制: src 目录');
    }

    // 创建zip文件
    const zipFilePath = path.join(__dirname, 'chrome-extension.zip');
    console.log('创建ZIP文件...');
    
    // 检测操作系统并使用适当的命令
    const isWindows = process.platform === 'win32';
    
    if (isWindows) {
      // Windows使用PowerShell命令
      execSync(`powershell -command "Compress-Archive -Path '${distDir}\\*' -DestinationPath '${zipFilePath}' -Force"`);
    } else {
      // macOS/Linux使用zip命令
      try {
        execSync(`cd "${distDir}" && zip -r "${zipFilePath}" ./*`);
      } catch (error) {
        console.log('zip命令失败，尝试使用其他方法...');
        // 如果zip命令失败，提供替代指令
        console.log(`
请手动压缩dist目录内容:
1. 打开文件管理器，导航到: ${distDir}
2. 选择所有文件
3. 右键点击，选择"压缩"或"添加到存档"选项
4. 将生成的zip文件重命名为"chrome-extension.zip"
        `);
        return;
      }
    }

    console.log(`
✅ 成功创建扩展包: ${zipFilePath}

安装说明:
1. 打开Chrome浏览器，访问: chrome://extensions/
2. 开启右上角的"开发者模式"
3. 将生成的zip文件直接拖放到Chrome扩展页面
`);
    
  } catch (error) {
    console.error('创建扩展包时出错:', error.message);
    console.log(`
如果出现错误，请尝试手动创建扩展包:
1. 复制public目录下的manifest.json, background.js, favicon.ico和index.html到一个新文件夹
2. 将src目录复制到该新文件夹
3. 压缩该文件夹为zip格式
4. 在Chrome扩展页面加载此zip文件
`);
  }
}

// 递归复制目录的辅助函数
function copyDirectory(source, destination) {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }
  
  const files = fs.readdirSync(source);
  
  for (const file of files) {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}

// 执行主函数
main();
