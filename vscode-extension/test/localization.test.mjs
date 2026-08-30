import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);

async function readJson(path) {
  return JSON.parse(await readFile(new URL(path, root), 'utf8'));
}

function placeholders(message) {
  return [...message.matchAll(/\{\d+\}/g)].map(match => match[0]).sort();
}

test('ships matching English and Simplified Chinese manifest messages', async () => {
  const [manifest, english, chinese] = await Promise.all([
    readJson('package.json'),
    readJson('package.nls.json'),
    readJson('package.nls.zh-cn.json')
  ]);

  assert.equal(manifest.l10n, './l10n');
  assert.equal(manifest.contributes.configuration.properties['slidevScholarly.language'], undefined);
  assert.deepEqual(Object.keys(chinese).sort(), Object.keys(english).sort());

  const manifestText = JSON.stringify(manifest);
  const keys = [...manifestText.matchAll(/%([^%]+)%/g)].map(match => match[1]);
  assert.ok(keys.length > 0);
  for (const key of keys) {
    assert.ok(english[key], `missing English manifest message: ${key}`);
    assert.ok(chinese[key], `missing Chinese manifest message: ${key}`);
  }
});

test('translates runtime UI and the catalog text shown most often', async () => {
  const [bundle, layouts, themes, templates, sourceFiles] = await Promise.all([
    readJson('l10n/bundle.l10n.zh-cn.json'),
    readJson('shared/layouts.json'),
    readJson('shared/themes.json'),
    readJson('shared/templates.json'),
    readdir(new URL('src/', root))
  ]);

  for (const file of sourceFiles.filter(name => name.endsWith('.ts'))) {
    const source = await readFile(new URL(`src/${file}`, root), 'utf8');
    for (const match of source.matchAll(/\bt\('((?:\\.|[^'\\])*)'/g)) {
      const message = match[1].replace(/\\'/g, "'");
      assert.ok(bundle[message], `missing runtime translation in ${file}: ${message}`);
    }
  }

  for (const item of Object.values(layouts.layoutCatalog)) {
    assert.ok(bundle[item.label], `missing layout label: ${item.label}`);
    assert.ok(bundle[item.useFor], `missing layout guidance: ${item.useFor}`);
  }
  for (const item of Object.values(layouts.componentCatalog))
    assert.ok(bundle[item.summary], `missing component summary: ${item.summary}`);

  for (const item of [
    ...themes.colorThemes,
    ...themes.fontThemes,
    ...themes.themePresets,
    ...themes.contentModes,
    ...themes.surfaceModes,
    ...templates.templates
  ]) {
    assert.ok(bundle[item.label], `missing option label: ${item.label}`);
    assert.ok(bundle[item.description], `missing option description: ${item.description}`);
  }

  for (const [message, translation] of Object.entries(bundle))
    assert.deepEqual(placeholders(translation), placeholders(message), `placeholder mismatch: ${message}`);
});
