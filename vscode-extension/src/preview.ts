import * as vscode from 'vscode';
import {
  COLOR_THEME_PREVIEW_DIRS,
  COMPONENT_PREVIEW_FILES
} from './sharedData';

export type PreviewKind = 'layout' | 'component' | 'colorTheme' | 'fontTheme' | 'preset';

export interface PreviewRequest {
  kind: PreviewKind;
  id: string;
  label?: string;
  description?: string;
  snippet?: string;
  colorTheme?: string;
  fontTheme?: string;
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
  'Note': 'theorem',
  'Highlight (Vue)': 'highlight',
  'Highlight (Syntax Sugar)': 'highlight',
  'Cite (Vue)': 'cite',
  'Cite (Syntax Sugar)': 'cite',
  'Steps': 'steps',
  'Steps (Syntax Sugar)': 'steps',
  'Columns': 'columns',
  'Columns (Syntax Sugar)': 'columns',
  'Keywords': 'keywords',
  'Keywords (Syntax Sugar)': 'keywords',
  'ThemePreview': 'theme-preview'
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

    // Show welcome message initially
    this.showWelcome();
  }

  public async showPreview(request: PreviewRequest): Promise<void> {
    this.currentRequest = request;

    if (!this.view) {
      // View not yet resolved, will be shown when resolved
      return;
    }

    // Make sure the view is visible
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

    const csp = this.view.webview.cspSource;
    this.view.webview.html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline';" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    :root { color-scheme: light dark; }
    body { margin: 0; padding: 16px; font-family: var(--vscode-font-family, system-ui); }
    .welcome { opacity: 0.7; text-align: center; padding: 24px 12px; }
    .welcome h3 { margin: 0 0 8px; font-size: 14px; }
    .welcome p { margin: 0; font-size: 12px; }
  </style>
</head>
<body>
  <div class="welcome">
    <h3>Preview</h3>
    <p>Click the 👁 icon on any layout or theme to preview it here.</p>
  </div>
</body>
</html>`;
  }

  private getTitle(request: PreviewRequest): string {
    const name = request.label || request.id;
    switch (request.kind) {
      case 'layout': return `Layout: ${name}`;
      case 'component': return `Component: ${name}`;
      case 'preset': return `Preset: ${name}`;
      case 'colorTheme': return `Color Theme: ${name}`;
      case 'fontTheme': return `Font Theme: ${name}`;
    }
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
      const file = getComponentPreviewFile(request.label || request.id);
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

    const meta: string[] = [];
    if (request.colorTheme) meta.push(`colorTheme: ${escapeHtml(request.colorTheme)}`);
    if (request.fontTheme) meta.push(`fontTheme: ${escapeHtml(request.fontTheme)}`);
    const metaHtml = meta.length
      ? `<div class="meta">${meta.map(m => `<span class="pill">${m}</span>`).join('')}</div>`
      : '';

    let gallery: string;
    if (images.length === 0) {
      gallery = '<div class="empty">No preview images available.</div>';
    } else if (images.length === 1) {
      gallery = `<div class="single"><img src="${images[0]}" alt="Preview of ${escapeHtml(title)}" /></div>`;
    } else {
      gallery = `<div class="grid">${images.map((src, i) => `<img src="${src}" alt="Preview ${i + 1} of ${escapeHtml(title)}" />`).join('')}</div>`;
    }

    const snippetHtml = snippet
      ? `<h2>Usage</h2><pre><code>${snippet}</code></pre>`
      : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${csp} data:; style-src 'unsafe-inline';" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <style>
    :root { color-scheme: light dark; }
    body { margin: 0; padding: 12px; font-family: var(--vscode-font-family, system-ui); }
    h1 { font-size: 14px; margin: 0 0 6px; }
    h2 { font-size: 12px; margin: 12px 0 6px; }
    .desc { opacity: 0.85; margin: 0 0 10px; font-size: 12px; }
    .meta { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px; }
    .pill { border: 1px solid var(--vscode-editorWidget-border, #ccc); border-radius: 10px; padding: 2px 8px; font-size: 11px; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
    .single { max-width: 100%; }
    img { width: 100%; height: auto; border-radius: 4px; border: 1px solid var(--vscode-editorWidget-border, #ccc); cursor: pointer; }
    img:hover { opacity: 0.9; }
    pre { margin: 0; padding: 10px; border-radius: 4px; background: var(--vscode-editor-background, #1e1e1e); border: 1px solid var(--vscode-editorWidget-border, #ccc); overflow: auto; max-height: 150px; }
    code { font-family: var(--vscode-editor-font-family, monospace); font-size: 11px; white-space: pre-wrap; }
    .empty { opacity: 0.7; padding: 16px; text-align: center; border: 1px dashed var(--vscode-editorWidget-border, #ccc); border-radius: 4px; font-size: 12px; }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  ${desc ? `<p class="desc">${desc}</p>` : ''}
  ${metaHtml}
  ${gallery}
  ${snippetHtml}
</body>
</html>`;
  }
}

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
    (arg?: PreviewRequest | { item?: { label?: string; description?: string; snippet?: string }; contextValue?: string; kind?: string; value?: string; meta?: { colorTheme?: string; fontTheme?: string } }) => {
      if (!arg) return;

      let request: PreviewRequest | undefined;

      // Direct PreviewRequest
      if ('kind' in arg && 'id' in arg && typeof arg.id === 'string') {
        request = arg as PreviewRequest;
      }
      // TreeItem with contextValue
      else if ('contextValue' in arg) {
        const ctx = arg.contextValue;
        if (ctx === 'layoutSnippet' && arg.item) {
          request = {
            kind: 'layout',
            id: arg.item.label || '',
            label: arg.item.label,
            description: arg.item.description,
            snippet: arg.item.snippet
          };
        } else if (ctx === 'componentSnippet' && arg.item) {
          request = {
            kind: 'component',
            id: arg.item.label || '',
            label: arg.item.label,
            description: arg.item.description,
            snippet: arg.item.snippet
          };
        } else if (ctx === 'themePreset' && arg.value) {
          request = {
            kind: 'preset',
            id: arg.value,
            label: arg.item?.label,
            description: arg.item?.description,
            colorTheme: arg.meta?.colorTheme,
            fontTheme: arg.meta?.fontTheme
          };
        } else if (ctx === 'themeColorTheme' && arg.value) {
          request = {
            kind: 'colorTheme',
            id: arg.value,
            label: arg.item?.label,
            description: arg.item?.description
          };
        } else if (ctx === 'themeFontTheme' && arg.value) {
          request = {
            kind: 'fontTheme',
            id: arg.value,
            label: arg.item?.label,
            description: arg.item?.description
          };
        }
      }

      if (request && previewProvider) {
        void previewProvider.showPreview(request);
      }
    }
  );
}
