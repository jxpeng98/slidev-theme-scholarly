import test from 'node:test';
import assert from 'node:assert/strict';

import { renderGuiBuilderHtml } from '../out/guiBuilderView.js';

test('renders a CSP-protected draggable GUI builder shell', () => {
  const html = renderGuiBuilderHtml({
    nonce: 'abc123',
    cspSource: 'vscode-resource:',
    layouts: [
      { id: 'cover', label: 'cover', description: 'Title slide', category: 'structure' },
      { id: 'bullets', label: 'bullets', description: 'Bullet list', category: 'content' }
    ],
    colorThemes: [{ value: 'classic-blue', label: 'Classic Blue' }],
    fontThemes: [{ value: 'classic', label: 'Classic' }]
  });

  assert.match(html, /Content-Security-Policy/);
  assert.match(html, /script-src 'nonce-abc123'/);
  assert.match(html, /draggable="true"/);
  assert.match(html, /data-layout-id="cover"/);
  assert.match(html, /data-layout-id="bullets"/);
  assert.match(html, /Classic Blue/);
  assert.match(html, /id="content-mode"/);
  assert.match(html, /id="chrome-mode"/);
  assert.match(html, /id="section-mode"/);
  assert.match(html, /contentMode: 'light'/);
  assert.match(html, /chromeMode: 'dark'/);
  assert.match(html, /sectionMode: 'dark'/);
  assert.match(html, /state\.contentMode = event\.target\.value/);
  assert.match(html, /state\.chromeMode = event\.target\.value/);
  assert.match(html, /state\.sectionMode = event\.target\.value/);
  assert.match(html, /acquireVsCodeApi/);
  assert.match(html, /generateNewDocument/);
  assert.match(html, /insertIntoEditor/);
});
