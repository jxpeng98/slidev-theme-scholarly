import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const command = 'slidev-scholarly.openGuiBuilder';

test('registers the Deck Builder command in the VS Code extension manifest', async () => {
  const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

  assert.ok(manifest.activationEvents.includes(`onCommand:${command}`));
  assert.ok(manifest.contributes.commands.some(item =>
    item.command === command && item.title === '%command.openDeckBuilder%'
  ));
});

test('wires the Deck Builder command during extension activation', async () => {
  const source = await readFile(new URL('../src/extension.ts', import.meta.url), 'utf8');

  assert.match(source, /openGuiBuilder/);
  assert.match(source, new RegExp(command.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});

test('orders sidebar views by the documentation workflow', async () => {
  const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  const messages = JSON.parse(await readFile(new URL('../package.nls.json', import.meta.url), 'utf8'));
  const views = manifest.contributes.views['slidev-scholarly'];
  const resolveMessage = value => {
    const key = value.match(/^%(.*)%$/)?.[1];
    return key ? messages[key] ?? value : value;
  };

  assert.deepEqual(
    views.map(item => resolveMessage(item.name)),
    [
      'Start · Templates',
      'Build · Layouts',
      'Build · Components',
      'Build · Citations & Anchors',
      'Customize · Themes',
      'Reference · CLI Actions',
      'Preview'
    ]
  );
  assert.ok(manifest.contributes.commands.every(item => item.category === 'Slidev Scholarly'));
});
