import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = new URL('../src/', import.meta.url);

test('supports Scholarly completions in file, untitled, and remote Markdown editors', async () => {
  const extension = await readFile(new URL('extension.ts', source), 'utf8');

  assert.match(extension, /DocumentSelector = \{ language: 'markdown' \}/);
  assert.doesNotMatch(extension, /DocumentSelector = \{ language: 'markdown', scheme: 'file' \}/);
});

test('guards shared insertion and presentation creation paths', async () => {
  const commands = await readFile(new URL('commands.ts', source), 'utf8');

  assert.match(commands, /editor\.document\.languageId !== 'markdown'/);
  assert.match(commands, /workspace\.fs\.stat\(uri\)/);
  assert.match(commands, /already exists\. Choose another file name/);
  assert.match(commands, /path\.isAbsolute\(value\)/);
});
