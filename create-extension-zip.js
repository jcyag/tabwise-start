
const fs = require('fs');
const path = require('path');

// 简单的zip创建函数
const createZip = (sourceDir, targetZip) => {
  console.log('创建zip文件...');
  
  try {
    // 使用内建模块，不依赖外部包
    const { execSync } = require('child_process');
    
    // 检测操作系统类型
    const isWindows = process.platform === 'win32';
    
    if (isWindows) {
      // Windows系统使用PowerShell命令
      const command = `powershell -command "Compress-Archive -Path '${sourceDir}\\*' -DestinationPath '${targetZip}' -Force"`;
      execSync(command);
    } else {
      // macOS/Linux系统使用zip命令
      const command = `cd "${sourceDir}" && zip -r "${targetZip}" *`;
      execSync(command);
    }
    
    console.log(`成功创建zip文件: ${targetZip}`);
    return true;
  } catch (error) {
    console.error('创建zip文件失败:', error.message);
    return false;
  }
};

// 主函数
const main = () => {
  console.log('开始打包Chrome扩展...');
  
  // 定义路径
  const publicDir = path.join(__dirname, 'public');
  const distDir = path.join(__dirname, 'dist');
  const zipFilePath = path.join(__dirname, 'elegant-new-tab.zip');
  
  // 创建dist目录（如果不存在）
  if (!fs.existsSync(distDir)) {
    console.log('创建dist目录...');
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  // 复制必要的文件到dist目录
  console.log('复制扩展文件...');
  const filesToCopy = [
    'manifest.json',
    'background.js',
    'favicon.ico',
    'index.html'
  ];
  
  filesToCopy.forEach(file => {
    const sourcePath = path.join(publicDir, file);
    const destPath = path.join(distDir, file);
    
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`已复制: ${file}`);
    } else {
      console.warn(`警告: 找不到文件 ${file}`);
    }
  });
  
  // 创建zip文件
  const success = createZip(distDir, zipFilePath);
  
  if (success) {
    console.log('\n安装说明:');
    console.log('1. 打开Chrome浏览器，访问 chrome://extensions/');
    console.log('2. 开启右上角的"开发者模式"');
    console.log('3. 将zip文件直接拖放到Chrome扩展页面');
  }
};

// 执行主函数
main();
