import { LAYOUT_CATALOG } from './sharedData';

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
}

export interface BuilderDeckState {
  title?: string;
  subtitle?: string;
  footerMiddle?: string;
  colorTheme?: string;
  fontTheme?: string;
  contentMode?: 'light' | 'dark';
  chromeMode?: 'light' | 'dark' | 'match' | 'inverse';
  sectionMode?: 'light' | 'dark' | 'match' | 'inverse';
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
    slots: normalizeSlots(values.slots)
  };
}

export function renderBuilderMarkdown(state: BuilderDeckState): string {
  const slides = state.slides?.length
    ? state.slides.map(slide => createBuilderSlide(slide.layout || 'default', slide))
    : [createBuilderSlide('default')];

  return [
    renderFrontmatter(state),
    ...slides.map(renderSlide)
  ].join('\n\n').trimEnd() + '\n';
}

function renderFrontmatter(state: BuilderDeckState): string {
  const lines = [
    '---',
    'theme: scholarly',
    `title: ${yamlScalar(state.title !== undefined ? state.title : 'Scholarly Presentation')}`,
    `subtitle: ${yamlScalar(state.subtitle !== undefined ? state.subtitle : 'Generated from GUI Builder')}`,
    `footerMiddle: ${yamlScalar(state.footerMiddle || 'Conference Name')}`,
    'lang: en',
    'themeConfig:',
    `  colorTheme: ${yamlScalar(state.colorTheme || 'classic-blue')}`,
    `  fontTheme: ${yamlScalar(state.fontTheme || 'classic')}`,
  ];

  if (state.contentMode)
    lines.push(`  contentMode: ${state.contentMode}`);

  lines.push(
    `  chromeMode: ${state.chromeMode || 'dark'}`,
    `  sectionMode: ${state.sectionMode || 'dark'}`,
    '  outlineToc: true',
    '  outlineTocOpen: false',
    '---'
  );

  return lines.join('\n');
}

function renderSlide(slide: BuilderSlide): string {
  const title = slide.title.trim() || 'Untitled slide';
  const body = renderSlideBody(slide);
  return [
    '---',
    `layout: ${slide.layout || 'default'}`,
    ...renderLayoutConfig(slide.layout, slide.config),
    '---',
    '',
    `# ${title}`,
    '',
    body
  ].join('\n').trimEnd();
}

function renderSlideBody(slide: BuilderSlide): string {
  const blocks: string[] = [];

  if (slide.image.trim()) {
    const title = slide.title.trim() || 'Slide image';
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

  return blocks.length ? blocks.join('\n\n') : 'Add content here.';
}

function renderLayoutConfig(layout: string, config: Record<string, unknown>): string[] {
  const configTypes = new Map(
    (LAYOUT_CATALOG[layout]?.config ?? []).map(item => [item.name, item.type])
  );

  return Object.entries(config).flatMap(([name, value]) => {
    if (name === 'layout' || !isSafeFrontmatterKey(name)) return [];
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

function normalizeRecord(value: Record<string, unknown> | undefined): Record<string, unknown> {
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
    || /[\r\n:#{}\[\],&*?|<>=!%@`]/.test(trimmed)
    || /^[-?]/.test(trimmed)
  ) {
    return JSON.stringify(trimmed);
  }
  return trimmed;
}
