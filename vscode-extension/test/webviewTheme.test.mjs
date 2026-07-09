import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const sourceUrl = new URL('../src/', import.meta.url);

test('uses one semantic VS Code theme layer across extension webviews', async () => {
  const [theme, builder, preview] = await Promise.all([
    readFile(new URL('webviewTheme.ts', sourceUrl), 'utf8'),
    readFile(new URL('guiBuilderView.ts', sourceUrl), 'utf8'),
    readFile(new URL('preview.ts', sourceUrl), 'utf8')
  ]);

  assert.match(builder, /WEBVIEW_THEME_CSS/);
  assert.match(preview, /WEBVIEW_THEME_CSS/);

  for (const token of [
    '--vscode-editor-background',
    '--vscode-editor-foreground',
    '--vscode-descriptionForeground',
    '--vscode-focusBorder',
    '--vscode-input-background',
    '--vscode-dropdown-background',
    '--vscode-button-background',
    '--vscode-button-secondaryBackground',
    '--vscode-list-hoverBackground',
    '--vscode-list-activeSelectionBackground',
    '--vscode-list-dropBackground',
    '--vscode-textCodeBlock-background',
    '--vscode-errorForeground',
    '--vscode-disabledForeground'
  ]) {
    assert.match(theme, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.match(theme, /:focus-visible/);
  assert.match(theme, /prefers-reduced-motion/);
  assert.match(theme, /forced-colors/);
  assert.match(builder, /Presentation palette data; these colors preview slide content, not extension chrome/);

  const chromeSources = [theme, builder, preview].join('\n');
  assert.doesNotMatch(chromeSources, /#[0-9a-f]{3,8}\b/gi);
  assert.doesNotMatch(chromeSources, /rgba?\(/gi);
});
