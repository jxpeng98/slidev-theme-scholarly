import * as vscode from 'vscode';
import {
  COLOR_THEMES,
  FONT_THEMES,
  COLOR_MODES,
  CONTENT_MODES,
  SURFACE_MODES,
  THEME_PRESETS,
  THEME_PRESET_IDS,
  TEMPLATES,
  TEMPLATE_IDS
} from './sharedData';
import {
  extractPaperMetadata,
  loadBibEntries,
  parseAnchorTargets,
  renderPaperMarkdown,
  type AnchorTarget,
  type BibEntry
} from './bibtex';

type ThemeConfigUpdate = {
  colorTheme?: string
  fontTheme?: string
  contentMode?: ContentMode
  chromeMode?: SurfaceMode
  sectionMode?: SurfaceMode
  colorMode?: ContentMode
}

type ContentMode = 'light' | 'dark'
type SurfaceMode = ContentMode | 'match' | 'inverse'

export type CliActionId =
  | 'initPresentation'
  | 'templateList'
  | 'themeApply'
  | 'themeList'
  | 'themePresetApply'
  | 'themePresetList'
  | 'layoutList'
  | 'componentList'
  | 'snippetAppend'
  | 'snippetShow'
  | 'snippetList'
  | 'workflowApply'
  | 'workflowList'
  | 'doctor'
  | 'help'

type ThemePreset = {
  id: string
  label: string
  description: string
  colorTheme: string
  fontTheme: string
}

const CLI_COMMAND_PREFIX = ['npx', '-y', '--package', 'slidev-theme-scholarly', 'sch'];
const CLI_SNIPPETS = ['theorem', 'block', 'cite', 'cover', 'section', 'methodology', 'results', 'references'] as const;
const CLI_WORKFLOWS = ['paper', 'seminar', 'quick'] as const;
let scholarlyCliTerminal: vscode.Terminal | undefined;

type ThemeApplyOptions = {
  colorTheme: string
  fontTheme?: string
  contentMode?: ContentMode
  chromeMode?: SurfaceMode
  sectionMode?: SurfaceMode
  file: string
}

export function insertSnippet(snippet: string) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage('No active editor found');
    return;
  }

  editor.insertSnippet(new vscode.SnippetString(snippet));
}

function getActiveMarkdownEditor(): vscode.TextEditor | undefined {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage('No active editor found');
    return undefined;
  }

  if (editor.document.languageId !== 'markdown') {
    vscode.window.showWarningMessage('Open a Markdown file to use Slidev Scholarly anchor tools');
    return undefined;
  }

  return editor;
}

function normalizeAnchorId(value: string): string {
  return value.trim().replace(/^#+/, '');
}

function validateAnchorId(value: string): string | null {
  const normalized = normalizeAnchorId(value);
  if (!normalized)
    return 'Anchor id cannot be empty';

  if (!/^[A-Za-z0-9][\w:.-]*$/.test(normalized))
    return 'Use letters, numbers, hyphens, underscores, colons, or periods';

  return null;
}

function getAnchorSyntaxLabel(syntax: AnchorTarget['syntax']): string {
  switch (syntax) {
    case 'heading':
      return 'Heading anchor';
    case 'anchor':
      return 'Standalone anchor';
    case 'named-anchor':
      return 'Named anchor';
    default:
      return 'HTML id';
  }
}

export async function insertInternalAnchor(): Promise<void> {
  if (!getActiveMarkdownEditor())
    return;

  const rawAnchorId = await vscode.window.showInputBox({
    prompt: 'Enter internal anchor id',
    placeHolder: 'appendix-proof',
    value: 'anchor-id',
    validateInput: validateAnchorId
  });

  if (!rawAnchorId)
    return;

  const anchorId = normalizeAnchorId(rawAnchorId);
  const selected = await vscode.window.showQuickPick(
    [
      {
        label: 'Standalone anchor',
        description: '::anchor{#id}',
        detail: 'Insert a dedicated anchor marker on its own line',
        snippet: `::anchor{#${anchorId}}$0`
      },
      {
        label: 'Heading suffix',
        description: '{#id}',
        detail: 'Append an id suffix to the current heading text',
        snippet: ` {#${anchorId}}$0`
      },
      {
        label: 'HTML id attribute',
        description: 'id="id"',
        detail: 'Insert an HTML/Vue id attribute at the cursor',
        snippet: `id="${anchorId}"$0`
      }
    ],
    {
      placeHolder: 'Select how to insert the internal anchor',
      matchOnDescription: true,
      matchOnDetail: true
    }
  );

  if (!selected)
    return;

  insertSnippet(selected.snippet);
}

export async function insertAnchorReference(): Promise<void> {
  const editor = getActiveMarkdownEditor();
  if (!editor)
    return;

  const anchors = parseAnchorTargets(editor.document);
  if (anchors.length === 0) {
    vscode.window.showInformationMessage('No internal anchors found in the current document');
    return;
  }

  const selected = await vscode.window.showQuickPick(
    anchors.map(anchor => ({
      label: `#${anchor.id}`,
      description: `${getAnchorSyntaxLabel(anchor.syntax)} · line ${anchor.line + 1}`,
      detail: anchor.label,
      anchor
    })),
    {
      placeHolder: 'Select an internal anchor to insert as a reference',
      matchOnDescription: true,
      matchOnDetail: true
    }
  );

  if (!selected)
    return;

  insertSnippet(`#${selected.anchor.id}`);
}

export async function insertPaperSummary(item?: { entry?: BibEntry } | BibEntry): Promise<void> {
  const editor = getActiveMarkdownEditor();
  if (!editor)
    return;

  const entries = await loadBibEntries(editor.document);
  const providedEntry = item && 'key' in item ? item : item?.entry;
  let entry = providedEntry && entries.find(candidate => candidate.key === providedEntry.key);

  if (!entry) {
    if (entries.length === 0) {
      vscode.window.showInformationMessage('No BibTeX entries found for the active Markdown file');
      return;
    }

    const selected = await vscode.window.showQuickPick(
      entries.map(candidate => ({
        label: candidate.key,
        description: candidate.year || '',
        detail: candidate.title || candidate.author || candidate.key,
        entry: candidate
      })),
      {
        placeHolder: 'Select a BibTeX entry to insert',
        matchOnDescription: true,
        matchOnDetail: true
      }
    );

    if (!selected)
      return;
    entry = selected.entry;
  }

  const selectedLayout = await vscode.window.showQuickPick(
    [
      {
        label: 'paper-summary',
        description: 'Slide frontmatter layout',
        value: 'paper-summary' as const
      },
      {
        label: 'paper-card',
        description: 'PaperCard component',
        value: 'paper-card' as const
      }
    ],
    {
      placeHolder: 'Select Markdown output'
    }
  );

  if (!selectedLayout)
    return;

  const metadata = extractPaperMetadata(entry);
  insertSnippet(renderPaperMarkdown(metadata, selectedLayout.value));
}

export async function createNewPresentation(template?: string) {
  if (template && TEMPLATE_IDS.includes(template)) {
    await createPresentationFromCliTemplate(template);
    return;
  }

  const workspaceFolders = vscode.workspace.workspaceFolders;

  const fileName = await vscode.window.showInputBox({
    prompt: 'Enter presentation file name',
    value: 'slides.md',
    validateInput: (value) => {
      if (!value.endsWith('.md')) {
        return 'File must have .md extension';
      }
      return null;
    }
  });

  if (!fileName) {
    return;
  }

  const content = template === 'simple' ? getSimpleTemplate() : getAcademicTemplate();

  try {
    if (workspaceFolders && workspaceFolders.length > 0) {
      const uri = vscode.Uri.joinPath(workspaceFolders[0].uri, fileName);
      const encoder = new TextEncoder();
      await vscode.workspace.fs.writeFile(uri, encoder.encode(content));
      const doc = await vscode.workspace.openTextDocument(uri);
      await vscode.window.showTextDocument(doc);
    } else {
      // No workspace, create untitled document
      const doc = await vscode.workspace.openTextDocument({
        language: 'markdown',
        content: content
      });
      await vscode.window.showTextDocument(doc);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`Failed to create presentation: ${message}`);
  }
}

async function createPresentationFromCliTemplate(template: string): Promise<void> {
  const meta = TEMPLATES.find(item => item.id === template);
  const targetDir = await vscode.window.showInputBox({
    prompt: `Target directory for ${meta?.label ?? template}`,
    value: template === 'basic' ? 'my-talk' : template,
    validateInput: (value) => {
      const trimmed = value.trim();
      if (!trimmed) return 'Directory cannot be empty';
      return null;
    }
  });

  if (!targetDir) return;
  await runCliArgs(['init', targetDir, '--template', template], `init ${targetDir}`);
}

function getAcademicTemplate(): string {
  return `---
theme: scholarly
footerMiddle: Conference Name 2025
lang: en
themeConfig:
  colorTheme: classic-blue
  fontTheme: classic
  contentMode: light
  chromeMode: dark
  sectionMode: dark
  outlineToc: true
  outlineTocOpen: false
bibFile: ./references.bib
bibStyle: apa
authors:
  - name: First Author
    institution: Department of Computer Science
    email: first@university.edu
  - name: Second Author
    institution: School of Engineering
    email: second@institute.edu
---

# Presentation Title

Subtitle or Research Topic

<!--
SLIDE: Cover
LAYOUT: cover (default for first slide)
-->

---
layout: toc
title: Outline
---

<!--
SLIDE: Outline
LAYOUT: toc
-->

---
layout: section
---

<!--
SLIDE: Section Divider
LAYOUT: section
-->

# Introduction

Background and Motivation

---
layout: default
title: Background
---

<!--
SLIDE: Background
LAYOUT: default
-->

## Background

Your background content here.

- Point 1
- Point 2
- Point 3

---
layout: section
---

# Methods

Our Approach

---
layout: default
title: Methodology
---

## Methodology

<Block type="info" title="Our Approach">

Describe your methodology here.

</Block>

---
layout: section
---

# Results

Key Findings

---
layout: fact
color: green
---

<!--
SLIDE: Key Result
LAYOUT: fact
-->

# 95%

Main Result Metric

---
layout: section
---

# Discussion

Conclusions and Future Work

---
layout: default
title: Conclusions
---

## Conclusions

- Key takeaway 1
- Key takeaway 2
- Key takeaway 3

---
layout: references
---

---
layout: end
email: your@email.com
website: https://example.com
subtitle: Questions?
---

<!--
SLIDE: End
LAYOUT: end
-->

Thank you for your attention!
`;
}

function getSimpleTemplate(): string {
  return `---
theme: scholarly
footerMiddle: Presentation Title
lang: en
themeConfig:
  colorTheme: classic-blue
  fontTheme: classic
  contentMode: light
  chromeMode: dark
  sectionMode: dark
  outlineToc: true
  outlineTocOpen: false
authors:
  - name: Your Name
    institution: Your Institution
    email: your@email.com
---

# Presentation Title

Your subtitle here

---
layout: toc
title: Outline
---

---
layout: section
---

# First Section

Section description

---
layout: default
---

## Slide Title

Your content here.

- Point 1
- Point 2
- Point 3

---
layout: center
---

## Thank You

Questions?
`;
}

function isWindows(): boolean {
  return process.platform === 'win32';
}

function shellQuote(value: string): string {
  if (isWindows()) {
    // Windows: use double quotes, escape internal double quotes
    return `"${value.replace(/"/g, '\\"')}"`;
  }
  // POSIX: use single quotes, escape internal single quotes
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

function getPreferredWorkspaceCwd(): string | undefined {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const folder = vscode.workspace.getWorkspaceFolder(editor.document.uri);
    if (folder) return folder.uri.fsPath;
  }

  const folders = vscode.workspace.workspaceFolders;
  if (folders && folders.length > 0) {
    return folders[0].uri.fsPath;
  }

  return undefined;
}

function getCliTerminal(): vscode.Terminal {
  const existing = scholarlyCliTerminal && vscode.window.terminals.includes(scholarlyCliTerminal)
    ? scholarlyCliTerminal
    : undefined;

  if (existing) return existing;

  scholarlyCliTerminal = vscode.window.createTerminal('Scholarly CLI');
  return scholarlyCliTerminal;
}

function buildCliCommand(args: string[]): string {
  return [...CLI_COMMAND_PREFIX, ...args].map(shellQuote).join(' ');
}

async function runCliArgs(args: string[], message?: string): Promise<void> {
  const cmd = buildCliCommand(args);
  const cwd = getPreferredWorkspaceCwd();
  let finalCommand: string;
  if (cwd) {
    const cdCmd = isWindows() ? `cd /d ${shellQuote(cwd)} &&` : `cd ${shellQuote(cwd)} &&`;
    finalCommand = `${cdCmd} ${cmd}`;
  } else {
    finalCommand = cmd;
  }
  const terminal = getCliTerminal();
  terminal.show(true);
  terminal.sendText(finalCommand, true);

  if (message) {
    await vscode.window.showInformationMessage(`Slidev Scholarly CLI: ${message}`);
  }
}

async function pickOptionalQuickValue<T extends string>(
  placeHolder: string,
  items: Array<{ label: string; description?: string; detail?: string; value: T }>
): Promise<T | undefined> {
  const selected = await vscode.window.showQuickPick(
    [
      { label: 'Skip', description: 'Do not set', value: '' },
      ...items
    ],
    {
      placeHolder,
      matchOnDescription: true
    }
  );

  if (!selected || !selected.value) return undefined;
  return selected.value as T;
}

async function runInitPresentationAction(): Promise<void> {
  const targetDir = await vscode.window.showInputBox({
    prompt: 'Target directory for new presentation',
    value: 'my-talk',
    validateInput: (value) => {
      const trimmed = value.trim();
      if (!trimmed) return 'Directory cannot be empty';
      return null;
    }
  });

  if (!targetDir) return;

  const template = await vscode.window.showQuickPick(
    TEMPLATES.map(t => ({
      label: t.label,
      description: t.id,
      detail: t.description,
      value: t.id
    })),
    {
      placeHolder: 'Select a template'
    }
  );

  if (!template) return;
  await runCliArgs(['init', targetDir, '--template', template.value], `init ${targetDir}`);
}

async function runThemeApplyAction(): Promise<void> {
  const colorTheme = await pickColorTheme();
  if (!colorTheme) return;

  const fontTheme = await pickOptionalQuickValue(
    'Optional: choose a font theme',
    FONT_THEMES.map(t => ({
      label: t.label,
      description: t.value,
      value: t.value
    }))
  );

  const contentMode = await pickOptionalQuickValue<ContentMode>(
    'Optional: choose content mode',
    CONTENT_MODES.map(t => ({
      label: t.label,
      description: t.value,
      value: t.value
    }))
  );

  const chromeMode = await pickOptionalQuickValue<SurfaceMode>(
    'Optional: choose chrome mode',
    SURFACE_MODES.map(t => ({
      label: t.label,
      description: t.value,
      detail: t.description,
      value: t.value
    }))
  );

  const sectionMode = await pickOptionalQuickValue<SurfaceMode>(
    'Optional: choose section mode',
    SURFACE_MODES.map(t => ({
      label: `${t.label} sections`,
      description: t.value,
      detail: t.description,
      value: t.value
    }))
  );

  const file = await vscode.window.showInputBox({
    prompt: 'Target slide file',
    value: 'slides.md'
  });
  if (!file) return;

  const args = buildThemeApplyArgs({
    colorTheme,
    fontTheme,
    contentMode,
    chromeMode,
    sectionMode,
    file
  });

  await runCliArgs(args, `theme apply ${colorTheme}`);
}

function buildThemeApplyArgs(options: ThemeApplyOptions): string[] {
  const args = ['theme', 'apply', options.colorTheme, '--file', options.file];
  if (options.fontTheme) args.push('--font', options.fontTheme);
  if (options.contentMode) args.push('--content-mode', options.contentMode);
  if (options.chromeMode) args.push('--chrome-mode', options.chromeMode);
  if (options.sectionMode) args.push('--section-mode', options.sectionMode);
  return args;
}

async function runThemePresetApplyAction(): Promise<void> {
  const preset = await vscode.window.showQuickPick(
    THEME_PRESET_IDS.map(name => ({
      label: name,
      description: `theme preset: ${name}`,
      value: name
    })),
    {
      placeHolder: 'Select a theme preset'
    }
  );

  if (!preset) return;

  const file = await vscode.window.showInputBox({
    prompt: 'Target slide file',
    value: 'slides.md'
  });

  if (!file) return;
  await runCliArgs(['theme', 'preset', 'apply', preset.value, '--file', file], `theme preset apply ${preset.value}`);
}

async function runSnippetAppendAction(): Promise<void> {
  const snippet = await vscode.window.showQuickPick(
    CLI_SNIPPETS.map(name => ({
      label: name,
      description: `append snippet: ${name}`,
      value: name
    })),
    {
      placeHolder: 'Select snippet to append'
    }
  );

  if (!snippet) return;

  const file = await vscode.window.showInputBox({
    prompt: 'Target slide file',
    value: 'slides.md'
  });

  if (!file) return;
  await runCliArgs(['snippet', 'append', snippet.value, '--file', file], `snippet append ${snippet.value}`);
}

async function runSnippetShowAction(): Promise<void> {
  const snippet = await vscode.window.showQuickPick(
    CLI_SNIPPETS.map(name => ({
      label: name,
      description: `show snippet: ${name}`,
      value: name
    })),
    {
      placeHolder: 'Select snippet to show'
    }
  );

  if (!snippet) return;
  await runCliArgs(['snippet', 'show', snippet.value], `snippet show ${snippet.value}`);
}

async function runWorkflowApplyAction(): Promise<void> {
  const workflow = await vscode.window.showQuickPick(
    CLI_WORKFLOWS.map(name => ({
      label: name,
      description: `workflow: ${name}`,
      value: name
    })),
    {
      placeHolder: 'Select workflow to append'
    }
  );

  if (!workflow) return;

  const file = await vscode.window.showInputBox({
    prompt: 'Target slide file',
    value: 'slides.md'
  });

  if (!file) return;
  await runCliArgs(['workflow', 'apply', workflow.value, '--file', file], `workflow apply ${workflow.value}`);
}

export async function runCliAction(action: CliActionId): Promise<void> {
  switch (action) {
    case 'initPresentation':
      await runInitPresentationAction();
      return;
    case 'templateList':
      await runCliArgs(['template', 'list'], 'template list');
      return;
    case 'themeApply':
      await runThemeApplyAction();
      return;
    case 'themeList':
      await runCliArgs(['theme', 'list'], 'theme list');
      return;
    case 'themePresetApply':
      await runThemePresetApplyAction();
      return;
    case 'themePresetList':
      await runCliArgs(['theme', 'preset', 'list'], 'theme preset list');
      return;
    case 'layoutList':
      await runCliArgs(['layout', 'list'], 'layout list');
      return;
    case 'componentList':
      await runCliArgs(['component', 'list'], 'component list');
      return;
    case 'snippetAppend':
      await runSnippetAppendAction();
      return;
    case 'snippetShow':
      await runSnippetShowAction();
      return;
    case 'snippetList':
      await runCliArgs(['snippet', 'list'], 'snippet list');
      return;
    case 'workflowApply':
      await runWorkflowApplyAction();
      return;
    case 'workflowList':
      await runCliArgs(['workflow', 'list'], 'workflow list');
      return;
    case 'doctor':
      await runCliArgs(['doctor'], 'doctor');
      return;
    case 'help':
      await runCliArgs(['help'], 'help');
      return;
    default:
      return;
  }
}

export async function openCliActionMenu(): Promise<void> {
  const items: Array<vscode.QuickPickItem & { action: CliActionId }> = [
    { label: 'New Presentation...', description: 'sch init with prompts', action: 'initPresentation' },
    { label: 'Apply Theme...', description: 'sch theme apply', action: 'themeApply' },
    { label: 'Apply Theme Preset Combo...', description: 'sch theme preset apply', action: 'themePresetApply' },
    { label: 'Append Snippet...', description: 'sch snippet append', action: 'snippetAppend' },
    { label: 'Append Workflow...', description: 'sch workflow apply', action: 'workflowApply' },
    { label: 'Show Snippet...', description: 'sch snippet show', action: 'snippetShow' },
    { label: 'List Templates', description: 'sch template list', action: 'templateList' },
    { label: 'List Themes', description: 'sch theme list', action: 'themeList' },
    { label: 'List Theme Presets', description: 'sch theme preset list', action: 'themePresetList' },
    { label: 'List Layouts', description: 'sch layout list', action: 'layoutList' },
    { label: 'List Components', description: 'sch component list', action: 'componentList' },
    { label: 'List Snippets', description: 'sch snippet list', action: 'snippetList' },
    { label: 'List Workflows', description: 'sch workflow list', action: 'workflowList' },
    { label: 'Doctor', description: 'sch doctor', action: 'doctor' },
    { label: 'Help', description: 'sch help', action: 'help' }
  ];

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: 'Select a Scholarly CLI action',
    matchOnDescription: true
  });

  if (!selected) return;
  await runCliAction(selected.action);
}

export async function setColorTheme(colorTheme?: string) {
  const value = colorTheme ?? await pickColorTheme();
  if (!value) return;
  await upsertThemeConfigInActiveDocument({ colorTheme: value });
  vscode.window.showInformationMessage(`Slidev Scholarly: colorTheme → ${value}`);
}

export async function setFontTheme(fontTheme?: string) {
  const value = fontTheme ?? await pickFontTheme();
  if (!value) return;
  await upsertThemeConfigInActiveDocument({ fontTheme: value });
  vscode.window.showInformationMessage(`Slidev Scholarly: fontTheme → ${value}`);
}

export async function setContentMode(contentMode?: ContentMode) {
  const value = contentMode ?? await pickContentMode();
  if (!value) return;
  await upsertThemeConfigInActiveDocument({ contentMode: value });
  vscode.window.showInformationMessage(`Slidev Scholarly: contentMode → ${value}`);
}

export async function setChromeMode(chromeMode?: SurfaceMode) {
  const value = chromeMode ?? await pickSurfaceMode('Select a Slidev Scholarly chrome mode');
  if (!value) return;
  await upsertThemeConfigInActiveDocument({ chromeMode: value });
  vscode.window.showInformationMessage(`Slidev Scholarly: chromeMode → ${value}`);
}

export async function setSectionMode(sectionMode?: SurfaceMode) {
  const value = sectionMode ?? await pickSurfaceMode('Select a Slidev Scholarly section mode');
  if (!value) return;
  await upsertThemeConfigInActiveDocument({ sectionMode: value });
  vscode.window.showInformationMessage(`Slidev Scholarly: sectionMode → ${value}`);
}

export async function setColorMode(colorMode?: ContentMode) {
  const value = colorMode ?? await pickColorMode();
  if (!value) return;
  await upsertThemeConfigInActiveDocument({ colorMode: value });
  vscode.window.showInformationMessage(`Slidev Scholarly: contentMode → ${value}`);
}

export async function applyThemePreset(preset?: ThemePreset | string) {
  let selected: ThemePreset | undefined;

  if (typeof preset === 'string') {
    selected = THEME_PRESETS.find(p => p.id === preset);
  } else {
    selected = preset;
  }

  selected = selected ?? await pickThemePreset();
  if (!selected) return;

  await upsertThemeConfigInActiveDocument({
    colorTheme: selected.colorTheme,
    fontTheme: selected.fontTheme
  });
  vscode.window.showInformationMessage(
    `Slidev Scholarly: preset → ${selected.label} (${selected.colorTheme}, ${selected.fontTheme})`
  );
}

async function pickColorTheme(): Promise<string | undefined> {
  const items: Array<vscode.QuickPickItem & { value: string }> = COLOR_THEMES.map(t => ({
    label: t.label,
    description: t.value,
    detail: t.description,
    value: t.value
  }));

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: 'Select a Slidev Scholarly color theme',
    matchOnDescription: true,
    matchOnDetail: true
  });

  return selected?.value;
}

async function pickFontTheme(): Promise<string | undefined> {
  const items: Array<vscode.QuickPickItem & { value: string }> = FONT_THEMES.map(t => ({
    label: t.label,
    description: t.value,
    detail: t.description,
    value: t.value
  }));

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: 'Select a Slidev Scholarly font theme',
    matchOnDescription: true,
    matchOnDetail: true
  });

  return selected?.value;
}

async function pickColorMode(): Promise<'light' | 'dark' | undefined> {
  const items: Array<vscode.QuickPickItem & { value: 'light' | 'dark' }> = COLOR_MODES.map(t => ({
    label: t.label,
    description: t.value,
    detail: t.description,
    value: t.value
  }));

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: 'Select a Slidev Scholarly color mode',
    matchOnDescription: true,
    matchOnDetail: true
  });

  return selected?.value;
}

async function pickContentMode(): Promise<ContentMode | undefined> {
  const items: Array<vscode.QuickPickItem & { value: ContentMode }> = CONTENT_MODES.map(t => ({
    label: t.label,
    description: t.value,
    detail: t.description,
    value: t.value
  }));

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: 'Select a Slidev Scholarly content mode',
    matchOnDescription: true,
    matchOnDetail: true
  });

  return selected?.value;
}

async function pickSurfaceMode(placeHolder: string): Promise<SurfaceMode | undefined> {
  const items: Array<vscode.QuickPickItem & { value: SurfaceMode }> = SURFACE_MODES.map(t => ({
    label: t.label,
    description: t.value,
    detail: t.description,
    value: t.value
  }));

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder,
    matchOnDescription: true,
    matchOnDetail: true
  });

  return selected?.value;
}

async function pickThemePreset(): Promise<ThemePreset | undefined> {
  const items: Array<vscode.QuickPickItem & { preset: ThemePreset }> = THEME_PRESETS.map(preset => ({
    label: preset.label,
    description: preset.description,
    preset
  }));

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: 'Apply a Slidev Scholarly theme preset',
    matchOnDescription: true
  });

  return selected?.preset;
}

async function upsertThemeConfigInActiveDocument(update: ThemeConfigUpdate) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage('No active editor found');
    return;
  }

  const document = editor.document;
  if (document.languageId !== 'markdown') {
    vscode.window.showWarningMessage('Open a Markdown file to edit Slidev frontmatter');
    return;
  }

  const eol = document.eol === vscode.EndOfLine.CRLF ? '\r\n' : '\n';
  const text = document.getText();

  const frontmatterMatch = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);

  try {
    if (!frontmatterMatch) {
      const yamlLines = buildNewFrontmatter(update);
      const insertion = `---${eol}${yamlLines.join(eol)}${eol}---${eol}${eol}`;
      const success = await editor.edit((editBuilder) => {
        editBuilder.insert(new vscode.Position(0, 0), insertion);
      });
      if (!success) {
        vscode.window.showErrorMessage('Failed to insert frontmatter');
      }
      return;
    }

    const fullMatch = frontmatterMatch[0];
    const yaml = (frontmatterMatch[1] ?? '').replace(/\r\n/g, '\n');
    const updatedYaml = upsertThemeConfigYaml(yaml, update);
    const updatedYamlWithEol = updatedYaml.split('\n').join(eol);
    const replacement = `---${eol}${updatedYamlWithEol}${eol}---${eol}`;

    const success = await editor.edit((editBuilder) => {
      editBuilder.replace(
        new vscode.Range(
          document.positionAt(0),
          document.positionAt(fullMatch.length)
        ),
        replacement
      );
    });
    if (!success) {
      vscode.window.showErrorMessage('Failed to update frontmatter');
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`Failed to update theme config: ${message}`);
  }
}

function buildNewFrontmatter(update: ThemeConfigUpdate): string[] {
  const lines: string[] = [];
  lines.push('theme: scholarly');
  const themeConfigLines = buildThemeConfigLines(update);
  if (themeConfigLines.length > 0) {
    lines.push('themeConfig:');
    lines.push(...themeConfigLines);
  }
  return lines;
}

function buildThemeConfigLines(update: ThemeConfigUpdate): string[] {
  const lines: string[] = [];
  const contentMode = update.contentMode ?? update.colorMode;
  if (update.colorTheme) lines.push(`  colorTheme: ${update.colorTheme}`);
  if (update.fontTheme) lines.push(`  fontTheme: ${update.fontTheme}`);
  if (contentMode) lines.push(`  contentMode: ${contentMode}`);
  if (update.chromeMode) lines.push(`  chromeMode: ${update.chromeMode}`);
  if (update.sectionMode) lines.push(`  sectionMode: ${update.sectionMode}`);
  return lines;
}

function upsertThemeConfigYaml(yaml: string, update: ThemeConfigUpdate): string {
  const lines = yaml.split('\n');
  const themeConfigIndex = lines.findIndex(line =>
    line.trim() === 'themeConfig:' && line.match(/^\s*/)?.[0]?.length === 0
  );

  if (themeConfigIndex === -1) {
    const themeConfigLines = buildThemeConfigLines(update);
    if (themeConfigLines.length === 0) return yaml.trimEnd();

    const result = [...lines];
    if (result.length && result[result.length - 1].trim() !== '') result.push('');
    result.push('themeConfig:');
    result.push(...themeConfigLines);
    return result.join('\n').trimEnd();
  }

  const blockStart = themeConfigIndex + 1;
  let blockEnd = blockStart;
  while (blockEnd < lines.length) {
    const line = lines[blockEnd];
    if (!line.trim()) {
      blockEnd++;
      continue;
    }
    const indent = line.match(/^\s*/)?.[0] ?? '';
    if (indent.length === 0) break;
    blockEnd++;
  }

  const updated = [...lines];

  const upsertChild = (key: keyof ThemeConfigUpdate, value: string | undefined) => {
    if (!value) return;
    const childRegex = new RegExp(`^\\s{2}${key}:\\s*`);
    let foundIndex = -1;
    for (let i = blockStart; i < blockEnd; i++) {
      if (childRegex.test(updated[i])) {
        foundIndex = i;
        break;
      }
    }

    if (foundIndex !== -1) {
      updated[foundIndex] = `  ${key}: ${value}`;
      return;
    }

    updated.splice(blockEnd, 0, `  ${key}: ${value}`);
    blockEnd++;
  };

  upsertChild('colorTheme', update.colorTheme);
  upsertChild('fontTheme', update.fontTheme);
  upsertChild('contentMode', update.contentMode ?? update.colorMode);
  upsertChild('chromeMode', update.chromeMode);
  upsertChild('sectionMode', update.sectionMode);

  return updated.join('\n').trimEnd();
}

export const __test = {
  buildThemeApplyArgs,
  buildNewFrontmatter,
  buildThemeConfigLines,
  getAcademicTemplate,
  getSimpleTemplate,
  upsertThemeConfigYaml
};
