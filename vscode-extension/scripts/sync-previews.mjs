import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const extensionRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(extensionRoot, '..');

const srcLayouts = path.join(repoRoot, 'docs', 'public', 'images', 'layouts');
const srcThemes = path.join(repoRoot, 'docs', 'public', 'images', 'themes');
const srcComponents = path.join(repoRoot, 'docs', 'public', 'images', 'components');

const destRoot = path.join(extensionRoot, 'media', 'previews');
const destLayouts = path.join(destRoot, 'layouts');
const destThemes = path.join(destRoot, 'themes');
const destComponents = path.join(destRoot, 'components');
const manifestPath = path.join(destRoot, 'manifest.json');
const checkMode = process.argv.includes('--check');

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function exists(dir) {
  try {
    await fs.stat(dir);
    return true;
  } catch {
    return false;
  }
}

async function getFiles(dir, ext = '.png') {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getFiles(fullPath, ext)));
    } else if (entry.name.endsWith(ext)) {
      files.push(fullPath);
    }
  }
  return files;
}

async function hashFile(file) {
  const buffer = await fs.readFile(file);
  return createHash('sha256').update(buffer).digest('hex');
}

function toRootRelative(file) {
  return path.relative(repoRoot, file).split(path.sep).join('/');
}

function getPreviewKind(file) {
  return path.relative(path.join(repoRoot, 'docs', 'public', 'images'), file).split(path.sep)[0];
}

function hasPngquant() {
  try {
    execSync('pngquant --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

const pngquantAvailable = hasPngquant();

async function compressAndCopy(src, dest) {
  await ensureDir(path.dirname(dest));

  if (pngquantAvailable) {
    try {
      // Compress with pngquant (quality 65-80, ~60-70% size reduction)
      execSync(`pngquant --quality=65-80 --force --output "${dest}" "${src}"`, {
        stdio: 'ignore'
      });
      return 'compressed';
    } catch {
      // If compression fails, fall back to copy
      await fs.copyFile(src, dest);
      return 'copied (compression failed)';
    }
  } else {
    // No pngquant, just copy
    await fs.copyFile(src, dest);
    return 'copied (pngquant not found)';
  }
}

async function createManifestEntry(src, dest) {
  const relativeToKind = path.relative(path.join(repoRoot, 'docs', 'public', 'images'), src);
  return {
    kind: getPreviewKind(src),
    id: relativeToKind.replace(/\.png$/, '').split(path.sep).join('/'),
    source: toRootRelative(src),
    output: toRootRelative(dest),
    sourceSha256: await hashFile(src),
    outputSha256: await hashFile(dest),
    bytes: (await fs.stat(dest)).size
  };
}

async function collectSourceImages() {
  const groups = [
    { source: srcLayouts, dest: destLayouts },
    { source: srcThemes, dest: destThemes },
    { source: srcComponents, dest: destComponents }
  ];

  const images = [];
  for (const group of groups) {
    if (!(await exists(group.source)))
      continue;

    const files = await getFiles(group.source);
    for (const file of files) {
      images.push({
        source: file,
        dest: path.join(group.dest, path.relative(group.source, file))
      });
    }
  }

  return images.sort((a, b) => toRootRelative(a.source).localeCompare(toRootRelative(b.source)));
}

async function writeManifest(entries) {
  const manifest = {
    version: 1,
    sourceRoot: 'docs/public/images',
    outputRoot: 'vscode-extension/media/previews',
    entries: entries.sort((a, b) => a.source.localeCompare(b.source))
  };

  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
}

async function checkManifest() {
  const failures = [];
  const images = await collectSourceImages();
  let manifest;

  try {
    manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  } catch (error) {
    failures.push(`Missing or invalid preview manifest: ${error.message}`);
    manifest = { entries: [] };
  }

  if (manifest.version !== 1)
    failures.push('Preview manifest version should be 1');

  const entries = Array.isArray(manifest.entries) ? manifest.entries : [];
  if (entries.length !== images.length)
    failures.push(`Preview manifest should list ${images.length} images, found ${entries.length}`);

  const entriesBySource = new Map(entries.map(entry => [entry.source, entry]));
  for (const image of images) {
    const sourceRelative = toRootRelative(image.source);
    const outputRelative = toRootRelative(image.dest);
    const entry = entriesBySource.get(sourceRelative);
    if (!entry) {
      failures.push(`Preview manifest missing source ${sourceRelative}`);
      continue;
    }

    if (entry.output !== outputRelative)
      failures.push(`Preview manifest output mismatch for ${sourceRelative}`);

    if (!(await exists(image.dest))) {
      failures.push(`Missing preview output ${outputRelative}`);
      continue;
    }

    const sourceHash = await hashFile(image.source);
    const outputHash = await hashFile(image.dest);
    if (entry.sourceSha256 !== sourceHash)
      failures.push(`Source image changed without preview sync: ${sourceRelative}`);
    if (entry.outputSha256 !== outputHash)
      failures.push(`Preview output changed without manifest update: ${outputRelative}`);
  }

  if (failures.length) {
    console.error('Preview freshness check failed:');
    for (const failure of failures)
      console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Preview freshness check passed (${images.length} images).`);
}

async function main() {
  if (checkMode) {
    await checkManifest();
    return;
  }

  console.log('Syncing preview images...\n');

  if (!(await exists(srcLayouts))) {
    console.warn(`Warning: Layout images not found at ${srcLayouts}`);
  }
  if (!(await exists(srcThemes))) {
    console.warn(`Warning: Theme images not found at ${srcThemes}`);
  }
  if (!(await exists(srcComponents))) {
    console.warn(`Warning: Component images not found at ${srcComponents}`);
  }

  // Clean destination
  if (await exists(destRoot)) {
    await fs.rm(destRoot, { recursive: true, force: true });
  }
  await ensureDir(destLayouts);
  await ensureDir(destThemes);
  await ensureDir(destComponents);

  let totalOriginal = 0;
  let totalCompressed = 0;
  let fileCount = 0;

  const images = await collectSourceImages();
  const entries = [];
  const counts = new Map();

  for (const image of images) {
    const originalSize = (await fs.stat(image.source)).size;
    await compressAndCopy(image.source, image.dest);
    const compressedSize = (await fs.stat(image.dest)).size;

    totalOriginal += originalSize;
    totalCompressed += compressedSize;
    fileCount++;
    counts.set(getPreviewKind(image.source), (counts.get(getPreviewKind(image.source)) || 0) + 1);
    entries.push(await createManifestEntry(image.source, image.dest));
  }

  await writeManifest(entries);

  console.log(`Layouts: ${counts.get('layouts') || 0} files processed`);
  console.log(`Themes: ${counts.get('themes') || 0} files processed`);
  console.log(`Components: ${counts.get('components') || 0} files processed`);

  console.log(`\nTotal: ${fileCount} files`);

  if (fileCount === 0) {
    console.log('No files to process.');
  } else {
    const savedPercent = ((1 - totalCompressed / totalOriginal) * 100).toFixed(1);
    const originalMB = (totalOriginal / 1024 / 1024).toFixed(2);
    const compressedMB = (totalCompressed / 1024 / 1024).toFixed(2);
    console.log(`Size: ${originalMB} MB → ${compressedMB} MB (${savedPercent}% saved)`);
  }

  console.log(`\nOutput: ${path.relative(extensionRoot, destRoot)}/`);
  console.log(`Manifest: ${path.relative(extensionRoot, manifestPath)}`);

  if (!pngquantAvailable) {
    console.log('\nTip: Install pngquant for better compression:');
    console.log('  brew install pngquant  # macOS');
    console.log('  apt install pngquant   # Ubuntu/Debian');
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
