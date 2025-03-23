
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// 定义路径
console.log('开始打包Chrome扩展...');
const sourceDir = path.join(__dirname, 'src');
const publicDir = path.join(__dirname, 'public');
const distDir = path.join(__dirname, 'dist');
const zipFilePath = path.join(__dirname, 'elegant-new-tab.zip');

// 创建dist目录（如果不存在）
if (!fs.existsSync(distDir)) {
  console.log('创建dist目录...');
  fs.mkdirSync(distDir, { recursive: true });
}

// 复制public目录下的文件到dist
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

// 复制src目录到dist/src
console.log('复制src目录...');
if (fs.existsSync(sourceDir)) {
  const copyDir = (src, dest) => {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  };
  
  copyDir(sourceDir, path.join(distDir, 'src'));
}

// 创建zip文件
console.log('创建Chrome扩展zip包...');

try {
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
    console.log('3. 将zip文件直接拖放到Chrome扩展页面');
  });

  archive.on('error', function(err) {
    throw err;
  });

  archive.pipe(output);
  archive.directory(distDir, false);
  archive.finalize();
} catch (error) {
  console.error('创建zip文件失败:', error);
}

