export interface BuilderSlideInput {
  id?: string;
  layout?: string;
  title?: string;
  body?: string;
  bullets?: string[];
  image?: string;
  caption?: string;
}

export interface BuilderSlide {
  id: string;
  layout: string;
  title: string;
  body: string;
  bullets: string[];
  image: string;
  caption: string;
}

export interface BuilderDeckState {
  title?: string;
  subtitle?: string;
  footerMiddle?: string;
  colorTheme?: string;
  fontTheme?: string;
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
    caption: values.caption || ''
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
    `footerMiddle: ${yamlScalar(state.footerMiddle || 'Conference Name')}`,
    'lang: en',
    'themeConfig:',
    `  colorTheme: ${yamlScalar(state.colorTheme || 'classic-blue')}`,
    `  fontTheme: ${yamlScalar(state.fontTheme || 'classic')}`,
    '  outlineToc: true',
    '  outlineTocOpen: false',
    '---'
  ];

  return lines.join('\n');
}

function renderSlide(slide: BuilderSlide): string {
  const title = slide.title.trim() || 'Untitled slide';
  const body = renderSlideBody(slide);
  return [
    '---',
    `layout: ${slide.layout || 'default'}`,
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

  if (slide.caption.trim()) {
    blocks.push(`*${slide.caption.trim()}*`);
  }

  return blocks.length ? blocks.join('\n\n') : 'Add content here.';
}

function yamlScalar(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '""';
  if (/[:#{}\[\],&*?|<>=!%@`]/.test(trimmed) || trimmed.startsWith('-')) {
    return JSON.stringify(trimmed);
  }
  return trimmed;
}
