import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create deployment directory structure
const deployDir = './deploy';

if (!fs.existsSync(deployDir)) {
  fs.mkdirSync(deployDir, { recursive: true });
}

// Copy necessary files for deployment
const filesToCopy = [
  'package.json',
  'package-lock.json',
  'server.js',
  '.env.production',
  'dist/'
];

console.log('Preparing deployment files...');

// Create a deployment package.json with only production dependencies
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const productionPackageJson = {
  ...packageJson,
  scripts: {
    start: "node server.js",
    postinstall: "cd Backend && npm install --production"
  }
};

fs.writeFileSync(
  path.join(deployDir, 'package.json'),
  JSON.stringify(productionPackageJson, null, 2)
);

// Copy server.js
fs.copyFileSync('./server.js', path.join(deployDir, 'server.js'));

// Copy .env.production as .env
fs.copyFileSync('./.env.production', path.join(deployDir, '.env'));

// Copy dist folder if it exists
if (fs.existsSync('./dist')) {
  const copyDir = (src, dest) => {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const files = fs.readdirSync(src);
    files.forEach(file => {
      const srcPath = path.join(src, file);
      const destPath = path.join(dest, file);
      if (fs.statSync(srcPath).isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    });
  };
  copyDir('./dist', path.join(deployDir, 'dist'));
}

// Copy Backend folder
if (fs.existsSync('./Backend')) {
  const copyDir = (src, dest) => {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const files = fs.readdirSync(src);
    files.forEach(file => {
      const srcPath = path.join(src, file);
      const destPath = path.join(dest, file);
      if (fs.statSync(srcPath).isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    });
  };
  copyDir('./Backend', path.join(deployDir, 'Backend'));
}

console.log('Deployment files prepared in ./deploy directory');
console.log('Upload the contents of the deploy folder to your Hostinger Node.js hosting');
