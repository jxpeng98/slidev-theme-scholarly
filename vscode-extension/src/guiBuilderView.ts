import type { BuilderDeckState } from './guiBuilderModel';
import type { CatalogConfigEntry, CatalogSlotEntry } from './sharedData';
import { WEBVIEW_THEME_CSS } from './webviewTheme';

export interface GuiBuilderLayoutOption {
  id: string;
  label: string;
  description: string;
  category?: string;
  image?: string;
  useFor?: string;
  features?: string[];
  tags?: string[];
  config?: CatalogConfigEntry[];
  slots?: CatalogSlotEntry[];
}

export interface GuiBuilderTemplateOption {
  id: string;
  label: string;
  description: string;
  deck: BuilderDeckState;
}

export interface GuiBuilderThemePalette {
  primary?: string;
  primaryLight?: string;
  accent?: string;
  background?: string;
  foreground?: string;
}

export interface GuiBuilderThemeOption {
  value: string;
  label: string;
  description?: string;
  palette?: GuiBuilderThemePalette;
}

export interface GuiBuilderModeOption {
  value: string;
  label: string;
}

export interface GuiBuilderHtmlOptions {
  nonce: string;
  cspSource: string;
  language?: 'en' | 'zh-cn';
  styleUri: string;
  scriptUri: string;
  layouts: GuiBuilderLayoutOption[];
  templates: GuiBuilderTemplateOption[];
  colorThemes: GuiBuilderThemeOption[];
  fontThemes: GuiBuilderThemeOption[];
  contentModes?: GuiBuilderModeOption[];
  surfaceModes?: GuiBuilderModeOption[];
}

type NormalizedLayoutOption = GuiBuilderLayoutOption & {
  displayLabel: string;
  displayCategory: string;
  filterCategory: string;
};

export function renderGuiBuilderHtml(options: GuiBuilderHtmlOptions): string {
  const language = options.language ?? 'en';
  const copy = (english: string, chinese: string) => language === 'zh-cn' ? chinese : english;
  const layouts = options.layouts.map(normalizeLayout);
  // Presentation palette data; these colors preview slide content, not extension chrome.
  const data = JSON.stringify({
    language,
    layouts,
    templates: options.templates,
    colorThemes: options.colorThemes,
    fontThemes: options.fontThemes,
    contentModes: options.contentModes ?? [],
    surfaceModes: options.surfaceModes ?? []
  }).replace(/</g, '\\u003c');
  const categories = Array.from(new Map(
    layouts.map(layout => [layout.filterCategory, layout.displayCategory])
  ).entries());

  return `<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${options.cspSource} data:; style-src 'nonce-${options.nonce}' ${options.cspSource}; script-src 'nonce-${options.nonce}' ${options.cspSource};" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${copy('Slidev Scholarly Deck Builder', 'Slidev Scholarly Deck Builder')}</title>
  <style nonce="${options.nonce}">${WEBVIEW_THEME_CSS}</style>
  <style nonce="${options.nonce}" id="theme-palette-style"></style>
  <link rel="stylesheet" href="${escapeHtml(options.styleUri)}" />
</head>
<body>
  <div class="app">
    <header class="topbar">
      <div>
        <h1>Scholarly Deck Builder</h1>
        <p>${copy('Choose a workflow, arrange the slides, then continue in Markdown.', '选择工作流并调整页面，再生成 Markdown 继续编辑。')}</p>
      </div>
      <div class="topbar-actions">
        <button class="secondary" id="insert-selected" disabled>${copy('Insert selected slide', '插入当前页')}</button>
        <button class="primary" id="create-markdown">${copy('Create Markdown', '生成 Markdown')}</button>
      </div>
    </header>

    <p id="builder-message" class="message" role="status" aria-live="polite" hidden></p>

    <main class="workspace">
      <aside class="start-pane" aria-labelledby="workflow-heading">
        <section class="pane-section workflow-section">
          <div class="section-heading">
            <h2 id="workflow-heading"><span class="step-number">1</span> ${copy('Choose a workflow', '选择工作流')}</h2>
            <span id="workflow-count" class="section-count"></span>
          </div>
          <p class="section-help">${copy('Start from a ready-made sequence. Choosing another one replaces the current outline.', '先从一套现成的页面顺序开始。改选其他工作流会替换当前大纲。')}</p>
          <div id="template-list" class="template-list" role="radiogroup" aria-label="${copy('Deck workflow', '演示工作流')}"></div>
        </section>

        <details class="deck-settings">
          <summary>${copy('Deck details and theme', '演示信息与主题')}</summary>
          <div class="settings-fields">
            <div class="field">
              <label for="deck-title">${copy('Presentation title', '演示标题')}</label>
              <input id="deck-title" />
            </div>
            <div class="field">
              <label for="deck-subtitle">${copy('Subtitle', '副标题')}</label>
              <input id="deck-subtitle" />
            </div>
            <div class="field">
              <label for="color-theme">${copy('Color theme', '配色主题')}</label>
              <select id="color-theme"></select>
            </div>
            <div class="field">
              <label for="font-theme">${copy('Font theme', '字体主题')}</label>
              <select id="font-theme"></select>
            </div>
            <div class="surface-fields">
              <div class="field">
                <label for="content-mode">${copy('Content slides', '内容页')}</label>
                <select id="content-mode"></select>
              </div>
              <div class="field">
                <label for="chrome-mode">${copy('Headers and footers', '页眉与页脚')}</label>
                <select id="chrome-mode"></select>
              </div>
              <div class="field">
                <label for="section-mode">${copy('Section dividers', '章节页')}</label>
                <select id="section-mode"></select>
              </div>
            </div>
            <div class="theme-summary" aria-live="polite">
              <ol id="theme-swatches" class="theme-swatches" aria-label="${copy('Current presentation color palette', '当前演示的配色')}">
                <li></li><li></li><li></li><li></li><li></li>
              </ol>
              <div><strong id="theme-name"></strong><p id="theme-description"></p></div>
            </div>
          </div>
        </details>

        <section class="pane-section library-section" aria-labelledby="library-heading">
          <div class="section-heading">
            <h2 id="library-heading">${copy('Add another layout', '添加其他布局')}</h2>
            <span id="layout-count" class="section-count">${layouts.length}</span>
          </div>
          <div class="library-tools">
            <label class="field">
              <span>${copy('Search', '搜索')}</span>
              <input id="layout-search" type="search" placeholder="${copy('Name or use', '按名称或用途搜索')}" autocomplete="off" />
            </label>
            <label class="field">
              <span>${copy('Category', '分类')}</span>
              <select id="layout-category">
                <option value="">${copy('All', '全部')}</option>
                ${categories.map(([value, label]) => `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`).join('')}
              </select>
            </label>
          </div>
          <div id="layout-grid" class="layout-grid">${layouts.map(layout => renderLayoutCard(layout, language)).join('')}</div>
          <p id="layout-filter-empty" class="empty" hidden>${copy('No layouts match this search.', '没有符合条件的布局。')}</p>
        </section>
      </aside>

      <section class="outline-pane" aria-labelledby="outline-heading">
        <div class="section-heading sticky-heading">
          <div>
            <h2 id="outline-heading"><span class="step-number">2</span> ${copy('Arrange the slides', '调整页面顺序')}</h2>
            <p class="section-help">${copy('Choose a slide to check its layout, then add your content.', '选择一页，查看布局用途并填写内容。')}</p>
          </div>
          <span id="slide-count" class="section-count"></span>
        </div>
        <div id="slide-list" class="slide-list" role="list" aria-label="${copy('Slides in deck', '演示中的页面')}"></div>
      </section>

      <section class="content-pane" aria-labelledby="content-heading">
        <div class="section-heading sticky-heading">
          <div>
            <h2 id="content-heading"><span class="step-number">3</span> ${copy('Write the slide', '填写当前页')}</h2>
            <p class="section-help">${copy('Use the layout as a starting point. Preview the finished deck in Slidev.', '先按布局填写内容，最终效果请在 Slidev 中预览。')}</p>
          </div>
        </div>
        <div id="inspector-empty" class="empty-state">${copy('Choose a slide from the outline to begin.', '请先从大纲中选择一页。')}</div>
        <div id="inspector" hidden>
          <figure class="selected-layout">
            <div class="selected-preview"><img id="selected-layout-image" src="${escapeHtml(layouts[0]?.image || '')}" alt="" hidden /></div>
            <figcaption><strong id="selected-layout-name"></strong><span id="selected-layout-description"></span></figcaption>
          </figure>

          <div class="content-fields">
            <label class="field">
              <span>${copy('Layout', '布局')}</span>
              <select id="slide-layout"></select>
            </label>
            <label class="field">
              <span>${copy('Slide title', '页面标题')}</span>
              <input id="slide-title" />
            </label>
            <label class="field">
              <span>${copy('Main content', '主要内容')} <small>Markdown</small></span>
              <textarea id="slide-body" rows="9" placeholder="${copy('Write the main point, evidence, or explanation for this slide.', '写下这一页的观点、证据或说明。')}"></textarea>
            </label>
            <div id="slot-fields" class="slot-fields"></div>
          </div>

          <details id="layout-settings" class="inspector-details">
            <summary>${copy('Layout settings', '布局设置')}</summary>
            <p id="template-settings-note" class="details-note" hidden>${copy('Settings supplied by the workflow are kept in the generated Markdown. Edit them there, or choose another layout to reset them.', '工作流自带的设置会原样写入 Markdown。生成后可直接修改，也可以更换布局并重新设置。')}</p>
            <div id="config-fields" class="config-fields"></div>
          </details>

          <details class="inspector-details">
            <summary>${copy('Generated Markdown for this slide', '当前页生成的 Markdown')}</summary>
            <pre id="markdown-preview" class="markdown-preview"></pre>
          </details>
        </div>
      </section>
    </main>
  </div>
  <script nonce="${options.nonce}">window.scholarlyBuilderData = ${data};</script>
  <script nonce="${options.nonce}" src="${escapeHtml(options.scriptUri)}"></script>
</body>
</html>`;
}

function normalizeLayout(layout: GuiBuilderLayoutOption): NormalizedLayoutOption {
  const category = layout.category || 'layout';
  return {
    ...layout,
    displayLabel: humanizeLabel(layout.label || layout.id),
    displayCategory: humanizeLabel(category),
    filterCategory: category.toLowerCase()
  };
}

function renderLayoutCard(layout: NormalizedLayoutOption, language: 'en' | 'zh-cn'): string {
  const search = [
    layout.id,
    layout.displayLabel,
    layout.displayCategory,
    layout.description,
    layout.useFor,
    ...(layout.features ?? []),
    ...(layout.tags ?? [])
  ].filter(Boolean).join(' ').toLowerCase();

  const title = language === 'zh-cn'
    ? `添加“${layout.displayLabel}”页面`
    : `Add ${layout.displayLabel} slide`;
  return `<button class="layout-card" data-layout-id="${escapeHtml(layout.id)}" data-layout-category="${escapeHtml(layout.filterCategory)}" data-layout-search="${escapeHtml(search)}" title="${escapeHtml(title)}">
    ${layout.image ? `<img src="${escapeHtml(layout.image)}" alt="" width="112" height="84" loading="lazy" />` : ''}
    <span><strong>${escapeHtml(layout.displayLabel)}</strong><small>${escapeHtml(layout.displayCategory)}</small><span>${escapeHtml(layout.useFor || layout.description)}</span></span>
  </button>`;
}

function humanizeLabel(value: string): string {
  const acronyms: Record<string, string> = { ai: 'AI', api: 'API', qr: 'QR', toc: 'TOC' };
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map(word => acronyms[word.toLowerCase()] || word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
