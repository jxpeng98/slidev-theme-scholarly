import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';

const require = createRequire(import.meta.url);

function loadCommandsWithVscodeMock() {
  const Module = require('node:module');
  const originalLoad = Module._load;

  Module._load = function patchedLoad(request, parent, isMain) {
    if (request === 'vscode') {
      return {
        EndOfLine: { CRLF: 2 },
        CompletionItem: class CompletionItem {},
        CompletionItemKind: { Reference: 18 },
        EventEmitter: class EventEmitter {
          event() {}
          fire() {}
        },
        Hover: class Hover {},
        MarkdownString: class MarkdownString {},
        Position: class Position {},
        Range: class Range {},
        SnippetString: class SnippetString {},
        TerminalLocation: { Editor: 2 },
        ThemeIcon: class ThemeIcon {},
        TreeItem: class TreeItem {},
        TreeItemCollapsibleState: { None: 0, Expanded: 2 },
        window: {
          activeTextEditor: undefined,
          createTerminal: () => ({
            sendText() {},
            show() {}
          }),
          showErrorMessage() {},
          showInformationMessage() {},
          showInputBox() {},
          showQuickPick() {},
          showWarningMessage() {}
        },
        workspace: {
          workspaceFolders: [],
          getConfiguration: () => ({
            get: () => undefined
          })
        }
      };
    }

    return originalLoad.call(this, request, parent, isMain);
  };

  try {
    const resolved = require.resolve('../out/commands.js');
    delete require.cache[resolved];
    return require(resolved);
  } finally {
    Module._load = originalLoad;
  }
}

test('exports explicit content and surface mode lists from shared theme data', () => {
  const sharedData = require('../out/sharedData.js');

  assert.deepEqual(
    sharedData.CONTENT_MODES.map(item => item.value),
    ['light', 'dark']
  );
  assert.deepEqual(
    sharedData.SURFACE_MODES.map(item => item.value),
    ['dark', 'light', 'match', 'inverse']
  );
  assert.deepEqual(
    sharedData.COLOR_MODES.map(item => item.value),
    ['dark', 'light'],
    'legacy color modes remain available for compatibility'
  );
});

test('upserts new theme mode keys while preserving legacy colorMode tolerance', () => {
  const commands = loadCommandsWithVscodeMock();
  const updateYaml = commands.__test.upsertThemeConfigYaml;

  const yaml = [
    'theme: scholarly',
    'themeConfig:',
    '  colorTheme: classic-blue',
    '  colorMode: dark'
  ].join('\n');

  assert.equal(
    updateYaml(yaml, {
      contentMode: 'light',
      chromeMode: 'inverse',
      sectionMode: 'match'
    }),
    [
      'theme: scholarly',
      'themeConfig:',
      '  colorTheme: classic-blue',
      '  colorMode: dark',
      '  contentMode: light',
      '  chromeMode: inverse',
      '  sectionMode: match'
    ].join('\n')
  );

  assert.equal(
    updateYaml('theme: scholarly', { colorMode: 'dark' }),
    [
      'theme: scholarly',
      'themeConfig:',
      '  contentMode: dark'
    ].join('\n'),
    'legacy colorMode updates write contentMode'
  );
});

test('normalizes indentation while preserving themeConfig values', () => {
  const commands = loadCommandsWithVscodeMock();
  const updateYaml = commands.__test.upsertThemeConfigYaml;

  assert.equal(
    updateYaml([
      'theme: scholarly',
      'themeConfig:',
      '    colorTheme: classic-blue'
    ].join('\n'), { colorTheme: 'yale-blue', fontTheme: 'modern' }),
    [
      'theme: scholarly',
      'themeConfig:',
      '  colorTheme: yale-blue',
      '  fontTheme: modern'
    ].join('\n')
  );
});

test('builds theme apply CLI args with explicit mode flags', () => {
  const commands = loadCommandsWithVscodeMock();

  assert.deepEqual(
    commands.__test.buildThemeApplyArgs({
      colorTheme: 'classic-blue',
      fontTheme: 'modern',
      contentMode: 'dark',
      chromeMode: 'inverse',
      sectionMode: 'match',
      file: 'slides.md'
    }),
    [
      'theme',
      'apply',
      'classic-blue',
      '--file',
      'slides.md',
      '--font',
      'modern',
      '--content-mode',
      'dark',
      '--chrome-mode',
      'inverse',
      '--section-mode',
      'match'
    ]
  );
});

test('built-in templates let content mode follow Slidev by default', () => {
  const commands = loadCommandsWithVscodeMock();

  for (const markdown of [
    commands.__test.getAcademicTemplate(),
    commands.__test.getSimpleTemplate()
  ]) {
    assert.doesNotMatch(markdown, /themeConfig:\n(?:  .+\n)*  contentMode: (?:light|dark)\n/);
    assert.match(markdown, /themeConfig:\n(?:  .+\n)*  chromeMode: dark\n/);
    assert.match(markdown, /themeConfig:\n(?:  .+\n)*  sectionMode: dark\n/);
  }
});

test('extension manifest exposes new mode commands and hides legacy color mode command', async () => {
  const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  const commandIds = manifest.contributes.commands.map(item => item.command);
  const titleMenuCommands = manifest.contributes.menus['view/title'].map(item => item.command);

  for (const command of [
    'slidev-scholarly.setContentMode',
    'slidev-scholarly.setChromeMode',
    'slidev-scholarly.setSectionMode'
  ]) {
    assert.ok(manifest.activationEvents.includes(`onCommand:${command}`));
    assert.ok(commandIds.includes(command));
    assert.ok(titleMenuCommands.includes(command));
  }

  assert.ok(manifest.activationEvents.includes('onCommand:slidev-scholarly.setColorMode'));
  assert.ok(!titleMenuCommands.includes('slidev-scholarly.setColorMode'));
});

test('theme updates preserve commented and inline YAML mappings and reject invalid inputs', () => {
  const yaml = require('../out/vendor/js-yaml');
  const update = loadCommandsWithVscodeMock().__test.upsertThemeConfigYaml;
  for (const source of [
    'themeConfig: # palette\n  fontTheme: traditional\n  outlineToc: false\n  custom: {nested: [1, 2]}',
    'themeConfig: {fontTheme: traditional, outlineToc: false, custom: {nested: [1, 2]}}'
  ]) {
    const updated = update(source + '\nother: {keep: true}', {colorTheme:'yale-blue'});
    if (source.includes('# palette')) assert.match(updated, /# palette/);
    const parsed = yaml.load(updated);
    assert.deepEqual(parsed.themeConfig, {fontTheme:'traditional', outlineToc:false, custom:{nested:[1,2]}, colorTheme:'yale-blue'});
    assert.deepEqual(parsed.other, {keep:true});
  }
  for (const source of ['themeConfig: {}\nthemeConfig: {}', 'themeConfig: []', 'themeConfig: broken', 'themeConfig: ['])
    assert.throws(() => update(source, {colorTheme:'yale-blue'}));
});


test('theme editing retains comments and quotes without changing aliased defaults', () => {
  const yaml = require('../out/vendor/js-yaml');
  const update = loadCommandsWithVscodeMock().__test.upsertThemeConfigYaml;
  const source = '# Author notes\ndefaults: &palette {colorTheme: classic-blue} # reusable\ntitle: "Quoted title" # keep title\nthemeConfig: *palette';
  const updated = update(source, {colorTheme: 'yale-blue'});
  for (const text of ['# Author notes', '# reusable', '"Quoted title" # keep title']) assert.ok(updated.includes(text), text);
  const data = yaml.load(updated);
  assert.equal(data.defaults.colorTheme, 'classic-blue');
  assert.equal(data.themeConfig.colorTheme, 'yale-blue');
});


test('theme editing creates mappings for empty and comment-only frontmatter', () => {
  const update = loadCommandsWithVscodeMock().__test.upsertThemeConfigYaml;
  for (const source of ['', '# Keep comment']) {
    const updated = update(source, {colorTheme: 'yale-blue'});
    assert.match(updated, /colorTheme: yale-blue/);
    if (source) assert.ok(updated.includes(source));
  }
});
