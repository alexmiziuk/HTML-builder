const fs = require('fs');
const path = require('path');
const stylesFolderPath = path.join(__dirname, 'styles');
const distFolderPath = path.join(__dirname, 'project-dist');
const outputFileName = 'bundle.css';
const files = fs.readdirSync(stylesFolderPath);
const cssFiles = files.filter((file) => path.extname(file) === '.css');
let styles = '';
cssFiles.forEach((file) => {
  const content = fs.readFileSync(path.join(stylesFolderPath, file), 'utf-8');
  styles += content;
});
if (!fs.existsSync(distFolderPath)) {
  fs.mkdirSync(distFolderPath);
}
fs.writeFileSync(path.join(distFolderPath, outputFileName), styles);

