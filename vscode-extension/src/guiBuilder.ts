import * as vscode from 'vscode';
import { parseBuilderConfigSource, renderBuilderMarkdown, renderBuilderSlides, type BuilderDeckState } from './guiBuilderModel';
import { renderGuiBuilderHtml, type GuiBuilderLayoutOption } from './guiBuilderView';
import { layouts } from './providers';
import { BUILDER_TEMPLATES, COLOR_THEMES, CONTENT_MODES, FONT_THEMES, SURFACE_MODES } from './sharedData';
import { isChineseUi, localizeDetail, t } from './localization';

type BuilderMessage = {
  type?: 'generateNewDocument' | 'insertSelectedSlide' | 'previewSelectedSlide';
  state?: BuilderDeckState;
};

let currentPanel: vscode.WebviewPanel | undefined;
let insertionTarget: vscode.TextEditor | undefined;

export function openGuiBuilder(context: vscode.ExtensionContext): void {
  if (vscode.window.activeTextEditor || !currentPanel)
    insertionTarget = vscode.window.activeTextEditor;
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
  const editorChanges = vscode.window.onDidChangeActiveTextEditor(editor => {
    // A Webview clears activeTextEditor. Keep the last explicit target, including
    // non-Markdown editors so they cannot silently fall back to an older file.
    if (editor) insertionTarget = editor;
  });
  const documentClosures = vscode.workspace.onDidCloseTextDocument(document => {
    if (insertionTarget?.document === document) insertionTarget = undefined;
  });
  panel.onDidDispose(() => {
    currentPanel = undefined;
    insertionTarget = undefined;
    editorChanges.dispose();
    documentClosures.dispose();
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
    ).toString(),
    validationScriptUri: panel.webview.asWebviewUri(
      vscode.Uri.joinPath(context.extensionUri, 'out', 'guiBuilderValidation.js')
    ).toString()
  });

  panel.webview.onDidReceiveMessage(
    message => handleBuilderMessage(panel, message),
    undefined,
    context.subscriptions
  );
}

async function handleBuilderMessage(panel: vscode.WebviewPanel, message: BuilderMessage): Promise<void> {
  if (!message?.type || !message.state) return;
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
      if (typeof message.state.title !== 'string' || !message.state.title.trim())
        throw new Error(t('Add a presentation title before creating Markdown.'));
      if (!Array.isArray(message.state.slides) || !message.state.slides.length)
        throw new Error(t('Add at least one slide before creating Markdown.'));
      const document = await vscode.workspace.openTextDocument({
        language: 'markdown',
        content: renderBuilderMarkdown(message.state)
      });
      await vscode.window.showTextDocument(document);
      const bibFile = parseBuilderConfigSource(message.state.frontmatterSource || '').bibFile;
      if (typeof bibFile === 'string' && bibFile.trim()) {
        const template = BUILDER_TEMPLATES.find(item => item.id === message.state?.templateId);
        const action = t('Create template project');
        const selected = await vscode.window.showInformationMessage(
          t('This outline needs {0} beside the saved Markdown. Create a complete template project, then save this outline into it.', bibFile),
          ...(template ? [action] : [])
        );
        if (template && selected === action)
          await vscode.commands.executeCommand('slidev-scholarly.newPresentation', template.id);
      }
      return;
    }

    if (message.type === 'insertSelectedSlide') {
      const target = vscode.window.activeTextEditor || insertionTarget;
      if (!target || target.document.isClosed || target.document.languageId !== 'markdown') {
        vscode.window.showWarningMessage(t('Open a Markdown file before inserting a slide'));
        return;
      }

      const slide = message.state.slides?.[0];
      if (!slide) return;
      const selection = target.selection;
      const editor = await vscode.window.showTextDocument(target.document, {
        viewColumn: target.viewColumn,
        selection
      });
      const content = editor.document.getText();
      const markdown = content.trim()
        ? '\n\n' + renderBuilderSlides([slide], message.state.lang)
        : renderBuilderMarkdown({ lang: message.state.lang, slides: [slide] });
      const inserted = await editor.edit(editBuilder => {
        const end = editor.document.positionAt(content.length);
        if (content.trim()) editBuilder.insert(end, markdown);
        else editBuilder.replace(new vscode.Range(editor.document.positionAt(0), end), markdown);
      });
      if (!inserted) throw new Error(t('The slide could not be inserted. Try again in the target Markdown file.'));
    }
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    if (message.type === 'previewSelectedSlide') {
      await panel.webview.postMessage({ type: 'selectedSlidePreview', markdown: '', error: detail });
      return;
    }
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
