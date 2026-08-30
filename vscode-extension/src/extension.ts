import * as vscode from 'vscode';
import { LayoutsProvider, ComponentsProvider, TemplatesProvider, ThemesProvider, CliProvider } from './providers';
import {
  insertSnippet,
  createNewPresentation,
  setColorTheme,
  setFontTheme,
  setContentMode,
  setChromeMode,
  setSectionMode,
  setColorMode,
  applyThemePreset,
  runCliAction,
  openCliActionMenu,
  insertInternalAnchor,
  insertAnchorReference,
  insertPaperSummary
} from './commands';
import { AnchorCompletionProvider, BibCompletionProvider, BibHoverProvider, BibTreeProvider } from './bibtex';
import { registerCitationDiagnostics } from './citationDiagnostics';
import { registerPreviewCommand, registerPreviewView } from './preview';
import { ScholarlyCompletionProvider } from './snippetCompletion';
import { DevModeController } from './devMode';
import { openGuiBuilder } from './guiBuilder';
import { t } from './localization';

export function activate(context: vscode.ExtensionContext) {
  const activationStarted = process.hrtime.bigint();
  console.log('Slidev Scholarly Snippets is now active!');

  const output = vscode.window.createOutputChannel('Slidev Scholarly');
  context.subscriptions.push(output);
  const devMode = new DevModeController(output);
  context.subscriptions.push(devMode);

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (!event.affectsConfiguration('slidevScholarly.devMode')) return;
      devMode.reload();
      vscode.window.showInformationMessage(
        devMode.enabled
          ? t('Slidev Scholarly dev mode is on')
          : t('Slidev Scholarly dev mode is off')
      );
    })
  );
  devMode.log(`Dev mode enabled (slow threshold: ${devMode.slowThresholdMs}ms)`);

  const registerTree = <T>(viewId: string, provider: vscode.TreeDataProvider<T>) => {
    try {
      context.subscriptions.push(vscode.window.registerTreeDataProvider(viewId, provider));
      output.appendLine(`Registered tree view: ${viewId}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      output.appendLine(`Failed to register tree view "${viewId}": ${message}`);
      vscode.window.showErrorMessage(
        t('Slidev Scholarly could not find the view "{0}". Reinstall the VSIX, then reload VS Code.', viewId)
      );
    }
  };

  // Register Tree View Providers
  const layoutsProvider = new LayoutsProvider(context.extensionUri);
  const componentsProvider = new ComponentsProvider(context.extensionUri);
  const templatesProvider = new TemplatesProvider();
  const themesProvider = new ThemesProvider(context.extensionUri);
  const cliProvider = new CliProvider();
  const bibTreeProvider = new BibTreeProvider();

  registerTree('scholarly-layouts', layoutsProvider);
  registerTree('scholarly-components', componentsProvider);
  registerTree('scholarly-templates', templatesProvider);
  registerTree('scholarly-themes', themesProvider);
  registerTree('scholarly-cli', cliProvider);
  registerTree('scholarly-references', bibTreeProvider);

  let referenceRefreshTimer: NodeJS.Timeout | undefined;
  const scheduleReferenceRefresh = () => {
    if (referenceRefreshTimer)
      clearTimeout(referenceRefreshTimer);

    referenceRefreshTimer = setTimeout(() => {
      referenceRefreshTimer = undefined;
      bibTreeProvider.refresh();
    }, 120);
  };

  context.subscriptions.push({
    dispose: () => {
      if (referenceRefreshTimer)
        clearTimeout(referenceRefreshTimer);
    }
  });

  const bibWatcher = vscode.workspace.createFileSystemWatcher('**/*.bib');
  context.subscriptions.push(
    bibWatcher,
    bibWatcher.onDidCreate(() => bibTreeProvider.refresh()),
    bibWatcher.onDidChange(() => bibTreeProvider.refresh()),
    bibWatcher.onDidDelete(() => bibTreeProvider.refresh()),
    vscode.workspace.onDidChangeTextDocument((event) => {
      if (event.document.languageId === 'markdown')
        scheduleReferenceRefresh();
    }),
    vscode.workspace.onDidOpenTextDocument((document) => {
      if (document.languageId === 'markdown')
        scheduleReferenceRefresh();
    }),
    vscode.workspace.onDidSaveTextDocument((document) => {
      if (document.languageId === 'markdown')
        scheduleReferenceRefresh();
    }),
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor?.document.languageId === 'markdown')
        scheduleReferenceRefresh();
    })
  );

  // Register BibTeX completion and hover providers
  const markdownSelector: vscode.DocumentSelector = { language: 'markdown' };
  const bibCompletionProvider = devMode.wrapCompletionProvider(
    'bib',
    new BibCompletionProvider()
  );
  const scholarlyCompletionProvider = devMode.wrapCompletionProvider(
    'scholarly',
    new ScholarlyCompletionProvider(context.extensionUri)
  );
  const anchorCompletionProvider = devMode.wrapCompletionProvider(
    'anchor',
    new AnchorCompletionProvider()
  );

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      markdownSelector,
      bibCompletionProvider,
      '@' // Trigger on @
    )
  );

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      markdownSelector,
      scholarlyCompletionProvider,
      ':', '-', '<'
    )
  );

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      markdownSelector,
      anchorCompletionProvider,
      '#'
    )
  );

  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      markdownSelector,
      new BibHoverProvider()
    )
  );

  registerCitationDiagnostics(context, context.extensionUri, output);

  // Register Preview Command
  context.subscriptions.push(registerPreviewView(context));
  context.subscriptions.push(registerPreviewCommand(context));

  // Register Commands
  context.subscriptions.push(
    vscode.commands.registerCommand('slidev-scholarly.insertLayout', (item) => {
      if (!item?.snippet) {
        vscode.window.showWarningMessage(t('Choose a layout first'));
        return;
      }
      insertSnippet(item.snippet);
    }),
    vscode.commands.registerCommand('slidev-scholarly.insertComponent', (item) => {
      if (!item?.snippet) {
        vscode.window.showWarningMessage(t('Choose a component first'));
        return;
      }
      insertSnippet(item.snippet);
    }),
    vscode.commands.registerCommand('slidev-scholarly.newPresentation', (template?: string) =>
      createNewPresentation(template)
    ),
    vscode.commands.registerCommand('slidev-scholarly.insertCitation', () =>
      insertCitationDialog()
    ),
    vscode.commands.registerCommand('slidev-scholarly.insertInternalAnchor', () =>
      insertInternalAnchor()
    ),
    vscode.commands.registerCommand('slidev-scholarly.insertAnchorReference', () =>
      insertAnchorReference()
    ),
    vscode.commands.registerCommand('slidev-scholarly.insertPaperSummary', (item) =>
      insertPaperSummary(item)
    ),
    vscode.commands.registerCommand('slidev-scholarly.insertBibKey', (key: string) => {
      if (!key) {
        vscode.window.showWarningMessage(t('Choose a citation first'));
        return;
      }
      insertSnippet(`@${key}`);
    }),
    vscode.commands.registerCommand('slidev-scholarly.insertAnchorKey', (key: string) => {
      if (!key) {
        vscode.window.showWarningMessage(t('Choose an anchor first'));
        return;
      }
      insertSnippet(`#${key}`);
    }),
    vscode.commands.registerCommand('slidev-scholarly.setColorTheme', (value?: string) =>
      setColorTheme(value)
    ),
    vscode.commands.registerCommand('slidev-scholarly.setFontTheme', (value?: string) =>
      setFontTheme(value)
    ),
    vscode.commands.registerCommand('slidev-scholarly.setContentMode', (value?: 'light' | 'dark') =>
      setContentMode(value)
    ),
    vscode.commands.registerCommand('slidev-scholarly.setChromeMode', (value?: 'light' | 'dark' | 'match' | 'inverse') =>
      setChromeMode(value)
    ),
    vscode.commands.registerCommand('slidev-scholarly.setSectionMode', (value?: 'light' | 'dark' | 'match' | 'inverse') =>
      setSectionMode(value)
    ),
    vscode.commands.registerCommand('slidev-scholarly.setColorMode', (value?: 'light' | 'dark') =>
      setColorMode(value)
    ),
    vscode.commands.registerCommand('slidev-scholarly.openSidebar', async () => {
      await vscode.commands.executeCommand('workbench.view.extension.slidev-scholarly');
    }),
    vscode.commands.registerCommand('slidev-scholarly.openGuiBuilder', () =>
      openGuiBuilder(context)
    ),
    vscode.commands.registerCommand('slidev-scholarly.applyThemePreset', (preset?: any) =>
      applyThemePreset(preset)
    ),
    vscode.commands.registerCommand('slidev-scholarly.refreshReferences', () => {
      bibTreeProvider.refresh();
      vscode.window.showInformationMessage(t('References refreshed'));
    }),
    vscode.commands.registerCommand('slidev-scholarly.cliAction', (action) =>
      runCliAction(action)
    ),
    vscode.commands.registerCommand('slidev-scholarly.cliMenu', () =>
      openCliActionMenu()
    ),
    vscode.commands.registerCommand('slidev-scholarly.toggleDevMode', async () => {
      const config = vscode.workspace.getConfiguration('slidevScholarly');
      const current = config.get<boolean>('devMode.enabled', false);
      const target = vscode.workspace.workspaceFolders?.length
        ? vscode.ConfigurationTarget.Workspace
        : vscode.ConfigurationTarget.Global;

      await config.update('devMode.enabled', !current, target);
      devMode.reload();
      vscode.window.showInformationMessage(
        devMode.enabled
          ? t('Slidev Scholarly dev mode is on')
          : t('Slidev Scholarly dev mode is off')
      );
    })
  );

  const activationMs = Number(process.hrtime.bigint() - activationStarted) / 1_000_000;
  devMode.logDuration('extension.activate', activationMs, 'startup complete');
  if (devMode.enabled) {
    output.show(true);
    devMode.log('Output channel opened for performance diagnostics');
  }
}

async function insertCitationDialog() {
  const citeKey = await vscode.window.showInputBox({
    prompt: t('Enter a citation key, for example smith2023'),
    placeHolder: 'citekey'
  });

  if (citeKey) {
    const style = await vscode.window.showQuickPick(
      [
        { label: t('Parenthetical citation'), description: '@citekey', prefix: '@' },
        { label: t('Narrative citation'), description: '!@citekey', prefix: '!@' }
      ],
      { placeHolder: t('Choose a citation style') }
    );

    if (style) {
      insertSnippet(`${style.prefix}${citeKey}`);
    }
  }
}

export function deactivate() { }
