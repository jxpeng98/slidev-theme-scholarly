import * as vscode from 'vscode';

export function t(message: string, ...args: Array<string | number | boolean>): string {
  return vscode.l10n.t(message, ...args);
}

export function isChineseUi(): boolean {
  return vscode.env.language.toLowerCase().replace('_', '-') === 'zh-cn';
}

export function localizeDetail(message: string, fallback: string): string {
  if (!isChineseUi()) return message;
  return vscode.l10n.bundle?.[message] ?? fallback;
}
