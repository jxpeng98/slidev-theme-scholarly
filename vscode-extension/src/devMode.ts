import * as vscode from 'vscode';
import { t } from './localization';

type CompletionResult =
  | vscode.CompletionItem[]
  | vscode.CompletionList<vscode.CompletionItem>
  | undefined
  | null;

function nowNs(): bigint {
  return process.hrtime.bigint();
}

function nsToMs(ns: bigint): number {
  return Number(ns) / 1_000_000;
}

function countCompletionItems(result: CompletionResult): number {
  if (!result) return 0;
  if (Array.isArray(result)) return result.length;
  return result.items.length;
}

export class DevModeController implements vscode.Disposable {
  private _enabled = false;
  private _slowThresholdMs = 25;
  private statusBar?: vscode.StatusBarItem;

  constructor(private readonly output: vscode.OutputChannel) {
    this.reload();
  }

  get enabled(): boolean {
    return this._enabled;
  }

  get slowThresholdMs(): number {
    return this._slowThresholdMs;
  }

  reload(): void {
    const config = vscode.workspace.getConfiguration('slidevScholarly');
    const fromSetting = config.get<boolean>('devMode.enabled', false);
    const fromEnv = process.env.SCHOLARLY_DEV_MODE === '1';
    this._enabled = Boolean(fromSetting || fromEnv);

    const configuredThreshold = config.get<number>('devMode.slowThresholdMs', 25);
    this._slowThresholdMs = Number.isFinite(configuredThreshold) && configuredThreshold > 0
      ? configuredThreshold
      : 25;

    this.updateStatusBar();
  }

  log(message: string): void {
    if (!this._enabled) return;
    this.output.appendLine(`[DEV] ${message}`);
  }

  logDuration(label: string, elapsedMs: number, details?: string): void {
    if (!this._enabled) return;
    const level = elapsedMs >= this._slowThresholdMs ? 'SLOW' : 'PERF';
    const suffix = details ? ` | ${details}` : '';
    this.output.appendLine(`[${level}] ${label}: ${elapsedMs.toFixed(2)}ms${suffix}`);
  }

  measureSync<T>(label: string, fn: () => T, detail?: () => string): T {
    const started = nowNs();
    try {
      return fn();
    } finally {
      const elapsedMs = nsToMs(nowNs() - started);
      this.logDuration(label, elapsedMs, detail?.());
    }
  }

  async measureAsync<T>(
    label: string,
    fn: () => Promise<T> | T,
    detail?: (result?: T, error?: unknown) => string
  ): Promise<T> {
    const started = nowNs();
    try {
      const result = await fn();
      const elapsedMs = nsToMs(nowNs() - started);
      this.logDuration(label, elapsedMs, detail?.(result, undefined));
      return result;
    } catch (error) {
      const elapsedMs = nsToMs(nowNs() - started);
      this.logDuration(label, elapsedMs, detail?.(undefined, error));
      throw error;
    }
  }

  wrapCompletionProvider(
    label: string,
    delegate: vscode.CompletionItemProvider
  ): vscode.CompletionItemProvider {
    return {
      provideCompletionItems: async (
        document,
        position,
        token,
        context
      ): Promise<CompletionResult> => {
        const file = vscode.workspace.asRelativePath(document.uri, false);
        return this.measureAsync(
          `${label}.provideCompletionItems`,
          async () => delegate.provideCompletionItems?.(document, position, token, context),
          (result, error) => {
            if (error) {
              const message = error instanceof Error ? error.message : String(error);
              return `${file}:${position.line + 1}:${position.character + 1} | error=${message}`;
            }

            const count = countCompletionItems(result as CompletionResult);
            return `${file}:${position.line + 1}:${position.character + 1} | items=${count}`;
          }
        );
      },
      resolveCompletionItem: delegate.resolveCompletionItem
        ? (item, token) => delegate.resolveCompletionItem!(item, token)
        : undefined
    };
  }

  private updateStatusBar(): void {
    if (this._enabled) {
      if (!this.statusBar) {
        this.statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 90);
        this.statusBar.command = 'slidev-scholarly.toggleDevMode';
      }

      this.statusBar.text = `$(pulse) ${t('Scholarly Dev')}`;
      this.statusBar.tooltip = `${t('Slidev Scholarly dev mode is on')}\n${t('Slow threshold: {0}ms', this._slowThresholdMs)}`;
      this.statusBar.show();
      return;
    }

    if (this.statusBar) {
      this.statusBar.hide();
      this.statusBar.dispose();
      this.statusBar = undefined;
    }
  }

  dispose(): void {
    if (this.statusBar) {
      this.statusBar.dispose();
      this.statusBar = undefined;
    }
  }
}
