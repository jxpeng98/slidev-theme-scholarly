import test from 'node:test';
import assert from 'node:assert/strict';

import { renderGuiBuilderHtml } from '../out/guiBuilderView.js';

test('renders a CSP-protected draggable GUI builder shell', () => {
  const html = renderGuiBuilderHtml({
    nonce: 'abc123',
    cspSource: 'vscode-resource:',
    layouts: [
      {
        id: 'cover',
        label: 'title-slide',
        description: 'Title slide',
        category: 'deck-structure',
        image: 'vscode-resource:/cover.png',
        useFor: 'Opening a presentation',
        features: ['Presenter metadata', 'Conference footer'],
        tags: ['opening', 'authors'],
        config: [{
          name: 'authors',
          type: 'Author[]',
          required: true,
          default: '[]',
          description: 'Presenter names and affiliations'
        }],
        slots: [{ name: 'default', description: 'Title and subtitle content' }]
      },
      { id: 'bullets', label: 'bullets', description: 'Bullet list', category: 'content' }
    ],
    colorThemes: [{
      value: 'classic-blue',
      label: 'Classic Blue',
      description: 'Default scholarly palette',
      palette: {
        primary: '#1e3a5f',
        primaryLight: '#2c5282',
        accent: '#b8860b',
        background: '#fdfbf7',
        foreground: '#2d3748'
      }
    }],
    fontThemes: [{ value: 'classic', label: 'Classic', description: 'Serif-led academic type' }],
    contentModes: [{ value: 'light', label: 'Light' }],
    surfaceModes: [{ value: 'dark', label: 'Dark' }]
  });

  assert.match(html, /Content-Security-Policy/);
  assert.match(html, /script-src 'nonce-abc123'/);
  assert.match(html, /draggable="true"/);
  assert.match(html, /data-layout-id="cover"/);
  assert.match(html, /data-layout-id="bullets"/);
  assert.match(html, /Title Slide/);
  assert.match(html, /Deck Structure/);
  assert.match(html, /Opening a presentation/);
  assert.match(html, /Presenter metadata/);
  assert.match(html, /class="layout-thumbnail-image"/);
  assert.match(html, /aspect-ratio: 4 \/ 3/);
  assert.match(html, /id="layout-search"/);
  assert.match(html, /id="layout-category"/);
  assert.match(html, /filterLayouts/);
  assert.match(html, /Classic Blue/);
  assert.match(html, /Default scholarly palette/);
  assert.match(html, /id="theme-swatches"/);
  assert.match(html, /palette-0/);
  assert.match(html, /id="content-mode"/);
  assert.match(html, /id="chrome-mode"/);
  assert.match(html, /id="section-mode"/);
  assert.match(html, /contentMode: ''/);
  assert.match(html, /Follow Slidev/);
  assert.match(html, /chromeMode: 'dark'/);
  assert.match(html, /sectionMode: 'dark'/);
  assert.match(html, /state\.contentMode = event\.target\.value/);
  assert.match(html, /state\.chromeMode = event\.target\.value/);
  assert.match(html, /state\.sectionMode = event\.target\.value/);
  assert.match(html, /id="slide-layout-select"/);
  assert.match(html, /id="layout-use-for"/);
  assert.match(html, /id="layout-features"/);
  assert.match(html, /id="layout-config"/);
  assert.match(html, /Layout\/theme-specific keys/);
  assert.match(html, /Standard <code>layout<\/code>/);
  assert.match(html, /id="layout-slots"/);
  assert.match(html, /Frontmatter configuration/);
  assert.match(html, /Presenter names and affiliations/);
  assert.match(html, /required.*optional/);
  assert.match(html, /Title and subtitle content/);
  assert.match(html, /configItemMarkup/);
  assert.match(html, /configEditorMarkup/);
  assert.match(html, /data-config-name/);
  assert.match(html, /data-config-type/);
  assert.match(html, /required aria-required="true"/);
  assert.match(html, /data-slot-name/);
  assert.match(html, /Override value/);
  assert.match(html, /Slot content/);
  assert.match(html, /JSON only, e\.g\. \[\.\.\.\] or \{\.\.\.\}/);
  assert.match(html, /slide\.config/);
  assert.match(html, /slide\.slots/);
  assert.match(html, /parseConfigEditorValue/);
  assert.match(html, /validateDeck/);
  assert.match(html, /builder-validation/);
  assert.match(html, /previewConfigValue/);
  assert.match(html, /syncFirstCover/);
  assert.match(html, /updateSelected\(\{ layout: event\.target\.value, config: \{\}, slots: \{\} \}\)/);
  assert.match(html, /--sch-bg/);
  assert.match(html, /focus-visible/);
  assert.match(html, /prefers-reduced-motion/);
  assert.match(html, /drop-zone\.drag-over/);
  assert.match(html, /icon-button destructive/);
  assert.match(html, /acquireVsCodeApi/);
  assert.match(html, /generateNewDocument/);
  assert.match(html, /insertIntoEditor/);

  const script = html.match(/<script nonce="abc123">([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script);
  assert.doesNotThrow(() => new Function(script));
});
