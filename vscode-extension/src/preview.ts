import * as vscode from 'vscode';
import {
  COLOR_THEME_PALETTES,
  COLOR_THEME_PREVIEW_DIRS,
  COMPONENT_PREVIEW_FILES,
  type CatalogConfigEntry,
  type CatalogSlotEntry,
  type ThemePalette
} from './sharedData';
import { WEBVIEW_THEME_CSS } from './webviewTheme';

export type PreviewKind = 'layout' | 'component' | 'colorTheme' | 'fontTheme' | 'preset';

export interface PreviewDetails {
  category?: string;
  useFor?: string;
  features?: string[];
  tips?: string[];
  variants?: string[];
  tags?: string[];
  previewNote?: string;
  config?: CatalogConfigEntry[];
  slots?: CatalogSlotEntry[];
}

export interface PreviewRequest {
  kind: PreviewKind;
  id: string;
  label?: string;
  description?: string;
  snippet?: string;
  colorTheme?: string;
  fontTheme?: string;
  details?: PreviewDetails;
}

const COMPONENT_PREVIEW_ALIASES: Record<string, string> = {
  'Block (Vue)': 'block',
  'Block (Syntax Sugar)': 'block',
  'Theorem (Vue)': 'theorem',
  'Theorem (Syntax Sugar)': 'theorem',
  'Definition': 'definition',
  'Lemma': 'definition',
  'Proof': 'theorem',
  'Corollary': 'theorem',
  'Claim': 'theorem',
  'Example': 'theorem',
  'Example Theorem': 'theorem',
  'Note': 'theorem',
  'Theorem Compact': 'theorem',
  'Highlight (Vue)': 'highlight',
  'Highlight (Syntax Sugar)': 'highlight',
  'Cite (Vue)': 'cite',
  'Cite (Syntax Sugar)': 'cite',
  'Citation Note': 'cite',
  'Steps': 'steps',
  'Steps (Syntax Sugar)': 'steps',
  'Columns': 'columns',
  'Columns (Syntax Sugar)': 'columns',
  'Keywords': 'keywords',
  'Keywords (Syntax Sugar)': 'keywords',
  'ThemePreview': 'theme-preview',
  'Theme Preview': 'theme-preview'
};

export function getComponentPreviewFile(componentLabel: string): string | undefined {
  const baseLabel = componentLabel.replace(/\s+\(.+?\)$/, '');
  return COMPONENT_PREVIEW_ALIASES[componentLabel]
    ?? COMPONENT_PREVIEW_FILES[componentLabel]
    ?? COMPONENT_PREVIEW_FILES[baseLabel];
}

export function getColorThemePreviewDir(colorThemeId: string): string | undefined {
  return COLOR_THEME_PREVIEW_DIRS[colorThemeId];
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function fileExists(uri: vscode.Uri): Promise<boolean> {
  try {
    await vscode.workspace.fs.stat(uri);
    return true;
  } catch {
    return false;
  }
}

export class PreviewViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'scholarly-preview';
  private view?: vscode.WebviewView;
  private currentRequest?: PreviewRequest;

  constructor(private readonly extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void {
    this.view = webviewView;

    webviewView.webview.options = {
      enableScripts: false,
      localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, 'media')]
    };

    if (this.currentRequest) {
      void this.showPreview(this.currentRequest);
    } else {
      this.showWelcome();
    }
  }

  public async showPreview(request: PreviewRequest): Promise<void> {
    this.currentRequest = request;

    if (!this.view) {
      return;
    }

    this.view.show?.(true);

    const title = this.getTitle(request);
    const imageUris = await this.resolveImages(request);
    const webviewUris = imageUris.map(uri =>
      this.view!.webview.asWebviewUri(uri).toString()
    );

    this.view.webview.html = this.renderHtml(request, title, webviewUris);
  }

  private showWelcome(): void {
    if (!this.view) return;

    this.view.webview.html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline';" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
	  <style>
      ${WEBVIEW_THEME_CSS}
      body { padding: 16px; }
	    .welcome {
        display: grid;
        place-items: center;
        min-height: 180px;
        padding: 24px 12px;
        text-align: center;
      }
      .welcome-mark {
        display: grid;
        place-items: center;
        width: 38px;
        height: 38px;
        margin-bottom: 12px;
        border: 1px solid var(--sch-border);
        border-radius: var(--sch-radius-md);
        color: var(--sch-link);
        background: var(--sch-card);
        font-size: 18px;
        font-weight: 700;
      }
	    .welcome h1 { margin: 0 0 6px; font-size: 15px; }
	    .welcome p { max-width: 28ch; margin: 0; color: var(--sch-muted); font-size: 12px; }
	  </style>
</head>
<body>
	  <div class="welcome">
      <div>
        <span class="welcome-mark" aria-hidden="true">Aa</span>
	      <h1>Catalog preview</h1>
	      <p>Choose Preview on a layout, component, or theme to see its visual and usage guidance.</p>
      </div>
	  </div>
</body>
</html>`;
  }

  private getTitle(request: PreviewRequest): string {
    return request.label || request.id;
  }

  private async resolveImages(request: PreviewRequest): Promise<vscode.Uri[]> {
    const uris: vscode.Uri[] = [];

    if (request.kind === 'layout') {
      const uri = vscode.Uri.joinPath(
        this.extensionUri, 'media', 'previews', 'layouts', `${request.id}.png`
      );
      if (await fileExists(uri)) {
        uris.push(uri);
      }
    }

    if (request.kind === 'component') {
      const file = getComponentPreviewFile(request.label || request.id)
        ?? getComponentPreviewFile(request.id);
      if (file) {
        const uri = vscode.Uri.joinPath(
          this.extensionUri, 'media', 'previews', 'components', `${file}.png`
        );
        if (await fileExists(uri)) {
          uris.push(uri);
        }
      }
    }

    if (request.kind === 'preset' || request.kind === 'colorTheme') {
      const colorTheme = request.kind === 'preset' ? request.colorTheme : request.id;
      const dir = colorTheme ? getColorThemePreviewDir(colorTheme) : undefined;
      if (dir) {
        for (const i of [1, 2, 3, 4]) {
          const uri = vscode.Uri.joinPath(
            this.extensionUri, 'media', 'previews', 'themes', dir, `${i}.png`
          );
          if (await fileExists(uri)) {
            uris.push(uri);
          }
        }
      }
    }

    return uris;
  }

  private renderHtml(
    request: PreviewRequest,
    title: string,
    images: string[]
  ): string {
    const csp = this.view!.webview.cspSource;
    const desc = request.description ? escapeHtml(request.description) : '';
    const snippet = request.snippet ? escapeHtml(request.snippet.trim()) : '';
    const details = request.details;

    const meta: string[] = [];
    if (details?.category) meta.push(details.category);
    if (request.colorTheme) meta.push(`colorTheme: ${request.colorTheme}`);
    if (request.fontTheme) meta.push(`fontTheme: ${request.fontTheme}`);
    const metaHtml = meta.length
      ? `<div class="meta" aria-label="Metadata">${meta.map(item => `<span class="pill">${escapeHtml(item)}</span>`).join('')}</div>`
      : '';

    let gallery: string;
    if (images.length === 0) {
      const message = request.kind === 'fontTheme'
        ? 'Apply this typography preset to a deck to inspect its heading, body, and code fonts together.'
        : 'This insertion helper has no separate screenshot. Its behavior and exact syntax are documented below.';
      gallery = `<div class="empty"><strong>Visual preview unavailable</strong><span>${message}</span></div>`;
    } else if (images.length === 1) {
      gallery = `<figure class="single"><img src="${images[0]}" alt="Preview of ${escapeHtml(title)}" /></figure>`;
    } else {
      const labels = ['Cover', 'Content', 'Section', 'Closing'];
      gallery = `<div class="gallery-grid">${images.map((src, index) => `
        <figure>
          <img src="${src}" alt="${labels[index] || `Preview ${index + 1}`} view of ${escapeHtml(title)}" />
          <figcaption>${labels[index] || `Preview ${index + 1}`}</figcaption>
        </figure>
      `).join('')}</div>`;
    }

    const previewNote = details?.previewNote
      ?? (request.kind === 'layout' || request.kind === 'component'
        ? 'Catalog screenshot baseline: Classic Blue · Classic font · Light content. The final deck follows your selected theme.'
        : '');

    const paletteTheme = request.kind === 'colorTheme'
      ? request.id
      : request.kind === 'preset'
        ? request.colorTheme
        : undefined;
    const palette = paletteTheme ? COLOR_THEME_PALETTES[paletteTheme] : undefined;
    const paletteHtml = palette
      ? `<section class="section" aria-labelledby="palette-heading">
          <h2 id="palette-heading">Theme palette</h2>
          ${renderPalette(palette)}
        </section>`
      : '';

    const guidanceHtml = renderGuidance(details);
    const configurationHtml = renderConfiguration(details, request.kind);
    const snippetHtml = snippet
      ? `<section class="section" aria-labelledby="usage-heading">
          <h2 id="usage-heading">Usage</h2>
          <pre tabindex="0"><code>${snippet}</code></pre>
        </section>`
      : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${csp} data:; style-src 'unsafe-inline';" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <style>
    ${WEBVIEW_THEME_CSS}
    body { padding: 14px; }
    h1 { margin: 0; font-size: 16px; line-height: 1.3; }
    h2 { margin: 0 0 7px; font-size: 12px; letter-spacing: 0.01em; }
    .subheading { margin-top: 10px; }
    p { margin: 0; }
    .hero { margin-bottom: 12px; }
    .eyebrow {
      margin: 0 0 4px;
      color: var(--sch-link);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .desc { margin: 6px 0 0; color: var(--sch-muted); font-size: 12px; }
    .meta { display: flex; gap: 5px; flex-wrap: wrap; margin-top: 9px; }
    .pill {
      padding: 2px 7px;
      border: 1px solid var(--sch-border);
      border-radius: 999px;
      color: var(--sch-muted);
      background: var(--sch-card);
      font: 10px/1.5 var(--vscode-editor-font-family, monospace);
    }
    .section { margin-top: 14px; }
    .gallery-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
    figure { min-width: 0; margin: 0; }
    img {
      display: block;
      width: 100%;
      height: auto;
      border: 1px solid var(--sch-border);
      border-radius: var(--sch-radius-md);
      background: var(--sch-card);
    }
    figcaption { margin-top: 4px; color: var(--sch-muted); font-size: 10px; }
    .preview-note { margin-top: 7px; color: var(--sch-muted); font-size: 10px; line-height: 1.4; }
    .guidance-grid { display: grid; gap: 8px; }
    .guidance-card {
      padding: 9px 10px;
      border: 1px solid var(--sch-border);
      border-radius: var(--sch-radius-md);
      background: var(--sch-card);
    }
    .guidance-card p, .guidance-card li { color: var(--sch-muted); font-size: 11px; }
    .guidance-card ul { display: grid; gap: 4px; margin: 0; padding-left: 16px; }
    .config-list { display: grid; gap: 7px; }
    .config-item {
      display: grid;
      gap: 5px;
      padding: 9px 10px;
      border: 1px solid var(--sch-border);
      border-radius: var(--sch-radius-md);
      background: var(--sch-card);
    }
    .config-heading { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; }
    .config-name { color: var(--sch-link); font-weight: 600; }
    .config-type { color: var(--sch-muted); font: 10px/1.4 var(--vscode-editor-font-family, monospace); overflow-wrap: anywhere; text-align: right; }
    .config-description { color: var(--sch-fg); font-size: 11px; }
    .config-meta { display: flex; flex-wrap: wrap; gap: 4px; }
    .config-meta span {
      padding: 1px 5px;
      border-radius: var(--sch-radius-sm);
      color: var(--sch-muted);
      background: var(--sch-code-bg);
      font: 9px/1.5 var(--vscode-editor-font-family, monospace);
    }
    .slot-list { display: grid; gap: 5px; margin: 0; padding: 0; list-style: none; }
    .slot-list li { display: grid; gap: 2px; padding: 7px 9px; border-left: 2px solid var(--sch-focus); background: var(--sch-card); }
    .slot-list code { color: var(--sch-link); }
    .slot-description, .config-empty, .config-scope { color: var(--sch-muted); font-size: 11px; }
    .config-scope {
      margin: 0 0 8px;
      padding: 7px 9px;
      border-left: 2px solid var(--sch-focus);
      background: var(--sch-card);
      line-height: 1.45;
    }
    .palette { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 5px; }
    .swatch {
      display: grid;
      gap: 4px;
      min-width: 0;
      color: var(--sch-muted);
      font-size: 9px;
      text-align: center;
    }
    .swatch-color {
      height: 28px;
      border: 1px solid var(--sch-border);
      border-radius: var(--sch-radius-sm);
      background: var(--swatch);
    }
    .swatch code { overflow: hidden; text-overflow: ellipsis; }
    pre {
      max-height: 240px;
      margin: 0;
      padding: 10px;
      overflow: auto;
      border: 1px solid var(--sch-border);
      border-radius: var(--sch-radius-md);
      color: var(--sch-code-fg);
      background: var(--sch-code-bg);
    }
    code { font-family: var(--vscode-editor-font-family, monospace); font-size: 11px; white-space: pre-wrap; }
    .empty {
      display: grid;
      gap: 4px;
      padding: 16px;
      border: 1px dashed var(--sch-border);
      border-radius: var(--sch-radius-md);
      color: var(--sch-muted);
      background: var(--sch-card);
      text-align: center;
      font-size: 11px;
    }
    .empty strong { color: var(--sch-fg); }
    @media (max-width: 260px) {
      .gallery-grid, .palette { grid-template-columns: 1fr; }
      .swatch { grid-template-columns: 28px 1fr; align-items: center; text-align: left; }
    }
  </style>
</head>
<body>
  <header class="hero">
    <p class="eyebrow">${escapeHtml(kindLabel(request.kind))}</p>
    <h1>${escapeHtml(title)}</h1>
    ${desc ? `<p class="desc">${desc}</p>` : ''}
    ${metaHtml}
  </header>
  <section class="section" aria-labelledby="visual-heading">
    <h2 id="visual-heading">Visual preview</h2>
    ${gallery}
    ${previewNote ? `<p class="preview-note">${escapeHtml(previewNote)}</p>` : ''}
  </section>
  ${paletteHtml}
  ${guidanceHtml}
  ${configurationHtml}
  ${snippetHtml}
</body>
</html>`;
  }
}

function kindLabel(kind: PreviewKind): string {
  switch (kind) {
    case 'layout': return 'Layout catalog';
    case 'component': return 'Component catalog';
    case 'preset': return 'Theme preset';
    case 'colorTheme': return 'Color theme';
    case 'fontTheme': return 'Font theme';
  }
}

function renderGuidance(details: PreviewDetails | undefined): string {
  if (!details) return '';

  const cards: string[] = [];
  if (details.useFor) {
    cards.push(`<article class="guidance-card"><h2>Best for</h2><p>${escapeHtml(details.useFor)}</p></article>`);
  }
  if (details.features?.length) {
    cards.push(renderListCard('What it provides', details.features));
  }
  if (details.variants?.length) {
    cards.push(renderListCard('Variants', details.variants));
  }
  if (details.tips?.length) {
    cards.push(renderListCard('Usage tips', details.tips));
  }
  if (!cards.length) return '';

  return `<section class="section" aria-labelledby="guidance-heading">
    <h2 id="guidance-heading">How to use it</h2>
    <div class="guidance-grid">${cards.join('')}</div>
  </section>`;
}

function renderListCard(title: string, items: string[]): string {
  return `<article class="guidance-card"><h2>${escapeHtml(title)}</h2><ul>${items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></article>`;
}

function renderConfiguration(details: PreviewDetails | undefined, kind: PreviewKind): string {
  if (kind !== 'layout' && kind !== 'component') return '';

  const config = details?.config ?? [];
  const slots = details?.slots ?? [];
  const configTitle = kind === 'layout' ? 'Frontmatter configuration' : 'Component props';
  const scopeNote = kind === 'layout'
    ? '<p class="config-scope">These are layout- and theme-specific keys. Standard Slidev frontmatter such as <code>layout</code>, <code>class</code>, and <code>transition</code> remains available on every slide.</p>'
    : '';
  const emptyText = kind === 'layout'
    ? 'This layout has no layout-specific frontmatter props.'
    : 'This component has no configurable props.';
  const configBody = config.length
    ? `<div class="config-list">${config.map(renderConfigItem).join('')}</div>`
    : `<p class="config-empty">${emptyText}</p>`;
  const slotsBody = slots.length
    ? `<ul class="slot-list">${slots.map(slot => `<li><code>${escapeHtml(slot.name)}</code><span class="slot-description">${escapeHtml(slot.description)}</span></li>`).join('')}</ul>`
    : '<p class="config-empty">No content slots.</p>';

  return `<section class="section" aria-labelledby="configuration-heading">
    <h2 id="configuration-heading">${configTitle}</h2>
    ${scopeNote}
    ${configBody}
    <h2 id="slots-heading" class="subheading">Content slots</h2>
    ${slotsBody}
  </section>`;
}

function renderConfigItem(item: CatalogConfigEntry): string {
  const requirement = `<span>${item.required ? 'required' : 'optional'}</span>`;
  const defaultValue = item.default !== undefined
    ? `<span>default: ${escapeHtml(item.default)}</span>`
    : '';
  const options = item.options?.length
    ? `<span>values: ${item.options.map(escapeHtml).join(' | ')}</span>`
    : '';

  return `<article class="config-item">
    <div class="config-heading"><code class="config-name">${escapeHtml(item.name)}</code><span class="config-type">${escapeHtml(item.type)}</span></div>
    <p class="config-description">${escapeHtml(item.description)}</p>
    <div class="config-meta">${requirement}${defaultValue}${options}</div>
  </article>`;
}

function renderPalette(palette: ThemePalette): string {
  const swatches: Array<[string, string]> = [
    ['Primary', palette.primary],
    ['Primary light', palette.primaryLight],
    ['Accent', palette.accent],
    ['Background', palette.background],
    ['Foreground', palette.foreground]
  ];

  return `<div class="palette">${swatches.map(([label, color]) => `
    <span class="swatch" title="${escapeHtml(label)}: ${escapeHtml(color)}">
      <span class="swatch-color" style="--swatch: ${safeCssColor(color)}" aria-hidden="true"></span>
      <span>${escapeHtml(label)}</span>
      <code>${escapeHtml(color)}</code>
    </span>
  `).join('')}</div>`;
}

function safeCssColor(value: string): string {
  return /^#[0-9a-f]{6}$/i.test(value) ? value : 'currentColor';
}

export const __test = {
  renderConfiguration
};

// Singleton instance for the preview provider
let previewProvider: PreviewViewProvider | undefined;

export function getPreviewProvider(): PreviewViewProvider | undefined {
  return previewProvider;
}

export function registerPreviewView(context: vscode.ExtensionContext): vscode.Disposable {
  previewProvider = new PreviewViewProvider(context.extensionUri);
  return vscode.window.registerWebviewViewProvider(
    PreviewViewProvider.viewType,
    previewProvider,
    { webviewOptions: { retainContextWhenHidden: true } }
  );
}

export function registerPreviewCommand(context: vscode.ExtensionContext): vscode.Disposable {
  return vscode.commands.registerCommand(
    'slidev-scholarly.preview',
    async (arg?: PreviewRequest | PreviewTreeArgument) => {
      if (!arg) return;

      let request: PreviewRequest | undefined;

      if ('kind' in arg && 'id' in arg && typeof arg.id === 'string') {
        request = arg as PreviewRequest;
      }
      else if ('contextValue' in arg) {
        const ctx = arg.contextValue;
        const label = treeItemText(arg.label) ?? arg.item?.label;
        const description = typeof arg.description === 'string'
          ? arg.description
          : arg.item?.description;
        if (ctx === 'layoutSnippet' && arg.item) {
          request = {
            kind: 'layout',
            id: arg.item.id || arg.item.label || '',
            label: arg.item.label,
            description: arg.item.description,
            snippet: arg.item.snippet,
            details: arg.item.details
          };
        } else if (ctx === 'componentSnippet' && arg.item) {
          request = {
            kind: 'component',
            id: arg.item.canonicalName || arg.item.id || arg.item.label || '',
            label: arg.item.label,
            description: arg.item.description,
            snippet: arg.item.snippet,
            details: arg.item.details
          };
        } else if (ctx === 'themePreset' && arg.value) {
          request = {
            kind: 'preset',
            id: arg.value,
            label,
            description,
            colorTheme: arg.meta?.colorTheme,
            fontTheme: arg.meta?.fontTheme
          };
        } else if (ctx === 'themeColorTheme' && arg.value) {
          request = {
            kind: 'colorTheme',
            id: arg.value,
            label,
            description,
            colorTheme: arg.value
          };
        } else if (ctx === 'themeFontTheme' && arg.value) {
          request = {
            kind: 'fontTheme',
            id: arg.value,
            label,
            description,
            fontTheme: arg.value
          };
        }
      }

      if (request && previewProvider) {
        await vscode.commands.executeCommand(`${PreviewViewProvider.viewType}.focus`);
        await previewProvider.showPreview(request);
      }
    }
  );
}

type PreviewTreeArgument = {
  item?: {
    id?: string;
    label?: string;
    description?: string;
    snippet?: string;
    canonicalName?: string;
    details?: PreviewDetails;
  };
  label?: string | vscode.TreeItemLabel;
  description?: string | boolean;
  contextValue?: string;
  kind?: string;
  value?: string;
  meta?: { colorTheme?: string; fontTheme?: string };
};

function treeItemText(label: string | vscode.TreeItemLabel | undefined): string | undefined {
  if (typeof label === 'string') return label;
  return label?.label;
}
