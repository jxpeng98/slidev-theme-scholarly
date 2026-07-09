/**
 * Shared semantic tokens for every extension webview.
 *
 * UI chrome must inherit the active VS Code theme. Presentation palette colors
 * are rendered separately as data (for example, in color-theme swatches).
 */
export const WEBVIEW_THEME_CSS = `
  :root {
    color-scheme: light dark;
    --sch-bg: var(--vscode-editor-background);
    --sch-panel: var(--vscode-sideBar-background, var(--vscode-editor-background));
    --sch-card: var(--vscode-editorWidget-background, var(--vscode-sideBar-background));
    --sch-fg: var(--vscode-editor-foreground);
    --sch-muted: var(--vscode-descriptionForeground);
    --sch-border: var(--vscode-contrastBorder, var(--vscode-panel-border, var(--vscode-widget-border, var(--vscode-editorWidget-border))));
    --sch-focus: var(--vscode-contrastActiveBorder, var(--vscode-focusBorder));
    --sch-link: var(--vscode-textLink-foreground);
    --sch-link-active: var(--vscode-textLink-activeForeground, var(--vscode-textLink-foreground));
    --sch-accent: var(--vscode-button-background);
    --sch-accent-fg: var(--vscode-button-foreground);
    --sch-accent-hover: var(--vscode-button-hoverBackground, var(--vscode-button-background));
    --sch-secondary: var(--vscode-button-secondaryBackground, var(--vscode-editorWidget-background));
    --sch-secondary-fg: var(--vscode-button-secondaryForeground, var(--vscode-editor-foreground));
    --sch-secondary-hover: var(--vscode-button-secondaryHoverBackground, var(--vscode-list-hoverBackground));
    --sch-input-bg: var(--vscode-input-background);
    --sch-input-fg: var(--vscode-input-foreground, var(--vscode-editor-foreground));
    --sch-input-border: var(--vscode-input-border, var(--sch-border));
    --sch-placeholder: var(--vscode-input-placeholderForeground, var(--vscode-descriptionForeground));
    --sch-dropdown-bg: var(--vscode-dropdown-background, var(--vscode-input-background));
    --sch-dropdown-fg: var(--vscode-dropdown-foreground, var(--vscode-input-foreground));
    --sch-dropdown-border: var(--vscode-dropdown-border, var(--vscode-input-border, var(--sch-border)));
    --sch-hover: var(--vscode-list-hoverBackground);
    --sch-hover-fg: var(--vscode-list-hoverForeground, var(--vscode-editor-foreground));
    --sch-selected: var(--vscode-list-activeSelectionBackground);
    --sch-selected-fg: var(--vscode-list-activeSelectionForeground, var(--vscode-editor-foreground));
    --sch-drop: var(--vscode-list-dropBackground, var(--vscode-list-activeSelectionBackground));
    --sch-code-bg: var(--vscode-textCodeBlock-background, var(--vscode-editorWidget-background));
    --sch-code-fg: var(--vscode-editor-foreground);
    --sch-badge-bg: var(--vscode-badge-background);
    --sch-badge-fg: var(--vscode-badge-foreground);
    --sch-error: var(--vscode-errorForeground);
    --sch-disabled: var(--vscode-disabledForeground, var(--vscode-descriptionForeground));
    --sch-shadow: var(--vscode-widget-shadow);
    --sch-radius-sm: 4px;
    --sch-radius-md: 7px;
    --sch-radius-lg: 10px;
  }

  * { box-sizing: border-box; }

  html, body {
    min-height: 100%;
    background: var(--sch-bg);
    color: var(--sch-fg);
  }

  body {
    margin: 0;
    font: 13px/1.5 var(--vscode-font-family, system-ui, sans-serif);
  }

  body.vscode-light,
  body.vscode-high-contrast-light {
    color-scheme: light;
  }

  body.vscode-dark,
  body.vscode-high-contrast {
    color-scheme: dark;
  }

  button, input, textarea, select {
    font: inherit;
  }

  button, select {
    cursor: pointer;
  }

  input, textarea, select {
    color: var(--sch-input-fg);
    background: var(--sch-input-bg);
    border: 1px solid var(--sch-input-border);
  }

  input::placeholder, textarea::placeholder {
    color: var(--sch-placeholder);
  }

  select {
    color: var(--sch-dropdown-fg);
    background: var(--sch-dropdown-bg);
    border-color: var(--sch-dropdown-border);
  }

  :where(button, input, textarea, select, a, [tabindex]):focus-visible {
    outline: 2px solid var(--sch-focus);
    outline-offset: 2px;
  }

  a {
    color: var(--sch-link);
  }

  a:hover {
    color: var(--sch-link-active);
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      scroll-behavior: auto !important;
      transition-duration: 0.01ms !important;
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
    }
  }

  @media (forced-colors: active) {
    :where(button, input, textarea, select, img, pre) {
      border: 1px solid CanvasText;
    }
  }
`;
