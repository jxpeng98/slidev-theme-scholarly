import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { pathToFileURL } from 'url';

type SharedCitationReference = {
  key: string
  marker: string
  index: number
}

type SharedBibEntry = {
  key: string
  type: string
}

type SharedCitationModule = {
  collectCitationReferences: (content: string) => SharedCitationReference[]
  extractBibFile: (content: string) => string
  hasReferencesSlide: (content: string) => boolean
  parseBibEntries: (content: string) => SharedBibEntry[]
  findDuplicateBibKeys: (entries: SharedBibEntry[]) => string[]
}

type CitationDiagnosticCode =
  | 'missing-setup'
  | 'missing-bib'
  | 'duplicate-key'
  | 'unresolved-key'
  | 'missing-references-slide'

type CitationDiagnosticData = {
  key?: string
  bibFile?: string
  bibFilePath?: string
}

type CitationDiagnosticIssue = {
  code: CitationDiagnosticCode
  message: string
  range: vscode.Range
  severity: vscode.DiagnosticSeverity
  data?: CitationDiagnosticData
}

const dynamicImport = new Function('specifier', 'return import(specifier)') as (
  specifier: string
) => Promise<SharedCitationModule>;

let sharedModulePromise: Promise<SharedCitationModule> | undefined;

async function loadSharedCitationModule(extensionUri: vscode.Uri): Promise<SharedCitationModule> {
  if (!sharedModulePromise) {
    const modulePath = path.join(extensionUri.fsPath, 'shared', 'citations.mjs');
    sharedModulePromise = dynamicImport(pathToFileURL(modulePath).href);
  }

  return sharedModulePromise;
}

function isMarkdownFile(document: vscode.TextDocument): boolean {
  return document.languageId === 'markdown' && document.uri.scheme === 'file';
}

function rangeFromReference(document: vscode.TextDocument, ref: SharedCitationReference): vscode.Range {
  return new vscode.Range(
    document.positionAt(ref.index),
    document.positionAt(ref.index + ref.marker.length)
  );
}

function firstDocumentRange(document: vscode.TextDocument): vscode.Range {
  const start = new vscode.Position(0, 0);
  return new vscode.Range(start, start);
}

function findFrontmatterKeyRange(document: vscode.TextDocument, key: string): vscode.Range | undefined {
  const content = document.getText();
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatterMatch || frontmatterMatch.index === undefined)
    return undefined;

  const frontmatter = frontmatterMatch[1] ?? '';
  const frontmatterOffset = frontmatterMatch.index + frontmatterMatch[0].indexOf(frontmatter);
  const keyMatch = new RegExp(`^\\s*${key}:\\s*(.+?)\\s*$`, 'm').exec(frontmatter);
  if (!keyMatch || keyMatch.index === undefined)
    return undefined;

  const start = document.positionAt(frontmatterOffset + keyMatch.index);
  const end = document.positionAt(frontmatterOffset + keyMatch.index + keyMatch[0].length);
  return new vscode.Range(start, end);
}

function uniqueKeys(refs: SharedCitationReference[]): string[] {
  const seen = new Set<string>();
  const keys: string[] = [];

  for (const ref of refs) {
    if (seen.has(ref.key))
      continue;

    seen.add(ref.key);
    keys.push(ref.key);
  }

  return keys;
}

function createIssue(
  code: CitationDiagnosticCode,
  message: string,
  range: vscode.Range,
  data?: CitationDiagnosticData
): CitationDiagnosticIssue {
  return {
    code,
    message,
    range,
    data,
    severity: vscode.DiagnosticSeverity.Warning
  };
}

function createDiagnostic(issue: CitationDiagnosticIssue): vscode.Diagnostic {
  const diagnostic = new vscode.Diagnostic(issue.range, issue.message, issue.severity);
  diagnostic.source = 'Slidev Scholarly';
  diagnostic.code = issue.code;
  (diagnostic as vscode.Diagnostic & { data?: CitationDiagnosticData }).data = issue.data;
  return diagnostic;
}

export async function analyzeCitationDiagnostics(
  document: vscode.TextDocument,
  extensionUri: vscode.Uri
): Promise<CitationDiagnosticIssue[]> {
  if (!isMarkdownFile(document))
    return [];

  const citationModule = await loadSharedCitationModule(extensionUri);
  const content = document.getText();
  const refs = citationModule.collectCitationReferences(content);
  const keys = uniqueKeys(refs);

  if (keys.length === 0)
    return [];

  const issues: CitationDiagnosticIssue[] = [];
  const firstCitationRange = refs[0] ? rangeFromReference(document, refs[0]) : firstDocumentRange(document);
  const docDir = path.dirname(document.uri.fsPath);
  const configuredBibFile = citationModule.extractBibFile(content);
  const defaultBibFile = 'references.bib';
  const defaultBibPath = path.join(docDir, defaultBibFile);
  const defaultBibExists = fs.existsSync(defaultBibPath);
  const bibFile = configuredBibFile || (defaultBibExists ? defaultBibFile : '');
  const bibFilePath = bibFile ? path.resolve(docDir, bibFile) : '';

  if (!configuredBibFile && !defaultBibExists) {
    issues.push(createIssue(
      'missing-setup',
      'Citations found, but no bibFile frontmatter or references.bib file was found.',
      firstCitationRange,
      { bibFile: './references.bib', bibFilePath: defaultBibPath }
    ));
  }

  if (!citationModule.hasReferencesSlide(content)) {
    issues.push(createIssue(
      'missing-references-slide',
      'Citations found, but no references slide exists. Add a slide with layout: references.',
      firstCitationRange
    ));
  }

  if (!bibFile)
    return issues;

  const bibRange = findFrontmatterKeyRange(document, 'bibFile') ?? firstCitationRange;

  if (!fs.existsSync(bibFilePath)) {
    issues.push(createIssue(
      'missing-bib',
      `Missing bibliography file: ${bibFile}`,
      bibRange,
      { bibFile, bibFilePath }
    ));
    return issues;
  }

  const entries = citationModule.parseBibEntries(fs.readFileSync(bibFilePath, 'utf8'));
  const duplicateKeys = citationModule.findDuplicateBibKeys(entries);
  for (const duplicateKey of duplicateKeys) {
    issues.push(createIssue(
      'duplicate-key',
      `Duplicate BibTeX key: ${duplicateKey}`,
      bibRange,
      { key: duplicateKey, bibFile, bibFilePath }
    ));
  }

  const entryKeys = new Set(entries.map(entry => entry.key));
  for (const ref of refs) {
    if (entryKeys.has(ref.key))
      continue;

    issues.push(createIssue(
      'unresolved-key',
      `Unresolved citation key: ${ref.key}`,
      rangeFromReference(document, ref),
      { key: ref.key, bibFile, bibFilePath }
    ));
  }

  return issues;
}

export class CitationDiagnosticsController implements vscode.Disposable {
  private readonly collection = vscode.languages.createDiagnosticCollection('slidev-scholarly-citations');
  private readonly disposables: vscode.Disposable[] = [this.collection];
  private readonly pendingUpdates = new Map<string, NodeJS.Timeout>();

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly output?: vscode.OutputChannel
  ) {
    const bibWatcher = vscode.workspace.createFileSystemWatcher('**/*.bib');
    this.disposables.push(
      bibWatcher,
      vscode.workspace.onDidOpenTextDocument(document => this.scheduleUpdate(document)),
      vscode.workspace.onDidChangeTextDocument(event => this.scheduleUpdate(event.document)),
      vscode.workspace.onDidSaveTextDocument(document => this.scheduleUpdate(document)),
      vscode.workspace.onDidCloseTextDocument(document => this.collection.delete(document.uri)),
      vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor)
          this.scheduleUpdate(editor.document);
      }),
      bibWatcher.onDidCreate(() => this.refreshOpenMarkdownDocuments()),
      bibWatcher.onDidChange(() => this.refreshOpenMarkdownDocuments()),
      bibWatcher.onDidDelete(() => this.refreshOpenMarkdownDocuments())
    );

    this.refreshOpenMarkdownDocuments();
  }

  scheduleUpdate(document: vscode.TextDocument): void {
    if (!isMarkdownFile(document))
      return;

    const key = document.uri.toString();
    const previous = this.pendingUpdates.get(key);
    if (previous)
      clearTimeout(previous);

    this.pendingUpdates.set(key, setTimeout(() => {
      this.pendingUpdates.delete(key);
      void this.update(document);
    }, 120));
  }

  async update(document: vscode.TextDocument): Promise<void> {
    if (!isMarkdownFile(document)) {
      this.collection.delete(document.uri);
      return;
    }

    try {
      const issues = await analyzeCitationDiagnostics(document, this.extensionUri);
      this.collection.set(document.uri, issues.map(createDiagnostic));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.output?.appendLine(`Citation diagnostics failed for ${document.uri.fsPath}: ${message}`);
    }
  }

  refreshOpenMarkdownDocuments(): void {
    for (const document of vscode.workspace.textDocuments)
      this.scheduleUpdate(document);
  }

  dispose(): void {
    for (const timer of this.pendingUpdates.values())
      clearTimeout(timer);

    this.pendingUpdates.clear();

    for (const disposable of this.disposables)
      disposable.dispose();
  }
}

function getDiagnosticCode(diagnostic: vscode.Diagnostic): string {
  if (typeof diagnostic.code === 'string')
    return diagnostic.code;

  if (diagnostic.code && typeof diagnostic.code === 'object' && 'value' in diagnostic.code)
    return String(diagnostic.code.value);

  return '';
}

function getDiagnosticData(diagnostic: vscode.Diagnostic): CitationDiagnosticData | undefined {
  return (diagnostic as vscode.Diagnostic & { data?: CitationDiagnosticData }).data;
}

function createAddBibFileAction(
  document: vscode.TextDocument,
  diagnostic: vscode.Diagnostic
): vscode.CodeAction {
  const action = new vscode.CodeAction('Add bibFile: ./references.bib', vscode.CodeActionKind.QuickFix);
  const edit = new vscode.WorkspaceEdit();
  const text = document.getText();

  if (document.lineCount > 0 && document.lineAt(0).text.trim() === '---') {
    edit.insert(document.uri, new vscode.Position(1, 0), 'bibFile: ./references.bib\n');
  } else {
    edit.insert(document.uri, new vscode.Position(0, 0), '---\nbibFile: ./references.bib\n---\n\n');
  }

  action.edit = edit;
  action.diagnostics = [diagnostic];
  action.isPreferred = !text.includes('bibFile:');
  return action;
}

function createReferencesSlideAction(
  document: vscode.TextDocument,
  diagnostic: vscode.Diagnostic
): vscode.CodeAction {
  const action = new vscode.CodeAction('Add references slide', vscode.CodeActionKind.QuickFix);
  const edit = new vscode.WorkspaceEdit();
  const text = document.getText();
  const prefix = text.endsWith('\n') ? '\n' : '\n\n';

  edit.insert(
    document.uri,
    document.positionAt(text.length),
    `${prefix}---\nlayout: references\n---\n`
  );

  action.edit = edit;
  action.diagnostics = [diagnostic];
  return action;
}

function createBibliographyFileAction(
  document: vscode.TextDocument,
  diagnostic: vscode.Diagnostic
): vscode.CodeAction | undefined {
  const data = getDiagnosticData(diagnostic);
  const bibFilePath = data?.bibFilePath ?? path.join(path.dirname(document.uri.fsPath), 'references.bib');
  const bibFile = data?.bibFile ?? './references.bib';
  if (!bibFilePath)
    return undefined;

  const action = new vscode.CodeAction(`Create bibliography file: ${bibFile}`, vscode.CodeActionKind.QuickFix);
  const uri = vscode.Uri.file(bibFilePath);
  const edit = new vscode.WorkspaceEdit();

  edit.createFile(uri, { ignoreIfExists: true });
  edit.insert(uri, new vscode.Position(0, 0), '% Add BibTeX entries here.\n');

  action.edit = edit;
  action.diagnostics = [diagnostic];
  return action;
}

function createBibStubAction(
  diagnostic: vscode.Diagnostic
): vscode.CodeAction | undefined {
  const data = getDiagnosticData(diagnostic);
  if (!data?.key || !data.bibFilePath)
    return undefined;

  const action = new vscode.CodeAction(`Append BibTeX stub for ${data.key}`, vscode.CodeActionKind.QuickFix);
  const uri = vscode.Uri.file(data.bibFilePath);
  const edit = new vscode.WorkspaceEdit();
  const current = fs.existsSync(data.bibFilePath) ? fs.readFileSync(data.bibFilePath, 'utf8') : '';
  const lines = current.split(/\r\n|\r|\n/);
  const lastLine = lines[lines.length - 1] ?? '';
  const prefix = current.endsWith('\n') || current.length === 0 ? '' : '\n';

  edit.insert(
    uri,
    new vscode.Position(Math.max(0, lines.length - 1), lastLine.length),
    `${prefix}@article{${data.key},\n  title = {},\n  author = {},\n  year = {}\n}\n`
  );

  action.edit = edit;
  action.diagnostics = [diagnostic];
  return action;
}

export class CitationCodeActionProvider implements vscode.CodeActionProvider {
  provideCodeActions(
    document: vscode.TextDocument,
    _range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext
  ): vscode.CodeAction[] {
    const actions: vscode.CodeAction[] = [];

    for (const diagnostic of context.diagnostics) {
      if (diagnostic.source !== 'Slidev Scholarly')
        continue;

      const code = getDiagnosticCode(diagnostic);
      if (code === 'missing-setup')
        actions.push(createAddBibFileAction(document, diagnostic));
      if (code === 'missing-references-slide')
        actions.push(createReferencesSlideAction(document, diagnostic));
      if (code === 'missing-bib') {
        const action = createBibliographyFileAction(document, diagnostic);
        if (action)
          actions.push(action);
      }
      if (code === 'unresolved-key') {
        const action = createBibStubAction(diagnostic);
        if (action)
          actions.push(action);
      }
    }

    return actions;
  }
}

export function registerCitationDiagnostics(
  context: vscode.ExtensionContext,
  extensionUri: vscode.Uri,
  output?: vscode.OutputChannel
): CitationDiagnosticsController {
  const controller = new CitationDiagnosticsController(extensionUri, output);
  context.subscriptions.push(
    controller,
    vscode.languages.registerCodeActionsProvider(
      { language: 'markdown', scheme: 'file' },
      new CitationCodeActionProvider(),
      { providedCodeActionKinds: [vscode.CodeActionKind.QuickFix] }
    )
  );
  return controller;
}
