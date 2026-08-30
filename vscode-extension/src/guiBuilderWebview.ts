interface ScholarlyWebviewApi {
  postMessage(message: unknown): void;
  getState(): ScholarlySavedState | undefined;
  setState(state: ScholarlySavedState): void;
}

interface ScholarlyConfigEntry {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  options?: string[];
  description: string;
}

interface ScholarlySlotEntry {
  name: string;
  description: string;
}

interface ScholarlyLayout {
  id: string;
  label: string;
  displayLabel: string;
  displayCategory: string;
  filterCategory: string;
  description: string;
  useFor?: string;
  image?: string;
  config?: ScholarlyConfigEntry[];
  slots?: ScholarlySlotEntry[];
}

interface ScholarlySlide {
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

interface ScholarlyDeckState {
  templateId: string;
  title: string;
  subtitle: string;
  footerMiddle: string;
  lang: string;
  colorTheme: string;
  fontTheme: string;
  contentMode: string;
  chromeMode: string;
  sectionMode: string;
  frontmatterSource: string;
  slides: ScholarlySlide[];
}

interface ScholarlyTemplate {
  id: string;
  label: string;
  description: string;
  deck: ScholarlyDeckState;
}

interface ScholarlyOption {
  value: string;
  label: string;
  description?: string;
  palette?: Record<string, string>;
}

interface ScholarlyBuilderData {
  language: 'en' | 'zh-cn';
  layouts: ScholarlyLayout[];
  templates: ScholarlyTemplate[];
  colorThemes: ScholarlyOption[];
  fontThemes: ScholarlyOption[];
  contentModes: ScholarlyOption[];
  surfaceModes: ScholarlyOption[];
}

interface ScholarlySavedState {
  state: ScholarlyDeckState;
  selectedId: string;
  dirty: boolean;
}

interface Window {
  scholarlyBuilderData: ScholarlyBuilderData;
}

declare function acquireVsCodeApi(): ScholarlyWebviewApi;

const scholarlyVscode = acquireVsCodeApi();
const scholarlyData = window.scholarlyBuilderData;
const scholarlyPaletteKeys = ['primary', 'primaryLight', 'accent', 'background', 'foreground'];
let scholarlyState: ScholarlyDeckState;
let scholarlySelectedId = '';
let scholarlyDragId = '';
let scholarlyDirty = false;
let scholarlyMessageTimer = 0;
let scholarlyPreviewTimer = 0;

function scholarlyCopy(english: string, chinese: string): string {
  return scholarlyData.language === 'zh-cn' ? chinese : english;
}

function scholarlyById<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing Deck Builder element: ${id}`);
  return element as T;
}

function scholarlyLayoutById(id: string): ScholarlyLayout | undefined {
  return scholarlyData.layouts.find(layout => layout.id === id);
}

function scholarlySelectedSlide(): ScholarlySlide | undefined {
  return scholarlyState.slides.find(slide => slide.id === scholarlySelectedId);
}

function scholarlyNormalizeDeck(deck: ScholarlyDeckState): ScholarlyDeckState {
  const copy = structuredClone(deck);
  copy.templateId ||= '';
  copy.title ||= scholarlyCopy('Scholarly Presentation', '学术演示');
  copy.subtitle ||= '';
  copy.footerMiddle ||= scholarlyCopy('Conference Name', '会议名称');
  copy.lang ||= scholarlyData.language === 'zh-cn' ? 'zh-CN' : 'en';
  copy.colorTheme ||= scholarlyData.colorThemes[0]?.value || 'classic-blue';
  copy.fontTheme ||= scholarlyData.fontThemes[0]?.value || 'classic';
  copy.contentMode ||= '';
  copy.chromeMode ||= 'dark';
  copy.sectionMode ||= 'dark';
  copy.frontmatterSource ||= '';
  copy.slides = Array.isArray(copy.slides) ? copy.slides.map((slide, index) => ({
    id: slide.id || `slide-${index + 1}`,
    layout: slide.layout || 'default',
    title: slide.title || scholarlyCopy('Untitled slide', '未命名页面'),
    body: slide.body || '',
    bullets: Array.isArray(slide.bullets) ? slide.bullets : [],
    image: slide.image || '',
    caption: slide.caption || '',
    config: slide.config && typeof slide.config === 'object' ? slide.config : {},
    slots: slide.slots && typeof slide.slots === 'object' ? slide.slots : {},
    heading: slide.heading !== false,
    titleKey: slide.titleKey || '',
    configSource: slide.configSource || ''
  })) : [];
  return copy;
}

function scholarlyApplyTemplate(templateId: string, askBeforeReplacing = true): void {
  const template = scholarlyData.templates.find(item => item.id === templateId);
  if (!template) return;
  if (
    askBeforeReplacing
    && scholarlyDirty
    && !window.confirm(scholarlyData.language === 'zh-cn'
      ? `要用“${template.label}”替换当前大纲吗？`
      : `Replace the current outline with the ${template.label} workflow?`)
  ) return;

  scholarlyState = scholarlyNormalizeDeck(template.deck);
  scholarlySelectedId = scholarlyState.slides[0]?.id || '';
  scholarlyDirty = false;
  scholarlyRenderAll();
  scholarlyShowMessage(scholarlyData.language === 'zh-cn'
    ? `已载入“${template.label}”。选择任意页面开始填写内容。`
    : `${template.label} outline loaded. Choose any slide to add your content.`);
}

function scholarlyRenderAll(): void {
  scholarlyRenderTemplates();
  scholarlyRenderSettings();
  scholarlyRenderSlides();
  scholarlyRenderInspector();
  scholarlyFilterLayouts();
  scholarlySaveState();
}

function scholarlyRenderTemplates(): void {
  const list = scholarlyById<HTMLDivElement>('template-list');
  list.innerHTML = scholarlyData.templates.map(template =>
    `<button class="template-option" role="radio" aria-checked="${template.id === scholarlyState.templateId}" data-template-id="${scholarlyEscape(template.id)}">
      <strong>${scholarlyEscape(template.label)} · ${scholarlyData.language === 'zh-cn' ? `${template.deck.slides.length} 页` : `${template.deck.slides.length} slides`}</strong>
      <span>${scholarlyEscape(template.description)}</span>
    </button>`
  ).join('');
  scholarlyById('workflow-count').textContent = scholarlyData.language === 'zh-cn'
    ? `${scholarlyData.templates.length} 个工作流`
    : `${scholarlyData.templates.length} workflows`;
}

function scholarlyOptionMarkup(option: ScholarlyOption): string {
  return `<option value="${scholarlyEscape(option.value)}">${scholarlyEscape(option.label)}</option>`;
}

function scholarlyRenderSettings(): void {
  const color = scholarlyById<HTMLSelectElement>('color-theme');
  const font = scholarlyById<HTMLSelectElement>('font-theme');
  const content = scholarlyById<HTMLSelectElement>('content-mode');
  const chrome = scholarlyById<HTMLSelectElement>('chrome-mode');
  const section = scholarlyById<HTMLSelectElement>('section-mode');

  color.innerHTML = scholarlyData.colorThemes.map(scholarlyOptionMarkup).join('');
  font.innerHTML = scholarlyData.fontThemes.map(scholarlyOptionMarkup).join('');
  content.innerHTML = `<option value="">${scholarlyCopy('Follow Slidev', '跟随 Slidev')}</option>` + scholarlyData.contentModes.map(scholarlyOptionMarkup).join('');
  chrome.innerHTML = scholarlyData.surfaceModes.map(scholarlyOptionMarkup).join('');
  section.innerHTML = scholarlyData.surfaceModes.map(scholarlyOptionMarkup).join('');

  scholarlyById<HTMLInputElement>('deck-title').value = scholarlyState.title;
  scholarlyById<HTMLInputElement>('deck-subtitle').value = scholarlyState.subtitle;
  color.value = scholarlyState.colorTheme;
  font.value = scholarlyState.fontTheme;
  content.value = scholarlyState.contentMode;
  chrome.value = scholarlyState.chromeMode;
  section.value = scholarlyState.sectionMode;
  scholarlyRenderThemeSummary();
}

function scholarlyRenderThemeSummary(): void {
  const theme = scholarlyData.colorThemes.find(item => item.value === scholarlyState.colorTheme)
    || scholarlyData.colorThemes[0];
  scholarlyById('theme-name').textContent = theme?.label || scholarlyCopy('Color theme', '配色主题');
  scholarlyById('theme-description').textContent = theme?.description || '';
  const colors = scholarlyPaletteKeys.map(key => theme?.palette?.[key] || '');
  scholarlyById<HTMLStyleElement>('theme-palette-style').textContent = colors
    .map((color, index) => /^#[\da-f]{3,8}$/i.test(color)
      ? `#theme-swatches li:nth-child(${index + 1}) { background-color: ${color}; }`
      : '')
    .join('\n');
  scholarlyById<HTMLOListElement>('theme-swatches').querySelectorAll('li').forEach((swatch, index) => {
    const labels = scholarlyData.language === 'zh-cn'
      ? ['主色', '浅主色', '强调色', '背景色', '前景色']
      : ['primary', 'primary light', 'accent', 'background', 'foreground'];
    const label = labels[index];
    swatch.setAttribute('title', colors[index] ? `${label}: ${colors[index]}` : label);
  });
}

function scholarlyRenderSlides(): void {
  const list = scholarlyById<HTMLDivElement>('slide-list');
  scholarlyById('slide-count').textContent = scholarlyData.language === 'zh-cn'
    ? `${scholarlyState.slides.length} 页`
    : `${scholarlyState.slides.length} slides`;
  if (!scholarlyState.slides.length) {
    list.innerHTML = `<div class="empty-state">${scholarlyCopy('Add a layout from the left to start the outline.', '从左侧添加一个布局，开始搭建大纲。')}</div>`;
    scholarlyById<HTMLButtonElement>('insert-selected').disabled = true;
    return;
  }

  list.innerHTML = scholarlyState.slides.map((slide, index) => {
    const layout = scholarlyLayoutById(slide.layout);
    const label = layout?.displayLabel || slide.layout;
    return `<div class="slide-item" role="listitem" tabindex="0" draggable="true" aria-current="${slide.id === scholarlySelectedId}" data-slide-id="${scholarlyEscape(slide.id)}">
      <div class="slide-thumbnail">${layout?.image ? `<img src="${scholarlyEscape(layout.image)}" alt="" />` : ''}<span class="slide-index">${index + 1}</span></div>
      <div class="slide-copy"><strong>${scholarlyEscape(slide.title || scholarlyCopy('Untitled slide', '未命名页面'))}</strong><span>${scholarlyEscape(label)} · ${scholarlyEscape(layout?.useFor || layout?.description || '')}</span></div>
      <div class="slide-actions">
        <button class="icon-button" data-action="up" title="${scholarlyCopy('Move up', '上移')}" aria-label="${scholarlyData.language === 'zh-cn' ? `上移“${scholarlyEscape(slide.title)}”` : `Move ${scholarlyEscape(slide.title)} up`}" ${index === 0 ? 'disabled' : ''}>${scholarlyIcon('up')}</button>
        <button class="icon-button" data-action="down" title="${scholarlyCopy('Move down', '下移')}" aria-label="${scholarlyData.language === 'zh-cn' ? `下移“${scholarlyEscape(slide.title)}”` : `Move ${scholarlyEscape(slide.title)} down`}" ${index === scholarlyState.slides.length - 1 ? 'disabled' : ''}>${scholarlyIcon('down')}</button>
        <button class="icon-button destructive" data-action="delete" title="${scholarlyCopy('Delete', '删除')}" aria-label="${scholarlyData.language === 'zh-cn' ? `删除“${scholarlyEscape(slide.title)}”` : `Delete ${scholarlyEscape(slide.title)}`}">${scholarlyIcon('delete')}</button>
      </div>
    </div>`;
  }).join('');
  scholarlyById<HTMLButtonElement>('insert-selected').disabled = !scholarlySelectedSlide();
}

function scholarlyRenderInspector(): void {
  const slide = scholarlySelectedSlide();
  scholarlyById('inspector-empty').hidden = Boolean(slide);
  scholarlyById('inspector').hidden = !slide;
  scholarlyById<HTMLButtonElement>('insert-selected').disabled = !slide;
  if (!slide) return;

  const layout = scholarlyLayoutById(slide.layout);
  const select = scholarlyById<HTMLSelectElement>('slide-layout');
  select.innerHTML = scholarlyData.layouts.map(item =>
    `<option value="${scholarlyEscape(item.id)}">${scholarlyEscape(item.displayLabel)}</option>`
  ).join('');
  select.value = slide.layout;
  scholarlyById<HTMLInputElement>('slide-title').value = slide.title;
  scholarlyById<HTMLTextAreaElement>('slide-body').value = slide.body;
  scholarlyById('selected-layout-name').textContent = layout?.displayLabel || slide.layout;
  scholarlyById('selected-layout-description').textContent = layout?.useFor || layout?.description || '';

  const image = scholarlyById<HTMLImageElement>('selected-layout-image');
  image.src = layout?.image || '';
  image.alt = layout
    ? scholarlyData.language === 'zh-cn' ? `${layout.displayLabel}布局预览` : `${layout.displayLabel} layout preview`
    : '';
  image.hidden = !layout?.image;

  scholarlyRenderSlots(slide, layout);
  scholarlyRenderConfig(slide, layout);
  scholarlyRequestPreview();
}

function scholarlyRenderSlots(slide: ScholarlySlide, layout?: ScholarlyLayout): void {
  const slots = (layout?.slots || []).filter(slot => slot.name !== 'default');
  const container = scholarlyById<HTMLDivElement>('slot-fields');
  if (!slots.length) {
    container.innerHTML = '';
    return;
  }
  container.innerHTML = `<p class="slot-heading">${scholarlyCopy('Layout sections', '布局分区')}</p>` + slots.map(slot =>
    `<label class="field"><span>${scholarlyEscape(scholarlyHumanize(slot.name))} <small>${scholarlyEscape(slot.description)}</small></span><textarea rows="5" data-slot-name="${scholarlyEscape(slot.name)}" placeholder="${scholarlyData.language === 'zh-cn' ? `填写 ${scholarlyEscape(slot.name)} 区域的 Markdown` : `Markdown for ${scholarlyEscape(slot.name)}`}">${scholarlyEscape(slide.slots[slot.name] || '')}</textarea></label>`
  ).join('');
}

function scholarlyRenderConfig(slide: ScholarlySlide, layout?: ScholarlyLayout): void {
  const note = scholarlyById<HTMLParagraphElement>('template-settings-note');
  const container = scholarlyById<HTMLDivElement>('config-fields');
  note.hidden = !slide.configSource;
  if (slide.configSource) {
    container.innerHTML = '';
    return;
  }
  const config = layout?.config || [];
  container.innerHTML = config.length
    ? config.map(item => scholarlyConfigMarkup(item, slide.config[item.name])).join('')
    : `<p class="details-note">${scholarlyCopy('This layout has no additional settings.', '这个布局没有额外设置。')}</p>`;
}

function scholarlyConfigMarkup(item: ScholarlyConfigEntry, value: unknown): string {
  const raw = value === undefined || value === null
    ? ''
    : typeof value === 'object' ? JSON.stringify(value) : String(value);
  const values = item.options?.length
    ? item.options
    : scholarlyBooleanOnly(item.type) ? ['true', 'false'] : [];
  const requirement = item.required ? scholarlyCopy('required', '必填') : scholarlyCopy('optional', '可选');
  const label = `<div class="config-heading"><code>${scholarlyEscape(item.name)}</code><span>${scholarlyEscape(item.type)} · ${requirement}</span></div><span class="config-description">${scholarlyEscape(item.description)}</span>`;
  const attributes = `data-config-name="${scholarlyEscape(item.name)}" data-config-type="${scholarlyEscape(item.type)}" ${item.required ? 'required' : ''}`;

  if (values.length) {
    return `<label class="config-item">${label}<select ${attributes}><option value="">${item.default !== undefined ? `${scholarlyCopy('Default', '默认值')}: ${scholarlyEscape(item.default)}` : scholarlyCopy('Leave blank', '留空')}</option>${values.map(option => `<option value="${scholarlyEscape(option)}" ${raw === option ? 'selected' : ''}>${scholarlyEscape(option)}</option>`).join('')}</select></label>`;
  }
  if (scholarlyStructuredType(item.type)) {
    return `<label class="config-item">${label}<textarea rows="4" ${attributes} placeholder="${scholarlyCopy('JSON, for example [...] or {...}', '填写 JSON，例如 [...] 或 {...}')}">${scholarlyEscape(raw)}</textarea></label>`;
  }
  return `<label class="config-item">${label}<input type="${scholarlyNumberOnly(item.type) ? 'number' : 'text'}" ${attributes} value="${scholarlyEscape(raw)}" placeholder="${item.default !== undefined ? `${scholarlyCopy('Default', '默认值')}: ${scholarlyEscape(item.default)}` : scholarlyCopy('Leave blank', '留空')}" /></label>`;
}

function scholarlyFilterLayouts(): void {
  const query = scholarlyById<HTMLInputElement>('layout-search').value.trim().toLowerCase();
  const category = scholarlyById<HTMLSelectElement>('layout-category').value;
  let visible = 0;
  document.querySelectorAll<HTMLElement>('.layout-card').forEach(card => {
    const matchesQuery = !query || Boolean(card.dataset.layoutSearch?.includes(query));
    const matchesCategory = !category || card.dataset.layoutCategory === category;
    card.hidden = !(matchesQuery && matchesCategory);
    if (!card.hidden) visible += 1;
  });
  scholarlyById('layout-count').textContent = scholarlyData.language === 'zh-cn'
    ? `${visible} / ${scholarlyData.layouts.length}`
    : `${visible} of ${scholarlyData.layouts.length}`;
  scholarlyById('layout-filter-empty').hidden = visible > 0;
}

function scholarlyAddSlide(layoutId: string): void {
  const layout = scholarlyLayoutById(layoutId);
  if (!layout) return;
  const usesTitleConfig = layout.id !== 'cover' && Boolean(layout.config?.some(item => item.name === 'title'));
  const slide: ScholarlySlide = {
    id: `slide-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    layout: layout.id,
    title: layout.displayLabel,
    body: '',
    bullets: [],
    image: '',
    caption: '',
    config: {},
    slots: {},
    heading: !usesTitleConfig,
    titleKey: usesTitleConfig ? 'title' : '',
    configSource: ''
  };
  scholarlyState.slides.push(slide);
  scholarlySelectedId = slide.id;
  scholarlyMarkDirty();
  scholarlyRenderSlides();
  scholarlyRenderInspector();
  scholarlyRevealContentOnNarrowView();
}

function scholarlyMoveSlide(id: string, direction: number): void {
  const index = scholarlyState.slides.findIndex(slide => slide.id === id);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= scholarlyState.slides.length) return;
  const [slide] = scholarlyState.slides.splice(index, 1);
  scholarlyState.slides.splice(target, 0, slide);
  scholarlyMarkDirty();
  scholarlyRenderSlides();
}

function scholarlyDeleteSlide(id: string): void {
  const index = scholarlyState.slides.findIndex(slide => slide.id === id);
  if (index < 0) return;
  const slide = scholarlyState.slides[index];
  if (!window.confirm(scholarlyData.language === 'zh-cn'
    ? `要从大纲中删除“${slide.title}”吗？`
    : `Delete “${slide.title}” from the outline?`)) return;
  scholarlyState.slides.splice(index, 1);
  scholarlySelectedId = scholarlyState.slides[Math.min(index, scholarlyState.slides.length - 1)]?.id || '';
  scholarlyMarkDirty();
  scholarlyRenderSlides();
  scholarlyRenderInspector();
}

function scholarlyChangeLayout(layoutId: string): void {
  const slide = scholarlySelectedSlide();
  const layout = scholarlyLayoutById(layoutId);
  if (!slide || !layout || slide.layout === layoutId) return;
  const usesTitleConfig = layout.id !== 'cover' && Boolean(layout.config?.some(item => item.name === 'title'));
  slide.layout = layout.id;
  slide.heading = !usesTitleConfig;
  slide.titleKey = usesTitleConfig ? 'title' : '';
  slide.configSource = '';
  slide.config = {};
  slide.slots = {};
  scholarlyMarkDirty();
  scholarlyRenderSlides();
  scholarlyRenderInspector();
}

function scholarlyUpdateConfig(input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): void {
  const slide = scholarlySelectedSlide();
  if (!slide || !input.dataset.configName || !input.dataset.configType) return;
  const parsed = scholarlyParseConfig(input.value, input.dataset.configType);
  input.setCustomValidity(parsed.error);
  input.setAttribute('aria-invalid', parsed.error ? 'true' : 'false');
  if (input.value.trim()) slide.config[input.dataset.configName] = parsed.value;
  else delete slide.config[input.dataset.configName];
  scholarlyMarkDirty();
  scholarlyRequestPreview();
}

function scholarlyValidateDeck(): boolean {
  if (!scholarlyState.title.trim()) {
    scholarlyShowMessage(scholarlyCopy(
      'Add a presentation title before creating the Markdown file.',
      '请先填写演示标题，再生成 Markdown。'
    ), true);
    scholarlyById<HTMLInputElement>('deck-title').focus();
    return false;
  }
  if (!scholarlyState.slides.length) {
    scholarlyShowMessage(scholarlyCopy(
      'Add at least one slide before creating the Markdown file.',
      '请至少添加一页，再生成 Markdown。'
    ), true);
    return false;
  }
  for (const slide of scholarlyState.slides) {
    if (slide.configSource) continue;
    const layout = scholarlyLayoutById(slide.layout);
    for (const item of layout?.config || []) {
      const value = slide.config[item.name];
      const raw = typeof value === 'object' ? JSON.stringify(value) : String(value ?? '');
      const error = value === undefined
        ? item.required
          ? scholarlyData.language === 'zh-cn'
            ? `此布局必须填写 ${item.name}。`
            : `${item.name} is required for this layout.`
          : ''
        : scholarlyParseConfig(raw, item.type).error;
      if (!error) continue;
      scholarlySelectedId = slide.id;
      scholarlyRenderSlides();
      scholarlyRenderInspector();
      scholarlyById<HTMLDetailsElement>('layout-settings').open = true;
      scholarlyShowMessage(`${slide.title}: ${error}`, true);
      const input = document.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(`[data-config-name="${CSS.escape(item.name)}"]`);
      input?.setCustomValidity(error);
      input?.setAttribute('aria-invalid', 'true');
      input?.focus();
      input?.reportValidity();
      return false;
    }
  }
  return true;
}

function scholarlyRevealContentOnNarrowView(): void {
  if (window.matchMedia('(max-width: 1100px)').matches)
    scholarlyById('content-heading').scrollIntoView({ block: 'start' });
}

function scholarlyParseConfig(raw: string, type: string): { value: unknown; error: string } {
  const value = raw.trim();
  if (!value) return { value: undefined, error: '' };
  if (scholarlyStructuredType(type)) {
    try { return { value: JSON.parse(value), error: '' }; }
    catch { return { value: raw, error: scholarlyCopy('Enter valid JSON.', '请输入有效的 JSON。') }; }
  }
  if (scholarlyBooleanOnly(type)) {
    if (/^(true|false)$/i.test(value)) return { value: value.toLowerCase() === 'true', error: '' };
    return { value: raw, error: scholarlyCopy('Choose true or false.', '请选择 true 或 false。') };
  }
  if (scholarlyNumberOnly(type)) {
    const number = Number(value);
    return Number.isFinite(number)
      ? { value: number, error: '' }
      : { value: raw, error: scholarlyCopy('Enter a valid number.', '请输入有效数字。') };
  }
  return { value, error: '' };
}

function scholarlyStructuredType(type: string): boolean {
  return /\[\]|Array<|\{/.test(type);
}

function scholarlyBooleanOnly(type: string): boolean {
  return /^\s*boolean\s*$/i.test(type);
}

function scholarlyNumberOnly(type: string): boolean {
  return /^\s*number\s*$/i.test(type);
}

function scholarlyRequestPreview(): void {
  window.clearTimeout(scholarlyPreviewTimer);
  scholarlyPreviewTimer = window.setTimeout(() => {
    const slide = scholarlySelectedSlide();
    if (!slide) return;
    scholarlyVscode.postMessage({
      type: 'previewSelectedSlide',
      state: { ...scholarlyState, slides: [slide] }
    });
  }, 100);
}

function scholarlyPost(type: 'generateNewDocument' | 'insertSelectedSlide'): void {
  if (!scholarlyValidateDeck()) return;
  if (type === 'insertSelectedSlide') {
    const slide = scholarlySelectedSlide();
    if (!slide) return;
    scholarlyVscode.postMessage({ type, state: { ...scholarlyState, slides: [slide] } });
    return;
  }
  scholarlyVscode.postMessage({ type, state: scholarlyState });
}

function scholarlyMarkDirty(): void {
  scholarlyDirty = true;
  scholarlySaveState();
}

function scholarlySaveState(): void {
  scholarlyVscode.setState({ state: scholarlyState, selectedId: scholarlySelectedId, dirty: scholarlyDirty });
}

function scholarlyShowMessage(text: string, error = false): void {
  const message = scholarlyById<HTMLParagraphElement>('builder-message');
  message.textContent = text;
  message.classList.toggle('is-error', error);
  message.hidden = false;
  window.clearTimeout(scholarlyMessageTimer);
  scholarlyMessageTimer = window.setTimeout(() => { message.hidden = true; }, error ? 7000 : 4200);
}

function scholarlyHumanize(value: string): string {
  return value.replace(/[-_]+/g, ' ').replace(/\b\w/g, character => character.toUpperCase());
}

function scholarlyIcon(name: 'up' | 'down' | 'delete'): string {
  const paths = {
    up: '<path d="M8 13V3m0 0L4 7m4-4 4 4"/>',
    down: '<path d="M8 3v10m0 0 4-4m-4 4L4 9"/>',
    delete: '<path d="M3 4h10M6 4V2.75h4V4m-5.5 0 .65 9h5.7l.65-9M6.75 6.5v4m2.5-4v4"/>'
  };
  return `<svg viewBox="0 0 16 16" aria-hidden="true">${paths[name]}</svg>`;
}

function scholarlyEscape(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character] || character);
}

scholarlyById('template-list').addEventListener('click', event => {
  const target = event.target as HTMLElement;
  const option = target.closest<HTMLElement>('[data-template-id]');
  if (option?.dataset.templateId) scholarlyApplyTemplate(option.dataset.templateId);
});

scholarlyById('layout-grid').addEventListener('click', event => {
  const target = event.target as HTMLElement;
  const card = target.closest<HTMLElement>('[data-layout-id]');
  if (card?.dataset.layoutId) scholarlyAddSlide(card.dataset.layoutId);
});

scholarlyById('layout-search').addEventListener('input', scholarlyFilterLayouts);
scholarlyById('layout-category').addEventListener('change', scholarlyFilterLayouts);

scholarlyById('slide-list').addEventListener('click', event => {
  const target = event.target as HTMLElement;
  const item = target.closest<HTMLElement>('[data-slide-id]');
  if (!item?.dataset.slideId) return;
  const action = target.closest<HTMLElement>('[data-action]')?.dataset.action;
  if (action === 'up') scholarlyMoveSlide(item.dataset.slideId, -1);
  else if (action === 'down') scholarlyMoveSlide(item.dataset.slideId, 1);
  else if (action === 'delete') scholarlyDeleteSlide(item.dataset.slideId);
  else {
    scholarlySelectedId = item.dataset.slideId;
    scholarlyRenderSlides();
    scholarlyRenderInspector();
    scholarlySaveState();
    scholarlyRevealContentOnNarrowView();
  }
});

scholarlyById('slide-list').addEventListener('keydown', event => {
  const keyboard = event as KeyboardEvent;
  if (keyboard.key !== 'Enter' && keyboard.key !== ' ') return;
  const target = keyboard.target as HTMLElement;
  if (target.closest('[data-action]')) return;
  const item = target.closest<HTMLElement>('[data-slide-id]');
  if (!item?.dataset.slideId) return;
  keyboard.preventDefault();
  scholarlySelectedId = item.dataset.slideId;
  scholarlyRenderSlides();
  scholarlyRenderInspector();
  scholarlySaveState();
  scholarlyRevealContentOnNarrowView();
});

scholarlyById('slide-list').addEventListener('dragstart', event => {
  const drag = event as DragEvent;
  const item = (drag.target as HTMLElement).closest<HTMLElement>('[data-slide-id]');
  if (!item?.dataset.slideId || !drag.dataTransfer) return;
  scholarlyDragId = item.dataset.slideId;
  item.classList.add('dragging');
  drag.dataTransfer.effectAllowed = 'move';
});

scholarlyById('slide-list').addEventListener('dragover', event => event.preventDefault());
scholarlyById('slide-list').addEventListener('drop', event => {
  const drag = event as DragEvent;
  drag.preventDefault();
  const item = (drag.target as HTMLElement).closest<HTMLElement>('[data-slide-id]');
  if (!item?.dataset.slideId || !scholarlyDragId || item.dataset.slideId === scholarlyDragId) return;
  const from = scholarlyState.slides.findIndex(slide => slide.id === scholarlyDragId);
  const to = scholarlyState.slides.findIndex(slide => slide.id === item.dataset.slideId);
  if (from < 0 || to < 0) return;
  const [slide] = scholarlyState.slides.splice(from, 1);
  scholarlyState.slides.splice(to, 0, slide);
  scholarlyMarkDirty();
  scholarlyRenderSlides();
});
scholarlyById('slide-list').addEventListener('dragend', () => {
  scholarlyDragId = '';
  document.querySelectorAll('.slide-item.dragging').forEach(item => item.classList.remove('dragging'));
});

scholarlyById<HTMLInputElement>('deck-title').addEventListener('input', event => {
  const value = (event.target as HTMLInputElement).value;
  scholarlyState.title = value;
  const cover = scholarlyState.slides.find(slide => slide.layout === 'cover');
  if (cover) cover.title = value;
  scholarlyMarkDirty();
  scholarlyRenderSlides();
  if (cover?.id === scholarlySelectedId) scholarlyRenderInspector();
});

scholarlyById<HTMLInputElement>('deck-subtitle').addEventListener('input', event => {
  const value = (event.target as HTMLInputElement).value;
  scholarlyState.subtitle = value;
  const cover = scholarlyState.slides.find(slide => slide.layout === 'cover');
  if (cover) cover.body = value;
  scholarlyMarkDirty();
  if (cover?.id === scholarlySelectedId) scholarlyRenderInspector();
});

for (const [id, key] of [
  ['color-theme', 'colorTheme'],
  ['font-theme', 'fontTheme'],
  ['content-mode', 'contentMode'],
  ['chrome-mode', 'chromeMode'],
  ['section-mode', 'sectionMode']
] as const) {
  scholarlyById<HTMLSelectElement>(id).addEventListener('change', event => {
    scholarlyState[key] = (event.target as HTMLSelectElement).value;
    scholarlyMarkDirty();
    if (key === 'colorTheme') scholarlyRenderThemeSummary();
  });
}

scholarlyById<HTMLSelectElement>('slide-layout').addEventListener('change', event =>
  scholarlyChangeLayout((event.target as HTMLSelectElement).value)
);

scholarlyById<HTMLInputElement>('slide-title').addEventListener('input', event => {
  const slide = scholarlySelectedSlide();
  if (!slide) return;
  slide.title = (event.target as HTMLInputElement).value;
  scholarlyMarkDirty();
  scholarlyRenderSlides();
  scholarlyRequestPreview();
});

scholarlyById<HTMLTextAreaElement>('slide-body').addEventListener('input', event => {
  const slide = scholarlySelectedSlide();
  if (!slide) return;
  slide.body = (event.target as HTMLTextAreaElement).value;
  scholarlyMarkDirty();
  scholarlyRequestPreview();
});

scholarlyById('slot-fields').addEventListener('input', event => {
  const input = event.target as HTMLTextAreaElement;
  const slide = scholarlySelectedSlide();
  if (!slide || !input.dataset.slotName) return;
  if (input.value.trim()) slide.slots[input.dataset.slotName] = input.value;
  else delete slide.slots[input.dataset.slotName];
  scholarlyMarkDirty();
  scholarlyRequestPreview();
});

scholarlyById('config-fields').addEventListener('input', event =>
  scholarlyUpdateConfig(event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)
);

scholarlyById('create-markdown').addEventListener('click', () => scholarlyPost('generateNewDocument'));
scholarlyById('insert-selected').addEventListener('click', () => scholarlyPost('insertSelectedSlide'));

window.addEventListener('message', event => {
  if (event.data?.type === 'selectedSlidePreview')
    scholarlyById('markdown-preview').textContent = event.data.markdown || '';
});

document.addEventListener('error', event => {
  if (event.target instanceof HTMLImageElement) event.target.hidden = true;
}, true);

const scholarlyPrevious = scholarlyVscode.getState();
if (scholarlyPrevious?.state) {
  scholarlyState = scholarlyNormalizeDeck(scholarlyPrevious.state);
  scholarlySelectedId = scholarlyPrevious.selectedId || scholarlyState.slides[0]?.id || '';
  scholarlyDirty = Boolean(scholarlyPrevious.dirty);
  scholarlyRenderAll();
} else {
  const initialId = scholarlyData.language === 'zh-cn' ? 'zh' : 'paper-talk';
  const initial = scholarlyData.templates.find(template => template.id === initialId)
    || scholarlyData.templates[0];
  if (initial) scholarlyApplyTemplate(initial.id, false);
  else {
    scholarlyState = scholarlyNormalizeDeck({
      templateId: '', title: scholarlyCopy('Scholarly Presentation', '学术演示'), subtitle: '',
      footerMiddle: scholarlyCopy('Conference Name', '会议名称'),
      lang: scholarlyData.language === 'zh-cn' ? 'zh-CN' : 'en',
      colorTheme: 'classic-blue', fontTheme: 'classic', contentMode: '', chromeMode: 'dark',
      sectionMode: 'dark', frontmatterSource: '', slides: []
    });
    scholarlyRenderAll();
  }
}
