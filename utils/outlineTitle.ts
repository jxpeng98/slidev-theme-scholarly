const MARKDOWN_HEADING_ID_SUFFIX_RE = /[ \t]+\{#[^\s}]+}[ \t]*$/

export function sanitizeMarkdownHeadingTitle(title: string): string {
  return title.replace(MARKDOWN_HEADING_ID_SUFFIX_RE, '').trim()
}
