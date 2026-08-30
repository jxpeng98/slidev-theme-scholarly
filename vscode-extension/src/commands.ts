import * as vscode from 'vscode';
import * as path from 'path';
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
import { localizeDetail, t } from './localization';

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
    vscode.window.showWarningMessage(t('Open a Markdown file first'));
    return;
  }

  if (editor.document.languageId !== 'markdown') {
    vscode.window.showWarningMessage(t('Open a Markdown file before inserting Scholarly content'));
    return;
  }

  editor.insertSnippet(new vscode.SnippetString(snippet));
}

function getActiveMarkdownEditor(): vscode.TextEditor | undefined {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage(t('Open a Markdown file first'));
    return undefined;
  }

  if (editor.document.languageId !== 'markdown') {
    vscode.window.showWarningMessage(t('Open a Markdown file to use the anchor tools'));
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
    return t('Enter an anchor id');

  if (!/^[A-Za-z0-9][\w:.-]*$/.test(normalized))
    return t('Use letters, numbers, hyphens, underscores, colons, or periods');

  return null;
}

function getAnchorSyntaxLabel(syntax: AnchorTarget['syntax']): string {
  switch (syntax) {
    case 'heading':
      return t('Heading anchor');
    case 'anchor':
      return t('Standalone anchor');
    case 'named-anchor':
      return t('Named anchor');
    default:
      return 'HTML id';
  }
}

export async function insertInternalAnchor(): Promise<void> {
  if (!getActiveMarkdownEditor())
    return;

  const rawAnchorId = await vscode.window.showInputBox({
    prompt: t('Enter an internal anchor id'),
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
        label: t('Standalone anchor'),
        description: '::anchor{#id}',
        detail: t('Add an anchor on its own line'),
        snippet: `::anchor{#${anchorId}}$0`
      },
      {
        label: t('Heading suffix'),
        description: '{#id}',
        detail: t('Add the id to the current heading'),
        snippet: ` {#${anchorId}}$0`
      },
      {
        label: t('HTML id attribute'),
        description: 'id="id"',
        detail: t('Add an HTML or Vue id at the cursor'),
        snippet: `id="${anchorId}"$0`
      }
    ],
    {
      placeHolder: t('Choose how to add the anchor'),
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
    vscode.window.showInformationMessage(t('This document has no internal anchors'));
    return;
  }

  const selected = await vscode.window.showQuickPick(
    anchors.map(anchor => ({
      label: `#${anchor.id}`,
      description: t('{0} · line {1}', getAnchorSyntaxLabel(anchor.syntax), anchor.line + 1),
      detail: anchor.label,
      anchor
    })),
    {
      placeHolder: t('Choose an internal anchor to reference'),
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
      vscode.window.showInformationMessage(t('No BibTeX entries were found for this Markdown file'));
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
        placeHolder: t('Choose a BibTeX entry'),
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
        description: t('Full-slide paper summary'),
        value: 'paper-summary' as const
      },
      {
        label: 'paper-card',
        description: t('PaperCard inside the current slide'),
        value: 'paper-card' as const
      }
    ],
    {
      placeHolder: t('Choose how to insert the paper')
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
    prompt: t('Name the presentation file'),
    value: 'slides.md',
    validateInput: (value) => {
      if (!value.endsWith('.md')) {
        return t('Use a .md file name');
      }
      if (path.isAbsolute(value) || value.split(/[\\/]/).includes('..')) {
        return t('Choose a file inside the current workspace');
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
      try {
        await vscode.workspace.fs.stat(uri);
        vscode.window.showWarningMessage(t('{0} already exists. Choose another file name.', fileName));
        return;
      } catch (error) {
        if (!(error instanceof vscode.FileSystemError) || error.code !== 'FileNotFound')
          throw error;
      }
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
    vscode.window.showErrorMessage(t('Could not create the presentation: {0}', message));
  }
}

async function createPresentationFromCliTemplate(template: string): Promise<void> {
  const meta = TEMPLATES.find(item => item.id === template);
  const targetDir = await vscode.window.showInputBox({
    prompt: t('Choose a folder for {0}', meta ? t(meta.label) : template),
    value: template === 'basic' ? 'my-talk' : template,
    validateInput: (value) => {
      const trimmed = value.trim();
      if (!trimmed) return t('Enter a folder name');
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
    await vscode.window.showInformationMessage(t('Running in the Scholarly CLI: {0}', message));
  }
}

async function pickOptionalQuickValue<T extends string>(
  placeHolder: string,
  items: Array<{ label: string; description?: string; detail?: string; value: T }>
): Promise<T | undefined> {
  const selected = await vscode.window.showQuickPick(
    [
      { label: t('Skip'), description: t('Leave this unchanged'), value: '' },
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
    prompt: t('Choose a folder for the new presentation'),
    value: 'my-talk',
    validateInput: (value) => {
      const trimmed = value.trim();
      if (!trimmed) return t('Enter a folder name');
      return null;
    }
  });

  if (!targetDir) return;

  const template = await vscode.window.showQuickPick(
    TEMPLATES.map(template => ({
      label: t(template.label),
      description: template.id,
      detail: localizeDetail(template.description, t('Ready-to-use presentation template')),
      value: template.id
    })),
    {
      placeHolder: t('Choose a template')
    }
  );

  if (!template) return;
  await runCliArgs(['init', targetDir, '--template', template.value], `init ${targetDir}`);
}

async function runThemeApplyAction(): Promise<void> {
  const colorTheme = await pickColorTheme();
  if (!colorTheme) return;

  const fontTheme = await pickOptionalQuickValue(
    t('Optional: choose a font theme'),
    FONT_THEMES.map(theme => ({
      label: t(theme.label),
      description: theme.value,
      value: theme.value
    }))
  );

  const contentMode = await pickOptionalQuickValue<ContentMode>(
    t('Optional: choose a content mode'),
    CONTENT_MODES.map(mode => ({
      label: t(mode.label),
      description: mode.value,
      value: mode.value
    }))
  );

  const chromeMode = await pickOptionalQuickValue<SurfaceMode>(
    t('Optional: choose a header and footer mode'),
    SURFACE_MODES.map(mode => ({
      label: t(mode.label),
      description: mode.value,
      detail: localizeDetail(mode.description, t('Controls headers, footers, and navigation')),
      value: mode.value
    }))
  );

  const sectionMode = await pickOptionalQuickValue<SurfaceMode>(
    t('Optional: choose a section mode'),
    SURFACE_MODES.map(mode => ({
      label: t('{0} sections', t(mode.label)),
      description: mode.value,
      detail: localizeDetail(mode.description, t('Controls section divider slides')),
      value: mode.value
    }))
  );

  const file = await vscode.window.showInputBox({
    prompt: t('Choose the slide file to update'),
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
      description: t('Theme preset: {0}', name),
      value: name
    })),
    {
      placeHolder: t('Choose a theme preset')
    }
  );

  if (!preset) return;

  const file = await vscode.window.showInputBox({
    prompt: t('Choose the slide file to update'),
    value: 'slides.md'
  });

  if (!file) return;
  await runCliArgs(['theme', 'preset', 'apply', preset.value, '--file', file], `theme preset apply ${preset.value}`);
}

async function runSnippetAppendAction(): Promise<void> {
  const snippet = await vscode.window.showQuickPick(
    CLI_SNIPPETS.map(name => ({
      label: name,
      description: t('Append snippet: {0}', name),
      value: name
    })),
    {
      placeHolder: t('Choose a snippet to append')
    }
  );

  if (!snippet) return;

  const file = await vscode.window.showInputBox({
    prompt: t('Choose the slide file to update'),
    value: 'slides.md'
  });

  if (!file) return;
  await runCliArgs(['snippet', 'append', snippet.value, '--file', file], `snippet append ${snippet.value}`);
}

async function runSnippetShowAction(): Promise<void> {
  const snippet = await vscode.window.showQuickPick(
    CLI_SNIPPETS.map(name => ({
      label: name,
      description: t('Show snippet: {0}', name),
      value: name
    })),
    {
      placeHolder: t('Choose a snippet to show')
    }
  );

  if (!snippet) return;
  await runCliArgs(['snippet', 'show', snippet.value], `snippet show ${snippet.value}`);
}

async function runWorkflowApplyAction(): Promise<void> {
  const workflow = await vscode.window.showQuickPick(
    CLI_WORKFLOWS.map(name => ({
      label: name,
      description: t('Workflow: {0}', name),
      value: name
    })),
    {
      placeHolder: t('Choose a workflow to append')
    }
  );

  if (!workflow) return;

  const file = await vscode.window.showInputBox({
    prompt: t('Choose the slide file to update'),
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
  const items: Array<vscode.QuickPickItem & { action?: CliActionId }> = [
    { label: t('Start'), kind: vscode.QuickPickItemKind.Separator },
    { label: t('New Presentation...'), description: t('Create a deck with guided prompts'), detail: 'sch init', action: 'initPresentation' },
    { label: t('List Templates'), description: t('See every starting template'), detail: 'sch template list', action: 'templateList' },
    { label: t('Build'), kind: vscode.QuickPickItemKind.Separator },
    { label: t('List Layouts'), description: t('See available slide structures'), detail: 'sch layout list', action: 'layoutList' },
    { label: t('List Components'), description: t('See available content blocks'), detail: 'sch component list', action: 'componentList' },
    { label: t('Append Snippet...'), description: t('Add a ready-made block to slides.md'), detail: 'sch snippet append', action: 'snippetAppend' },
    { label: t('Apply Workflow...'), description: t('Add a paper, seminar, or quick workflow'), detail: 'sch workflow apply', action: 'workflowApply' },
    { label: t('Show Snippet...'), description: t('Print a block without changing a file'), detail: 'sch snippet show', action: 'snippetShow' },
    { label: t('List Snippets'), description: t('See every reusable block'), detail: 'sch snippet list', action: 'snippetList' },
    { label: t('List Workflows'), description: t('See every presentation workflow'), detail: 'sch workflow list', action: 'workflowList' },
    { label: t('Customize'), kind: vscode.QuickPickItemKind.Separator },
    { label: t('Set Theme...'), description: t('Choose colors, fonts, and surface modes'), detail: 'sch theme apply', action: 'themeApply' },
    { label: t('Apply Curated Preset...'), description: t('Apply a ready-made theme combination'), detail: 'sch theme preset apply', action: 'themePresetApply' },
    { label: t('List Color Themes'), description: t('See every color theme'), detail: 'sch theme list', action: 'themeList' },
    { label: t('List Curated Presets'), description: t('See every preset combination'), detail: 'sch theme preset list', action: 'themePresetList' },
    { label: t('Check & Help'), kind: vscode.QuickPickItemKind.Separator },
    { label: t('Doctor'), description: t('Check setup, citations, and project files'), detail: 'sch doctor', action: 'doctor' },
    { label: t('Help'), description: t('List every CLI command'), detail: 'sch help', action: 'help' }
  ];

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: t('What do you want to do next?'),
    matchOnDescription: true,
    matchOnDetail: true
  });

  if (!selected?.action) return;
  await runCliAction(selected.action);
}

export async function setColorTheme(colorTheme?: string) {
  const value = colorTheme ?? await pickColorTheme();
  if (!value) return;
  await upsertThemeConfigInActiveDocument({ colorTheme: value });
  vscode.window.showInformationMessage(t('Color theme set to {0}', value));
}

export async function setFontTheme(fontTheme?: string) {
  const value = fontTheme ?? await pickFontTheme();
  if (!value) return;
  await upsertThemeConfigInActiveDocument({ fontTheme: value });
  vscode.window.showInformationMessage(t('Font theme set to {0}', value));
}

export async function setContentMode(contentMode?: ContentMode) {
  const value = contentMode ?? await pickContentMode();
  if (!value) return;
  await upsertThemeConfigInActiveDocument({ contentMode: value });
  vscode.window.showInformationMessage(t('Content mode set to {0}', value));
}

export async function setChromeMode(chromeMode?: SurfaceMode) {
  const value = chromeMode ?? await pickSurfaceMode(t('Choose a header and footer mode'));
  if (!value) return;
  await upsertThemeConfigInActiveDocument({ chromeMode: value });
  vscode.window.showInformationMessage(t('Header and footer mode set to {0}', value));
}

export async function setSectionMode(sectionMode?: SurfaceMode) {
  const value = sectionMode ?? await pickSurfaceMode(t('Choose a section mode'));
  if (!value) return;
  await upsertThemeConfigInActiveDocument({ sectionMode: value });
  vscode.window.showInformationMessage(t('Section mode set to {0}', value));
}

export async function setColorMode(colorMode?: ContentMode) {
  const value = colorMode ?? await pickColorMode();
  if (!value) return;
  await upsertThemeConfigInActiveDocument({ colorMode: value });
  vscode.window.showInformationMessage(t('Content mode set to {0}', value));
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
    t('Applied {0} ({1}, {2})', t(selected.label), selected.colorTheme, selected.fontTheme)
  );
}

async function pickColorTheme(): Promise<string | undefined> {
  const items: Array<vscode.QuickPickItem & { value: string }> = COLOR_THEMES.map(theme => ({
    label: t(theme.label),
    description: theme.value,
    detail: localizeDetail(theme.description, t('Color palette for the presentation')),
    value: theme.value
  }));

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: t('Choose a color theme'),
    matchOnDescription: true,
    matchOnDetail: true
  });

  return selected?.value;
}

async function pickFontTheme(): Promise<string | undefined> {
  const items: Array<vscode.QuickPickItem & { value: string }> = FONT_THEMES.map(theme => ({
    label: t(theme.label),
    description: theme.value,
    detail: localizeDetail(theme.description, t('Font pairing for the presentation')),
    value: theme.value
  }));

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: t('Choose a font theme'),
    matchOnDescription: true,
    matchOnDetail: true
  });

  return selected?.value;
}

async function pickColorMode(): Promise<'light' | 'dark' | undefined> {
  const items: Array<vscode.QuickPickItem & { value: 'light' | 'dark' }> = COLOR_MODES.map(mode => ({
    label: t(mode.label),
    description: mode.value,
    detail: localizeDetail(mode.description, t('Controls the slide background and text contrast')),
    value: mode.value
  }));

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: t('Choose a color mode'),
    matchOnDescription: true,
    matchOnDetail: true
  });

  return selected?.value;
}

async function pickContentMode(): Promise<ContentMode | undefined> {
  const items: Array<vscode.QuickPickItem & { value: ContentMode }> = CONTENT_MODES.map(mode => ({
    label: t(mode.label),
    description: mode.value,
    detail: localizeDetail(mode.description, t('Controls the slide background and text contrast')),
    value: mode.value
  }));

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: t('Choose a content mode'),
    matchOnDescription: true,
    matchOnDetail: true
  });

  return selected?.value;
}

async function pickSurfaceMode(placeHolder: string): Promise<SurfaceMode | undefined> {
  const items: Array<vscode.QuickPickItem & { value: SurfaceMode }> = SURFACE_MODES.map(mode => ({
    label: t(mode.label),
    description: mode.value,
    detail: localizeDetail(mode.description, t('Controls the surface background and text contrast')),
    value: mode.value
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
    label: t(preset.label),
    description: localizeDetail(preset.description, t('Ready-made color and font combination')),
    preset
  }));

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: t('Choose a theme preset'),
    matchOnDescription: true
  });

  return selected?.preset;
}

async function upsertThemeConfigInActiveDocument(update: ThemeConfigUpdate) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage(t('Open a Markdown file first'));
    return;
  }

  const document = editor.document;
  if (document.languageId !== 'markdown') {
    vscode.window.showWarningMessage(t('Open a Markdown file to edit Slidev frontmatter'));
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
        vscode.window.showErrorMessage(t('Could not insert the frontmatter'));
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
      vscode.window.showErrorMessage(t('Could not update the frontmatter'));
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(t('Could not update the theme settings: {0}', message));
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
  const childIndent = updated
    .slice(blockStart, blockEnd)
    .find(line => line.trim())
    ?.match(/^\s+/)?.[0] ?? '  ';
  const escapedIndent = childIndent.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const upsertChild = (key: keyof ThemeConfigUpdate, value: string | undefined) => {
    if (!value) return;
    const childRegex = new RegExp(`^${escapedIndent}${key}:\\s*`);
    let foundIndex = -1;
    for (let i = blockStart; i < blockEnd; i++) {
      if (childRegex.test(updated[i])) {
        foundIndex = i;
        break;
      }
    }

    if (foundIndex !== -1) {
      updated[foundIndex] = `${childIndent}${key}: ${value}`;
      return;
    }

    updated.splice(blockEnd, 0, `${childIndent}${key}: ${value}`);
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
