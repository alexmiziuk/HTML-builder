const fs = require('fs').promises;
const path = require('path');

async function copyDir() {
  const sourceDir = path.join(__dirname, 'files');
  const destDir = path.join(__dirname, 'files-copy');
  
  try {
    await fs.access(destDir);
  } catch (error) {
    await fs.mkdir(destDir, { recursive: true });
  }
  
  const files = await fs.readdir(sourceDir, { withFileTypes: true });
  for (const file of files) {
    const sourcePath = path.join(sourceDir, file.name);
    const destPath = path.join(destDir, file.name);
    
    if (file.isDirectory()) {
      await copyDir(sourcePath, destPath);
    } else {
      await fs.copyFile(sourcePath, destPath);
    }
  }
}

copyDir();


