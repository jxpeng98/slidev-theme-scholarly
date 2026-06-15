import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const extensionRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(extensionRoot, '..');
const sourceDir = path.join(repoRoot, 'shared');
const destDir = path.join(extensionRoot, 'shared');
const files = ['themes.json', 'layouts.json', 'templates.json', 'citations.mjs', 'bibtex.mjs'];

async function main() {
  await fs.mkdir(destDir, { recursive: true });

  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const destPath = path.join(destDir, file);
    await fs.copyFile(sourcePath, destPath);
    console.log(`Synced ${path.relative(extensionRoot, destPath)}`);
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
