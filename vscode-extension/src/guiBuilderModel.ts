import { LAYOUT_CATALOG } from './sharedData';

const yaml = require('js-yaml');
const { parseConfigInput } = require('./guiBuilderValidation') as {
  parseConfigInput: typeof scholarlyParseConfigValue;
};

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
  if (values.config !== undefined && (!values.config || typeof values.config !== 'object' || Array.isArray(values.config)))
    throw new Error('Layout settings must be a mapping of setting names to values.');
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
  if (state.title !== undefined && !state.title.trim())
    throw new Error('Add a presentation title before creating Markdown.');
  if (state.slides && !state.slides.length)
    throw new Error('Add at least one slide before creating Markdown.');
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
  if (config.title === undefined) config.title = deckTitle;
  if (firstSlide.layout === 'toc') {
    // A TOC heading may be false, but Slidev's global title must be a string.
    const heading = first.heading ?? first.title;
    config.heading = heading === undefined || (typeof heading === 'string' && !heading.trim())
      ? (isChinese(state.lang) ? '目录' : 'Outline') : heading;
    if (first.title === false) config.title = deckTitle;
  }
  // Slidev shares headmatter with page one. Keep its explicit title and retain
  // the presentation name in the native browser-title template when they differ.
  if (typeof first.title === 'string' && first.title !== deckTitle) {
    config.titleTemplate = String(extra.titleTemplate || '%s - Slidev').replace('%s', deckTitle);
  }
  return ['---', ...renderFrontmatterEntries(firstSlide.layout, config, state.lang), '---'].join('\n');
}

function renderSlide(slide: BuilderSlide, chinese: boolean): string {
  return [
    '---',
    ...renderFrontmatterEntries(slide.layout, slideFrontmatter(slide, chinese), chinese ? 'zh' : 'en'),
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
    ...slide.config
  };
  if (slide.titleKey && config[slide.titleKey] !== false)
    config[slide.titleKey] = title;
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

function renderFrontmatterEntries(layout: string, config: Record<string, unknown>, language = 'en'): string[] {
  for (const entry of LAYOUT_CATALOG[layout]?.config || []) {
    const parsed = parseConfigInput(config[entry.name], entry.type, entry.required, language);
    if (parsed.error) throw new Error(`${config.title || layout}: ${entry.name} — ${parsed.error}`);
    if (parsed.value !== undefined) config[entry.name] = parsed.value;
    else delete config[entry.name];
  }

  return Object.entries(config).flatMap(([name, value]) => {
    if (!isSafeFrontmatterKey(name)) return [];
    if (name === 'themeConfig' && value && typeof value === 'object' && !Array.isArray(value)) {
      return ['themeConfig:', ...renderFrontmatterEntries('', value as Record<string, unknown>).map(line => `  ${line}`)];
    }
    const rendered = yamlConfigValue(value);
    return rendered === undefined ? [] : [`${name}: ${rendered}`];
  });
}

function yamlConfigValue(value: unknown): string | undefined {
  if (value === null || typeof value === 'number' || typeof value === 'boolean')
    return JSON.stringify(value);

  if (Array.isArray(value) || (value && typeof value === 'object'))
    return JSON.stringify(value);

  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  return yamlScalar(trimmed);
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
