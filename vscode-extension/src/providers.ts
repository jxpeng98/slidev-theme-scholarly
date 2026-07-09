import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import {
  getColorThemePreviewDir,
  getComponentPreviewFile,
  type PreviewDetails
} from './preview';
import {
  COLOR_THEMES,
  FONT_THEMES,
  THEME_PRESETS,
  LAYOUT_GROUPS,
  LAYOUT_CATALOG,
  COMPONENT_NAMES,
  COMPONENT_CATALOG,
  COMPONENT_GROUPS,
  TEMPLATES
} from './sharedData';
import type { CliActionId } from './commands';

export interface SnippetItem {
  id?: string;
  label: string;
  description: string;
  snippet: string;
  icon?: string;
  category?: string;
  canonicalName?: string;
  details?: PreviewDetails;
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
  label: string,
  description: string,
  snippet: string,
  details?: PreviewDetails
): vscode.MarkdownString {
  const md = new vscode.MarkdownString('', true);
  md.baseUri = extensionUri;
  md.supportHtml = true;
  if (hasPreview(extensionUri, 'media', 'previews', 'layouts', `${layoutId}.png`)) {
    md.appendMarkdown(`![${label}](./media/previews/layouts/${layoutId}.png)\n\n`);
  }
  md.appendMarkdown(`**${label}**  \`${layoutId}\`\n\n${description}\n\n`);
  appendCatalogDetails(md, details);
  md.appendMarkdown(toMarkdownCodeBlock(snippet));
  md.appendMarkdown('\n\n*Use the Preview action for the full catalog entry.*');
  return md;
}

function createComponentTooltip(
  extensionUri: vscode.Uri,
  label: string,
  description: string,
  snippet: string,
  details?: PreviewDetails
): vscode.MarkdownString {
  const md = new vscode.MarkdownString('', true);
  md.baseUri = extensionUri;
  md.supportHtml = true;
  const file = getComponentPreviewFile(label);
  if (file && hasPreview(extensionUri, 'media', 'previews', 'components', `${file}.png`)) {
    md.appendMarkdown(`![${label}](./media/previews/components/${file}.png)\n\n`);
  }
  md.appendMarkdown(`**${label}** — ${description}\n\n`);
  appendCatalogDetails(md, details);
  md.appendMarkdown(toMarkdownCodeBlock(snippet));
  md.appendMarkdown('\n\n*Use the Preview action for the full catalog entry.*');
  return md;
}

function appendCatalogDetails(md: vscode.MarkdownString, details: PreviewDetails | undefined): void {
  if (!details) return;
  if (details.category) md.appendMarkdown(`**Category:** ${details.category}\n\n`);
  if (details.useFor) md.appendMarkdown(`**Best for:** ${details.useFor}\n\n`);
  if (details.features?.length) {
    md.appendMarkdown(`**Provides:** ${details.features.join(' · ')}\n\n`);
  }
  if (details.config) {
    if (details.config.length) {
      md.appendMarkdown('**Configuration:**\n\n');
      for (const item of details.config) {
        const options = item.options?.length ? `; values: ${item.options.join(' | ')}` : '';
        const defaultValue = item.default !== undefined ? `; default: ${item.default}` : '';
        const requirement = item.required ? 'required' : 'optional';
        md.appendMarkdown(`- \`${item.name}\` — \`${item.type}\`; ${requirement}${defaultValue}${options}: ${item.description}\n`);
      }
      md.appendMarkdown('\n');
    } else {
      md.appendMarkdown('**Configuration:** No item-specific props.\n\n');
    }
  }
  if (details.slots) {
    if (details.slots.length) {
      md.appendMarkdown('**Slots:**\n\n');
      for (const slot of details.slots) {
        md.appendMarkdown(`- \`${slot.name}\`: ${slot.description}\n`);
      }
      md.appendMarkdown('\n');
    } else {
      md.appendMarkdown('**Slots:** None.\n\n');
    }
  }
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
  md.appendMarkdown('*Use the Preview action for the full theme gallery.*');
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

function createLayoutSnippetItem(
  layoutId: string,
  categoryLabel: string,
  definition?: SnippetDefinition
): SnippetItem {
  const catalog = LAYOUT_CATALOG[layoutId];
  return {
    id: layoutId,
    label: catalog?.label ?? layoutId,
    description: catalog?.summary
      ?? (definition ? stripCategoryPrefix(definition.description) : `Insert ${layoutId} layout`),
    icon: 'layout',
    snippet: definition?.body ?? `---\nlayout: ${layoutId}\n---\n\n$0`,
    details: catalog
      ? {
          category: categoryLabel,
          useFor: catalog.useFor,
          features: catalog.features,
          tags: catalog.tags,
          config: catalog.config,
          slots: catalog.slots
        }
      : { category: categoryLabel }
  };
}

function createComponentSnippetItem(definition: SnippetDefinition): SnippetItem {
  const label = stripScholarlyPrefix(definition.name);
  const canonicalName = resolveComponentName(label, definition.body);
  const catalog = canonicalName ? COMPONENT_CATALOG[canonicalName] : undefined;
  const category = catalog?.category ?? inferUtilityCategory(label);
  const categoryLabel = COMPONENT_GROUPS.find(group => group.name === category)?.label ?? category;
  return {
    id: canonicalName ?? label,
    label,
    description: catalog?.summary ?? definition.description,
    icon: componentIcon(label, canonicalName),
    category,
    canonicalName,
    snippet: definition.body,
    details: catalog
      ? {
          category: categoryLabel,
          useFor: catalog.useFor,
          features: catalog.features,
          tags: catalog.aliases,
          config: catalog.config,
          slots: catalog.slots
        }
      : {
          category: categoryLabel,
          useFor: definition.description
        }
  };
}

function resolveComponentName(label: string, snippet: string): string | undefined {
  const componentTag = snippet.match(/<([A-Z][A-Za-z0-9]+)/)?.[1];
  if (componentTag && COMPONENT_NAMES.includes(componentTag)) return componentTag;

  const baseLabel = label.replace(/\s+\(.+?\)$/, '');
  const normalized = normalizeCatalogTerm(baseLabel);
  return Object.entries(COMPONENT_CATALOG).find(([name, catalog]) =>
    [name, catalog.label, ...catalog.aliases]
      .some(candidate => normalizeCatalogTerm(candidate) === normalized)
  )?.[0];
}

function normalizeCatalogTerm(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function inferUtilityCategory(label: string): string {
  return /citation|bibliograph|references|anchor/i.test(label)
    ? 'citations'
    : 'theme-utilities';
}

function componentIcon(label: string, canonicalName: string | undefined): string {
  if (canonicalName) return 'symbol-method';
  if (/citation|bibliograph|references|anchor/i.test(label)) return 'references';
  if (/math/i.test(label)) return 'symbol-operator';
  if (/font/i.test(label)) return 'text-size';
  if (/comment/i.test(label)) return 'comment';
  return 'symbol-snippet';
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
      layouts: group.items.map(id => createLayoutSnippetItem(id, group.label, layoutSnippetById.get(id)))
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

export const componentCategories = Object.fromEntries(
  COMPONENT_GROUPS.map(group => [
    group.name,
    {
      label: group.label,
      description: group.description,
      items: components.filter(item => item.category === group.name)
    }
  ])
);

// Tree Item class
export class SnippetTreeItem extends vscode.TreeItem {
  constructor(
    public readonly item: SnippetItem,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(item.label, collapsibleState);
    this.tooltip = item.description;
    this.description = item.description;
    this.iconPath = new vscode.ThemeIcon(item.icon || 'symbol-snippet');
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

class ComponentCategoryTreeItem extends vscode.TreeItem {
  constructor(
    public readonly categoryKey: string,
    public readonly categoryData: { label: string; description: string; items: SnippetItem[] }
  ) {
    super(categoryData.label, vscode.TreeItemCollapsibleState.Collapsed);
    this.description = `${categoryData.items.length}`;
    this.tooltip = categoryData.description;
    this.iconPath = new vscode.ThemeIcon('symbol-folder');
    this.contextValue = 'componentCategory';
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
            layout.id || layout.label,
            layout.label,
            layout.description,
            layout.snippet,
            layout.details
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
export class ComponentsProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  constructor(private readonly extensionUri: vscode.Uri) { }

  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
    if (!element) {
      return Promise.resolve(
        Object.entries(componentCategories)
          .filter(([, category]) => category.items.length > 0)
          .map(([key, category]) => new ComponentCategoryTreeItem(key, category))
      );
    }

    if (element instanceof ComponentCategoryTreeItem) {
      return Promise.resolve(element.categoryData.items.map(component => {
        const item = new SnippetTreeItem(component, vscode.TreeItemCollapsibleState.None);
        item.contextValue = 'componentSnippet';
        item.tooltip = createComponentTooltip(
          this.extensionUri,
          component.label,
          component.description,
          component.snippet,
          component.details
        );
        item.command = {
          command: 'slidev-scholarly.insertComponent',
          title: 'Insert',
          arguments: [{ snippet: component.snippet }]
        };
        return item;
      }));
    }

    return Promise.resolve([]);
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
              theme.description,
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
              theme.description,
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
              theme.description,
              {
                command: 'slidev-scholarly.setFontTheme',
                title: 'Set Font Theme',
                arguments: [theme.value]
              },
              { fontTheme: theme.value }
            );
            item.tooltip = new vscode.MarkdownString(
              `**${theme.label}**\n\n${theme.description}\n\n\`fontTheme: ${theme.value}\`\n\n*Use the Preview action for usage guidance.*`
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
