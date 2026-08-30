import * as vscode from 'vscode';
import { renderBuilderMarkdown, renderBuilderSlides, type BuilderDeckState } from './guiBuilderModel';
import { renderGuiBuilderHtml, type GuiBuilderLayoutOption } from './guiBuilderView';
import { layouts } from './providers';
import { BUILDER_TEMPLATES, COLOR_THEMES, CONTENT_MODES, FONT_THEMES, SURFACE_MODES } from './sharedData';
import { isChineseUi, localizeDetail, t } from './localization';

type BuilderMessage = {
  type?: 'generateNewDocument' | 'insertSelectedSlide' | 'previewSelectedSlide';
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
    t('Slidev Scholarly Deck Builder'),
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [
        vscode.Uri.joinPath(context.extensionUri, 'media'),
        vscode.Uri.joinPath(context.extensionUri, 'out')
      ]
    }
  );

  currentPanel = panel;
  panel.onDidDispose(() => {
    currentPanel = undefined;
  }, null, context.subscriptions);

  panel.webview.html = renderGuiBuilderHtml({
    nonce: getNonce(),
    cspSource: panel.webview.cspSource,
    language: isChineseUi() ? 'zh-cn' : 'en',
    layouts: getLayoutOptions(panel.webview, context.extensionUri),
    templates: BUILDER_TEMPLATES.map(template => ({
      ...template,
      label: t(template.label),
      description: localizeDetail(template.description, t('Ready-to-use presentation workflow'))
    })),
    colorThemes: COLOR_THEMES.map(theme => ({
      ...theme,
      label: t(theme.label),
      description: localizeDetail(theme.description, t('Color palette for the presentation'))
    })),
    fontThemes: FONT_THEMES.map(theme => ({
      ...theme,
      label: t(theme.label),
      description: localizeDetail(theme.description, t('Font pairing for the presentation'))
    })),
    contentModes: CONTENT_MODES.map(mode => ({ ...mode, label: t(mode.label) })),
    surfaceModes: SURFACE_MODES.map(mode => ({ ...mode, label: t(mode.label) })),
    styleUri: panel.webview.asWebviewUri(
      vscode.Uri.joinPath(context.extensionUri, 'media', 'gui-builder.css')
    ).toString(),
    scriptUri: panel.webview.asWebviewUri(
      vscode.Uri.joinPath(context.extensionUri, 'out', 'guiBuilderWebview.js')
    ).toString()
  });

  panel.webview.onDidReceiveMessage(
    message => handleBuilderMessage(panel, message),
    undefined,
    context.subscriptions
  );
}

async function handleBuilderMessage(panel: vscode.WebviewPanel, message: BuilderMessage): Promise<void> {
  if (!message.type || !message.state) return;
  try {
    if (message.type === 'previewSelectedSlide') {
      const slide = message.state.slides?.[0];
      await panel.webview.postMessage({
        type: 'selectedSlidePreview',
        markdown: slide ? renderBuilderSlides([slide], message.state.lang).trim() : ''
      });
      return;
    }

    if (message.type === 'generateNewDocument') {
      const document = await vscode.workspace.openTextDocument({
        language: 'markdown',
        content: renderBuilderMarkdown(message.state)
      });
      await vscode.window.showTextDocument(document);
      return;
    }

    if (message.type === 'insertSelectedSlide') {
      const editor = vscode.window.activeTextEditor;
      if (!editor || editor.document.languageId !== 'markdown') {
        vscode.window.showWarningMessage(t('Open a Markdown file before inserting a slide'));
        return;
      }

      const slide = message.state.slides?.[0];
      if (!slide) return;
      const markdown = renderBuilderSlides([slide], message.state.lang).trim();
      const offset = editor.document.offsetAt(editor.selection.active);
      const before = editor.document.getText().slice(0, offset).trimEnd();
      const after = editor.document.getText().slice(offset).trimStart();
      await editor.edit(editBuilder => {
        editBuilder.insert(
          editor.selection.active,
          `${before ? '\n\n' : ''}${markdown}${after ? '\n\n' : '\n'}`
        );
      });
    }
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(t('Deck Builder could not finish the action: {0}', detail));
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
