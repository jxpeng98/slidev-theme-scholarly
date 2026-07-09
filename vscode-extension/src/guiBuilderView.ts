import { WEBVIEW_THEME_CSS } from './webviewTheme';
import type { CatalogConfigEntry, CatalogSlotEntry } from './sharedData';

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
  layouts: GuiBuilderLayoutOption[];
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

const paletteKeys: Array<keyof GuiBuilderThemePalette> = [
  'primary',
  'primaryLight',
  'accent',
  'background',
  'foreground'
];

export function renderGuiBuilderHtml(options: GuiBuilderHtmlOptions): string {
  const layouts: NormalizedLayoutOption[] = options.layouts.map(layout => {
    const category = layout.category || 'layout';
    return {
      ...layout,
      displayLabel: humanizeLabel(layout.label || layout.id),
      displayCategory: humanizeLabel(category),
      filterCategory: category.toLowerCase()
    };
  });

  const data = JSON.stringify({
    layouts,
    colorThemes: options.colorThemes,
    fontThemes: options.fontThemes,
    contentModes: options.contentModes ?? [],
    surfaceModes: options.surfaceModes ?? []
  }).replace(/</g, '\\u003c');

  const categories = Array.from(new Map(
    layouts.map(layout => [layout.filterCategory, layout.displayCategory])
  ).entries());
  const categoryOptions = categories.map(([value, label]) =>
    `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`
  ).join('');

  const layoutCards = layouts.map(layout => {
    const searchText = [
      layout.id,
      layout.displayLabel,
      layout.displayCategory,
      layout.description,
      layout.useFor,
      ...(layout.features ?? []),
      ...(layout.tags ?? []),
      ...(layout.config ?? []).flatMap(item => [item.name, item.type, item.description, ...(item.options ?? [])]),
      ...(layout.slots ?? []).flatMap(slot => [slot.name, slot.description])
    ].filter(Boolean).join(' ').toLowerCase();
    const tags = (layout.tags ?? []).slice(0, 3).map(tag =>
      `<span class="layout-tag">${escapeHtml(humanizeLabel(tag))}</span>`
    ).join('');

    return `
      <button
        class="layout-card"
        draggable="true"
        data-layout-id="${escapeHtml(layout.id)}"
        data-layout-category="${escapeHtml(layout.filterCategory)}"
        data-layout-search="${escapeHtml(searchText)}"
        aria-label="Add ${escapeHtml(layout.displayLabel)} slide"
        title="Add ${escapeHtml(layout.displayLabel)} slide"
      >
        ${renderLayoutThumbnail(layout)}
        <span class="layout-card-copy">
          <span class="layout-card-heading">
            <span class="layout-name">${escapeHtml(layout.displayLabel)}</span>
            <span class="layout-category">${escapeHtml(layout.displayCategory)}</span>
          </span>
          <span class="layout-description">${escapeHtml(layout.description)}</span>
          ${tags ? `<span class="layout-tags" aria-label="Tags">${tags}</span>` : ''}
        </span>
      </button>
    `;
  }).join('');

  const paletteCss = options.colorThemes.map((theme, themeIndex) => {
    if (!theme.palette) return '';
    return paletteKeys.map((key, swatchIndex) =>
      `.theme-swatches.palette-${themeIndex} .theme-swatch:nth-child(${swatchIndex + 1}) { background-color: ${safePaletteColor(theme.palette?.[key])}; }`
    ).join('\n');
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${options.cspSource} data:; style-src 'nonce-${options.nonce}'; script-src 'nonce-${options.nonce}';" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Slidev Scholarly GUI Builder</title>
  <style nonce="${options.nonce}">
    ${WEBVIEW_THEME_CSS}

    :root {
      --builder-transition: 160ms ease;
    }

    [hidden] { display: none !important; }

    .app {
      display: grid;
      grid-template-rows: auto minmax(0, 1fr);
      height: 100vh;
      min-height: 100vh;
      overflow: hidden;
    }

    .toolbar {
      display: grid;
      gap: 10px;
      padding: 12px;
      border-bottom: 1px solid var(--sch-border);
      background: var(--sch-panel);
    }

    .toolbar-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .toolbar-heading h1 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      line-height: 1.25;
    }

    .toolbar-heading p {
      margin: 2px 0 0;
      color: var(--sch-muted);
      font-size: 12px;
    }

    .validation-message {
      margin: 0;
      padding: 7px 9px;
      border: 1px solid var(--sch-error);
      border-radius: var(--sch-radius-sm);
      color: var(--sch-error);
      background: var(--sch-card);
      font-size: 11px;
    }

    .settings-grid {
      display: grid;
      grid-template-columns: minmax(260px, 0.8fr) minmax(540px, 2fr);
      gap: 10px;
      min-width: 0;
    }

    .settings-group {
      min-width: 0;
      margin: 0;
      padding: 9px;
      border: 1px solid var(--sch-border);
      border-radius: var(--sch-radius-md);
      background: var(--sch-card);
    }

    .settings-group legend {
      padding: 0 5px;
      color: var(--sch-fg);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.03em;
      text-transform: uppercase;
    }

    .deck-fields,
    .theme-fields {
      display: grid;
      gap: 8px;
      min-width: 0;
    }

    .deck-fields {
      grid-template-columns: repeat(2, minmax(120px, 1fr));
    }

    .theme-fields {
      grid-template-columns: repeat(5, minmax(92px, 1fr));
    }

    .field {
      display: grid;
      gap: 4px;
      min-width: 0;
    }

    label,
    .field-label {
      color: var(--sch-muted);
      font-size: 11px;
      font-weight: 500;
    }

    input,
    textarea,
    select {
      width: 100%;
      min-width: 0;
      border-radius: var(--sch-radius-sm);
      padding: 6px 8px;
      transition: border-color var(--builder-transition), background-color var(--builder-transition);
    }

    textarea {
      min-height: 78px;
      resize: vertical;
    }

    button {
      transition: border-color var(--builder-transition), background-color var(--builder-transition), color var(--builder-transition), opacity var(--builder-transition);
    }

    button:disabled {
      cursor: default;
      color: var(--sch-disabled);
      opacity: 0.72;
    }

    .toolbar-actions,
    .button-row {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      white-space: nowrap;
    }

    .primary,
    .secondary,
    .icon-button,
    .layout-card {
      border: 1px solid var(--sch-border);
      border-radius: var(--sch-radius-sm);
    }

    .primary,
    .secondary {
      min-height: 32px;
      padding: 6px 11px;
    }

    .primary {
      border-color: var(--sch-accent);
      background: var(--sch-accent);
      color: var(--sch-accent-fg);
    }

    .primary:hover:not(:disabled) {
      border-color: var(--sch-accent-hover);
      background: var(--sch-accent-hover);
    }

    .secondary,
    .icon-button {
      background: var(--sch-secondary);
      color: var(--sch-secondary-fg);
    }

    .secondary:hover:not(:disabled),
    .icon-button:hover:not(:disabled) {
      background: var(--sch-secondary-hover);
    }

    .theme-summary {
      display: grid;
      grid-template-columns: auto minmax(120px, 1fr);
      gap: 8px;
      align-items: center;
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid var(--sch-border);
    }

    .theme-swatches {
      display: grid;
      grid-template-columns: repeat(5, 22px);
      gap: 4px;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .theme-swatch {
      display: block;
      width: 22px;
      aspect-ratio: 1;
      border: 1px solid var(--sch-border);
      border-radius: var(--sch-radius-sm);
      box-shadow: 0 1px 2px var(--sch-shadow);
    }

    .theme-copy {
      min-width: 0;
    }

    .theme-name {
      font-weight: 600;
    }

    .theme-description {
      margin: 1px 0 0;
      color: var(--sch-muted);
      font-size: 11px;
    }

    .main {
      display: grid;
      grid-template-columns: minmax(330px, 390px) minmax(280px, 1fr) minmax(280px, 350px);
      min-height: 0;
      background: var(--sch-bg);
    }

    .library,
    .slides,
    .inspector {
      min-height: 0;
      overflow: auto;
      padding: 12px;
      background: var(--sch-bg);
    }

    .library,
    .slides {
      border-right: 1px solid var(--sch-border);
    }

    .section-heading {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 10px;
    }

    h2 {
      margin: 0;
      font-size: 13px;
      font-weight: 600;
    }

    .section-count {
      color: var(--sch-muted);
      font-size: 11px;
    }

    .library-tools {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(104px, 0.55fr);
      gap: 8px;
      margin-bottom: 10px;
    }

    .layout-grid {
      display: grid;
      gap: 8px;
    }

    .layout-card {
      display: grid;
      grid-template-columns: 112px minmax(0, 1fr);
      gap: 9px;
      width: 100%;
      min-height: 102px;
      padding: 8px;
      overflow: hidden;
      text-align: left;
      background: var(--sch-card);
      color: var(--sch-fg);
    }

    .layout-card:hover {
      border-color: var(--sch-focus);
      background: var(--sch-hover);
      color: var(--sch-hover-fg);
    }

    .layout-card.dragging,
    .slide-item.dragging {
      opacity: 0.62;
    }

    .layout-thumbnail {
      position: relative;
      display: grid;
      place-items: center;
      width: 100%;
      aspect-ratio: 4 / 3;
      overflow: hidden;
      border: 1px solid var(--sch-border);
      border-radius: var(--sch-radius-sm);
      background: var(--sch-code-bg);
      color: var(--sch-muted);
    }

    .layout-thumbnail-image {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      background: var(--sch-code-bg);
    }

    .thumbnail-placeholder {
      display: grid;
      gap: 7px;
      width: 74%;
      color: var(--sch-muted);
    }

    .thumbnail-line {
      display: block;
      height: 2px;
      border-radius: var(--sch-radius-sm);
      background: currentColor;
      opacity: 0.55;
    }

    .thumbnail-line:first-child {
      width: 64%;
      height: 4px;
      opacity: 0.9;
    }

    .thumbnail-line:last-child {
      width: 82%;
    }

    .layout-card-copy,
    .layout-card-heading {
      display: grid;
      min-width: 0;
    }

    .layout-card-copy {
      align-content: start;
      gap: 4px;
    }

    .layout-card-heading {
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 6px;
      align-items: baseline;
    }

    .layout-name {
      overflow: hidden;
      font-weight: 600;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .layout-category {
      color: var(--sch-muted);
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.03em;
      text-transform: uppercase;
    }

    .layout-description,
    .empty,
    .filter-empty {
      color: var(--sch-muted);
      font-size: 12px;
    }

    .layout-description {
      display: -webkit-box;
      overflow: hidden;
      line-height: 1.35;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
    }

    .layout-tags,
    .feature-list {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .layout-tag,
    .feature-chip {
      display: inline-flex;
      align-items: center;
      min-width: 0;
      border: 1px solid var(--sch-border);
      border-radius: var(--sch-radius-lg);
      background: var(--sch-code-bg);
      color: var(--sch-muted);
      font-size: 10px;
      line-height: 1.4;
    }

    .layout-tag {
      max-width: 88px;
      padding: 1px 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .filter-empty {
      margin: 12px 0;
      padding: 12px;
      border: 1px dashed var(--sch-border);
      border-radius: var(--sch-radius-md);
      text-align: center;
    }

    .drop-zone {
      display: grid;
      align-content: start;
      gap: 8px;
      min-height: 360px;
      padding: 8px;
      border: 1px dashed var(--sch-border);
      border-radius: var(--sch-radius-md);
      background: var(--sch-bg);
      transition: border-color var(--builder-transition), background-color var(--builder-transition), color var(--builder-transition);
    }

    .drop-zone.drag-over {
      border-color: var(--sch-focus);
      background: var(--sch-drop);
      color: var(--sch-selected-fg);
    }

    .drop-zone.drag-over .empty {
      color: var(--sch-selected-fg);
    }

    .slide-item {
      display: grid;
      grid-template-columns: 32px minmax(0, 1fr) auto;
      gap: 8px;
      align-items: center;
      min-height: 58px;
      padding: 8px;
      border: 1px solid var(--sch-border);
      border-radius: var(--sch-radius-md);
      background: var(--sch-card);
      color: var(--sch-fg);
      cursor: pointer;
      transition: border-color var(--builder-transition), background-color var(--builder-transition), color var(--builder-transition), opacity var(--builder-transition);
    }

    .slide-item:hover {
      background: var(--sch-hover);
      color: var(--sch-hover-fg);
    }

    .slide-item.active {
      border-color: var(--sch-focus);
      background: var(--sch-selected);
      color: var(--sch-selected-fg);
    }

    .slide-item.active .slide-layout {
      color: var(--sch-selected-fg);
      opacity: 0.78;
    }

    .slide-index {
      display: grid;
      place-items: center;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--sch-badge-bg);
      color: var(--sch-badge-fg);
      font-size: 12px;
      font-variant-numeric: tabular-nums;
    }

    .slide-title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: 600;
    }

    .slide-layout {
      overflow: hidden;
      color: var(--sch-muted);
      font-size: 12px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .slide-actions {
      display: flex;
      gap: 4px;
    }

    .icon-button {
      display: inline-grid;
      place-items: center;
      width: 30px;
      height: 30px;
      padding: 0;
    }

    .icon-button svg {
      width: 15px;
      height: 15px;
      fill: none;
      stroke: currentColor;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-width: 1.5;
    }

    .icon-button.destructive {
      color: var(--sch-error);
    }

    .icon-button.destructive:hover:not(:disabled) {
      border-color: var(--sch-error);
      color: var(--sch-error);
    }

    #inspector-fields {
      display: grid;
      gap: 10px;
    }

    .layout-context {
      display: grid;
      gap: 8px;
      padding: 9px;
      border: 1px solid var(--sch-border);
      border-radius: var(--sch-radius-md);
      background: var(--sch-card);
    }

    .layout-context p {
      margin: 2px 0 0;
      color: var(--sch-muted);
      font-size: 12px;
    }

    .feature-list {
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .feature-chip {
      padding: 2px 6px;
    }

    .inspector-config-list,
    .inspector-slot-list {
      display: grid;
      gap: 6px;
      margin: 4px 0 0;
      padding: 0;
      list-style: none;
    }

    .inspector-config-item {
      display: grid;
      gap: 4px;
      padding: 7px 8px;
      border: 1px solid var(--sch-border);
      border-radius: var(--sch-radius-sm);
      background: var(--sch-bg);
    }

    .inspector-config-item.is-required {
      border-left: 2px solid var(--sch-focus);
    }

    .inspector-config-heading {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 6px;
    }

    .inspector-config-name,
    .inspector-slot-name {
      color: var(--sch-link);
      font-family: var(--vscode-editor-font-family, monospace);
      font-size: 11px;
      font-weight: 600;
    }

    .inspector-config-type,
    .inspector-config-description,
    .inspector-slot-description,
    .inspector-config-empty,
    .inspector-config-scope {
      color: var(--sch-muted);
      font-size: 10px;
    }

    .inspector-config-scope {
      margin: 3px 0 0;
      line-height: 1.45;
    }

    .inspector-config-type {
      overflow-wrap: anywhere;
      text-align: right;
    }

    .inspector-config-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .inspector-config-meta span {
      padding: 1px 4px;
      border-radius: var(--sch-radius-sm);
      color: var(--sch-muted);
      background: var(--sch-code-bg);
      font: 9px/1.5 var(--vscode-editor-font-family, monospace);
    }

    .inspector-config-editor,
    .inspector-slot-editor {
      display: grid;
      gap: 3px;
      margin-top: 2px;
    }

    .inspector-config-editor label,
    .inspector-slot-editor label,
    .inspector-slot-note {
      color: var(--sch-muted);
      font-size: 9px;
    }

    .inspector-config-editor textarea,
    .inspector-slot-editor textarea {
      min-height: 54px;
      font-family: var(--vscode-editor-font-family, monospace);
      font-size: 11px;
    }

    .inspector-config-editor :where(input, textarea, select)[aria-invalid="true"] {
      border-color: var(--sch-error);
    }

    .inspector-slot-list li {
      display: grid;
      gap: 4px;
      padding-left: 7px;
      border-left: 2px solid var(--sch-focus);
    }

    .preview {
      margin: 2px 0 0;
      padding: 10px;
      max-height: 220px;
      overflow: auto;
      border: 1px solid var(--sch-border);
      border-radius: var(--sch-radius-md);
      background: var(--sch-code-bg);
      color: var(--sch-code-fg);
      white-space: pre-wrap;
      font-family: var(--vscode-editor-font-family, monospace);
      font-size: 12px;
    }

    /* Presentation palette data; these colors preview slide content, not extension chrome. */
    ${paletteCss}

    @media (max-width: 1120px) {
      .settings-grid {
        grid-template-columns: 1fr;
      }

      .main {
        grid-template-columns: minmax(300px, 350px) minmax(280px, 1fr);
      }

      .inspector {
        grid-column: 1 / -1;
        border-top: 1px solid var(--sch-border);
      }
    }

    @media (max-width: 760px) {
      .app {
        height: auto;
        overflow: visible;
      }

      .toolbar-heading {
        align-items: stretch;
        flex-direction: column;
      }

      .toolbar-actions {
        justify-content: stretch;
      }

      .toolbar-actions button {
        flex: 1;
      }

      .deck-fields,
      .theme-fields,
      .main {
        grid-template-columns: 1fr;
      }

      .library,
      .slides {
        border-right: 0;
        border-bottom: 1px solid var(--sch-border);
      }

      .inspector {
        grid-column: auto;
      }
    }

    @media (max-width: 430px) {
      .library-tools,
      .layout-card {
        grid-template-columns: 1fr;
      }

      .layout-thumbnail {
        max-width: 176px;
      }

      .layout-card-heading {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="app">
    <header class="toolbar">
      <div class="toolbar-heading">
        <div>
          <h1>Presentation setup</h1>
          <p>Shape the deck, then add and arrange layouts below.</p>
        </div>
        <div class="toolbar-actions">
          <button class="secondary" id="insertIntoEditor">Insert</button>
          <button class="primary" id="generateNewDocument">New Markdown</button>
        </div>
      </div>
      <p id="builder-validation" class="validation-message" role="alert" hidden></p>
      <div class="settings-grid">
        <fieldset class="settings-group">
          <legend>Deck details</legend>
          <div class="deck-fields">
            <div class="field">
              <label for="deck-title">Title</label>
              <input id="deck-title" value="Scholarly Presentation" />
            </div>
            <div class="field">
              <label for="deck-subtitle">Subtitle</label>
              <input id="deck-subtitle" value="Generated from GUI Builder" />
            </div>
          </div>
        </fieldset>
        <fieldset class="settings-group">
          <legend>Theme &amp; surfaces</legend>
          <div class="theme-fields">
            <div class="field">
              <label for="color-theme">Color theme</label>
              <select id="color-theme"></select>
            </div>
            <div class="field">
              <label for="font-theme">Font theme</label>
              <select id="font-theme"></select>
            </div>
            <div class="field">
              <label for="content-mode">Content</label>
              <select id="content-mode"></select>
            </div>
            <div class="field">
              <label for="chrome-mode">Chrome</label>
              <select id="chrome-mode"></select>
            </div>
            <div class="field">
              <label for="section-mode">Sections</label>
              <select id="section-mode"></select>
            </div>
          </div>
          <div class="theme-summary" aria-live="polite">
            <ol id="theme-swatches" class="theme-swatches" aria-label="Current presentation color palette">
              <li class="theme-swatch"></li>
              <li class="theme-swatch"></li>
              <li class="theme-swatch"></li>
              <li class="theme-swatch"></li>
              <li class="theme-swatch"></li>
            </ol>
            <div class="theme-copy">
              <div id="theme-name" class="theme-name"></div>
              <p id="theme-description" class="theme-description"></p>
            </div>
          </div>
        </fieldset>
      </div>
    </header>
    <main class="main">
      <section class="library" aria-labelledby="layouts-heading">
        <div class="section-heading">
          <h2 id="layouts-heading">Layout library</h2>
          <span id="layout-count" class="section-count">${layouts.length} layouts</span>
        </div>
        <div class="library-tools">
          <div class="field">
            <label for="layout-search">Search layouts</label>
            <input id="layout-search" type="search" placeholder="Title, use, or feature" autocomplete="off" />
          </div>
          <div class="field">
            <label for="layout-category">Category</label>
            <select id="layout-category">
              <option value="">All categories</option>
              ${categoryOptions}
            </select>
          </div>
        </div>
        <div id="layout-grid" class="layout-grid">${layoutCards}</div>
        <p id="layout-filter-empty" class="filter-empty" hidden>No layouts match this search and category.</p>
      </section>
      <section class="slides" aria-labelledby="slides-heading">
        <div class="section-heading">
          <h2 id="slides-heading">Slides</h2>
          <span class="section-count">Drag to reorder</span>
        </div>
        <div id="drop-zone" class="drop-zone" role="list" aria-label="Slides in deck">
          <p class="empty">Drag a layout here, or click a layout card to add a slide.</p>
        </div>
      </section>
      <section class="inspector" aria-labelledby="inspector-heading">
        <div class="section-heading">
          <h2 id="inspector-heading">Inspector</h2>
          <span class="section-count">Selected slide</span>
        </div>
        <div id="inspector-empty" class="empty">Select a slide to edit its content.</div>
        <div id="inspector-fields" hidden>
          <div class="field">
            <label for="slide-layout-select">Layout</label>
            <select id="slide-layout-select"></select>
          </div>
          <div class="layout-context" aria-live="polite">
            <div>
              <span class="field-label">Best for</span>
              <p id="layout-use-for"></p>
            </div>
            <div>
              <span class="field-label">Layout features</span>
              <ul id="layout-features" class="feature-list"></ul>
            </div>
            <div>
              <span class="field-label">Frontmatter configuration</span>
              <p class="inspector-config-scope">Layout/theme-specific keys. Standard <code>layout</code>, <code>class</code>, and <code>transition</code> also work on every slide.</p>
              <div id="layout-config" class="inspector-config-list"></div>
            </div>
            <div>
              <span class="field-label">Content slots</span>
              <ul id="layout-slots" class="inspector-slot-list"></ul>
            </div>
          </div>
          <div class="field">
            <label for="slide-title">Markdown heading</label>
            <input id="slide-title" />
          </div>
          <div class="field">
            <label for="slide-body">Default slot / body</label>
            <textarea id="slide-body"></textarea>
          </div>
          <div class="field">
            <label for="slide-bullets">Bullets</label>
            <textarea id="slide-bullets" placeholder="One bullet per line"></textarea>
          </div>
          <div class="field">
            <label for="slide-image">Markdown image path</label>
            <input id="slide-image" placeholder="./images/example.png" />
          </div>
          <div class="field">
            <label for="slide-caption">Caption</label>
            <input id="slide-caption" />
          </div>
          <pre id="markdown-preview" class="preview" aria-label="Markdown preview"></pre>
        </div>
      </section>
    </main>
  </div>
  <script nonce="${options.nonce}">
    const vscode = acquireVsCodeApi();
    const builderData = ${data};
    const paletteEntries = [
      ['primary', 'Primary'],
      ['primaryLight', 'Primary light'],
      ['accent', 'Accent'],
      ['background', 'Background'],
      ['foreground', 'Foreground']
    ];
    const state = {
      title: 'Scholarly Presentation',
      subtitle: 'Generated from GUI Builder',
      colorTheme: builderData.colorThemes[0]?.value || 'classic-blue',
      fontTheme: builderData.fontThemes[0]?.value || 'classic',
      contentMode: '',
      chromeMode: 'dark',
      sectionMode: 'dark',
      slides: []
    };
    let selectedId = '';
    let dragSlideId = '';

    const byId = id => document.getElementById(id);
    const layoutById = id => builderData.layouts.find(layout => layout.id === id) || builderData.layouts[0];

    function optionMarkup(option) {
      return '<option value="' + escapeHtml(option.value) + '">' + escapeHtml(option.label) + '</option>';
    }

    function renderSettings() {
      byId('color-theme').innerHTML = builderData.colorThemes.map(optionMarkup).join('');
      byId('font-theme').innerHTML = builderData.fontThemes.map(optionMarkup).join('');
      byId('content-mode').innerHTML = '<option value="">Follow Slidev</option>' + builderData.contentModes.map(optionMarkup).join('');
      byId('chrome-mode').innerHTML = builderData.surfaceModes.map(optionMarkup).join('');
      byId('section-mode').innerHTML = builderData.surfaceModes.map(optionMarkup).join('');
      byId('slide-layout-select').innerHTML = builderData.layouts.map(layout =>
        '<option value="' + escapeHtml(layout.id) + '">' + escapeHtml(layout.displayLabel) + '</option>'
      ).join('');
      byId('deck-title').value = state.title;
      byId('deck-subtitle').value = state.subtitle;
      byId('color-theme').value = state.colorTheme;
      byId('font-theme').value = state.fontTheme;
      byId('content-mode').value = state.contentMode;
      byId('chrome-mode').value = state.chromeMode;
      byId('section-mode').value = state.sectionMode;
      renderThemeSummary();
    }

    function renderThemeSummary() {
      const theme = builderData.colorThemes.find(item => item.value === state.colorTheme) || builderData.colorThemes[0];
      const themeIndex = Math.max(0, builderData.colorThemes.indexOf(theme));
      byId('theme-name').textContent = theme?.label || 'Color theme';
      byId('theme-description').textContent = theme?.description || 'Presentation color palette';

      const swatches = byId('theme-swatches');
      swatches.hidden = !theme?.palette;
      swatches.className = 'theme-swatches palette-' + themeIndex;
      Array.from(swatches.children).forEach((swatch, index) => {
        const entry = paletteEntries[index];
        const color = theme?.palette?.[entry[0]] || '';
        const label = entry[1] + (color ? ': ' + color : '');
        swatch.title = label;
        swatch.setAttribute('aria-label', label);
      });
    }

    function filterLayouts() {
      const query = byId('layout-search').value.trim().toLowerCase();
      const category = byId('layout-category').value;
      let visible = 0;
      document.querySelectorAll('.layout-card').forEach(card => {
        const matchesQuery = !query || card.dataset.layoutSearch.includes(query);
        const matchesCategory = !category || card.dataset.layoutCategory === category;
        card.hidden = !(matchesQuery && matchesCategory);
        if (!card.hidden) visible += 1;
      });
      byId('layout-filter-empty').hidden = visible !== 0;
      byId('layout-count').textContent = visible === builderData.layouts.length
        ? visible + ' layouts'
        : visible + ' of ' + builderData.layouts.length;
    }

    function addSlide(layoutId) {
      const layout = layoutById(layoutId);
      if (!layout) return;
      const slide = {
        id: 'slide-' + Date.now() + '-' + Math.random().toString(16).slice(2),
        layout: layout.id,
        title: layout.id === 'cover' ? state.title : titleFromLayout(layout),
        body: layout.id === 'cover' ? state.subtitle : '',
        bullets: layout.id === 'bullets' ? ['First point', 'Second point'] : [],
        image: '',
        caption: '',
        config: {},
        slots: {}
      };
      state.slides.push(slide);
      selectedId = slide.id;
      render();
    }

    function titleFromLayout(layout) {
      return layout.displayLabel || layout.label || layout.id;
    }

    function render() {
      renderSlides();
      renderInspector();
      renderThemeSummary();
      postPreview();
    }

    function renderSlides() {
      const zone = byId('drop-zone');
      if (state.slides.length === 0) {
        zone.innerHTML = '<p class="empty">Drag a layout here, or click a layout card to add a slide.</p>';
        return;
      }
      zone.innerHTML = state.slides.map((slide, index) => {
        const layout = layoutById(slide.layout);
        const layoutLabel = layout?.displayLabel || slide.layout;
        const title = slide.title || 'Untitled slide';
        return '<div class="slide-item' + (slide.id === selectedId ? ' active' : '') + '" draggable="true" role="listitem" tabindex="0" aria-current="' + (slide.id === selectedId) + '" data-slide-id="' + escapeHtml(slide.id) + '">' +
          '<div class="slide-index">' + (index + 1) + '</div>' +
          '<div><div class="slide-title">' + escapeHtml(title) + '</div>' +
          '<div class="slide-layout">' + escapeHtml(layoutLabel) + '</div></div>' +
          '<div class="slide-actions">' +
            '<button class="icon-button" data-action="up" aria-label="Move ' + escapeHtml(title) + ' up" title="Move up"' + (index === 0 ? ' disabled' : '') + '>' + iconMarkup('up') + '</button>' +
            '<button class="icon-button" data-action="down" aria-label="Move ' + escapeHtml(title) + ' down" title="Move down"' + (index === state.slides.length - 1 ? ' disabled' : '') + '>' + iconMarkup('down') + '</button>' +
            '<button class="icon-button destructive" data-action="delete" aria-label="Delete ' + escapeHtml(title) + '" title="Delete">' + iconMarkup('delete') + '</button>' +
          '</div>' +
        '</div>';
      }).join('');
    }

    function renderInspector() {
      const slide = selectedSlide();
      byId('inspector-empty').hidden = Boolean(slide);
      byId('inspector-fields').hidden = !slide;
      if (!slide) return;
      const layout = layoutById(slide.layout);
      byId('slide-layout-select').value = slide.layout;
      byId('slide-title').value = slide.title;
      byId('slide-body').value = slide.body;
      byId('slide-bullets').value = slide.bullets.join('\\n');
      byId('slide-image').value = slide.image;
      byId('slide-caption').value = slide.caption;
      slide.config = slide.config && typeof slide.config === 'object' ? slide.config : {};
      slide.slots = slide.slots && typeof slide.slots === 'object' ? slide.slots : {};
      byId('layout-use-for').textContent = layout?.useFor || layout?.description || 'General-purpose slide content.';
      const features = layout?.features || [];
      byId('layout-features').innerHTML = features.length
        ? features.map(feature => '<li class="feature-chip">' + escapeHtml(feature) + '</li>').join('')
        : '<li class="feature-chip">Flexible content</li>';
      const config = layout?.config || [];
      byId('layout-config').innerHTML = config.length
        ? config.map(item => configItemMarkup(item, slide.config[item.name])).join('')
        : '<p class="inspector-config-empty">No layout-specific frontmatter props.</p>';
      const slots = layout?.slots || [];
      byId('layout-slots').innerHTML = slots.length
        ? slots.map(slot => slotItemMarkup(slot, slide.slots[slot.name])).join('')
        : '<li class="inspector-config-empty">No content slots.</li>';
      byId('markdown-preview').textContent = previewSlide(slide);
    }

    function configItemMarkup(item, value) {
      const requirement = '<span>' + (item.required ? 'required' : 'optional') + '</span>';
      const defaultValue = item.default !== undefined
        ? '<span>default: ' + escapeHtml(item.default) + '</span>'
        : '';
      const options = item.options?.length
        ? '<span>values: ' + item.options.map(escapeHtml).join(' | ') + '</span>'
        : '';
      return '<article class="inspector-config-item' + (item.required ? ' is-required' : '') + '">' +
        '<div class="inspector-config-heading"><code class="inspector-config-name">' + escapeHtml(item.name) + '</code><span class="inspector-config-type">' + escapeHtml(item.type) + '</span></div>' +
        '<span class="inspector-config-description">' + escapeHtml(item.description) + '</span>' +
        '<div class="inspector-config-meta">' + requirement + defaultValue + options + '</div>' +
        configEditorMarkup(item, value) +
      '</article>';
    }

    function configEditorMarkup(item, value) {
      const id = 'layout-config-' + item.name.replace(/[^A-Za-z0-9_-]/g, '-');
      const displayValue = editorValue(value);
      const defaultHint = item.default !== undefined ? 'Default: ' + item.default : 'Leave blank to omit';
      const label = '<label for="' + escapeHtml(id) + '">Override value</label>';
      const required = item.required ? ' required aria-required="true"' : '';
      const attrs = ' id="' + escapeHtml(id) + '" data-config-name="' + escapeHtml(item.name) + '" data-config-type="' + escapeHtml(item.type) + '" aria-label="' + escapeHtml(item.name + ' override') + '"' + required;
      const values = item.options?.length
        ? item.options
        : /(?:^|\\W)boolean(?:\\W|$)/i.test(item.type)
          ? ['true', 'false']
          : [];

      if (values.length) {
        const choices = ['<option value="">' + escapeHtml(defaultHint) + '</option>']
          .concat(values.map(option => '<option value="' + escapeHtml(option) + '"' + (displayValue === option ? ' selected' : '') + '>' + escapeHtml(option) + '</option>'));
        return '<div class="inspector-config-editor">' + label + '<select' + attrs + '>' + choices.join('') + '</select></div>';
      }

      if (/\\[\\]|Array<|\\{/.test(item.type)) {
        return '<div class="inspector-config-editor">' + label + '<textarea' + attrs + ' placeholder="' + escapeHtml(defaultHint + '; JSON only, e.g. [...] or {...}') + '">' + escapeHtml(displayValue) + '</textarea></div>';
      }

      const inputType = /^number\\b/.test(item.type) ? 'number' : 'text';
      return '<div class="inspector-config-editor">' + label + '<input type="' + inputType + '"' + attrs + ' value="' + escapeHtml(displayValue) + '" placeholder="' + escapeHtml(defaultHint) + '" /></div>';
    }

    function slotItemMarkup(slot, value) {
      const description = '<code class="inspector-slot-name">' + escapeHtml(slot.name) + '</code><span class="inspector-slot-description">' + escapeHtml(slot.description) + '</span>';
      if (slot.name === 'default') {
        return '<li>' + description + '<span class="inspector-slot-note">Edit this slot with the Body, Bullets, Image, and Caption fields below.</span></li>';
      }
      const id = 'layout-slot-' + slot.name.replace(/[^A-Za-z0-9_-]/g, '-');
      return '<li>' + description + '<div class="inspector-slot-editor"><label for="' + escapeHtml(id) + '">Slot content</label><textarea id="' + escapeHtml(id) + '" data-slot-name="' + escapeHtml(slot.name) + '" placeholder="Markdown or HTML for ::' + escapeHtml(slot.name) + '::">' + escapeHtml(editorValue(value)) + '</textarea></div></li>';
    }

    function editorValue(value) {
      if (value === undefined || value === null) return '';
      return typeof value === 'object' ? JSON.stringify(value) : String(value);
    }

    function isStructuredConfigType(type) {
      return /\\[\\]|Array<|\\{/.test(type || '');
    }

    function isStringConfigType(type) {
      return /^\\s*string(?:\\s*\\||\\s*$)|\\|\\s*string\\s*(?:\\||$)/i.test(type || '');
    }

    function isBooleanOnlyConfigType(type) {
      return /^(?:\\s*)boolean(?:\\s*\\||\\s*$)|\\|\\s*boolean\\s*(?:\\||$)/i.test(type || '') && !isStringConfigType(type);
    }

    function isNumberOnlyConfigType(type) {
      return /^\\s*number(?:\\s*\\||\\s*$)|\\|\\s*number\\s*(?:\\||$)/i.test(type || '') && !isStringConfigType(type);
    }

    function allowsLiteral(type, literal) {
      return String(type || '').split('|').some(part => part.trim().replace(/[\"']/g, '') === literal);
    }

    function parseConfigEditorValue(raw, type) {
      const trimmed = raw.trim();
      if (!trimmed) return { value: undefined, error: '' };

      if (isStructuredConfigType(type)) {
        try {
          return { value: JSON.parse(trimmed), error: '' };
        } catch {
          if (isStringConfigType(type) && !/^[\\[{]/.test(trimmed))
            return { value: trimmed, error: '' };
          return { value: raw, error: 'Enter valid JSON, for example [\"one\", \"two\"] or {\"h1\": 40}.' };
        }
      }

      if (isBooleanOnlyConfigType(type)) {
        if (/^(?:true|false)$/i.test(trimmed))
          return { value: trimmed.toLowerCase() === 'true', error: '' };
        return { value: raw, error: 'Choose true or false.' };
      }

      if (isNumberOnlyConfigType(type)) {
        const value = Number(trimmed);
        return Number.isFinite(value)
          ? { value, error: '' }
          : { value: raw, error: 'Enter a valid number.' };
      }

      if (allowsLiteral(type, 'false') && trimmed === 'false')
        return { value: false, error: '' };
      if (allowsLiteral(type, 'true') && trimmed === 'true')
        return { value: true, error: '' };
      if (allowsLiteral(type, 'null') && trimmed === 'null')
        return { value: null, error: '' };

      return { value: trimmed, error: '' };
    }

    function validateConfigValue(item, value) {
      const missing = value === undefined || value === null || (typeof value === 'string' && !value.trim());
      if (missing)
        return item.required ? item.name + ' is required for this layout.' : '';

      if (typeof value === 'string') {
        const parsed = parseConfigEditorValue(value, item.type);
        if (parsed.error) return parsed.error;
        value = parsed.value;
      }

      if (item.required && Array.isArray(value) && value.length === 0)
        return item.name + ' requires at least one item.';
      if (/\\[\\]|Array</.test(item.type) && !Array.isArray(value))
        return item.name + ' must be a JSON array.';
      if (/^\\s*\\{/.test(item.type) && (!value || typeof value !== 'object' || Array.isArray(value)))
        return item.name + ' must be a JSON object.';
      if (isBooleanOnlyConfigType(item.type) && typeof value !== 'boolean')
        return item.name + ' must be true or false.';
      if (isNumberOnlyConfigType(item.type) && typeof value !== 'number')
        return item.name + ' must be a number.';
      return '';
    }

    function clearValidationMessage() {
      const summary = byId('builder-validation');
      summary.hidden = true;
      summary.textContent = '';
    }

    function validateDeck() {
      for (let slideIndex = 0; slideIndex < state.slides.length; slideIndex += 1) {
        const slide = state.slides[slideIndex];
        const layout = layoutById(slide.layout);
        for (const item of layout?.config || []) {
          const message = validateConfigValue(item, slide.config?.[item.name]);
          if (!message) continue;

          selectedId = slide.id;
          render();
          const summary = byId('builder-validation');
          summary.textContent = 'Slide ' + (slideIndex + 1) + ' · ' + (layout.displayLabel || layout.id) + ': ' + message;
          summary.hidden = false;
          const input = Array.from(document.querySelectorAll('[data-config-name]'))
            .find(candidate => candidate.dataset.configName === item.name);
          if (input) {
            input.setCustomValidity(message);
            input.setAttribute('aria-invalid', 'true');
            input.focus();
            input.reportValidity();
          }
          return false;
        }
      }
      clearValidationMessage();
      return true;
    }

    function syncFirstCover(field, value) {
      const cover = state.slides.find(slide => slide.layout === 'cover');
      if (!cover) return;
      if (field === 'title') cover.title = value;
      else cover.body = value;
    }

    function selectedSlide() {
      return state.slides.find(slide => slide.id === selectedId);
    }

    function updateSelected(patch) {
      const slide = selectedSlide();
      if (!slide) return;
      Object.assign(slide, patch);
      render();
    }

    function moveSlide(id, direction) {
      const index = state.slides.findIndex(slide => slide.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= state.slides.length) return;
      const slide = state.slides.splice(index, 1)[0];
      state.slides.splice(target, 0, slide);
      render();
    }

    function deleteSlide(id) {
      const index = state.slides.findIndex(slide => slide.id === id);
      if (index < 0) return;
      state.slides.splice(index, 1);
      selectedId = state.slides[Math.min(index, state.slides.length - 1)]?.id || '';
      render();
    }

    function post(type) {
      if (!validateDeck()) return;
      vscode.postMessage({ type, state });
    }

    function postPreview() {
      vscode.setState({ state, selectedId });
    }

    function previewSlide(slide) {
      const layout = layoutById(slide.layout);
      const configLines = Object.entries(slide.config || {})
        .filter(([name, value]) => name !== 'layout' && /^[A-Za-z_][A-Za-z0-9_-]*$/.test(name) && editorValue(value).trim())
        .map(([name, value]) => {
          const type = layout?.config?.find(item => item.name === name)?.type;
          return name + ': ' + previewConfigValue(value, type);
        });
      const lines = ['---', 'layout: ' + slide.layout, ...configLines, '---', '', '# ' + (slide.title || 'Untitled slide'), ''];
      if (slide.image) lines.push('![' + (slide.title || 'Slide image') + '](' + slide.image + ')', '');
      if (slide.bullets.length) lines.push(slide.bullets.map(item => '- ' + item).join('\\n'), '');
      if (slide.body) lines.push(slide.body, '');
      if (slide.slots?.default) lines.push(String(slide.slots.default).trim(), '');
      if (slide.caption) lines.push('*' + slide.caption + '*');
      Object.entries(slide.slots || {}).forEach(([name, content]) => {
        if (name === 'default' || !/^[A-Za-z_][A-Za-z0-9_-]*$/.test(name) || !String(content).trim()) return;
        lines.push('', '::' + name + '::', '', String(content).trim());
      });
      return lines.join('\\n').trim();
    }

    function previewConfigValue(value, declaredType) {
      if (value === null || typeof value === 'number' || typeof value === 'boolean')
        return JSON.stringify(value);
      if (Array.isArray(value) || (value && typeof value === 'object'))
        return JSON.stringify(value);
      const raw = editorValue(value).trim();
      if (isStructuredConfigType(declaredType)) {
        try { return JSON.stringify(JSON.parse(raw)); } catch {}
      }
      if (isBooleanOnlyConfigType(declaredType) && /^(?:true|false)$/i.test(raw))
        return raw.toLowerCase();
      if (isNumberOnlyConfigType(declaredType)) {
        const parsed = Number(raw);
        if (Number.isFinite(parsed)) return JSON.stringify(parsed);
      }
      const yamlKeyword = /^(?:true|false|null|yes|no|on|off|~|[-+]?\\.inf|\\.nan)$/i.test(raw);
      if (!raw || yamlKeyword || Number.isFinite(Number(raw)) || /[\\r\\n:#{}\\[\\],&*?|<>=!%@\\x60]/.test(raw) || /^[-?]/.test(raw)) return JSON.stringify(raw);
      return raw;
    }

    function iconMarkup(name) {
      const paths = {
        up: '<path d="M8 13V3m0 0L4 7m4-4 4 4"/>',
        down: '<path d="M8 3v10m0 0 4-4m-4 4L4 9"/>',
        delete: '<path d="M3 4h10M6 4V2.75h4V4m-5.5 0 .65 9h5.7l.65-9M6.75 6.5v4m2.5-4v4"/>'
      };
      return '<svg viewBox="0 0 16 16" aria-hidden="true">' + paths[name] + '</svg>';
    }

    function escapeHtml(value) {
      return String(value).replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      })[char]);
    }

    document.querySelectorAll('.layout-card').forEach(card => {
      card.addEventListener('click', () => addSlide(card.dataset.layoutId));
      card.addEventListener('dragstart', event => {
        card.classList.add('dragging');
        event.dataTransfer.setData('text/plain', card.dataset.layoutId);
        event.dataTransfer.effectAllowed = 'copy';
      });
      card.addEventListener('dragend', () => card.classList.remove('dragging'));
    });

    document.querySelectorAll('.layout-thumbnail-image').forEach(image => {
      image.addEventListener('error', () => { image.hidden = true; });
    });

    byId('layout-search').addEventListener('input', filterLayouts);
    byId('layout-category').addEventListener('change', filterLayouts);

    byId('drop-zone').addEventListener('dragover', event => {
      event.preventDefault();
      byId('drop-zone').classList.add('drag-over');
    });
    byId('drop-zone').addEventListener('dragleave', event => {
      if (!byId('drop-zone').contains(event.relatedTarget)) {
        byId('drop-zone').classList.remove('drag-over');
      }
    });
    byId('drop-zone').addEventListener('drop', event => {
      event.preventDefault();
      byId('drop-zone').classList.remove('drag-over');
      const layoutId = event.dataTransfer.getData('text/plain');
      if (builderData.layouts.some(layout => layout.id === layoutId)) addSlide(layoutId);
    });

    byId('drop-zone').addEventListener('click', event => {
      const item = event.target.closest('.slide-item');
      if (!item) return;
      const action = event.target.closest('[data-action]')?.dataset.action;
      const id = item.dataset.slideId;
      if (action === 'up') moveSlide(id, -1);
      else if (action === 'down') moveSlide(id, 1);
      else if (action === 'delete') deleteSlide(id);
      else {
        selectedId = id;
        render();
      }
    });
    byId('drop-zone').addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      if (event.target.closest('[data-action]')) return;
      const item = event.target.closest('.slide-item');
      if (!item) return;
      event.preventDefault();
      selectedId = item.dataset.slideId;
      render();
    });
    byId('drop-zone').addEventListener('dragstart', event => {
      const item = event.target.closest('.slide-item');
      if (!item) return;
      dragSlideId = item.dataset.slideId;
      item.classList.add('dragging');
      event.dataTransfer.setData('application/x-sch-slide', dragSlideId);
      event.dataTransfer.effectAllowed = 'move';
    });
    byId('drop-zone').addEventListener('dragend', event => {
      event.target.closest('.slide-item')?.classList.remove('dragging');
      byId('drop-zone').classList.remove('drag-over');
      dragSlideId = '';
    });
    byId('drop-zone').addEventListener('dragover', event => {
      const item = event.target.closest('.slide-item');
      if (!item || !dragSlideId) return;
      event.preventDefault();
      const from = state.slides.findIndex(slide => slide.id === dragSlideId);
      const to = state.slides.findIndex(slide => slide.id === item.dataset.slideId);
      if (from < 0 || to < 0 || from === to) return;
      const slide = state.slides.splice(from, 1)[0];
      state.slides.splice(to, 0, slide);
      renderSlides();
    });

    byId('deck-title').addEventListener('input', event => {
      state.title = event.target.value;
      syncFirstCover('title', event.target.value);
      render();
    });
    byId('deck-subtitle').addEventListener('input', event => {
      state.subtitle = event.target.value;
      syncFirstCover('subtitle', event.target.value);
      render();
    });
    byId('color-theme').addEventListener('change', event => {
      state.colorTheme = event.target.value;
      renderThemeSummary();
      postPreview();
    });
    byId('font-theme').addEventListener('change', event => { state.fontTheme = event.target.value; postPreview(); });
    byId('content-mode').addEventListener('change', event => { state.contentMode = event.target.value; postPreview(); });
    byId('chrome-mode').addEventListener('change', event => { state.chromeMode = event.target.value; postPreview(); });
    byId('section-mode').addEventListener('change', event => { state.sectionMode = event.target.value; postPreview(); });
    byId('slide-layout-select').addEventListener('change', event => updateSelected({ layout: event.target.value, config: {}, slots: {} }));
    byId('slide-title').addEventListener('input', event => updateSelected({ title: event.target.value }));
    byId('slide-body').addEventListener('input', event => updateSelected({ body: event.target.value }));
    byId('slide-bullets').addEventListener('input', event => updateSelected({
      bullets: event.target.value.split('\\n').map(line => line.trim()).filter(Boolean)
    }));
    byId('slide-image').addEventListener('input', event => updateSelected({ image: event.target.value }));
    byId('slide-caption').addEventListener('input', event => updateSelected({ caption: event.target.value }));
    byId('layout-config').addEventListener('input', event => {
      const input = event.target.closest('[data-config-name]');
      const slide = selectedSlide();
      if (!input || !slide) return;
      const item = layoutById(slide.layout)?.config?.find(candidate => candidate.name === input.dataset.configName);
      if (!item) return;
      slide.config = slide.config || {};
      const parsed = parseConfigEditorValue(input.value, item.type);
      if (input.value.trim()) slide.config[input.dataset.configName] = parsed.value;
      else delete slide.config[input.dataset.configName];
      const validation = parsed.error || validateConfigValue(item, parsed.value);
      input.setCustomValidity(validation);
      input.setAttribute('aria-invalid', validation ? 'true' : 'false');
      if (!validation) clearValidationMessage();
      byId('markdown-preview').textContent = previewSlide(slide);
      postPreview();
    });
    byId('layout-slots').addEventListener('input', event => {
      const input = event.target.closest('[data-slot-name]');
      const slide = selectedSlide();
      if (!input || !slide) return;
      slide.slots = slide.slots || {};
      if (input.value.trim()) slide.slots[input.dataset.slotName] = input.value;
      else delete slide.slots[input.dataset.slotName];
      byId('markdown-preview').textContent = previewSlide(slide);
      postPreview();
    });
    byId('generateNewDocument').addEventListener('click', () => post('generateNewDocument'));
    byId('insertIntoEditor').addEventListener('click', () => post('insertIntoEditor'));

    const previous = vscode.getState();
    if (previous?.state) {
      Object.assign(state, previous.state);
      selectedId = previous.selectedId || '';
    }
    if (!Array.isArray(state.slides)) state.slides = [];
    if (typeof state.contentMode !== 'string') state.contentMode = '';
    renderSettings();
    if (state.slides.length === 0) addSlide('cover');
    render();
  </script>
</body>
</html>`;
}

function renderLayoutThumbnail(layout: NormalizedLayoutOption): string {
  const image = layout.image
    ? `<img class="layout-thumbnail-image" src="${escapeHtml(layout.image)}" alt="${escapeHtml(layout.displayLabel)} layout preview" width="320" height="240" loading="lazy" />`
    : '';
  return `
    <span class="layout-thumbnail">
      <span class="thumbnail-placeholder" aria-hidden="true">
        <span class="thumbnail-line"></span>
        <span class="thumbnail-line"></span>
        <span class="thumbnail-line"></span>
      </span>
      ${image}
    </span>
  `;
}

function humanizeLabel(value: string): string {
  const acronyms: Record<string, string> = {
    ai: 'AI',
    api: 'API',
    qr: 'QR',
    toc: 'TOC'
  };
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map(word => acronyms[word.toLowerCase()] || word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function safePaletteColor(value: string | undefined): string {
  return value && /^#[\da-f]{3,8}$/i.test(value) ? value : 'var(--sch-muted)';
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
