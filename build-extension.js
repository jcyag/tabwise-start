
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 构建项目
console.log('正在构建项目...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('项目构建成功！');
} catch (error) {
  console.error('构建项目失败:', error);
  process.exit(1);
}

// 确定构建目录
const buildDir = path.join(__dirname, 'dist');
const publicDir = path.join(__dirname, 'public');

// 确保构建目录存在
if (!fs.existsSync(buildDir)) {
  console.error('构建目录不存在，请检查构建过程');
  process.exit(1);
}

// 复制Chrome扩展所需的文件
console.log('正在复制Chrome扩展文件...');
const filesToCopy = [
  'manifest.json',
  'background.js',
  'favicon.ico'
];

filesToCopy.forEach(file => {
  const sourcePath = path.join(publicDir, file);
  const destPath = path.join(buildDir, file);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`已复制: ${file}`);
  } else {
    console.warn(`警告: 找不到文件 ${file}`);
  }
});

console.log('扩展构建完成！');
console.log('请在Chrome浏览器中访问 chrome://extensions/');
console.log('开启开发者模式，然后点击"加载已解压的扩展程序"');
console.log(`选择以下目录: ${buildDir}`);
