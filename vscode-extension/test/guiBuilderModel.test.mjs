import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createBuilderSlide,
  renderBuilderMarkdown,
  renderBuilderSlides
} from '../out/guiBuilderModel.js';
import { BUILDER_TEMPLATES } from '../out/sharedData.js';

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
  assert.match(markdown, /title: Research Talk/);
  assert.match(markdown, /subtitle: A GUI-generated draft/);
  assert.match(markdown, /footerMiddle: Workshop 2026/);
  assert.match(markdown, /colorTheme: classic-blue/);
  assert.match(markdown, /fontTheme: classic/);
  assert.doesNotMatch(markdown, /contentMode: (?:light|dark)/);
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

test('uses Chinese placeholders for a Chinese deck', () => {
  const markdown = renderBuilderMarkdown({
    lang: 'zh-CN',
    slides: [createBuilderSlide('default')]
  });

  assert.match(markdown, /# 未命名页面/);
  assert.match(markdown, /在这里填写内容。/);
});

test('renders layout-specific configuration and named slots', () => {
  const markdown = renderBuilderMarkdown({
    slides: [
      createBuilderSlide('split-image', {
        title: 'Qualitative comparison',
        config: {
          images: '["./before.png", "./after.png"]',
          captions: ['Before', 'After'],
          title: 'true',
          ratio: '1:1',
          showNumbers: false,
          emptyValue: ''
        },
        slots: {
          default: 'Default content stays in the normal body fields.',
          notes: 'Explain the visual difference.'
        }
      })
    ]
  });

  assert.match(markdown, /layout: split-image/);
  assert.match(markdown, /images: \["\.\/before\.png","\.\/after\.png"\]/);
  assert.match(markdown, /captions: \["Before","After"\]/);
  assert.match(markdown, /title: "true"/);
  assert.match(markdown, /ratio: "1:1"/);
  assert.match(markdown, /showNumbers: false/);
  assert.doesNotMatch(markdown, /emptyValue:/);
  assert.match(markdown, /::notes::\n\nExplain the visual difference\./);
  assert.doesNotMatch(markdown, /::default::/);
  assert.match(markdown, /Default content stays in the normal body fields\./);
});

test('preserves declared string values instead of coercing YAML-like scalars', () => {
  const markdown = renderBuilderMarkdown({
    slides: [createBuilderSlide('end', {
      config: {
        subtitle: 'null',
        qrcodeLabel: '2026',
        website: 'true'
      }
    })]
  });

  assert.match(markdown, /subtitle: "null"/);
  assert.match(markdown, /qrcodeLabel: "2026"/);
  assert.match(markdown, /website: "true"/);
});

test('builds the paper-talk workflow from the shared CLI template', () => {
  const workflow = BUILDER_TEMPLATES.find(template => template.id === 'paper-talk');

  assert.ok(workflow);
  assert.equal(workflow.deck.slides.length, 8);

  const markdown = renderBuilderMarkdown(workflow.deck);
  assert.match(markdown, /description: Structured academic paper presentation/);
  assert.match(markdown, /layout: paper-summary/);
  assert.match(markdown, /paperTitle: Efficient Adaptation for Scientific Models/);
  assert.match(markdown, /::problem::/);
  assert.match(markdown, /layout: method-pipeline/);
  assert.match(markdown, /activeStep: 2/);
  assert.match(markdown, /layout: references/);
});

test('renders one selected slide without deck frontmatter', () => {
  const markdown = renderBuilderSlides([
    createBuilderSlide('quote', { title: 'Key claim', body: 'Evidence belongs beside the claim.' })
  ]);

  assert.match(markdown, /^---\nlayout: quote\n---/);
  assert.doesNotMatch(markdown, /theme: scholarly/);
});
