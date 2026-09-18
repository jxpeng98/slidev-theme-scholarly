import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import {
  LAYOUT_NAMES,
  COLOR_THEME_IDS as COLOR_THEMES,
  FONT_THEME_IDS as FONT_THEMES,
  CONTENT_MODE_IDS as CONTENT_MODES,
  SURFACE_MODE_IDS as SURFACE_MODES
} from './sharedData';
import { localizeDetail, t } from './localization';

type SnippetDefinition = {
  name: string;
  prefixes: string[];
  body: string;
  description: string;
};

// LAYOUT_NAMES, COLOR_THEMES, FONT_THEMES, CONTENT_MODES, SURFACE_MODES imported from ./sharedData

const BIB_STYLES = ['apa', 'harvard1', 'vancouver', 'ieee', 'mla', 'chicago-author-date'];

type SnippetCompletionDefinition = {
  name: string;
  description: string;
  insertBody: string;
};

function toBodyString(body: string | string[]): string {
  return Array.isArray(body) ? body.join('\n') : body;
}

function readSnippetDefinitions(filePath: string): SnippetDefinition[] {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, any>;
    const result: SnippetDefinition[] = [];

    for (const [name, value] of Object.entries(parsed)) {
      if (!value || typeof value !== 'object') continue;

      const rawPrefix = value.prefix;
      const rawBody = value.body;
      if (!rawPrefix || !rawBody) continue;

      const prefixes = Array.isArray(rawPrefix)
        ? rawPrefix.filter((entry: unknown): entry is string => typeof entry === 'string')
        : typeof rawPrefix === 'string'
          ? [rawPrefix]
          : [];

      if (prefixes.length === 0) continue;

      const body = toBodyString(rawBody);
      const description = typeof value.description === 'string' ? value.description : name;
      result.push({ name, prefixes, body, description });
    }

    return result;
  } catch (error) {
    console.error('Failed to parse snippet definition:', filePath, error);
    return [];
  }
}

function createComponentCompletions(definitions: SnippetDefinition[]): SnippetCompletionDefinition[] {
  const seen = new Set<string>();
  const completions: SnippetCompletionDefinition[] = [];

  for (const definition of definitions) {
    const body = definition.body.trim();
    const match = body.match(/^<([A-Z][A-Za-z0-9]*)\b/);
    if (!match || seen.has(match[1])) continue;

    seen.add(match[1]);
    completions.push({
      name: match[1],
      description: definition.description,
      insertBody: definition.body
    });
  }

  return completions;
}

function createDirectiveCompletions(definitions: SnippetDefinition[]): SnippetCompletionDefinition[] {
  const seen = new Set<string>();
  const completions: SnippetCompletionDefinition[] = [];

  for (const definition of definitions) {
    const body = definition.body.trim();
    const match = body.match(/^:::([a-z][a-z0-9-]*)\b/);
    if (!match || seen.has(match[1])) continue;

    seen.add(match[1]);
    completions.push({
      name: match[1],
      description: definition.description,
      insertBody: definition.body
    });
  }

  return completions;
}

function asRange(position: vscode.Position, startCharacter: number): vscode.Range {
  return new vscode.Range(position.line, startCharacter, position.line, position.character);
}

function createValueItems(
  values: string[],
  partial: string,
  range: vscode.Range,
  detail: string
): vscode.CompletionItem[] {
  const normalized = partial.toLowerCase();
  return values
    .filter(value => value.toLowerCase().startsWith(normalized))
    .map(value => {
      const item = new vscode.CompletionItem(value, vscode.CompletionItemKind.EnumMember);
      item.range = range;
      item.insertText = value;
      item.detail = detail;
      return item;
    });
}

export class ScholarlyCompletionProvider implements vscode.CompletionItemProvider {
  private readonly snippets: SnippetDefinition[];
  private readonly componentCompletions: SnippetCompletionDefinition[];
  private readonly directiveCompletions: SnippetCompletionDefinition[];

  constructor(extensionUri: vscode.Uri) {
    const snippetDir = path.join(extensionUri.fsPath, 'snippets');
    const layoutDefinitions = readSnippetDefinitions(path.join(snippetDir, 'layouts.json'));
    const componentDefinitions = readSnippetDefinitions(path.join(snippetDir, 'components.json'));
    this.snippets = [
      ...layoutDefinitions,
      ...componentDefinitions
    ];
    this.componentCompletions = createComponentCompletions(componentDefinitions);
    this.directiveCompletions = createDirectiveCompletions(componentDefinitions);
  }

  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position
  ): vscode.CompletionItem[] {
    const linePrefix = document.lineAt(position).text.slice(0, position.character);
    const items: vscode.CompletionItem[] = [];

    const layoutMatch = linePrefix.match(/\blayout:\s*([a-z-]*)$/);
    if (layoutMatch) {
      const partial = layoutMatch[1] ?? '';
      const range = asRange(position, linePrefix.length - partial.length);
      items.push(...createValueItems(LAYOUT_NAMES, partial, range, t('Scholarly layout')));
    }

    const colorThemeMatch = linePrefix.match(/\bcolorTheme:\s*([a-z-]*)$/);
    if (colorThemeMatch) {
      const partial = colorThemeMatch[1] ?? '';
      const range = asRange(position, linePrefix.length - partial.length);
      items.push(...createValueItems(COLOR_THEMES, partial, range, t('Scholarly color theme')));
    }

    const fontThemeMatch = linePrefix.match(/\bfontTheme:\s*([a-z-]*)$/);
    if (fontThemeMatch) {
      const partial = fontThemeMatch[1] ?? '';
      const range = asRange(position, linePrefix.length - partial.length);
      items.push(...createValueItems(FONT_THEMES, partial, range, t('Scholarly font theme')));
    }

    const colorModeMatch = linePrefix.match(/\bcolorMode:\s*([a-z-]*)$/);
    if (colorModeMatch) {
      const partial = colorModeMatch[1] ?? '';
      const range = asRange(position, linePrefix.length - partial.length);
      items.push(...createValueItems(CONTENT_MODES, partial, range, t('Legacy Scholarly color mode')));
    }

    const contentModeMatch = linePrefix.match(/\bcontentMode:\s*([a-z-]*)$/);
    if (contentModeMatch) {
      const partial = contentModeMatch[1] ?? '';
      const range = asRange(position, linePrefix.length - partial.length);
      items.push(...createValueItems(CONTENT_MODES, partial, range, t('Scholarly content mode')));
    }

    const chromeModeMatch = linePrefix.match(/\bchromeMode:\s*([a-z-]*)$/);
    if (chromeModeMatch) {
      const partial = chromeModeMatch[1] ?? '';
      const range = asRange(position, linePrefix.length - partial.length);
      items.push(...createValueItems(SURFACE_MODES, partial, range, t('Scholarly header and footer mode')));
    }

    const sectionModeMatch = linePrefix.match(/\bsectionMode:\s*([a-z-]*)$/);
    if (sectionModeMatch) {
      const partial = sectionModeMatch[1] ?? '';
      const range = asRange(position, linePrefix.length - partial.length);
      items.push(...createValueItems(SURFACE_MODES, partial, range, t('Scholarly section mode')));
    }

    const themeMatch = linePrefix.match(/\btheme:\s*([a-z-]*)$/);
    if (themeMatch) {
      const partial = themeMatch[1] ?? '';
      const range = asRange(position, linePrefix.length - partial.length);
      items.push(...createValueItems(['scholarly'], partial, range, t('Slidev theme')));
    }

    const bibStyleMatch = linePrefix.match(/\bbibStyle:\s*([a-z-]*)$/);
    if (bibStyleMatch) {
      const partial = bibStyleMatch[1] ?? '';
      const range = asRange(position, linePrefix.length - partial.length);
      items.push(...createValueItems(BIB_STYLES, partial, range, t('Bibliography style')));
    }

    const bibShowNumMatch = linePrefix.match(/\bbibShowNum:\s*([a-z]*)$/);
    if (bibShowNumMatch) {
      const partial = bibShowNumMatch[1] ?? '';
      const range = asRange(position, linePrefix.length - partial.length);
      items.push(...createValueItems(['true', 'false'], partial, range, t('Show numbered bibliography markers')));
    }

    const componentMatch = linePrefix.match(/<([A-Za-z-]*)$/);
    if (componentMatch) {
      const partial = componentMatch[1] ?? '';
      const normalized = partial.toLowerCase();
      const range = asRange(position, linePrefix.length - partial.length);
      for (const component of this.componentCompletions) {
        if (!component.name.toLowerCase().startsWith(normalized)) continue;

        const item = new vscode.CompletionItem(component.name, vscode.CompletionItemKind.Class);
        item.range = range;
        item.insertText = new vscode.SnippetString(component.insertBody);
        item.detail = localizeDetail(component.description, t('{0} component', component.name));
        item.documentation = new vscode.MarkdownString(
          `${t('Scholarly component')}: \`<${component.name}>\``
        );
        items.push(item);
      }
    }

    const directiveMatch = linePrefix.match(/:::\s*([a-z-]*)$/);
    if (directiveMatch) {
      const partial = directiveMatch[1] ?? '';
      const normalized = partial.toLowerCase();
      const range = asRange(position, linePrefix.length - partial.length);
      for (const directive of this.directiveCompletions) {
        if (!directive.name.startsWith(normalized)) continue;

        const item = new vscode.CompletionItem(directive.name, vscode.CompletionItemKind.Snippet);
        item.range = range;
        item.insertText = new vscode.SnippetString(directive.insertBody);
        item.detail = localizeDetail(directive.description, t('{0} directive', directive.name));
        item.documentation = new vscode.MarkdownString(
          `${t('Scholarly directive')}: \`:::${directive.name}\``
        );
        items.push(item);
      }
    }

    const tokenMatch = linePrefix.match(/([!@A-Za-z0-9._:-]+)$/);
    const token = tokenMatch?.[1] ?? '';
    const normalizedToken = token.toLowerCase();
    const shouldSuggestSnippetPrefixes = normalizedToken.startsWith('scholarly')
      || normalizedToken.startsWith('@cite')
      || normalizedToken.startsWith('!@cite');

    if (token && shouldSuggestSnippetPrefixes) {
      const range = asRange(position, linePrefix.length - token.length);
      const matches = this.snippets.filter(def =>
        def.prefixes.some(prefix => prefix.toLowerCase().startsWith(normalizedToken))
      );

      for (const def of matches) {
        const preferredPrefix = def.prefixes.find(prefix =>
          prefix.toLowerCase().startsWith(normalizedToken)
        ) ?? def.prefixes[0];

        const item = new vscode.CompletionItem(preferredPrefix, vscode.CompletionItemKind.Snippet);
        item.range = range;
        item.insertText = new vscode.SnippetString(def.body);
        item.detail = localizeDetail(def.description, t('{0} snippet', def.name));
        item.documentation = new vscode.MarkdownString(
          `**${def.name}**\n\n${t('Aliases')}: ${def.prefixes.join(', ')}`
        );
        items.push(item);
      }
    }

    return items;
  }
}
