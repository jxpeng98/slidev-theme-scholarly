import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import {
  LAYOUT_NAMES,
  COLOR_THEME_IDS as COLOR_THEMES,
  FONT_THEME_IDS as FONT_THEMES
} from './sharedData';

type SnippetDefinition = {
  name: string;
  prefixes: string[];
  body: string;
  description: string;
};

// LAYOUT_NAMES, COLOR_THEMES, FONT_THEMES imported from ./sharedData

const BIB_STYLES = ['apa', 'harvard1', 'vancouver', 'ieee', 'mla', 'chicago-author-date'];

const LEGACY_COMPONENT_SNIPPETS: Array<{
  name: string;
  description: string;
  insertBody: string;
}> = [
    {
      name: 'Block',
      description: 'Beamer-style information block',
      insertBody: 'Block type="${1|info,default,success,warning,danger,example|}" title="${2:Block Title}">\n${3:Block content}\n</Block>'
    },
    {
      name: 'Theorem',
      description: 'Theorem/lemma/definition container',
      insertBody: 'Theorem type="${1|theorem,lemma,definition,corollary,claim,example,proof,note|}" title="${2:Theorem Title}">\n${3:Statement}\n</Theorem>'
    },
    {
      name: 'Highlight',
      description: 'Inline highlight',
      insertBody: 'Highlight type="${1|primary,success,warning,danger,info|}">${2:highlighted text}</Highlight>'
    },
    {
      name: 'Cite',
      description: 'Citation helper component',
      insertBody: 'Cite :inline="${1|true,false|}">\n${2:Citation text}\n</Cite>'
    },
    {
      name: 'Steps',
      description: 'Step-by-step process',
      insertBody: 'Steps :steps="[\n  { title: \'${1:Step 1}\', description: \'${2:Description 1}\' },\n  { title: \'${3:Step 2}\', description: \'${4:Description 2}\' }\n]" :activeStep="${5:1}" />'
    },
    {
      name: 'Columns',
      description: 'Multi-column container',
      insertBody: 'Columns :columns="${1:2}" :gap="${2:2}">\n${3:Column 1}\n\n<template #col2>\n\n${4:Column 2}\n\n</template>\n\n</Columns>'
    },
    {
      name: 'Keywords',
      description: 'Keyword tags',
      insertBody: 'Keywords :keywords="[\'${1:Keyword 1}\', \'${2:Keyword 2}\']" />'
    },
    {
      name: 'ThemePreview',
      description: 'Preview a theme color set',
      insertBody: 'ThemePreview colorTheme="${1|classic-blue,oxford-burgundy,cambridge-green,yale-blue,princeton-orange,nordic-blue,warm-sepia,monochrome,high-contrast|}">\n${2:Preview content}\n</ThemePreview>'
    }
  ];

const LEGACY_DIRECTIVE_SNIPPETS: Array<{
  name: string;
  description: string;
  insertBody: string;
}> = [
    {
      name: 'block',
      description: 'Block directive',
      insertBody: 'block{type="${1|info,default,success,warning,danger,example|}" title="${2:Block Title}"}\n${3:Block content}\n:::'
    },
    {
      name: 'theorem',
      description: 'Theorem directive',
      insertBody: 'theorem{type="${1|theorem,lemma,definition,corollary,claim,example,proof,note|}" title="${2:Theorem Title}"}\n${3:Statement}\n:::'
    },
    {
      name: 'highlight',
      description: 'Highlight directive',
      insertBody: 'highlight{type="${1|primary,success,warning,danger,info|}"}\n${2:highlighted text}\n:::'
    },
    {
      name: 'cite',
      description: 'Cite directive',
      insertBody: 'cite{:inline="${1|true,false|}"}\n${2:Citation text}\n:::'
    },
    {
      name: 'steps',
      description: 'Steps directive',
      insertBody: 'steps{:steps=\'[\n  { title: "${1:Step 1}", description: "${2:Description 1}" },\n  { title: "${3:Step 2}", description: "${4:Description 2}" }\n]\' :activeStep="${5:1}"}\n:::'
    },
    {
      name: 'columns',
      description: 'Columns directive',
      insertBody: 'columns{columns="${1|2,3,4|}" gap="${2:2rem}" ratio="${3:1:1}"}\n${4:Column 1}\n\n+++\n\n${5:Column 2}\n:::'
    },
    {
      name: 'keywords',
      description: 'Keywords directive',
      insertBody: 'keywords{:keywords=\'["${1:Keyword 1}", "${2:Keyword 2}"]\' color="${3|primary,blue,green,purple,gray|}"}\n:::'
    }
  ];

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
      items.push(...createValueItems(LAYOUT_NAMES, partial, range, 'Scholarly layout'));
    }

    const colorThemeMatch = linePrefix.match(/\bcolorTheme:\s*([a-z-]*)$/);
    if (colorThemeMatch) {
      const partial = colorThemeMatch[1] ?? '';
      const range = asRange(position, linePrefix.length - partial.length);
      items.push(...createValueItems(COLOR_THEMES, partial, range, 'Scholarly color theme'));
    }

    const fontThemeMatch = linePrefix.match(/\bfontTheme:\s*([a-z-]*)$/);
    if (fontThemeMatch) {
      const partial = fontThemeMatch[1] ?? '';
      const range = asRange(position, linePrefix.length - partial.length);
      items.push(...createValueItems(FONT_THEMES, partial, range, 'Scholarly font theme'));
    }

    const colorModeMatch = linePrefix.match(/\bcolorMode:\s*([a-z-]*)$/);
    if (colorModeMatch) {
      const partial = colorModeMatch[1] ?? '';
      const range = asRange(position, linePrefix.length - partial.length);
      items.push(...createValueItems(['dark', 'light'], partial, range, 'Scholarly color mode'));
    }

    const themeMatch = linePrefix.match(/\btheme:\s*([a-z-]*)$/);
    if (themeMatch) {
      const partial = themeMatch[1] ?? '';
      const range = asRange(position, linePrefix.length - partial.length);
      items.push(...createValueItems(['scholarly'], partial, range, 'Slidev theme'));
    }

    const bibStyleMatch = linePrefix.match(/\bbibStyle:\s*([a-z-]*)$/);
    if (bibStyleMatch) {
      const partial = bibStyleMatch[1] ?? '';
      const range = asRange(position, linePrefix.length - partial.length);
      items.push(...createValueItems(BIB_STYLES, partial, range, 'Bibliography style'));
    }

    const bibShowNumMatch = linePrefix.match(/\bbibShowNum:\s*([a-z]*)$/);
    if (bibShowNumMatch) {
      const partial = bibShowNumMatch[1] ?? '';
      const range = asRange(position, linePrefix.length - partial.length);
      items.push(...createValueItems(['true', 'false'], partial, range, 'Show numbered bibliography markers'));
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
        item.detail = component.description;
        item.documentation = new vscode.MarkdownString(
          `Scholarly component: \`<${component.name}>\``
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
        item.detail = directive.description;
        item.documentation = new vscode.MarkdownString(
          `Scholarly directive: \`:::${directive.name}\``
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
        item.detail = def.description;
        item.documentation = new vscode.MarkdownString(
          `**${def.name}**\n\nAliases: ${def.prefixes.join(', ')}`
        );
        items.push(item);
      }
    }

    return items;
  }
}
