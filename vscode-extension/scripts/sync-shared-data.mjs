import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const extensionRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(extensionRoot, '..');
const sourceDir = path.join(repoRoot, 'shared');
const destDir = path.join(extensionRoot, 'shared');
const files = ['themes.json', 'layouts.json', 'citations.mjs', 'bibtex.mjs'];

async function main() {
  await fs.mkdir(destDir, { recursive: true });

  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const destPath = path.join(destDir, file);
    await fs.copyFile(sourcePath, destPath);
    console.log(`Synced ${path.relative(extensionRoot, destPath)}`);
  }

  await syncTemplates();
}

async function syncTemplates() {
  const sourcePath = path.join(sourceDir, 'templates.json');
  const destPath = path.join(destDir, 'templates.json');
  const data = JSON.parse(await fs.readFile(sourcePath, 'utf8'));

  data.templates = await Promise.all(data.templates.map(async template => {
    const slidesPath = path.join(repoRoot, 'cli', 'templates', template.id, 'slides.md');
    const source = await fs.readFile(slidesPath, 'utf8');
    return { ...template, deck: parseTemplateDeck(source, template.id) };
  }));

  await fs.writeFile(destPath, `${JSON.stringify(data, null, 4)}\n`);
  console.log(`Synced ${path.relative(extensionRoot, destPath)}`);
}

function parseTemplateDeck(source, templateId) {
  const normalized = source.replace(/\r\n/g, '\n').trim();
  const deckMatch = normalized.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!deckMatch) throw new Error(`Template ${templateId} has no deck frontmatter`);

  const frontmatter = deckMatch[1];
  const body = normalized.slice(deckMatch[0].length).trim();
  const chunks = body.split(/\n---\n(?=layout:\s*)/);
  const slides = chunks.map((chunk, index) => parseTemplateSlide(chunk, index));
  const themeConfig = readIndentedBlock(frontmatter, 'themeConfig');

  return {
    templateId,
    title: readScalar(frontmatter, 'title') || slides[0]?.title || 'Scholarly Presentation',
    subtitle: readFirstParagraph(slides[0]?.body || ''),
    footerMiddle: readScalar(frontmatter, 'footerMiddle') || 'Conference Name',
    lang: readScalar(frontmatter, 'lang') || 'en',
    colorTheme: readScalar(themeConfig, 'colorTheme') || 'classic-blue',
    fontTheme: readScalar(themeConfig, 'fontTheme') || 'classic',
    contentMode: readScalar(themeConfig, 'contentMode') || '',
    chromeMode: readScalar(themeConfig, 'chromeMode') || 'dark',
    sectionMode: readScalar(themeConfig, 'sectionMode') || 'dark',
    frontmatterSource: stripManagedFrontmatter(frontmatter),
    slides
  };
}

function parseTemplateSlide(chunk, index) {
  let layout = index === 0 ? 'cover' : 'default';
  let configSource = '';
  let body = chunk.trim();

  if (index > 0) {
    const boundary = chunk.indexOf('\n---\n');
    if (boundary < 0) throw new Error(`Slide ${index + 1} has no closing frontmatter delimiter`);
    const frontmatter = chunk.slice(0, boundary).trim();
    body = chunk.slice(boundary + 5).trim();
    layout = readScalar(frontmatter, 'layout') || 'default';
    configSource = removeScalar(frontmatter, 'layout').trim();
  }

  const headingMatch = body.match(/^#\s+(.+)$/m);
  let title = '';
  let heading = Boolean(headingMatch);
  let titleKey = '';

  if (headingMatch && headingMatch.index !== undefined) {
    title = headingMatch[1].trim();
    body = `${body.slice(0, headingMatch.index)}${body.slice(headingMatch.index + headingMatch[0].length)}`.trim();
  } else {
    for (const key of ['title', 'paperTitle', 'heading', 'question']) {
      const value = readScalar(configSource, key);
      if (!value) continue;
      title = value;
      titleKey = key;
      configSource = removeScalar(configSource, key).trim();
      break;
    }
  }

  const content = extractNamedSlots(body);
  return {
    id: `${templateIdForSlide(layout)}-${index + 1}`,
    layout,
    title: title || humanize(layout),
    body: content.body,
    slots: content.slots,
    heading,
    titleKey: heading ? '' : titleKey,
    configSource
  };
}

function extractNamedSlots(source) {
  const matches = [...source.matchAll(/^::([A-Za-z_][A-Za-z0-9_-]*)::\s*$/gm)];
  if (!matches.length) return { body: source.trim(), slots: {} };

  const slots = {};
  const body = source.slice(0, matches[0].index).trim();
  matches.forEach((match, index) => {
    const start = match.index + match[0].length;
    const end = matches[index + 1]?.index ?? source.length;
    slots[match[1]] = source.slice(start, end).trim();
  });
  return { body, slots };
}

function stripManagedFrontmatter(source) {
  const managed = new Set(['theme', 'title', 'subtitle', 'footerMiddle', 'lang']);
  const lines = source.split('\n');
  const kept = [];
  let skipIndented = false;

  for (const line of lines) {
    if (/^themeConfig:\s*$/.test(line)) {
      skipIndented = true;
      continue;
    }
    if (skipIndented && /^\s+/.test(line)) continue;
    skipIndented = false;

    const key = line.match(/^([A-Za-z_][A-Za-z0-9_-]*):/)?.[1];
    if (key && managed.has(key)) continue;
    kept.push(line);
  }

  return kept.join('\n').trim();
}

function readIndentedBlock(source, key) {
  const lines = source.split('\n');
  const start = lines.findIndex(line => line.trim() === `${key}:`);
  if (start < 0) return '';
  const block = [];
  for (let index = start + 1; index < lines.length && /^\s+/.test(lines[index]); index += 1)
    block.push(lines[index].replace(/^\s+/, ''));
  return block.join('\n');
}

function readScalar(source, key) {
  const match = source.match(new RegExp(`^${escapeRegExp(key)}:\\s*(.+)$`, 'm'));
  if (!match) return '';
  const value = match[1].trim();
  if (/^(["']).*\1$/.test(value)) {
    try { return JSON.parse(value); } catch { return value.slice(1, -1); }
  }
  return value;
}

function removeScalar(source, key) {
  return source.replace(new RegExp(`^${escapeRegExp(key)}:\\s*.*(?:\\n|$)`, 'm'), '');
}

function readFirstParagraph(source) {
  return source.split(/\n\s*\n/).map(value => value.trim()).find(Boolean) || '';
}

function humanize(value) {
  return value.replace(/[-_]+/g, ' ').replace(/\b\w/g, character => character.toUpperCase());
}

function templateIdForSlide(layout) {
  return layout.replace(/[^A-Za-z0-9_-]/g, '-') || 'slide';
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
