import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirsToProcess = [
  path.join(__dirname, 'public'),
  path.join(__dirname, 'src', 'assets')
];

async function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else if (fullPath.toLowerCase().endsWith('.png') || fullPath.toLowerCase().endsWith('.jpg') || fullPath.toLowerCase().endsWith('.jpeg')) {
      const ext = path.extname(fullPath);
      const newPath = fullPath.slice(0, -ext.length) + '.webp';
      
      console.log(`Converting ${fullPath} to webp...`);
      try {
        await sharp(fullPath)
          .webp({ quality: 80 })
          .toFile(newPath);
          
        // Delete original file after successful conversion
        fs.unlinkSync(fullPath);
        console.log(`Deleted original file: ${fullPath}`);
      } catch (err) {
        console.error(`Error processing ${fullPath}:`, err);
      }
    }
  }
}

async function run() {
  for (const dir of dirsToProcess) {
    if (fs.existsSync(dir)) {
      await processDirectory(dir);
    }
  }
  console.log('Optimization complete.');
}

run();
