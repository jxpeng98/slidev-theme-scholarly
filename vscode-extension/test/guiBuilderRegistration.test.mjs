import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const command = 'slidev-scholarly.openGuiBuilder';

test('registers the GUI Builder command in the VS Code extension manifest', async () => {
  const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

  assert.ok(manifest.activationEvents.includes(`onCommand:${command}`));
  assert.ok(manifest.contributes.commands.some(item =>
    item.command === command && item.title === 'Open GUI Builder'
  ));
});

test('wires the GUI Builder command during extension activation', async () => {
  const source = await readFile(new URL('../src/extension.ts', import.meta.url), 'utf8');

  assert.match(source, /openGuiBuilder/);
  assert.match(source, new RegExp(command.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});
