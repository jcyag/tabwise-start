
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const archiver = require('archiver');

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
const zipFilePath = path.join(__dirname, 'elegant-new-tab.zip');

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

// 创建zip文件
console.log('正在创建Chrome扩展zip包...');
const output = fs.createWriteStream(zipFilePath);
const archive = archiver('zip', {
  zlib: { level: 9 } // 设置压缩级别
});

output.on('close', function() {
  console.log(`扩展打包完成! 总大小: ${(archive.pointer() / 1024).toFixed(2)} KB`);
  console.log(`zip文件路径: ${zipFilePath}`);
  console.log('\n安装说明:');
  console.log('1. 打开Chrome浏览器，访问 chrome://extensions/');
  console.log('2. 开启右上角的"开发者模式"');
  console.log('3. 将zip文件直接拖放到Chrome扩展页面，或点击"加载已解压的扩展程序"选择dist目录');
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);
archive.directory(buildDir, false);
archive.finalize();
