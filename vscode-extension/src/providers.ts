import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { getColorThemePreviewDir, getComponentPreviewFile } from './preview';
import type { CliActionId } from './commands';

export interface SnippetItem {
  label: string;
  description: string;
  snippet: string;
  icon?: string;
  category?: string;
}

function toMarkdownCodeBlock(snippet: string): string {
  return '```md\n' + snippet.trim() + '\n```';
}

const previewExistsCache = new Map<string, boolean>();

function hasPreview(extensionUri: vscode.Uri, ...segments: string[]): boolean {
  const absPath = path.join(extensionUri.fsPath, ...segments);
  const cached = previewExistsCache.get(absPath);
  if (cached !== undefined) return cached;
  const exists = fs.existsSync(absPath);
  previewExistsCache.set(absPath, exists);
  return exists;
}

function createLayoutTooltip(
  extensionUri: vscode.Uri,
  layoutId: string,
  description: string,
  snippet: string
): vscode.MarkdownString {
  const md = new vscode.MarkdownString('', true);
  md.baseUri = extensionUri;
  md.supportHtml = true;
  if (hasPreview(extensionUri, 'media', 'previews', 'layouts', `${layoutId}.png`)) {
    md.appendMarkdown(`![${layoutId}](./media/previews/layouts/${layoutId}.png)\n\n`);
  }
  md.appendMarkdown(`**${layoutId}** — ${description}\n\n`);
  md.appendMarkdown(toMarkdownCodeBlock(snippet));
  md.appendMarkdown('\n\n*Click 👁 for larger preview*');
  return md;
}

function createComponentTooltip(
  extensionUri: vscode.Uri,
  label: string,
  description: string,
  snippet: string
): vscode.MarkdownString {
  const md = new vscode.MarkdownString('', true);
  md.baseUri = extensionUri;
  md.supportHtml = true;
  const file = getComponentPreviewFile(label);
  if (file && hasPreview(extensionUri, 'media', 'previews', 'components', `${file}.png`)) {
    md.appendMarkdown(`![${label}](./media/previews/components/${file}.png)\n\n`);
  }
  md.appendMarkdown(`**${label}** — ${description}\n\n`);
  md.appendMarkdown(toMarkdownCodeBlock(snippet));
  md.appendMarkdown('\n\n*Click 👁 for larger preview*');
  return md;
}

function createThemeTooltip(
  extensionUri: vscode.Uri,
  label: string,
  description: string | undefined,
  colorTheme: string | undefined
): vscode.MarkdownString {
  const md = new vscode.MarkdownString('', true);
  md.baseUri = extensionUri;
  md.supportHtml = true;

  if (colorTheme) {
    const dir = getColorThemePreviewDir(colorTheme);
    if (dir && hasPreview(extensionUri, 'media', 'previews', 'themes', dir, '1.png')) {
      md.appendMarkdown(`![${label}](./media/previews/themes/${dir}/1.png)\n\n`);
    }
  }

  md.appendMarkdown(`**${label}**\n\n`);
  if (description) md.appendMarkdown(`${description}\n\n`);
  if (colorTheme) md.appendMarkdown(`\`colorTheme: ${colorTheme}\`\n\n`);
  md.appendMarkdown('*Click 👁 for full preview*');
  return md;
}

type SnippetDefinition = {
  name: string;
  prefixes: string[];
  body: string;
  description: string;
};

function toBodyString(body: string | string[]): string {
  return Array.isArray(body) ? body.join('\n') : body;
}

function readSnippetDefinitions(fileName: string): SnippetDefinition[] {
  const filePath = path.resolve(__dirname, '..', 'snippets', fileName);
  if (!fs.existsSync(filePath)) {
    return [];
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, any>;
    return Object.entries(parsed)
      .filter(([, value]) => value && typeof value === 'object' && value.prefix && value.body)
      .map(([name, value]) => ({
        name,
        prefixes: Array.isArray(value.prefix) ? value.prefix : [value.prefix],
        body: toBodyString(value.body),
        description: typeof value.description === 'string' ? value.description : name
      }));
  } catch {
    return [];
  }
}

function stripScholarlyPrefix(name: string): string {
  return name.replace(/^Slidev Scholarly:\s*/, '');
}

function stripCategoryPrefix(description: string): string {
  return description.replace(/^\[[^\]]+\]\s*/, '');
}

function findLayoutId(snippet: string): string | undefined {
  return snippet.match(/^layout:\s*([a-z0-9-]+)/m)?.[1];
}

function createLayoutSnippetItem(layoutId: string, definition?: SnippetDefinition): SnippetItem {
  return {
    label: layoutId,
    description: definition ? stripCategoryPrefix(definition.description) : `Insert ${layoutId} layout`,
    snippet: definition?.body ?? `---\nlayout: ${layoutId}\n---\n\n$0`
  };
}

function createComponentSnippetItem(definition: SnippetDefinition): SnippetItem {
  const label = stripScholarlyPrefix(definition.name);
  const baseName = label.replace(/\s+\(.+?\)$/, '');
  return {
    label,
    description: definition.description,
    icon: COMPONENT_NAMES.includes(baseName) ? 'symbol-method' : 'symbol-snippet',
    snippet: definition.body
  };
}

const layoutSnippetDefinitions = readSnippetDefinitions('layouts.json');
const layoutSnippetById = new Map(
  layoutSnippetDefinitions
    .map(definition => [findLayoutId(definition.body), definition] as const)
    .filter((entry): entry is [string, SnippetDefinition] => Boolean(entry[0]))
);

export const layoutCategories = Object.fromEntries(
  LAYOUT_GROUPS.map(group => [
    group.name,
    {
      label: group.label,
      description: group.description,
      icon: group.icon,
      layouts: group.items.map(id => createLayoutSnippetItem(id, layoutSnippetById.get(id)))
    }
  ])
);

export const layouts: SnippetItem[] = Object.entries(layoutCategories).flatMap(
  ([categoryKey, category]) =>
    category.layouts.map(layout => ({
      ...layout,
      category: categoryKey
    }))
);

export const components: SnippetItem[] = readSnippetDefinitions('components.json')
  .map(createComponentSnippetItem);

// Tree Item class
export class SnippetTreeItem extends vscode.TreeItem {
  constructor(
    public readonly item: SnippetItem,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(item.label, collapsibleState);
    this.tooltip = item.description;
    this.description = item.description;
    this.iconPath = new vscode.ThemeIcon('symbol-snippet');
    this.command = {
      command: 'slidev-scholarly.insertLayout',
      title: 'Insert',
      arguments: [{ snippet: item.snippet }]
    };
  }

  get snippet(): string {
    return this.item.snippet;
  }
}

// Layout Category Tree Item
class LayoutCategoryTreeItem extends vscode.TreeItem {
  constructor(
    public readonly categoryKey: string,
    public readonly categoryData: { label: string; description: string; icon: string }
  ) {
    super(categoryData.label, vscode.TreeItemCollapsibleState.Collapsed);
    this.description = categoryData.description;
    this.iconPath = new vscode.ThemeIcon(categoryData.icon);
    this.contextValue = 'layoutCategory';
  }
}

// Layouts Provider with categories
export class LayoutsProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  constructor(private readonly extensionUri: vscode.Uri) { }

  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
    if (!element) {
      // Return category groups
      return Promise.resolve(
        Object.entries(layoutCategories).map(
          ([key, category]) => new LayoutCategoryTreeItem(key, category)
        )
      );
    }

    if (element instanceof LayoutCategoryTreeItem) {
      // Return layouts in this category
      const category = layoutCategories[element.categoryKey as keyof typeof layoutCategories];
      return Promise.resolve(
        category.layouts.map(layout => {
          const item = new SnippetTreeItem(layout, vscode.TreeItemCollapsibleState.None);
          item.contextValue = 'layoutSnippet';
          item.tooltip = createLayoutTooltip(
            this.extensionUri,
            layout.label,
            layout.description,
            layout.snippet
          );
          item.command = {
            command: 'slidev-scholarly.insertLayout',
            title: 'Insert',
            arguments: [{ snippet: layout.snippet }]
          };
          return item;
        })
      );
    }

    return Promise.resolve([]);
  }
}

// Components Provider
export class ComponentsProvider implements vscode.TreeDataProvider<SnippetTreeItem> {
  constructor(private readonly extensionUri: vscode.Uri) { }

  getTreeItem(element: SnippetTreeItem): vscode.TreeItem {
    element.contextValue = 'componentSnippet';
    element.tooltip = createComponentTooltip(
      this.extensionUri,
      element.item.label,
      element.item.description,
      element.item.snippet
    );
    element.command = {
      command: 'slidev-scholarly.insertComponent',
      title: 'Insert',
      arguments: [{ snippet: element.snippet }]
    };
    return element;
  }

  getChildren(): Thenable<SnippetTreeItem[]> {
    return Promise.resolve(
      components.map(item => new SnippetTreeItem(item, vscode.TreeItemCollapsibleState.None))
    );
  }
}

// Templates Provider
export class TemplatesProvider implements vscode.TreeDataProvider<SnippetTreeItem> {
  getTreeItem(element: SnippetTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(): Thenable<SnippetTreeItem[]> {
    const items = TEMPLATES.map(template => {
      const item: SnippetItem = {
        label: template.label,
        description: template.description,
        icon: 'file-code',
        snippet: template.id
      };
      const treeItem = new SnippetTreeItem(item, vscode.TreeItemCollapsibleState.None);
      treeItem.command = {
        command: 'slidev-scholarly.newPresentation',
        title: 'Create',
        arguments: [item.snippet]
      };
      return treeItem;
    });

    return Promise.resolve(items);
  }
}

type ThemeGroupId = 'presets' | 'colorThemes' | 'fontThemes';

type ThemePresetItem = {
  id: string;
  label: string;
  description: string;
  colorTheme: string;
  fontTheme: string;
};

// Theme data imported from shared definitions (Single Source of Truth)
import {
  COLOR_THEMES_SIMPLE as COLOR_THEMES,
  FONT_THEMES_SIMPLE as FONT_THEMES,
  THEME_PRESETS,
  LAYOUT_GROUPS,
  COMPONENT_NAMES,
  TEMPLATES
} from './sharedData';

class ThemeGroupTreeItem extends vscode.TreeItem {
  constructor(
    public readonly groupId: ThemeGroupId,
    label: string
  ) {
    super(label, vscode.TreeItemCollapsibleState.Collapsed);
    this.iconPath = new vscode.ThemeIcon('symbol-folder');
  }
}

interface ThemeValueMeta {
  colorTheme?: string;
  fontTheme?: string;
}

class ThemeValueTreeItem extends vscode.TreeItem {
  public readonly meta?: ThemeValueMeta;

  constructor(
    public readonly kind: 'preset' | 'colorTheme' | 'fontTheme',
    public readonly value: string,
    label: string,
    description?: string,
    command?: vscode.Command,
    meta?: ThemeValueMeta
  ) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.description = description;
    this.iconPath = new vscode.ThemeIcon(
      kind === 'preset' ? 'paintcan' : kind === 'fontTheme' ? 'symbol-font' : 'symbol-color'
    );
    this.command = command;
    this.meta = meta;
    this.contextValue = kind === 'preset' ? 'themePreset' :
      kind === 'colorTheme' ? 'themeColorTheme' : 'themeFontTheme';
  }
}

export class ThemesProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  constructor(private readonly extensionUri: vscode.Uri) { }

  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
    if (!element) {
      return Promise.resolve([
        new ThemeGroupTreeItem('presets', 'Presets'),
        new ThemeGroupTreeItem('colorThemes', 'Color Themes'),
        new ThemeGroupTreeItem('fontThemes', 'Font Themes')
      ]);
    }

    if (element instanceof ThemeGroupTreeItem) {
      if (element.groupId === 'presets') {
        return Promise.resolve(
          THEME_PRESETS.map(preset => {
            const item = new ThemeValueTreeItem(
              'preset',
              preset.id,
              preset.label,
              preset.description,
              {
                command: 'slidev-scholarly.applyThemePreset',
                title: 'Apply Preset',
                arguments: [preset]
              },
              { colorTheme: preset.colorTheme, fontTheme: preset.fontTheme }
            );
            item.tooltip = createThemeTooltip(
              this.extensionUri,
              preset.label,
              preset.description,
              preset.colorTheme
            );
            return item;
          })
        );
      }

      if (element.groupId === 'colorThemes') {
        return Promise.resolve(
          COLOR_THEMES.map(theme => {
            const item = new ThemeValueTreeItem(
              'colorTheme',
              theme.value,
              theme.label,
              theme.value,
              {
                command: 'slidev-scholarly.setColorTheme',
                title: 'Set Color Theme',
                arguments: [theme.value]
              },
              { colorTheme: theme.value }
            );
            item.tooltip = createThemeTooltip(
              this.extensionUri,
              theme.label,
              theme.value,
              theme.value
            );
            return item;
          })
        );
      }

      if (element.groupId === 'fontThemes') {
        return Promise.resolve(
          FONT_THEMES.map(theme => {
            const item = new ThemeValueTreeItem(
              'fontTheme',
              theme.value,
              theme.label,
              theme.value,
              {
                command: 'slidev-scholarly.setFontTheme',
                title: 'Set Font Theme',
                arguments: [theme.value]
              },
              { fontTheme: theme.value }
            );
            item.tooltip = new vscode.MarkdownString(
              `**${theme.label}**\n\n\`fontTheme: ${theme.value}\``
            );
            return item;
          })
        );
      }
    }

    return Promise.resolve([]);
  }
}

type CliGroupId = 'create' | 'theme' | 'snippets' | 'tools';

type CliActionItem = {
  label: string;
  description: string;
  icon: string;
  action: CliActionId;
};

const CLI_GROUPS: Record<CliGroupId, { label: string; icon: string; items: CliActionItem[] }> = {
  create: {
    label: 'Create',
    icon: 'new-file',
    items: [
      {
        label: 'New Presentation...',
        description: 'Run scholarly init with prompts',
        icon: 'new-file',
        action: 'initPresentation'
      },
      {
        label: 'List Templates',
        description: 'Run scholarly template list',
        icon: 'list-flat',
        action: 'templateList'
      }
    ]
  },
  theme: {
    label: 'Theme',
    icon: 'paintcan',
    items: [
      {
        label: 'Apply Theme Preset...',
        description: 'Apply color/font preset to frontmatter',
        icon: 'wand',
        action: 'themeApply'
      },
      {
        label: 'Apply Theme Preset Combo...',
        description: 'Run scholarly theme preset apply',
        icon: 'paintcan',
        action: 'themePresetApply'
      },
      {
        label: 'List Themes',
        description: 'Run scholarly theme list',
        icon: 'symbol-color',
        action: 'themeList'
      },
      {
        label: 'List Theme Presets',
        description: 'Run scholarly theme preset list',
        icon: 'list-flat',
        action: 'themePresetList'
      },
      {
        label: 'List Layouts',
        description: 'Run scholarly layout list',
        icon: 'layout',
        action: 'layoutList'
      },
      {
        label: 'List Components',
        description: 'Run scholarly component list',
        icon: 'symbol-method',
        action: 'componentList'
      }
    ]
  },
  snippets: {
    label: 'Snippets',
    icon: 'symbol-snippet',
    items: [
      {
        label: 'Append Snippet...',
        description: 'Append theorem/methodology/etc to slides',
        icon: 'add',
        action: 'snippetAppend'
      },
      {
        label: 'Show Snippet...',
        description: 'Print a snippet in terminal',
        icon: 'eye',
        action: 'snippetShow'
      },
      {
        label: 'List Snippets',
        description: 'Run scholarly snippet list',
        icon: 'list-flat',
        action: 'snippetList'
      },
      {
        label: 'Append Workflow...',
        description: 'Append paper/seminar/quick workflow',
        icon: 'git-commit',
        action: 'workflowApply'
      },
      {
        label: 'List Workflows',
        description: 'Run scholarly workflow list',
        icon: 'list-tree',
        action: 'workflowList'
      }
    ]
  },
  tools: {
    label: 'Tools',
    icon: 'tools',
    items: [
      {
        label: 'Doctor',
        description: 'Check CLI environment and project status',
        icon: 'pulse',
        action: 'doctor'
      },
      {
        label: 'Help',
        description: 'Run scholarly help',
        icon: 'question',
        action: 'help'
      }
    ]
  }
};

class CliGroupTreeItem extends vscode.TreeItem {
  constructor(public readonly groupId: CliGroupId, label: string, icon: string) {
    super(label, vscode.TreeItemCollapsibleState.Expanded);
    this.iconPath = new vscode.ThemeIcon(icon);
  }
}

class CliActionTreeItem extends vscode.TreeItem {
  constructor(public readonly actionItem: CliActionItem) {
    super(actionItem.label, vscode.TreeItemCollapsibleState.None);
    this.description = actionItem.description;
    this.tooltip = `${actionItem.label} — ${actionItem.description}`;
    this.iconPath = new vscode.ThemeIcon(actionItem.icon);
    this.contextValue = 'cliAction';
    this.command = {
      command: 'slidev-scholarly.cliAction',
      title: 'Run CLI Action',
      arguments: [actionItem.action]
    };
  }
}

export class CliProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
    if (!element) {
      const groups = (Object.keys(CLI_GROUPS) as CliGroupId[]).map(
        key => new CliGroupTreeItem(key, CLI_GROUPS[key].label, CLI_GROUPS[key].icon)
      );
      return Promise.resolve(groups);
    }

    if (element instanceof CliGroupTreeItem) {
      const group = CLI_GROUPS[element.groupId];
      return Promise.resolve(group.items.map(item => new CliActionTreeItem(item)));
    }

    return Promise.resolve([]);
  }
}
