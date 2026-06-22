export interface GuiBuilderLayoutOption {
  id: string;
  label: string;
  description: string;
  category?: string;
}

export interface GuiBuilderThemeOption {
  value: string;
  label: string;
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
  contentModes: GuiBuilderModeOption[];
  surfaceModes: GuiBuilderModeOption[];
}

export function renderGuiBuilderHtml(options: GuiBuilderHtmlOptions): string {
  const data = JSON.stringify({
    layouts: options.layouts,
    colorThemes: options.colorThemes,
    fontThemes: options.fontThemes,
    contentModes: options.contentModes,
    surfaceModes: options.surfaceModes
  }).replace(/</g, '\\u003c');

  const layoutCards = options.layouts.map(layout => `
    <button
      class="layout-card"
      draggable="true"
      data-layout-id="${escapeHtml(layout.id)}"
      title="${escapeHtml(layout.description)}"
    >
      <span class="layout-name">${escapeHtml(layout.label)}</span>
      <span class="layout-category">${escapeHtml(layout.category || 'layout')}</span>
      <span class="layout-description">${escapeHtml(layout.description)}</span>
    </button>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${options.cspSource} data:; style-src 'nonce-${options.nonce}'; script-src 'nonce-${options.nonce}';" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Slidev Scholarly GUI Builder</title>
  <style nonce="${options.nonce}">
    :root {
      color-scheme: light dark;
      --border: var(--vscode-editorWidget-border, #c8c8c8);
      --bg: var(--vscode-editor-background, #ffffff);
      --panel: var(--vscode-sideBar-background, #f3f3f3);
      --text: var(--vscode-editor-foreground, #1f1f1f);
      --muted: var(--vscode-descriptionForeground, #6b6b6b);
      --accent: var(--vscode-button-background, #0e639c);
      --accent-text: var(--vscode-button-foreground, #ffffff);
      --input: var(--vscode-input-background, #ffffff);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      background: var(--bg);
      color: var(--text);
      font: 13px/1.45 var(--vscode-font-family, system-ui, sans-serif);
    }
    button, input, textarea, select {
      font: inherit;
    }
    .app {
      display: grid;
      grid-template-rows: auto 1fr;
      min-height: 100vh;
    }
    .toolbar {
      display: grid;
      grid-template-columns: minmax(180px, 1fr) auto auto;
      gap: 8px;
      align-items: end;
      padding: 12px;
      border-bottom: 1px solid var(--border);
      background: var(--panel);
    }
    .toolbar-fields {
      display: grid;
      grid-template-columns: repeat(7, minmax(104px, 1fr));
      gap: 8px;
    }
    .field {
      display: grid;
      gap: 4px;
      min-width: 0;
    }
    label {
      color: var(--muted);
      font-size: 11px;
    }
    input, textarea, select {
      width: 100%;
      min-width: 0;
      border: 1px solid var(--border);
      border-radius: 4px;
      padding: 7px 8px;
      color: var(--text);
      background: var(--input);
    }
    textarea {
      min-height: 78px;
      resize: vertical;
    }
    .button-row {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      white-space: nowrap;
    }
    .primary, .secondary, .icon-button, .layout-card {
      border: 1px solid var(--border);
      border-radius: 4px;
      cursor: pointer;
    }
    .primary {
      background: var(--accent);
      color: var(--accent-text);
      padding: 8px 12px;
      border-color: var(--accent);
    }
    .secondary, .icon-button {
      background: var(--vscode-button-secondaryBackground, transparent);
      color: var(--text);
      padding: 8px 10px;
    }
    .main {
      display: grid;
      grid-template-columns: minmax(220px, 280px) minmax(260px, 1fr) minmax(260px, 340px);
      min-height: 0;
    }
    .library, .slides, .inspector {
      min-height: 0;
      overflow: auto;
      padding: 12px;
    }
    .library, .slides {
      border-right: 1px solid var(--border);
    }
    h2 {
      margin: 0 0 10px;
      font-size: 13px;
      font-weight: 600;
    }
    .layout-grid {
      display: grid;
      gap: 8px;
    }
    .layout-card {
      display: grid;
      gap: 3px;
      width: 100%;
      min-height: 72px;
      padding: 9px;
      text-align: left;
      background: var(--vscode-list-hoverBackground, transparent);
      color: var(--text);
    }
    .layout-card:hover, .slide-item.active {
      outline: 1px solid var(--accent);
      outline-offset: -1px;
    }
    .layout-name {
      font-weight: 600;
    }
    .layout-category, .layout-description, .empty {
      color: var(--muted);
      font-size: 12px;
    }
    .drop-zone {
      display: grid;
      gap: 8px;
      min-height: 360px;
      padding: 8px;
      border: 1px dashed var(--border);
      border-radius: 4px;
    }
    .drop-zone.drag-over {
      border-color: var(--accent);
      background: var(--vscode-list-activeSelectionBackground, transparent);
    }
    .slide-item {
      display: grid;
      grid-template-columns: 32px 1fr auto;
      gap: 8px;
      align-items: center;
      min-height: 58px;
      padding: 8px;
      border: 1px solid var(--border);
      border-radius: 4px;
      background: var(--panel);
      cursor: pointer;
    }
    .slide-index {
      display: grid;
      place-items: center;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--vscode-badge-background, #777);
      color: var(--vscode-badge-foreground, #fff);
      font-size: 12px;
    }
    .slide-title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: 600;
    }
    .slide-layout {
      color: var(--muted);
      font-size: 12px;
    }
    .slide-actions {
      display: flex;
      gap: 4px;
    }
    .icon-button {
      width: 30px;
      height: 30px;
      padding: 0;
    }
    .preview {
      margin: 12px 0 0;
      padding: 10px;
      max-height: 220px;
      overflow: auto;
      border: 1px solid var(--border);
      border-radius: 4px;
      background: var(--vscode-textCodeBlock-background, rgba(127, 127, 127, 0.08));
      white-space: pre-wrap;
      font-family: var(--vscode-editor-font-family, monospace);
      font-size: 12px;
    }
    @media (max-width: 920px) {
      .toolbar, .toolbar-fields, .main {
        grid-template-columns: 1fr;
      }
      .library, .slides {
        border-right: 0;
        border-bottom: 1px solid var(--border);
      }
    }
  </style>
</head>
<body>
  <div class="app">
    <header class="toolbar">
      <div class="toolbar-fields">
        <div class="field">
          <label for="deck-title">Title</label>
          <input id="deck-title" value="Scholarly Presentation" />
        </div>
        <div class="field">
          <label for="deck-subtitle">Subtitle</label>
          <input id="deck-subtitle" value="Generated from GUI Builder" />
        </div>
        <div class="field">
          <label for="color-theme">Color</label>
          <select id="color-theme"></select>
        </div>
        <div class="field">
          <label for="font-theme">Font</label>
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
          <label for="section-mode">Section</label>
          <select id="section-mode"></select>
        </div>
      </div>
      <button class="secondary" id="insertIntoEditor">Insert</button>
      <button class="primary" id="generateNewDocument">New Markdown</button>
    </header>
    <main class="main">
      <section class="library">
        <h2>Layouts</h2>
        <div class="layout-grid">${layoutCards}</div>
      </section>
      <section class="slides">
        <h2>Slides</h2>
        <div id="drop-zone" class="drop-zone">
          <p class="empty">Drag a layout here, or click a layout card to add a slide.</p>
        </div>
      </section>
      <section class="inspector">
        <h2>Inspector</h2>
        <div id="inspector-empty" class="empty">Select a slide to edit its content.</div>
        <div id="inspector-fields" hidden>
          <div class="field">
            <label for="slide-title">Slide title</label>
            <input id="slide-title" />
          </div>
          <div class="field">
            <label for="slide-body">Body</label>
            <textarea id="slide-body"></textarea>
          </div>
          <div class="field">
            <label for="slide-bullets">Bullets</label>
            <textarea id="slide-bullets" placeholder="One bullet per line"></textarea>
          </div>
          <div class="field">
            <label for="slide-image">Image path</label>
            <input id="slide-image" placeholder="./images/example.png" />
          </div>
          <div class="field">
            <label for="slide-caption">Caption</label>
            <input id="slide-caption" />
          </div>
          <pre id="markdown-preview" class="preview"></pre>
        </div>
      </section>
    </main>
  </div>
  <script nonce="${options.nonce}">
    const vscode = acquireVsCodeApi();
    const builderData = ${data};
    const state = {
      title: 'Scholarly Presentation',
      subtitle: 'Generated from GUI Builder',
      colorTheme: builderData.colorThemes[0]?.value || 'classic-blue',
      fontTheme: builderData.fontThemes[0]?.value || 'classic',
      contentMode: 'light',
      chromeMode: 'dark',
      sectionMode: 'dark',
      slides: []
    };
    let selectedId = '';
    let dragSlideId = '';

    const byId = id => document.getElementById(id);
    const layoutById = id => builderData.layouts.find(layout => layout.id === id) || builderData.layouts[0];

    function renderThemeSelects() {
      byId('color-theme').innerHTML = builderData.colorThemes.map(theme =>
        '<option value="' + escapeHtml(theme.value) + '">' + escapeHtml(theme.label) + '</option>'
      ).join('');
      byId('font-theme').innerHTML = builderData.fontThemes.map(theme =>
        '<option value="' + escapeHtml(theme.value) + '">' + escapeHtml(theme.label) + '</option>'
      ).join('');
      byId('content-mode').innerHTML = builderData.contentModes.map(mode =>
        '<option value="' + escapeHtml(mode.value) + '">' + escapeHtml(mode.label) + '</option>'
      ).join('');
      byId('chrome-mode').innerHTML = builderData.surfaceModes.map(mode =>
        '<option value="' + escapeHtml(mode.value) + '">' + escapeHtml(mode.label) + '</option>'
      ).join('');
      byId('section-mode').innerHTML = builderData.surfaceModes.map(mode =>
        '<option value="' + escapeHtml(mode.value) + '">' + escapeHtml(mode.label) + '</option>'
      ).join('');
      byId('color-theme').value = state.colorTheme;
      byId('font-theme').value = state.fontTheme;
      byId('content-mode').value = state.contentMode;
      byId('chrome-mode').value = state.chromeMode;
      byId('section-mode').value = state.sectionMode;
    }

    function addSlide(layoutId) {
      const layout = layoutById(layoutId);
      const slide = {
        id: 'slide-' + Date.now() + '-' + Math.random().toString(16).slice(2),
        layout: layout.id,
        title: layout.label === 'cover' ? state.title : titleFromLayout(layout.label),
        body: layout.label === 'cover' ? state.subtitle : '',
        bullets: layout.label === 'bullets' ? ['First point', 'Second point'] : [],
        image: '',
        caption: ''
      };
      state.slides.push(slide);
      selectedId = slide.id;
      render();
    }

    function titleFromLayout(label) {
      return label.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
    }

    function render() {
      renderSlides();
      renderInspector();
      postPreview();
    }

    function renderSlides() {
      const zone = byId('drop-zone');
      if (state.slides.length === 0) {
        zone.innerHTML = '<p class="empty">Drag a layout here, or click a layout card to add a slide.</p>';
        return;
      }
      zone.innerHTML = state.slides.map((slide, index) =>
        '<div class="slide-item' + (slide.id === selectedId ? ' active' : '') + '" draggable="true" data-slide-id="' + escapeHtml(slide.id) + '">' +
          '<div class="slide-index">' + (index + 1) + '</div>' +
          '<div><div class="slide-title">' + escapeHtml(slide.title || 'Untitled slide') + '</div>' +
          '<div class="slide-layout">' + escapeHtml(slide.layout) + '</div></div>' +
          '<div class="slide-actions">' +
            '<button class="icon-button" data-action="up" title="Move up">↑</button>' +
            '<button class="icon-button" data-action="down" title="Move down">↓</button>' +
            '<button class="icon-button" data-action="delete" title="Delete">×</button>' +
          '</div>' +
        '</div>'
      ).join('');
    }

    function renderInspector() {
      const slide = selectedSlide();
      byId('inspector-empty').hidden = Boolean(slide);
      byId('inspector-fields').hidden = !slide;
      if (!slide) return;
      byId('slide-title').value = slide.title;
      byId('slide-body').value = slide.body;
      byId('slide-bullets').value = slide.bullets.join('\\n');
      byId('slide-image').value = slide.image;
      byId('slide-caption').value = slide.caption;
      byId('markdown-preview').textContent = previewSlide(slide);
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
      vscode.postMessage({ type, state });
    }

    function postPreview() {
      vscode.setState({ state, selectedId });
    }

    function previewSlide(slide) {
      const lines = ['---', 'layout: ' + slide.layout, '---', '', '# ' + (slide.title || 'Untitled slide'), ''];
      if (slide.image) lines.push('![' + (slide.title || 'Slide image') + '](' + slide.image + ')', '');
      if (slide.bullets.length) lines.push(slide.bullets.map(item => '- ' + item).join('\\n'), '');
      if (slide.body) lines.push(slide.body, '');
      if (slide.caption) lines.push('*' + slide.caption + '*');
      return lines.join('\\n').trim();
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
        event.dataTransfer.setData('text/plain', card.dataset.layoutId);
        event.dataTransfer.effectAllowed = 'copy';
      });
    });

    byId('drop-zone').addEventListener('dragover', event => {
      event.preventDefault();
      byId('drop-zone').classList.add('drag-over');
    });
    byId('drop-zone').addEventListener('dragleave', () => byId('drop-zone').classList.remove('drag-over'));
    byId('drop-zone').addEventListener('drop', event => {
      event.preventDefault();
      byId('drop-zone').classList.remove('drag-over');
      const layoutId = event.dataTransfer.getData('text/plain');
      if (layoutId) addSlide(layoutId);
    });

    byId('drop-zone').addEventListener('click', event => {
      const item = event.target.closest('.slide-item');
      if (!item) return;
      const action = event.target.dataset.action;
      const id = item.dataset.slideId;
      if (action === 'up') moveSlide(id, -1);
      else if (action === 'down') moveSlide(id, 1);
      else if (action === 'delete') deleteSlide(id);
      else {
        selectedId = id;
        render();
      }
    });
    byId('drop-zone').addEventListener('dragstart', event => {
      const item = event.target.closest('.slide-item');
      if (!item) return;
      dragSlideId = item.dataset.slideId;
      event.dataTransfer.effectAllowed = 'move';
    });
    byId('drop-zone').addEventListener('dragend', () => {
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

    byId('deck-title').addEventListener('input', event => { state.title = event.target.value; postPreview(); });
    byId('deck-subtitle').addEventListener('input', event => { state.subtitle = event.target.value; postPreview(); });
    byId('color-theme').addEventListener('change', event => { state.colorTheme = event.target.value; postPreview(); });
    byId('font-theme').addEventListener('change', event => { state.fontTheme = event.target.value; postPreview(); });
    byId('content-mode').addEventListener('change', event => { state.contentMode = event.target.value; postPreview(); });
    byId('chrome-mode').addEventListener('change', event => { state.chromeMode = event.target.value; postPreview(); });
    byId('section-mode').addEventListener('change', event => { state.sectionMode = event.target.value; postPreview(); });
    byId('slide-title').addEventListener('input', event => updateSelected({ title: event.target.value }));
    byId('slide-body').addEventListener('input', event => updateSelected({ body: event.target.value }));
    byId('slide-bullets').addEventListener('input', event => updateSelected({
      bullets: event.target.value.split('\\n').map(line => line.trim()).filter(Boolean)
    }));
    byId('slide-image').addEventListener('input', event => updateSelected({ image: event.target.value }));
    byId('slide-caption').addEventListener('input', event => updateSelected({ caption: event.target.value }));
    byId('generateNewDocument').addEventListener('click', () => post('generateNewDocument'));
    byId('insertIntoEditor').addEventListener('click', () => post('insertIntoEditor'));

    const previous = vscode.getState();
    if (previous?.state) {
      Object.assign(state, previous.state);
      selectedId = previous.selectedId || '';
    }
    renderThemeSelects();
    if (state.slides.length === 0) addSlide('cover');
    render();
  </script>
</body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
