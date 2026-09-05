import { LAYOUT_CATALOG } from './sharedData';

const yaml = require('js-yaml');

export interface BuilderSlideInput {
  id?: string;
  layout?: string;
  title?: string;
  body?: string;
  bullets?: string[];
  image?: string;
  caption?: string;
  config?: Record<string, unknown>;
  slots?: Record<string, string>;
  heading?: boolean;
  titleKey?: string;
  configSource?: string;
}

export interface BuilderSlide {
  id: string;
  layout: string;
  title: string;
  body: string;
  bullets: string[];
  image: string;
  caption: string;
  config: Record<string, unknown>;
  slots: Record<string, string>;
  heading: boolean;
  titleKey: string;
  configSource: string;
}

export interface BuilderDeckState {
  templateId?: string;
  title?: string;
  subtitle?: string;
  footerMiddle?: string;
  lang?: string;
  colorTheme?: string;
  fontTheme?: string;
  contentMode?: 'light' | 'dark';
  chromeMode?: 'light' | 'dark' | 'match' | 'inverse';
  sectionMode?: 'light' | 'dark' | 'match' | 'inverse';
  frontmatterSource?: string;
  slides?: BuilderSlideInput[];
}

let slideCounter = 0;

export function createBuilderSlide(
  layout: string,
  values: Omit<BuilderSlideInput, 'layout'> = {}
): BuilderSlide {
  slideCounter += 1;
  return {
    id: values.id || `slide-${slideCounter}`,
    layout,
    title: values.title || '',
    body: values.body || '',
    bullets: values.bullets?.filter(Boolean) ?? [],
    image: values.image || '',
    caption: values.caption || '',
    config: normalizeRecord(values.config),
    slots: normalizeSlots(values.slots),
    heading: values.heading !== false,
    titleKey: values.titleKey || '',
    configSource: values.configSource?.trim() || ''
  };
}

export function renderBuilderMarkdown(state: BuilderDeckState): string {
  const slides = state.slides?.length
    ? state.slides.map(slide => createBuilderSlide(slide.layout || 'default', slide))
    : [createBuilderSlide('default')];

  return [
    renderFrontmatter(state, slides[0]),
    renderSlideContent(slides[0], isChinese(state.lang)),
    ...slides.slice(1).map(slide => renderSlide(slide, isChinese(state.lang)))
  ].join('\n\n').trimEnd() + '\n';
}

export function renderBuilderSlides(slides: BuilderSlideInput[], lang = 'en'): string {
  return slides
    .map(slide => createBuilderSlide(slide.layout || 'default', slide))
    .map(slide => renderSlide(slide, isChinese(lang)))
    .join('\n\n')
    .trimEnd() + '\n';
}

function renderFrontmatter(state: BuilderDeckState, firstSlide: BuilderSlide): string {
  const extra = parseBuilderConfigSource(state.frontmatterSource || '');
  const deckTitle = state.title ?? 'Scholarly Presentation';
  const first = slideFrontmatter(firstSlide, isChinese(state.lang));
  const themeConfig = {
    outlineToc: true,
    outlineTocOpen: false,
    ...normalizeRecord(extra.themeConfig),
    colorTheme: state.colorTheme || 'classic-blue',
    fontTheme: state.fontTheme || 'classic',
    ...(state.contentMode ? { contentMode: state.contentMode } : {}),
    chromeMode: state.chromeMode || 'dark',
    sectionMode: state.sectionMode || 'dark',
    ...normalizeRecord(first.themeConfig)
  };
  const config: Record<string, unknown> = {
    theme: 'scholarly',
    ...extra,
    title: deckTitle,
    subtitle: state.subtitle ?? 'Generated with Deck Builder',
    footerMiddle: state.footerMiddle || 'Conference Name',
    lang: state.lang || 'en',
    ...first,
    themeConfig
  };
  config.theme = 'scholarly';
  // Slidev shares headmatter with page one. Keep its explicit title and retain
  // the presentation name in the native browser-title template when they differ.
  if (typeof first.title === 'string' && first.title !== deckTitle) {
    config.titleTemplate = String(extra.titleTemplate || '%s - Slidev').replace('%s', deckTitle);
  }
  return ['---', ...renderFrontmatterEntries(firstSlide.layout, config), '---'].join('\n');
}

function renderSlide(slide: BuilderSlide, chinese: boolean): string {
  return [
    '---',
    ...renderFrontmatterEntries(slide.layout, slideFrontmatter(slide, chinese)),
    '---',
    '',
    renderSlideContent(slide, chinese)
  ].join('\n').trimEnd();
}

function slideFrontmatter(slide: BuilderSlide, chinese: boolean): Record<string, unknown> {
  const title = slide.title.trim() || (chinese ? '未命名页面' : 'Untitled slide');
  const config: Record<string, unknown> = {
    layout: slide.layout || 'default',
    ...parseBuilderConfigSource(slide.configSource),
    ...slide.config,
    ...(slide.titleKey ? { [slide.titleKey]: title } : {})
  };
  // A saved source block must not override the currently selected layout.
  config.layout = slide.layout || 'default';
  return config;
}

function renderSlideContent(slide: BuilderSlide, chinese: boolean): string {
  const title = slide.title.trim() || (chinese ? '未命名页面' : 'Untitled slide');
  return [
    ...(slide.heading ? [`# ${title}`, ''] : []),
    renderSlideBody(slide, chinese)
  ].join('\n');
}

export function parseBuilderConfigSource(source: string): Record<string, unknown> {
  if (!source.trim()) return {};
  const value: unknown = yaml.load(source, { schema: yaml.JSON_SCHEMA });
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('Layout and presentation settings must be YAML mappings.');
  return value as Record<string, unknown>;
}

function renderSlideBody(slide: BuilderSlide, chinese: boolean): string {
  const blocks: string[] = [];

  if (slide.image.trim()) {
    const title = slide.title.trim() || (chinese ? '页面图片' : 'Slide image');
    blocks.push(`![${title}](${slide.image.trim()})`);
  }

  if (slide.bullets.length > 0) {
    blocks.push(slide.bullets.map(item => `- ${item.trim()}`).join('\n'));
  }

  if (slide.body.trim()) {
    blocks.push(slide.body.trim());
  }

  const defaultSlot = slide.slots.default?.trim();
  if (defaultSlot) {
    blocks.push(defaultSlot);
  }

  if (slide.caption.trim()) {
    blocks.push(`*${slide.caption.trim()}*`);
  }

  for (const [name, content] of Object.entries(slide.slots)) {
    const trimmed = content.trim();
    if (!trimmed || name === 'default' || !isSafeFrontmatterKey(name)) continue;
    blocks.push(`::${name}::\n\n${trimmed}`);
  }

  return blocks.length ? blocks.join('\n\n') : chinese ? '在这里填写内容。' : 'Add content here.';
}

function isChinese(lang: string | undefined): boolean {
  return Boolean(lang?.toLowerCase().startsWith('zh'));
}

function renderFrontmatterEntries(layout: string, config: Record<string, unknown>): string[] {
  const configTypes = new Map(
    (LAYOUT_CATALOG[layout]?.config ?? []).map(item => [item.name, item.type])
  );

  return Object.entries(config).flatMap(([name, value]) => {
    if (!isSafeFrontmatterKey(name)) return [];
    if (name === 'themeConfig' && value && typeof value === 'object' && !Array.isArray(value)) {
      return ['themeConfig:', ...renderFrontmatterEntries('', value as Record<string, unknown>).map(line => `  ${line}`)];
    }
    const rendered = yamlConfigValue(value, configTypes.get(name));
    return rendered === undefined ? [] : [`${name}: ${rendered}`];
  });
}

function yamlConfigValue(value: unknown, declaredType?: string): string | undefined {
  if (value === null || typeof value === 'number' || typeof value === 'boolean')
    return JSON.stringify(value);

  if (Array.isArray(value) || (value && typeof value === 'object'))
    return JSON.stringify(value);

  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  if (isStructuredType(declaredType)) {
    try {
      return JSON.stringify(JSON.parse(trimmed));
    } catch {
      // UI validation rejects malformed JSON. Preserve older state safely as a string.
    }
  }

  if (isBooleanOnlyType(declaredType) && /^(?:true|false)$/i.test(trimmed))
    return trimmed.toLowerCase();

  if (isNumberOnlyType(declaredType)) {
    const parsed = Number(trimmed);
    if (Number.isFinite(parsed)) return JSON.stringify(parsed);
  }

  return yamlScalar(trimmed);
}

function isStructuredType(type: string | undefined): boolean {
  return Boolean(type && (/\[\]|Array<|\{/.test(type)));
}

function isBooleanOnlyType(type: string | undefined): boolean {
  return Boolean(type && isTopLevelType(type, 'boolean') && !isTopLevelType(type, 'string'));
}

function isNumberOnlyType(type: string | undefined): boolean {
  return Boolean(type && isTopLevelType(type, 'number') && !isTopLevelType(type, 'string'));
}

function isTopLevelType(type: string, primitive: string): boolean {
  const escaped = primitive.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^\\s*${escaped}(?:\\s*\\||\\s*$)|\\|\\s*${escaped}\\s*(?:\\||$)`, 'i').test(type);
}

function normalizeRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value));
}

function normalizeSlots(value: Record<string, string> | undefined): Record<string, string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === 'string')
  );
}

function isSafeFrontmatterKey(value: string): boolean {
  return /^[A-Za-z_][A-Za-z0-9_-]*$/.test(value);
}

function yamlScalar(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '""';
  const yamlKeyword = /^(?:true|false|null|yes|no|on|off|~|[-+]?\.inf|\.nan)$/i.test(trimmed);
  const yamlNumber = Number.isFinite(Number(trimmed));
  if (
    yamlKeyword
    || yamlNumber
    || /[\r\n:#{}\[\],&*?|<>=!%@"'`]/.test(trimmed)
    || /^[-?]/.test(trimmed)
  ) {
    return JSON.stringify(trimmed);
  }
  return trimmed;
}
