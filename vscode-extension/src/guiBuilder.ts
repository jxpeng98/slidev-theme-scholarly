import * as vscode from 'vscode';
import { renderBuilderMarkdown, type BuilderDeckState } from './guiBuilderModel';
import { renderGuiBuilderHtml, type GuiBuilderLayoutOption } from './guiBuilderView';
import { layouts } from './providers';
import { COLOR_THEMES, CONTENT_MODES, FONT_THEMES, SURFACE_MODES } from './sharedData';

type BuilderMessage = {
  type?: 'generateNewDocument' | 'insertIntoEditor';
  state?: BuilderDeckState;
};

let currentPanel: vscode.WebviewPanel | undefined;

export function openGuiBuilder(context: vscode.ExtensionContext): void {
  if (currentPanel) {
    currentPanel.reveal(vscode.ViewColumn.One);
    return;
  }

  const panel = vscode.window.createWebviewPanel(
    'slidevScholarlyGuiBuilder',
    'Slidev Scholarly GUI Builder',
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')]
    }
  );

  currentPanel = panel;
  panel.onDidDispose(() => {
    currentPanel = undefined;
  }, null, context.subscriptions);

  panel.webview.html = renderGuiBuilderHtml({
    nonce: getNonce(),
    cspSource: panel.webview.cspSource,
    layouts: getLayoutOptions(panel.webview, context.extensionUri),
    colorThemes: COLOR_THEMES,
    fontThemes: FONT_THEMES,
    contentModes: CONTENT_MODES,
    surfaceModes: SURFACE_MODES
  });

  panel.webview.onDidReceiveMessage(
    message => handleBuilderMessage(message),
    undefined,
    context.subscriptions
  );
}

async function handleBuilderMessage(message: BuilderMessage): Promise<void> {
  if (!message.type || !message.state) return;

  const markdown = renderBuilderMarkdown(message.state);

  if (message.type === 'generateNewDocument') {
    const document = await vscode.workspace.openTextDocument({
      language: 'markdown',
      content: markdown
    });
    await vscode.window.showTextDocument(document);
    return;
  }

  if (message.type === 'insertIntoEditor') {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage('Open a Markdown file before inserting GUI Builder output');
      return;
    }

    await editor.edit(editBuilder => {
      editBuilder.insert(editor.selection.active, markdown);
    });
  }
}

function getLayoutOptions(webview: vscode.Webview, extensionUri: vscode.Uri): GuiBuilderLayoutOption[] {
  return layouts.map(layout => ({
    id: layout.id || layout.label,
    label: layout.label,
    description: layout.description,
    category: layout.category,
    image: webview.asWebviewUri(
      vscode.Uri.joinPath(
        extensionUri,
        'media',
        'previews',
        'layouts',
        `${layout.id || layout.label}.png`
      )
    ).toString(),
    useFor: layout.details?.useFor,
    features: layout.details?.features,
    tags: layout.details?.tags,
    config: layout.details?.config,
    slots: layout.details?.slots
  }));
}

function getNonce(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let nonce = '';
  for (let i = 0; i < 32; i += 1) {
    nonce += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return nonce;
}
