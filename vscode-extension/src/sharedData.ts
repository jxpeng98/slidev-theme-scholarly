/**
 * Shared data definitions — Single Source of Truth
 *
 * All theme, layout, and component lists are loaded from the shared JSON files
 * at the project root. Every module that needs these lists should import from
 * here instead of defining its own copy.
 */

import * as path from 'path';

// ── Raw JSON types ──────────────────────────────────────────────────────────

export interface ThemePalette {
    primary: string;
    primaryLight: string;
    accent: string;
    background: string;
    foreground: string;
}

interface ThemeEntry {
    id: string;
    label: string;
    description: string;
    palette?: ThemePalette;
}

interface ThemePresetEntry {
    id: string;
    label: string;
    description: string;
    colorTheme: string;
    fontTheme: string;
}

interface LayoutGroup {
    name: string;
    label?: string;
    description?: string;
    icon?: string;
    items: string[];
}

export interface CatalogConfigEntry {
    name: string;
    type: string;
    required: boolean;
    default?: string;
    options?: string[];
    description: string;
}

export interface CatalogSlotEntry {
    name: string;
    description: string;
}

export interface LayoutCatalogEntry {
    label: string;
    summary: string;
    useFor: string;
    features: string[];
    tags: string[];
    config: CatalogConfigEntry[];
    slots: CatalogSlotEntry[];
}

export interface ComponentCatalogEntry {
    label: string;
    category: string;
    summary: string;
    useFor: string;
    features: string[];
    aliases: string[];
    config: CatalogConfigEntry[];
    slots: CatalogSlotEntry[];
}

export interface ComponentGroup {
    name: string;
    label: string;
    description: string;
    items: string[];
}

interface TemplateEntry {
    id: string;
    label: string;
    description: string;
    deck?: BuilderTemplateDeck;
}

export interface BuilderTemplateSlide {
    id: string;
    layout: string;
    title: string;
    body: string;
    slots?: Record<string, string>;
    heading?: boolean;
    titleKey?: string;
    configSource?: string;
}

export interface BuilderTemplateDeck {
    templateId: string;
    title: string;
    subtitle: string;
    footerMiddle: string;
    lang: string;
    colorTheme: string;
    fontTheme: string;
    contentMode?: 'light' | 'dark';
    chromeMode: 'light' | 'dark' | 'match' | 'inverse';
    sectionMode: 'light' | 'dark' | 'match' | 'inverse';
    frontmatterSource?: string;
    slides: BuilderTemplateSlide[];
}

interface ThemesData {
    colorThemes: ThemeEntry[];
    fontThemes: ThemeEntry[];
    themePresets: ThemePresetEntry[];
    contentModes: ThemeEntry[];
    surfaceModes: ThemeEntry[];
    colorModes: ThemeEntry[];
}

interface LayoutsData {
    layoutGroups: LayoutGroup[];
    layoutCatalog: Record<string, LayoutCatalogEntry>;
    componentNames: string[];
    componentGroups: ComponentGroup[];
    componentCatalog: Record<string, ComponentCatalogEntry>;
}

interface TemplatesData {
    templates: TemplateEntry[];
    aliases: Record<string, string>;
}

// ── Load shared JSON ────────────────────────────────────────────────────────

const sharedDir = path.resolve(__dirname, '..', 'shared');

const themesData: ThemesData = require(path.join(sharedDir, 'themes.json'));
const layoutsData: LayoutsData = require(path.join(sharedDir, 'layouts.json'));
const templatesData: TemplatesData = require(path.join(sharedDir, 'templates.json'));

function toKebabCase(value: string): string {
    return value
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
}

// ── Derived exports for commands.ts ─────────────────────────────────────────
// Shape: { value: string; label: string; description: string }

export const COLOR_THEMES = themesData.colorThemes.map(t => ({
    value: t.id,
    label: t.label,
    description: t.description,
    palette: t.palette
}));

export const FONT_THEMES = themesData.fontThemes.map(t => ({
    value: t.id,
    label: t.label,
    description: t.description
}));

export const COLOR_MODES = themesData.colorModes.map(t => ({
    value: t.id as 'light' | 'dark',
    label: t.label,
    description: t.description
}));

export const CONTENT_MODES = themesData.contentModes.map(t => ({
    value: t.id as 'light' | 'dark',
    label: t.label,
    description: t.description
}));

export const SURFACE_MODES = themesData.surfaceModes.map(t => ({
    value: t.id as 'light' | 'dark' | 'match' | 'inverse',
    label: t.label,
    description: t.description
}));

export const THEME_PRESETS = themesData.themePresets.map(p => ({
    id: p.id,
    label: p.label,
    description: p.description,
    colorTheme: p.colorTheme,
    fontTheme: p.fontTheme
}));

export const TEMPLATES = templatesData.templates.map(t => ({
    id: t.id,
    label: t.label,
    description: t.description
}));

export const BUILDER_TEMPLATES = templatesData.templates
    .filter((template): template is TemplateEntry & { deck: BuilderTemplateDeck } => Boolean(template.deck))
    .map(template => ({
        id: template.id,
        label: template.label,
        description: template.description,
        deck: template.deck
    }));

// ── Derived exports for providers.ts ────────────────────────────────────────
// Shape: { value: string; label: string }

export const COLOR_THEMES_SIMPLE = themesData.colorThemes.map(t => ({
    value: t.id,
    label: t.label,
    description: t.description,
    palette: t.palette
}));

export const FONT_THEMES_SIMPLE = themesData.fontThemes.map(t => ({
    value: t.id,
    label: t.label,
    description: t.description
}));

export const LAYOUT_GROUPS = layoutsData.layoutGroups.map(group => ({
    name: group.name,
    label: group.label ?? group.name,
    description: group.description ?? '',
    icon: group.icon ?? 'symbol-folder',
    items: group.items
}));

export const LAYOUT_CATALOG: Record<string, LayoutCatalogEntry> = layoutsData.layoutCatalog;

export const COMPONENT_GROUPS: ComponentGroup[] = layoutsData.componentGroups;

export const COMPONENT_CATALOG: Record<string, ComponentCatalogEntry> = layoutsData.componentCatalog;

// ── Derived exports for snippetCompletion.ts ────────────────────────────────
// Shape: plain string[]

export const LAYOUT_NAMES: string[] = layoutsData.layoutGroups.flatMap(g => g.items);

export const COLOR_THEME_IDS: string[] = themesData.colorThemes.map(t => t.id);

export const FONT_THEME_IDS: string[] = themesData.fontThemes.map(t => t.id);

export const CONTENT_MODE_IDS: string[] = themesData.contentModes.map(t => t.id);

export const SURFACE_MODE_IDS: string[] = themesData.surfaceModes.map(t => t.id);

// ── Derived exports for CLI compat ──────────────────────────────────────────

export const THEME_PRESET_IDS = themesData.themePresets.map(p => p.id);

export const COMPONENT_NAMES: string[] = layoutsData.componentNames;

export const TEMPLATE_IDS = templatesData.templates.map(t => t.id);

export const TEMPLATE_ALIASES = templatesData.aliases;

export const COMPONENT_PREVIEW_FILES: Record<string, string> = Object.fromEntries(
    layoutsData.componentNames.map(name => [name, toKebabCase(name)])
);

export const COLOR_THEME_PREVIEW_DIRS: Record<string, string> = {
    'classic-blue': 'classic-blue',
    'oxford-burgundy': 'oxford',
    'cambridge-green': 'cambridge',
    'yale-blue': 'yale',
    'princeton-orange': 'princeton',
    'nordic-blue': 'nordic',
    'warm-sepia': 'sepia',
    monochrome: 'monochrome',
    'high-contrast': 'high-contrast'
};

export const COLOR_THEME_PALETTES: Record<string, ThemePalette> = Object.fromEntries(
    themesData.colorThemes
        .filter((theme): theme is ThemeEntry & { palette: ThemePalette } => Boolean(theme.palette))
        .map(theme => [theme.id, theme.palette])
);
