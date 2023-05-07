const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);
const copyFileAsync = promisify(fs.copyFile);

const COMPONENTS_DIR = path.join(__dirname, 'components');
const STYLES_DIR = path.join(__dirname, 'styles');
const ASSETS_DIR = path.join(__dirname, 'assets');
const DIST_DIR = path.join(__dirname, 'project-dist');
const INDEX_FILE = path.join(DIST_DIR, 'index.html');
const STYLE_FILE = path.join(DIST_DIR, 'style.css');
const TEMPLATE_FILE = path.join(__dirname, 'template.html');

async function createDistDir() {
  try {
    await mkdirAsync(DIST_DIR);
    console.log(`Created ${DIST_DIR} directory`);
  } catch (err) {
    if (err.code === 'EEXIST') {
      console.log(`${DIST_DIR} directory already exists`);
    } else {
      console.error(`Error creating ${DIST_DIR} directory: ${err}`);
    }
  }
}

async function replaceTemplateTags(templateContent) {
  const componentFiles = await fs.promises.readdir(COMPONENTS_DIR);
  for (const component of componentFiles) {
    const componentName = path.basename(component, '.html');
    const componentPath = path.join(COMPONENTS_DIR, component);
    const componentContent = await readFileAsync(componentPath, 'utf-8');
    const tag = `{{${componentName}}}`;
    templateContent = templateContent.replace(new RegExp(tag, 'g'), componentContent);
  }
  return templateContent;
}

async function compileIndex() {
  const templateContent = await readFileAsync(TEMPLATE_FILE, 'utf-8');
  const compiledContent = await replaceTemplateTags(templateContent);
  await writeFileAsync(INDEX_FILE, compiledContent, 'utf-8');
  console.log(`Compiled ${INDEX_FILE}`);
}

async function compileStyles() {
  const styleFiles = await fs.promises.readdir(STYLES_DIR);
  let styles = '';
  for (const file of styleFiles) {
    const filePath = path.join(STYLES_DIR, file);
    const fileContent = await readFileAsync(filePath, 'utf-8');
    styles += fileContent;
  }
  await writeFileAsync(STYLE_FILE, styles, 'utf-8');
  console.log(`Compiled ${STYLE_FILE}`);
}

async function copyAssets() {
  try {
    await copyFileAsync(ASSETS_DIR, path.join(DIST_DIR, 'assets'));
    console.log(`Copied ${ASSETS_DIR} to ${path.join(DIST_DIR, 'assets')}`);
  } catch (err) {
    console.error(`Error copying ${ASSETS_DIR}: ${err}`);
  }
}

async function build() {
  await createDistDir();
  await compileIndex();
  await compileStyles();
  await copyAssets();
  console.log('Build complete');
}

build();
