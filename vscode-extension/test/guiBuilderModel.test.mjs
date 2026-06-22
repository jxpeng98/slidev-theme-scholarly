import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createBuilderSlide,
  renderBuilderMarkdown
} from '../out/guiBuilderModel.js';

test('renders scholarly frontmatter and ordered slides from GUI state', () => {
  const markdown = renderBuilderMarkdown({
    title: 'Research Talk',
    subtitle: 'A GUI-generated draft',
    footerMiddle: 'Workshop 2026',
    colorTheme: 'classic-blue',
    fontTheme: 'classic',
    slides: [
      createBuilderSlide('cover', {
        title: 'Research Talk',
        body: 'A GUI-generated draft'
      }),
      createBuilderSlide('bullets', {
        title: 'Main Findings',
        bullets: ['Fast authoring', 'Editable Markdown output']
      }),
      createBuilderSlide('figure', {
        title: 'Architecture',
        image: './images/pipeline.png',
        caption: 'GUI state is rendered as Slidev Markdown.'
      })
    ]
  });

  assert.match(markdown, /^---\ntheme: scholarly\n/);
  assert.match(markdown, /footerMiddle: Workshop 2026/);
  assert.match(markdown, /colorTheme: classic-blue/);
  assert.match(markdown, /fontTheme: classic/);
  assert.match(markdown, /contentMode: light/);
  assert.match(markdown, /chromeMode: dark/);
  assert.match(markdown, /sectionMode: dark/);
  assert.match(markdown, /layout: cover/);
  assert.match(markdown, /# Research Talk\n\nA GUI-generated draft/);
  assert.match(markdown, /layout: bullets/);
  assert.match(markdown, /- Fast authoring\n- Editable Markdown output/);
  assert.match(markdown, /layout: figure/);
  assert.match(markdown, /!\[Architecture\]\(\.\/images\/pipeline\.png\)/);
  assert.match(markdown, /\*GUI state is rendered as Slidev Markdown\.\*/);
});

test('renders selected content and surface modes in GUI frontmatter', () => {
  const markdown = renderBuilderMarkdown({
    contentMode: 'dark',
    chromeMode: 'inverse',
    sectionMode: 'match',
    slides: [createBuilderSlide('default')]
  });

  assert.match(markdown, /contentMode: dark/);
  assert.match(markdown, /chromeMode: inverse/);
  assert.match(markdown, /sectionMode: match/);
});

test('uses practical placeholder text when a GUI slide is incomplete', () => {
  const markdown = renderBuilderMarkdown({
    slides: [createBuilderSlide('default')]
  });

  assert.match(markdown, /# Untitled slide/);
  assert.match(markdown, /Add content here\./);
});
