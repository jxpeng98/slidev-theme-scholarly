import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { renderGuiBuilderHtml } from '../out/guiBuilderView.js';

test('renders the workflow-driven Deck Builder shell', async () => {
  const html = renderGuiBuilderHtml({
    nonce: 'abc123',
    cspSource: 'vscode-resource:',
    styleUri: 'vscode-resource:/gui-builder.css',
    scriptUri: 'vscode-resource:/guiBuilderWebview.js',
    layouts: [{
      id: 'cover',
      label: 'title-slide',
      description: 'Title slide',
      category: 'deck-structure',
      image: 'vscode-resource:/cover.png',
      useFor: 'Opening a presentation'
    }],
    templates: [{
      id: 'paper-talk',
      label: 'Paper Talk',
      description: 'Present one paper clearly',
      deck: {
        templateId: 'paper-talk',
        title: 'Paper Talk',
        slides: [{ layout: 'cover', title: 'Paper Title' }]
      }
    }],
    colorThemes: [{ value: 'classic-blue', label: 'Classic Blue' }],
    fontThemes: [{ value: 'classic', label: 'Classic' }]
  });

  assert.match(html, /Content-Security-Policy/);
  assert.match(html, /Choose a workflow/);
  assert.match(html, /Arrange the slides/);
  assert.match(html, /Write the slide/);
  assert.match(html, /Create Markdown/);
  assert.match(html, /Insert selected slide/);
  assert.match(html, /data-layout-id="cover"/);
  assert.match(html, /vscode-resource:\/gui-builder\.css/);
  assert.match(html, /vscode-resource:\/guiBuilderWebview\.js/);
  assert.match(html, /"templateId":"paper-talk"/);
  assert.doesNotMatch(html, /<iframe/);

  const script = await readFile(new URL('../out/guiBuilderWebview.js', import.meta.url), 'utf8');
  assert.match(script, /previewSelectedSlide/);
  assert.match(script, /generateNewDocument/);
  assert.match(script, /insertSelectedSlide/);
  assert.match(script, /draggable="true"/);
  assert.match(script, /reportValidity/);
  assert.match(script, /matchMedia/);
  assert.doesNotThrow(() => new Function(script));
});

test('renders a natural Simplified Chinese Deck Builder shell', () => {
  const html = renderGuiBuilderHtml({
    nonce: 'abc123',
    cspSource: 'vscode-resource:',
    styleUri: 'vscode-resource:/gui-builder.css',
    scriptUri: 'vscode-resource:/guiBuilderWebview.js',
    language: 'zh-cn',
    layouts: [{
      id: 'cover',
      label: '标题页',
      description: '演示的第一张幻灯片',
      category: '结构',
      useFor: '展示标题、作者和所属机构'
    }],
    templates: [],
    colorThemes: [],
    fontThemes: []
  });

  assert.match(html, /<html lang="zh-cn">/);
  assert.match(html, /选择工作流/);
  assert.match(html, /调整页面顺序/);
  assert.match(html, /填写当前页/);
  assert.match(html, /生成 Markdown/);
  assert.match(html, /演示信息与主题/);
  assert.match(html, /添加“标题页”页面/);
});
