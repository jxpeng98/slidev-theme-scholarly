import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);

class MarkdownString {
  constructor(value = '') {
    this.value = value;
  }

  appendMarkdown(value) {
    this.value += value;
    return this;
  }
}

class TreeItem {
  constructor(label, collapsibleState) {
    this.label = label;
    this.collapsibleState = collapsibleState;
  }
}

class ThemeIcon {
  constructor(id) {
    this.id = id;
  }
}

function loadCatalogModules(language = 'en', bundle) {
  const Module = require('node:module');
  const originalLoad = Module._load;

  Module._load = function patchedLoad(request, parent, isMain) {
    if (request === 'vscode') {
      return {
        env: { language },
        l10n: {
          bundle,
          t(message, ...args) {
            const localized = bundle?.[message] ?? message;
            return args.reduce(
              (result, value, index) => result.replaceAll(`{${index}}`, String(value)),
              localized
            );
          }
        },
        MarkdownString,
        ThemeIcon,
        TreeItem,
        TreeItemCollapsibleState: { None: 0, Collapsed: 1, Expanded: 2 },
        Uri: {
          joinPath(base, ...segments) {
            return {
              fsPath: path.join(base.fsPath, ...segments)
            };
          }
        }
      };
    }
    return originalLoad.call(this, request, parent, isMain);
  };

  try {
    for (const moduleName of ['../out/localization.js', '../out/providers.js', '../out/preview.js']) {
      const resolved = require.resolve(moduleName);
      delete require.cache[resolved];
    }
    return {
      providers: require('../out/providers.js'),
      preview: require('../out/preview.js')
    };
  } finally {
    Module._load = originalLoad;
  }
}

test('exposes complete, grouped layout and component catalog metadata', async () => {
  const { providers } = loadCatalogModules();
  const layoutItems = Object.values(providers.layoutCategories).flatMap(category => category.layouts);
  const groupedComponents = Object.values(providers.componentCategories).flatMap(category => category.items);

  assert.equal(layoutItems.length, 34);
  assert.equal(new Set(layoutItems.map(item => item.id)).size, 34);
  assert.ok(layoutItems.every(item =>
    item.label
    && item.description
    && item.details?.useFor
    && item.details?.features?.length
    && Array.isArray(item.details?.config)
    && Array.isArray(item.details?.slots)
  ));

  assert.equal(groupedComponents.length, providers.components.length);
  assert.equal(new Set(groupedComponents.map(item => item.label)).size, groupedComponents.length);
  const canonicalComponents = groupedComponents.filter(item => item.canonicalName);
  assert.equal(new Set(canonicalComponents.map(item => item.canonicalName)).size, 17);
  assert.ok(canonicalComponents.every(item =>
    Array.isArray(item.details?.config) && Array.isArray(item.details?.slots)
  ));

  const resultTable = providers.components.find(item => item.canonicalName === 'ResultTable');
  assert.ok(resultTable);
  assert.equal(resultTable.category, 'evidence');
  assert.match(resultTable.description, /structured result datasets/i);
  assert.ok(resultTable.details.features.includes('Highlighted columns and compact mode'));
  assert.ok(resultTable.details.config.some(item => item.name === 'highlightColumn'));

  const definition = providers.components.find(item => item.label === 'Definition');
  assert.equal(definition?.canonicalName, 'Theorem');
  assert.equal(definition?.category, 'academic');

  const provider = new providers.ComponentsProvider({
    fsPath: path.resolve(new URL('..', import.meta.url).pathname)
  });
  const categories = await provider.getChildren();
  assert.equal(categories.length, 5);
  assert.deepEqual(
    categories.map(item => item.label),
    ['Academic', 'Evidence & Results', 'Structure', 'Citations', 'Style & Utilities']
  );

  const evidenceItems = await provider.getChildren(categories[1]);
  assert.ok(evidenceItems.some(item => item.item.canonicalName === 'ResultTable'));
  assert.ok(evidenceItems.every(item => item.contextValue === 'componentSnippet'));

  const layoutProvider = new providers.LayoutsProvider({
    fsPath: path.resolve(new URL('..', import.meta.url).pathname)
  });
  const layoutGroups = await layoutProvider.getChildren();
  const structureItems = await layoutProvider.getChildren(layoutGroups[0]);
  const cover = structureItems.find(item => item.item.id === 'cover');
  assert.match(cover.tooltip.value, /Settings:/);
  assert.match(cover.tooltip.value, /Content slots:/);
  assert.match(cover.tooltip.value, /Cover title, subtitle, and other opening content/);
});

test('resolves every visual component variant to its canonical preview', () => {
  const { preview } = loadCatalogModules();

  assert.equal(preview.getComponentPreviewFile('ResultTable'), 'result-table');
  assert.equal(preview.getComponentPreviewFile('Example Theorem'), 'theorem');
  assert.equal(preview.getComponentPreviewFile('Theorem Compact'), 'theorem');
  assert.equal(preview.getComponentPreviewFile('Citation Note'), 'cite');
  assert.equal(preview.getComponentPreviewFile('Theme Preview'), 'theme-preview');

  const configuration = preview.__test.renderConfiguration({
    config: [{
      name: 'ratio',
      type: 'string',
      required: false,
      default: '1:1',
      options: ['1:1', '2:3'],
      description: 'Controls the column width ratio.'
    }],
    slots: [{ name: 'right', description: 'Right-hand column content.' }]
  }, 'layout');
  assert.match(configuration, /Frontmatter settings/);
  assert.match(configuration, /Standard Slidev keys/);
  assert.match(configuration, /<code>transition<\/code>/);
  assert.match(configuration, /ratio/);
  assert.match(configuration, /optional/);
  assert.match(configuration, /default: 1:1/);
  assert.match(configuration, /values: 1:1 \| 2:3/);
  assert.match(configuration, /Right-hand column content/);

  const noConfiguration = preview.__test.renderConfiguration({
    config: [],
    slots: []
  }, 'component');
  assert.match(noConfiguration, /no configurable props/i);
  assert.match(noConfiguration, /No content slots/);
});

test('preserves theme descriptions in the Themes tree', async () => {
  const { providers } = loadCatalogModules();
  const extensionUri = {
    fsPath: path.resolve(new URL('..', import.meta.url).pathname)
  };
  const provider = new providers.ThemesProvider(extensionUri);
  const groups = await provider.getChildren();

  const colorThemes = await provider.getChildren(groups[1]);
  const fontThemes = await provider.getChildren(groups[2]);

  assert.equal(colorThemes[0].label, 'Classic Blue');
  assert.equal(colorThemes[0].value, 'classic-blue');
  assert.equal(colorThemes[0].description, 'Default scholarly palette');
  assert.equal(fontThemes[0].label, 'Classic');
  assert.equal(fontThemes[0].description, 'Traditional academic feel');

  assert.equal(groups[3].label, 'Light and Dark Modes');
  const modes = await provider.getChildren(groups[3]);
  assert.deepEqual(
    modes.map(item => item.label),
    ['Content Slides', 'Headers, Footers, and Navigation', 'Section Dividers']
  );
});

test('orders CLI actions by the documentation workflow', async () => {
  const { providers } = loadCatalogModules();
  const provider = new providers.CliProvider();
  const groups = await provider.getChildren();

  assert.deepEqual(
    groups.map(item => item.label),
    ['Start', 'Build', 'Customize', 'Check & Help']
  );

  const buildItems = await provider.getChildren(groups[1]);
  assert.deepEqual(
    buildItems.slice(0, 4).map(item => item.label),
    ['List Layouts', 'List Components', 'Append Snippet...', 'Apply Workflow...']
  );
});

test('shows localized catalog and theme labels in Simplified Chinese', async () => {
  const bundle = require('../l10n/bundle.l10n.zh-cn.json');
  const { providers } = loadCatalogModules('zh-cn', bundle);

  assert.equal(providers.layouts.find(item => item.id === 'cover').label, '标题页');
  assert.equal(
    providers.layouts.find(item => item.id === 'two-cols').details.useFor,
    '比较两组内容，或并排展示相关信息。'
  );
  assert.match(
    providers.components.find(item => item.canonicalName === 'PaperCard').description,
    /论文元数据/
  );

  const themeGroups = await new providers.ThemesProvider({ fsPath: '' }).getChildren();
  assert.deepEqual(themeGroups.map(item => item.label), ['预设', '配色主题', '字体主题', '明暗模式']);
});
