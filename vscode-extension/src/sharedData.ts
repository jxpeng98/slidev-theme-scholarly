/**
 * Shared data definitions — Single Source of Truth
 *
 * All theme, layout, and component lists are loaded from the shared JSON files
 * at the project root. Every module that needs these lists should import from
 * here instead of defining its own copy.
 */

import * as path from 'path';

// ── Raw JSON types ──────────────────────────────────────────────────────────

interface ThemeEntry {
    id: string;
    label: string;
    description: string;
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

interface TemplateEntry {
    id: string;
    label: string;
    description: string;
}

interface ThemesData {
    colorThemes: ThemeEntry[];
    fontThemes: ThemeEntry[];
    themePresets: ThemePresetEntry[];
    colorModes: ThemeEntry[];
}

interface LayoutsData {
    layoutGroups: LayoutGroup[];
    componentNames: string[];
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
    description: t.description
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

// ── Derived exports for providers.ts ────────────────────────────────────────
// Shape: { value: string; label: string }

export const COLOR_THEMES_SIMPLE = themesData.colorThemes.map(t => ({
    value: t.id,
    label: t.label
}));

export const FONT_THEMES_SIMPLE = themesData.fontThemes.map(t => ({
    value: t.id,
    label: t.label
}));

export const LAYOUT_GROUPS = layoutsData.layoutGroups.map(group => ({
    name: group.name,
    label: group.label ?? group.name,
    description: group.description ?? '',
    icon: group.icon ?? 'symbol-folder',
    items: group.items
}));

// ── Derived exports for snippetCompletion.ts ────────────────────────────────
// Shape: plain string[]

export const LAYOUT_NAMES: string[] = layoutsData.layoutGroups.flatMap(g => g.items);

export const COLOR_THEME_IDS: string[] = themesData.colorThemes.map(t => t.id);

export const FONT_THEME_IDS: string[] = themesData.fontThemes.map(t => t.id);

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
