import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { parser } = await import('@slidev/cli');

test('Builder retains the explicit insertion target across Webview focus', async () => {
  let receive, disposePanel, changeEditor, closeDocument;
  let disposed = 0;
  let editSucceeds = true;
  const warnings = [], errors = [], insertions = [], shown = [];
  const original = '---\ntheme: scholarly\ntitle: Original\nbibFile: ./refs.bib\n---\n\n# First\n\nKeep all content.\n\n---\nlayout: default\n---\n\n# Second\n';
  const editor = (languageId = 'markdown', content = original) => ({
    document: { languageId, isClosed: false, getText: () => content, offsetAt: () => 0, positionAt: offset => ({ offset }) },
    selection: { active: { line: 0, character: 10 } }, viewColumn: 1,
    edit: async callback => {
      if (!editSucceeds) return false;
      callback({ insert: (position, content) => insertions.push({ position, content }) });
      return true;
    }
  });
  const first = editor();
  const panel = {
    reveal() {},
    onDidDispose(callback) { disposePanel = callback; },
    webview: {
      cspSource: 'self', asWebviewUri: uri => uri,
      onDidReceiveMessage(callback) { receive = callback; },
      postMessage() {}
    }
  };
  const vscode = {
    ViewColumn: { One: 1 }, Uri: { joinPath: (...parts) => parts.join('/') },
    env: { language: 'en' }, l10n: { t: (message, ...args) => message.replace('{0}', args[0]) },
    window: {
      activeTextEditor: first,
      createWebviewPanel() { this.activeTextEditor = undefined; return panel; },
      onDidChangeActiveTextEditor(callback) {
        changeEditor = callback; return { dispose() { disposed++; } };
      },
      async showTextDocument(document, options) {
        shown.push({ document, options });
        const visible = { ...first, document, selection: options?.selection || first.selection };
        this.activeTextEditor = visible;
        changeEditor(visible);
        return visible;
      },
      showWarningMessage: message => warnings.push(message),
      showErrorMessage: message => errors.push(message)
    },
    workspace: {
      onDidCloseTextDocument(callback) {
        closeDocument = callback; return { dispose() { disposed++; } };
      },
      openTextDocument: async options => ({ ...editor().document, content: options.content })
    }
  };
  const Module = require('node:module');
  const originalLoad = Module._load;
  Module._load = function (request, parent, isMain) {
    if (request === 'vscode') return vscode;
    if (request === './providers' && parent.filename.endsWith('/guiBuilder.js')) return { layouts: [] };
    return originalLoad.call(this, request, parent, isMain);
  };
  let openGuiBuilder;
  try {
    delete require.cache[require.resolve('../out/guiBuilder.js')];
    ({ openGuiBuilder } = require('../out/guiBuilder.js'));
  } finally {
    Module._load = originalLoad;
  }
  const context = { extensionUri: '/extension', subscriptions: [] };
  const state = { title: 'Native host test', slides: [{ layout: 'default', title: 'Inserted', body: 'Evidence' }] };
  const insert = () => receive({ type: 'insertSelectedSlide', state });
  const focusWebview = () => { vscode.window.activeTextEditor = undefined; changeEditor(undefined); };
  openGuiBuilder(context);
  focusWebview();
  await insert();
  assert.equal(shown[0].document, first.document);
  assert.equal(shown[0].options.selection, first.selection);
  assert.match(insertions[0].content, /# Inserted/);
  assert.equal(insertions[0].position.offset, original.length, 'append even when the cursor is inside headmatter');
  const before = await parser.parse(original);
  const after = await parser.parse(original + insertions[0].content);
  assert.equal(after.slides.length, before.slides.length + 1);
  assert.deepEqual(after.slides.slice(0, -1).map(s => [s.frontmatter, s.content]), before.slides.map(s => [s.frontmatter, s.content]));
  assert.equal(warnings.length, 0);

  changeEditor(editor('plaintext'));
  focusWebview();
  await insert();
  assert.equal(insertions.length, 1, 'a non-Markdown target must not fall back to the first file');
  assert.equal(warnings.length, 1);

  const untitled = editor();
  untitled.document.isUntitled = true;
  changeEditor(untitled);
  focusWebview();
  await insert();
  assert.equal(shown.at(-1).document, untitled.document);
  focusWebview();
  closeDocument(untitled.document);
  await insert();
  assert.equal(insertions.length, 2, 'closing the target clears it');
  assert.equal(warnings.length, 2);

  changeEditor(editor('markdown', ''));
  focusWebview();
  await insert();
  const empty = await parser.parse(insertions.at(-1).content);
  assert.equal(empty.slides.length, 1);
  assert.equal(empty.slides[0].frontmatter.theme, 'scholarly');

  await receive({ type: 'generateNewDocument', state });
  assert.match(shown.at(-1).document.content, /^---\ntheme: scholarly/);
  editSucceeds = false;
  focusWebview();
  await insert();
  assert.match(errors[0], /The slide could not be inserted/);
  disposePanel();
  assert.equal(disposed, 2, 'panel disposal removes target listeners');
  vscode.window.activeTextEditor = undefined;
  openGuiBuilder(context);
  await insert();
  assert.equal(warnings.length, 3, 'an empty editor environment has no stale target');
  assert.equal(errors.length, 1);
  disposePanel();
});
