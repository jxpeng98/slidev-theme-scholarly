import { defineConfig } from 'vitepress'
import { withSidebar } from 'vitepress-sidebar';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

// https://vitepress.dev/reference/site-config


const vitePressOptions = {
  title: "Slidev Theme Scholarly",
  description: "A Slidev Theme for professional academic presentations",

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    socialLinks: [
      { icon: 'github', link: 'https://github.com/jxpeng98/slidev-theme-scholarly' }
    ],
    outline: {
      label: 'On this page',
      level: [1, 6],
    },
  },

  locales: {
    root: {
      label: 'English',
      lang: 'en',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          {
            text: 'Guide',
            items: [
              { text: 'Quick Start', link: '/en/guide/quick-start' },
              { text: 'Upgrade Notes', link: '/en/guide/upgrade' },
              { text: 'Features', link: '/en/guide/features' },
              { text: 'Academic Workflows', link: '/en/guide/workflows/' },
              { text: 'Configurations', link: '/en/guide/configurations' },
              { text: 'Theme Mode and Contrast', link: '/en/guide/theme-mode-contrast' },
              { text: 'Color & Typography Themes', link: '/en/guide/themes' }
            ]
          },
          {
            text: 'Layouts',
            items: [
              { text: 'Overview', link: '/en/layouts/' },
              { text: 'Structure', link: '/en/layouts/structure' },
              { text: 'Content', link: '/en/layouts/content' },
              { text: 'Emphasis', link: '/en/layouts/emphasis' },
              { text: 'Academic', link: '/en/layouts/academic' }
            ]
          },
          {
            text: 'Components',
            items: [
              { text: 'Overview', link: '/en/components/' },
              { text: 'Theorem', link: '/en/components/theorem' },
              { text: 'Block', link: '/en/components/block' },
              { text: 'Steps', link: '/en/components/steps' },
              { text: 'Keywords', link: '/en/components/keywords' },
              { text: 'Columns', link: '/en/components/columns' },
              { text: 'Highlight', link: '/en/components/highlight' },
              { text: 'MetricCard', link: '/en/components/metric-card' },
              { text: 'MetricGrid', link: '/en/components/metric-grid' },
              { text: 'EvidenceBlock', link: '/en/components/evidence-block' },
              { text: 'EquationBlock', link: '/en/components/equation-block' },
              { text: 'DatasetCard', link: '/en/components/dataset-card' },
              { text: 'PaperCard', link: '/en/components/paper-card' },
              { text: 'ContributionList', link: '/en/components/contribution-list' },
              { text: 'CaveatList', link: '/en/components/caveat-list' },
              { text: 'Cite', link: '/en/components/cite' },
              { text: 'ThemePreview', link: '/en/components/theme-preview' }
            ]
          },
          { text: 'Syntax Sugar', link: '/en/syntax-sugar' },
          { text: 'Examples', link: '/en/examples' }
        ],
      }
    },
    zh: {
      label: '简体中文',
      lang: 'zh',
      link: '/zh/',
      themeConfig: {
        nav: [
          { text: '首页', link: '/zh/' },
          {
            text: '指南',
            items: [
              { text: '快速开始', link: '/zh/guide/quick-start' },
              { text: '重大升级说明', link: '/zh/guide/upgrade' },
              { text: '主要功能', link: '/zh/guide/features' },
              { text: '学术工作流', link: '/zh/guide/workflows/' },
              { text: '配置', link: '/zh/guide/configurations' },
              { text: '主题模式与对比度', link: '/zh/guide/theme-mode-contrast' },
              { text: '色彩与字体主题', link: '/zh/guide/themes' }
            ]
          },
          {
            text: '布局',
            items: [
              { text: '概览', link: '/zh/layouts/' },
              { text: '结构布局', link: '/zh/layouts/structure' },
              { text: '内容布局', link: '/zh/layouts/content' },
              { text: '强调布局', link: '/zh/layouts/emphasis' },
              { text: '学术布局', link: '/zh/layouts/academic' }
            ]
          },
          {
            text: '组件',
            items: [
              { text: '概览', link: '/zh/components/' },
              { text: '定理', link: '/zh/components/theorem' },
              { text: 'Block', link: '/zh/components/block' },
              { text: 'Steps', link: '/zh/components/steps' },
              { text: 'Keywords', link: '/zh/components/keywords' },
              { text: 'Columns', link: '/zh/components/columns' },
              { text: 'Highlight', link: '/zh/components/highlight' },
              { text: 'MetricCard', link: '/zh/components/metric-card' },
              { text: 'MetricGrid', link: '/zh/components/metric-grid' },
              { text: 'EvidenceBlock', link: '/zh/components/evidence-block' },
              { text: 'EquationBlock', link: '/zh/components/equation-block' },
              { text: 'DatasetCard', link: '/zh/components/dataset-card' },
              { text: 'PaperCard', link: '/zh/components/paper-card' },
              { text: 'ContributionList', link: '/zh/components/contribution-list' },
              { text: 'CaveatList', link: '/zh/components/caveat-list' },
              { text: 'Cite', link: '/zh/components/cite' },
              { text: 'ThemePreview', link: '/zh/components/theme-preview' }
            ]
          },
          { text: '语法糖', link: '/zh/syntax-sugar' },
          { text: '示例', link: '/zh/examples' }
        ],
      }
    }
  }
}

const documentRootPath = existsSync(resolve(process.cwd(), 'en')) ? '.' : 'docs';

const commonSidebarOptions = {
  // vitepress-sidebar expects a path relative to `process.cwd()`
  documentRootPath,
  useTitleFromFrontmatter: true,
  frontmatterTitleFieldName: 'title',
  collapsed: true,
  removePrefixAfterOrdering: true,
  prefixSeparator: '-',
  hyphenToSpace: true,
  useFolderTitleFromIndexFile: true,
  useFolderLinkFromIndexFile: true,
  sortMenusByName: false,
};

const vitePressSidebarOptions = [
  {
    ...commonSidebarOptions,
    scanStartPath: '/en',
    basePath: '/',
    resolvePath: '/en/'
  },
  {
    ...commonSidebarOptions,
    scanStartPath: '/zh',
    basePath: '/',
    resolvePath: '/zh/',
  }
];

export default defineConfig(withSidebar(vitePressOptions, vitePressSidebarOptions));
