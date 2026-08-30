import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { t } from './localization';

// BibTeX entry interface
export interface BibEntry {
    key: string;
    type: string;
    fields?: Record<string, string>;
    author?: string;
    title?: string;
    year?: string;
    journal?: string;
    booktitle?: string;
    publisher?: string;
    school?: string;
    institution?: string;
    doi?: string;
    url?: string;
    volume?: string;
    pages?: string;
}

export interface PaperMetadata {
    key: string;
    type: string;
    title: string;
    authors: string[];
    year: string;
    venue: string;
    doi: string;
    url: string;
}

export interface AnchorTarget {
    id: string;
    label: string;
    line: number;
    syntax: 'heading' | 'anchor' | 'html-id' | 'named-anchor';
}

const HEADING_ID_SUFFIX_RE = /^([ \t]*#{1,6}\s+.*?)[ \t]+\{#([^\s}]+)\}[ \t]*$/gm;
const ANCHOR_SUGAR_RE = /^[ \t]*::anchor\{#([^\s}]+)\}[ \t]*$/gm;
const HTML_ID_RE = /<([A-Za-z][\w:-]*)\b[^>]*\bid\s*=\s*["']([^"'<>]+)["'][^>]*>/gi;
const NAMED_ANCHOR_RE = /<a\b[^>]*\bname\s*=\s*["']([^"'<>]+)["'][^>]*>/gi;
const ANCHOR_COMPLETION_CONTEXT_RE = /(?:\]\(#|(?:href|to)\s*=\s*["']#)([\w-]*)$/;
const VENUE_FIELDS = ['journal', 'booktitle', 'publisher', 'school', 'institution'];

function normalizeWhitespace(value: string | undefined): string {
    return String(value || '').replace(/\s+/g, ' ').trim();
}

function cleanupBibValue(value: string | undefined): string {
    return normalizeWhitespace(String(value || '').replace(/[{}]/g, ''));
}

function splitAuthors(value: string | undefined): string[] {
    const text = cleanupBibValue(value);
    if (!text)
        return [];

    return text.split(/\s+and\s+/i).map(author => {
        const parts = author.split(',').map(part => normalizeWhitespace(part)).filter(Boolean);
        if (parts.length >= 2)
            return normalizeWhitespace(`${parts.slice(1).join(' ')} ${parts[0]}`);
        return normalizeWhitespace(author);
    }).filter(Boolean);
}

function escapeYamlScalar(value: string): string {
    if (!value)
        return '""';
    if (/[:#\[\]{}&*!|>'"%@`]|^\s|\s$/.test(value))
        return JSON.stringify(value);
    return value;
}

function escapeVueAttribute(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

export function extractPaperMetadata(entry: BibEntry): PaperMetadata {
    const fields = entry.fields || {};
    const read = (name: string) => cleanupBibValue(fields[name] || (entry as any)[name]);
    const venueField = VENUE_FIELDS.find(field => read(field));

    return {
        key: entry.key,
        type: entry.type,
        title: read('title'),
        authors: splitAuthors(read('author') || read('editor')),
        year: read('year') || read('date'),
        venue: venueField ? read(venueField) : '',
        doi: read('doi'),
        url: read('url') || read('eprint')
    };
}

export function renderPaperMarkdown(metadata: PaperMetadata, layout: 'paper-summary' | 'paper-card' = 'paper-summary'): string {
    if (layout === 'paper-card') {
        const attrs = [`title="${escapeVueAttribute(metadata.title || t('Untitled Paper'))}"`];
        if (metadata.authors.length)
            attrs.push(`:authors='${JSON.stringify(metadata.authors).replace(/'/g, '&apos;')}'`);
        if (metadata.venue)
            attrs.push(`venue="${escapeVueAttribute(metadata.venue)}"`);
        if (metadata.year)
            attrs.push(`year="${escapeVueAttribute(metadata.year)}"`);
        if (metadata.doi)
            attrs.push(`doi="${escapeVueAttribute(metadata.doi)}"`);
        if (metadata.url)
            attrs.push(`url="${escapeVueAttribute(metadata.url)}"`);

        return `<PaperCard\n  ${attrs.join('\n  ')}\n>\n\n${t('Add the main contribution or discussion notes.')}\n\n</PaperCard>\n`;
    }

    const lines = [
        '---',
        'layout: paper-summary',
        `paperTitle: ${escapeYamlScalar(metadata.title || t('Untitled Paper'))}`
    ];

    if (metadata.authors.length) {
        lines.push('authors:');
        for (const author of metadata.authors)
            lines.push(`  - ${escapeYamlScalar(author)}`);
    } else {
        lines.push('authors: []');
    }

    lines.push(`year: ${escapeYamlScalar(metadata.year || '')}`);
    lines.push(`venue: ${escapeYamlScalar(metadata.venue || '')}`);
    if (metadata.doi)
        lines.push(`doi: ${escapeYamlScalar(metadata.doi)}`);
    if (metadata.url)
        lines.push(`url: ${escapeYamlScalar(metadata.url)}`);
    lines.push('---');
    lines.push('');
    lines.push('::problem');
    lines.push(`- ${t('Add the paper problem or research question.')}`);
    lines.push('::');
    lines.push('');
    lines.push('::method');
    lines.push(`- ${t('Add the method or study design.')}`);
    lines.push('::');
    lines.push('');
    lines.push('::finding');
    lines.push(`- ${t('Add the key result or takeaway.')}`);
    lines.push('::');

    return `${lines.join('\n')}\n`;
}

function getAnchorSyntaxLabel(syntax: AnchorTarget['syntax']): string {
    switch (syntax) {
        case 'heading':
            return t('Heading anchor');
        case 'anchor':
            return t('Standalone anchor');
        case 'named-anchor':
            return t('Named anchor');
        default:
            return 'HTML id';
    }
}

function stripHeadingMarker(heading: string): string {
    return heading.replace(/^[ \t]*#{1,6}\s*/, '').trim();
}

export function parseAnchorTargets(document: vscode.TextDocument): AnchorTarget[] {
    const text = document.getText();
    const anchors: AnchorTarget[] = [];
    const seen = new Set<string>();

    const addAnchor = (id: string | undefined, label: string, syntax: AnchorTarget['syntax'], index: number) => {
        const normalizedId = id?.trim();
        if (!normalizedId || seen.has(normalizedId))
            return;

        seen.add(normalizedId);
        anchors.push({
            id: normalizedId,
            label: label.trim() || normalizedId,
            line: document.positionAt(index).line,
            syntax,
        });
    };

    for (const match of text.matchAll(HEADING_ID_SUFFIX_RE)) {
        const heading = stripHeadingMarker(match[1] ?? '');
        addAnchor(match[2], heading, 'heading', match.index ?? 0);
    }

    for (const match of text.matchAll(ANCHOR_SUGAR_RE))
        addAnchor(match[1], t('Anchor #{0}', match[1] ?? ''), 'anchor', match.index ?? 0);

    for (const match of text.matchAll(HTML_ID_RE)) {
        const tag = (match[1] ?? 'element').toLowerCase();
        addAnchor(match[2], `<${tag}> #${match[2]}`, 'html-id', match.index ?? 0);
    }

    for (const match of text.matchAll(NAMED_ANCHOR_RE))
        addAnchor(match[1], `<a name="${match[1]}">`, 'named-anchor', match.index ?? 0);

    return anchors.sort((left, right) => left.line - right.line || left.id.localeCompare(right.id));
}

function resolveAnchorCompletionContext(linePrefix: string): string | null {
    const match = linePrefix.match(ANCHOR_COMPLETION_CONTEXT_RE);
    return match ? match[1] ?? '' : null;
}

function createAnchorCompletionItem(anchor: AnchorTarget, range: vscode.Range): vscode.CompletionItem {
    const item = new vscode.CompletionItem(anchor.id, vscode.CompletionItemKind.Reference);
    const syntaxLabel = getAnchorSyntaxLabel(anchor.syntax);

    item.detail = t('{0} · line {1}', syntaxLabel, anchor.line + 1);
    item.documentation = new vscode.MarkdownString(
        `**${anchor.label}**\n\n` +
        `\`#${anchor.id}\`\n\n` +
        t('{0} on line {1}', syntaxLabel, anchor.line + 1)
    );
    item.insertText = anchor.id;
    item.filterText = anchor.id;
    item.range = range;
    item.sortText = `${String(anchor.line).padStart(5, '0')}-${anchor.id}`;

    return item;
}

// Parse a .bib file and extract entries
export function parseBibFile(content: string): BibEntry[] {
    const entries: BibEntry[] = [];
    const text = content;
    const len = text.length;
    let i = 0;
    const macros = new Map<string, string>();

    const isWhitespace = (ch: string) => /\s/.test(ch);
    const skipWhitespace = () => {
        while (i < len && isWhitespace(text[i])) i++;
    };

    const readWord = (): string => {
        const start = i;
        while (i < len && /[A-Za-z0-9_-]/.test(text[i])) i++;
        return text.slice(start, i);
    };

    const readUntil = (stopChars: Set<string>): string => {
        const start = i;
        while (i < len && !stopChars.has(text[i])) i++;
        return text.slice(start, i);
    };

    const parseBraceValue = (): string => {
        i++; // skip '{'
        const start = i;
        let depth = 1;
        while (i < len) {
            const ch = text[i];
            if (ch === '{') depth++;
            else if (ch === '}') depth--;
            if (depth === 0) break;
            i++;
        }
        const value = text.slice(start, i);
        if (i < len && text[i] === '}') i++;
        return value;
    };

    const parseQuotedValue = (): string => {
        i++; // skip opening quote
        let value = '';
        while (i < len) {
            const ch = text[i];
            if (ch === '\\' && i + 1 < len) {
                value += text[i + 1];
                i += 2;
                continue;
            }
            if (ch === '"') {
                i++;
                break;
            }
            value += ch;
            i++;
        }
        return value;
    };

    const parseValueToken = (entryClose: string): string => {
        skipWhitespace();
        if (i >= len) return '';

        const ch = text[i];
        if (ch === '{') return parseBraceValue();
        if (ch === '"') return parseQuotedValue();

        const raw = readUntil(new Set([',', '#', entryClose]));
        const token = raw.trim();
        return macros.get(token.toLowerCase()) || token;
    };

    const parseValue = (entryClose: string): string => {
        let value = parseValueToken(entryClose);
        skipWhitespace();
        while (i < len && text[i] === '#') {
            i++;
            value += parseValueToken(entryClose);
            skipWhitespace();
        }
        return value.replace(/\s+/g, ' ').trim();
    };

    const parseStringMacro = (close: string) => {
        skipWhitespace();
        const name = readWord().toLowerCase();
        skipWhitespace();
        if (!name || text[i] !== '=') {
            skipEnclosedBlock(close === '}' ? '{' : '(', close);
            return;
        }

        i++;
        const value = parseValue(close);
        if (value)
            macros.set(name, value);

        while (i < len && text[i] !== close) i++;
        if (text[i] === close) i++;
    };

    const skipEnclosedBlock = (open: string, close: string) => {
        let depth = 1;
        while (i < len) {
            const ch = text[i];
            if (ch === open) depth++;
            else if (ch === close) depth--;
            i++;
            if (depth === 0) break;
        }
    };

    while (i < len) {
        const at = text.indexOf('@', i);
        if (at === -1) break;
        i = at + 1;

        skipWhitespace();
        const type = readWord().toLowerCase();
        if (!type) {
            i++;
            continue;
        }

        skipWhitespace();
        const open = text[i];
        if (open !== '{' && open !== '(') continue;
        const close = open === '{' ? '}' : ')';
        i++; // skip open

        if (type === 'comment' || type === 'preamble') {
            skipEnclosedBlock(open, close);
            continue;
        }

        if (type === 'string') {
            parseStringMacro(close);
            continue;
        }

        skipWhitespace();
        const key = readUntil(new Set([',', close])).trim();

        if (i < len && text[i] === ',') i++;

        const entry: BibEntry = { key, type, fields: {} };

        while (i < len) {
            skipWhitespace();
            if (i >= len) break;

            if (text[i] === ',') {
                i++;
                continue;
            }

            if (text[i] === close) {
                i++;
                break;
            }

            const fieldName = readWord().toLowerCase();
            if (!fieldName) {
                i++;
                continue;
            }

            skipWhitespace();
            if (text[i] !== '=') {
                i++;
                continue;
            }

            i++;
            const fieldValue = parseValue(close);
            if (fieldValue) {
                entry.fields![fieldName] = fieldValue;
                (entry as any)[fieldName] = fieldValue;
            }
        }

        if (entry.key) entries.push(entry);
    }

    return entries;
}

// Find .bib file from frontmatter or workspace
export async function findBibFile(document?: vscode.TextDocument): Promise<string | undefined> {
    const resolvedDocument = document ?? vscode.window.activeTextEditor?.document;
    if (!resolvedDocument) return undefined;

    const text = resolvedDocument.getText();
    const localWorkspace = vscode.workspace.workspaceFolders?.find(folder => folder.uri.scheme === 'file');
    const docDir = resolvedDocument.uri.scheme === 'file'
        ? path.dirname(resolvedDocument.uri.fsPath)
        : localWorkspace?.uri.fsPath;

    // Look for bibFile in frontmatter
    const frontmatterMatch = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (frontmatterMatch) {
        const bibFileMatch = frontmatterMatch[1].match(/^\s*bibFile:\s*(.+?)\s*$/m);
        if (bibFileMatch) {
            const raw = bibFileMatch[1].trim();
            const noComment = raw.split('#')[0].trim();
            const bibPath = noComment.replace(/^['"]|['"]$/g, '');
            return docDir ? path.resolve(docDir, bibPath) : undefined;
        }
    }

    // Fallback: look for references.bib in workspace
    if (localWorkspace) {
        const defaultBib = path.join(localWorkspace.uri.fsPath, 'references.bib');
        if (fs.existsSync(defaultBib)) {
            return defaultBib;
        }
    }

    return undefined;
}

// Load and cache BibTeX entries
const cachedEntriesByPath = new Map<string, BibEntry[]>();

export function clearBibCache() {
    cachedEntriesByPath.clear();
}

export async function loadBibEntries(document?: vscode.TextDocument): Promise<BibEntry[]> {
    const bibPath = await findBibFile(document);
    if (!bibPath || !fs.existsSync(bibPath)) {
        return [];
    }

    const cached = cachedEntriesByPath.get(bibPath);
    if (cached) return cached;

    try {
        const content = fs.readFileSync(bibPath, 'utf8');
        const parsed = parseBibFile(content);
        cachedEntriesByPath.set(bibPath, parsed);
        return parsed;
    } catch (e) {
        console.error('Error loading bib file:', e);
        return [];
    }
}

// Completion provider for @citekey
export class BibCompletionProvider implements vscode.CompletionItemProvider {
    async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position
    ): Promise<vscode.CompletionItem[]> {
        const lineText = document.lineAt(position).text;
        const linePrefix = lineText.substring(0, position.character);

        // Check if we're after @ or !@
        if (!linePrefix.match(/(!?@)[\w-]*$/)) {
            return [];
        }

        const entries = await loadBibEntries(document);

        return entries.map(entry => {
            const item = new vscode.CompletionItem(
                entry.key,
                vscode.CompletionItemKind.Reference
            );

            // Build detail string
            const author = entry.author ? entry.author.split(' and ')[0] : t('Unknown');
            const year = entry.year || '';
            item.detail = `${author} (${year})`;

            // Build documentation
            item.documentation = new vscode.MarkdownString(
                `**${entry.title || t('Untitled')}**\n\n` +
                `*${entry.author || t('Unknown author')}*\n\n` +
                `${entry.journal || entry.booktitle || entry.publisher || ''} ${year}`
            );

            item.insertText = entry.key;
            item.filterText = entry.key;

            return item;
        });
    }
}

export class AnchorCompletionProvider implements vscode.CompletionItemProvider {
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position
    ): vscode.CompletionItem[] {
        const lineText = document.lineAt(position).text;
        const linePrefix = lineText.substring(0, position.character);
        const partial = resolveAnchorCompletionContext(linePrefix);

        if (partial === null)
            return [];

        const range = new vscode.Range(
            position.line,
            position.character - partial.length,
            position.line,
            position.character
        );

        return parseAnchorTargets(document).map(anchor => createAnchorCompletionItem(anchor, range));
    }
}

// Hover provider for citations
export class BibHoverProvider implements vscode.HoverProvider {
    async provideHover(
        document: vscode.TextDocument,
        position: vscode.Position
    ): Promise<vscode.Hover | undefined> {
        const range = document.getWordRangeAtPosition(position, /!?@[\w-]+/);
        if (!range) return undefined;

        const text = document.getText(range);
        const key = text.replace(/^!?@/, '');

        const entries = await loadBibEntries(document);
        const entry = entries.find(e => e.key === key);

        if (!entry) return undefined;

        const markdown = new vscode.MarkdownString();
        markdown.appendMarkdown(`### ${entry.title || t('Untitled')}\n\n`);
        markdown.appendMarkdown(`**${t('Authors')}:** ${entry.author || t('Unknown')}\n\n`);
        markdown.appendMarkdown(`**${t('Year')}:** ${entry.year || t('N/A')}\n\n`);
        if (entry.journal) {
            markdown.appendMarkdown(`**${t('Journal')}:** ${entry.journal}\n\n`);
        }
        if (entry.booktitle) {
            markdown.appendMarkdown(`**${t('Conference')}:** ${entry.booktitle}\n\n`);
        }
        markdown.appendMarkdown(`\`@${entry.key}\``);

        return new vscode.Hover(markdown, range);
    }
}

// Tree view provider for BibTeX entries
export class BibTreeItem extends vscode.TreeItem {
    constructor(
        public readonly entry: BibEntry,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        const author = entry.author ? entry.author.split(' and ')[0].split(',')[0] : t('Unknown');
        super(`${author} (${entry.year || t('N/A')})`, collapsibleState);
        this.description = entry.key;
        this.tooltip = entry.title || entry.key;
        this.iconPath = new vscode.ThemeIcon('book');
        this.contextValue = 'referenceCitation';
        this.command = {
            command: 'slidev-scholarly.insertBibKey',
            title: t('Insert Citation'),
            arguments: [entry.key]
        };
    }
}

class AnchorTreeItem extends vscode.TreeItem {
    constructor(
        public readonly anchor: AnchorTarget,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(anchor.label, collapsibleState);
        this.description = `#${anchor.id}`;
        this.tooltip = `${anchor.label}\n#${anchor.id}\n${t('{0} · line {1}', getAnchorSyntaxLabel(anchor.syntax), anchor.line + 1)}`;
        this.iconPath = new vscode.ThemeIcon(anchor.syntax === 'heading' ? 'symbol-key' : 'link');
        this.contextValue = 'referenceAnchor';
        this.command = {
            command: 'slidev-scholarly.insertAnchorKey',
            title: t('Insert Anchor Reference'),
            arguments: [anchor.id]
        };
    }
}

class ReferenceGroupItem extends vscode.TreeItem {
    constructor(
        public readonly kind: 'citations' | 'anchors',
        count: number
    ) {
        super(kind === 'citations' ? t('Citations') : t('Internal Anchors'), vscode.TreeItemCollapsibleState.Expanded);
        this.description = String(count);
        this.iconPath = new vscode.ThemeIcon(kind === 'citations' ? 'book' : 'link');
        this.contextValue = 'referenceGroup';
    }
}

type ReferenceTreeItem = BibTreeItem | AnchorTreeItem | ReferenceGroupItem;

export class BibTreeProvider implements vscode.TreeDataProvider<ReferenceTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<ReferenceTreeItem | undefined | null | void> = new vscode.EventEmitter<ReferenceTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<ReferenceTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        clearBibCache();
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: ReferenceTreeItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: ReferenceTreeItem): Promise<ReferenceTreeItem[]> {
        const activeDocument = vscode.window.activeTextEditor?.document;
        const document = activeDocument?.languageId === 'markdown' ? activeDocument : undefined;

        if (element instanceof ReferenceGroupItem) {
            if (element.kind === 'citations') {
                const entries = await loadBibEntries(document);
                return entries.map(entry => new BibTreeItem(entry, vscode.TreeItemCollapsibleState.None));
            }

            if (!document)
                return [];

            return parseAnchorTargets(document).map(anchor =>
                new AnchorTreeItem(anchor, vscode.TreeItemCollapsibleState.None)
            );
        }

        const entries = await loadBibEntries(document);
        const anchors = document ? parseAnchorTargets(document) : [];
        const rootItems: ReferenceTreeItem[] = [];

        if (entries.length > 0)
            rootItems.push(new ReferenceGroupItem('citations', entries.length));

        if (anchors.length > 0)
            rootItems.push(new ReferenceGroupItem('anchors', anchors.length));

        return rootItems;
    }
}
