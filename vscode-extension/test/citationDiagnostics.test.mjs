import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const require = createRequire(import.meta.url);
const Module = require('node:module');
const originalLoad = Module._load;
class Position {
  constructor(line, character) { Object.assign(this, { line, character }); }
}
class Range {
  constructor(start, end) { Object.assign(this, { start, end }); }
}
class CodeAction {
  constructor(title, kind) { Object.assign(this, { title, kind }); }
}
class WorkspaceEdit {
  edits = [];
  insert(uri, position, text) { this.edits.push({ uri, position, text }); }
}
let diagnostics;
try {
  Module._load = function (request, parent, isMain) {
    if (request === 'vscode') return {
      Position, Range, CodeAction, WorkspaceEdit,
      CodeActionKind: { QuickFix: 'quickfix' },
      DiagnosticSeverity: { Warning: 1 },
      // Deliberately unrelated copy: behavior must not depend on English labels.
      l10n: { t: () => '本地化操作' }
    };
    return originalLoad.call(this, request, parent, isMain);
  };
  diagnostics = require('../out/citationDiagnostics.js');
} finally {
  Module._load = originalLoad;
}

function documentFor(source, directory) {
  const lines = source.split('\n');
  return {
    languageId: 'markdown',
    uri: { scheme: 'file', fsPath: path.join(directory, 'slides.md') },
    lineCount: lines.length,
    lineAt: index => ({ text: lines[index] }),
    getText: () => source,
    positionAt(index) {
      const preceding = source.slice(0, index).split('\n');
      return new Position(preceding.length - 1, preceding.at(-1).length);
    }
  };
}

test('citation fixes add usable references and setup independently of translated copy', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'scholarly-citations-'));
  const extensionUri = { fsPath: path.resolve(new URL('..', import.meta.url).pathname) };
  const provider = new diagnostics.CitationCodeActionProvider();
  try {
    await writeFile(path.join(directory, 'sources.bib'), '@article{known, title={Known}, year={2026}}');
    for (const ending of ['', '\n']) {
      const source = '---\nbibFile: ./sources.bib\n---\n\nStudy @known.' + ending;
      const document = documentFor(source, directory);
      const issues = await diagnostics.analyzeCitationDiagnostics(document, extensionUri);
      assert.deepEqual(issues.map(issue => issue.code), ['missing-references-slide']);
      const diagnostic = { ...issues[0], source: 'Slidev Scholarly' };
      const [action] = provider.provideCodeActions(document, issues[0].range, { diagnostics: [diagnostic] });
      assert.equal(action.kind, 'quickfix');
      assert.deepEqual(action.diagnostics, [diagnostic]);
      assert.equal(action.edit.edits.length, 1);
      const edit = action.edit.edits[0];
      assert.deepEqual(edit.position, document.positionAt(source.length));
      assert.equal(edit.uri, document.uri);
      assert.match(source + edit.text, /\n\n---\nlayout: references\n---\n$/);
      const repaired = documentFor(source + edit.text, directory);
      assert.deepEqual(await diagnostics.analyzeCitationDiagnostics(repaired, extensionUri), []);
    }

    for (const source of ['Study @known.', '---\ntheme: scholarly\n---\n\nStudy @known.']) {
      const document = documentFor(source, directory);
      const diagnostic = { code: 'missing-setup', source: 'Slidev Scholarly' };
      const [action] = provider.provideCodeActions(document, new Range(), { diagnostics: [diagnostic] });
      const edit = action.edit.edits[0];
      assert.equal(edit.position.line, source.startsWith('---') ? 1 : 0);
      assert.match(edit.text, /bibFile: \.\/references\.bib\n/);
    }
    assert.deepEqual(provider.provideCodeActions(documentFor('', directory), new Range(), {
      diagnostics: [{ code: 'missing-references-slide', source: 'Another extension' }]
    }), []);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
