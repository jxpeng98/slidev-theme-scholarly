import { defineConfig } from 'vitepress'

const enSidebar = [
  {
    text: 'Start here',
    items: [
      { text: 'Overview', link: '/en/' },
      { text: 'Quick start', link: '/en/guide/quick-start' },
      { text: 'VS Code extension', link: '/en/guide/vscode-extension' },
      {
        text: 'Choose a workflow', link: '/en/guide/workflows/', collapsed: true,
        items: [
          { text: 'Paper talk', link: '/en/guide/workflows/paper-talk' },
          { text: 'Thesis defense', link: '/en/guide/workflows/thesis-defense' },
          { text: 'Literature review', link: '/en/guide/workflows/literature-review' },
          { text: 'Results talk', link: '/en/guide/workflows/results-heavy' },
          { text: 'Course lecture', link: '/en/guide/workflows/course-lecture' },
        ],
      },
      { text: 'Upgrade notes', link: '/en/guide/upgrade' },
    ],
  },
  {
    text: 'Build your deck',
    items: [
      {
        text: 'Layouts', link: '/en/layouts/', collapsed: true,
        items: [
          { text: 'Structure', link: '/en/layouts/structure' },
          { text: 'Content', link: '/en/layouts/content' },
          { text: 'Emphasis', link: '/en/layouts/emphasis' },
          { text: 'Academic', link: '/en/layouts/academic' },
        ],
      },
      {
        text: 'Components', link: '/en/components/', collapsed: true,
        items: [
          { text: 'Theorem', link: '/en/components/theorem' },
          { text: 'Block', link: '/en/components/block' },
          { text: 'Highlight', link: '/en/components/highlight' },
          { text: 'Columns', link: '/en/components/columns' },
          { text: 'Steps', link: '/en/components/steps' },
          { text: 'Keywords', link: '/en/components/keywords' },
          { text: 'MetricCard', link: '/en/components/metric-card' },
          { text: 'MetricGrid', link: '/en/components/metric-grid' },
          { text: 'ResultTable', link: '/en/components/result-table' },
          { text: 'EvidenceBlock', link: '/en/components/evidence-block' },
          { text: 'EquationBlock', link: '/en/components/equation-block' },
          { text: 'DatasetCard', link: '/en/components/dataset-card' },
          { text: 'PaperCard', link: '/en/components/paper-card' },
          { text: 'ContributionList', link: '/en/components/contribution-list' },
          { text: 'CaveatList', link: '/en/components/caveat-list' },
          { text: 'ThemePreview', link: '/en/components/theme-preview' },
        ],
      },
      { text: 'Citations', link: '/en/components/cite' },
      { text: 'Syntax sugar', link: '/en/syntax-sugar' },
      { text: 'Data-driven slides', link: '/en/guide/data-driven' },
      { text: 'Examples', link: '/en/examples' },
    ],
  },
  {
    text: 'Customize',
    collapsed: true,
    items: [
      { text: 'Configuration', link: '/en/guide/configurations' },
      { text: 'Colors and typography', link: '/en/guide/themes' },
      { text: 'Theme modes and contrast', link: '/en/guide/theme-mode-contrast' },
    ],
  },
  {
    text: 'Reference',
    collapsed: true,
    items: [
      { text: 'Feature overview', link: '/en/guide/features' },
      { text: 'All guides', link: '/en/guide/' },
      { text: 'Contributing', link: '/en/contributing' },
    ],
  },
]

const zhSidebar = [
  {
    text: '从这里开始',
    items: [
      { text: '概览', link: '/zh/' },
      { text: '快速开始', link: '/zh/guide/quick-start' },
      { text: 'VS Code 插件', link: '/zh/guide/vscode-extension' },
      {
        text: '选择工作流', link: '/zh/guide/workflows/', collapsed: true,
        items: [
          { text: '论文报告', link: '/zh/guide/workflows/paper-talk' },
          { text: '学位答辩', link: '/zh/guide/workflows/thesis-defense' },
          { text: '文献综述', link: '/zh/guide/workflows/literature-review' },
          { text: '结果报告', link: '/zh/guide/workflows/results-heavy' },
          { text: '课程讲义', link: '/zh/guide/workflows/course-lecture' },
        ],
      },
      { text: '升级说明', link: '/zh/guide/upgrade' },
    ],
  },
  {
    text: '制作演示',
    items: [
      {
        text: '布局', link: '/zh/layouts/', collapsed: true,
        items: [
          { text: '结构布局', link: '/zh/layouts/structure' },
          { text: '内容布局', link: '/zh/layouts/content' },
          { text: '强调布局', link: '/zh/layouts/emphasis' },
          { text: '学术布局', link: '/zh/layouts/academic' },
        ],
      },
      {
        text: '组件', link: '/zh/components/', collapsed: true,
        items: [
          { text: 'Theorem', link: '/zh/components/theorem' },
          { text: 'Block', link: '/zh/components/block' },
          { text: 'Highlight', link: '/zh/components/highlight' },
          { text: 'Columns', link: '/zh/components/columns' },
          { text: 'Steps', link: '/zh/components/steps' },
          { text: 'Keywords', link: '/zh/components/keywords' },
          { text: 'MetricCard', link: '/zh/components/metric-card' },
          { text: 'MetricGrid', link: '/zh/components/metric-grid' },
          { text: 'ResultTable', link: '/zh/components/result-table' },
          { text: 'EvidenceBlock', link: '/zh/components/evidence-block' },
          { text: 'EquationBlock', link: '/zh/components/equation-block' },
          { text: 'DatasetCard', link: '/zh/components/dataset-card' },
          { text: 'PaperCard', link: '/zh/components/paper-card' },
          { text: 'ContributionList', link: '/zh/components/contribution-list' },
          { text: 'CaveatList', link: '/zh/components/caveat-list' },
          { text: 'ThemePreview', link: '/zh/components/theme-preview' },
        ],
      },
      { text: '引用', link: '/zh/components/cite' },
      { text: '语法糖', link: '/zh/syntax-sugar' },
      { text: '从数据生成幻灯片', link: '/zh/guide/data-driven' },
      { text: '示例', link: '/zh/examples' },
    ],
  },
  {
    text: '定制',
    collapsed: true,
    items: [
      { text: '配置', link: '/zh/guide/configurations' },
      { text: '颜色与字体', link: '/zh/guide/themes' },
      { text: '主题模式与对比度', link: '/zh/guide/theme-mode-contrast' },
    ],
  },
  {
    text: '参考',
    collapsed: true,
    items: [
      { text: '功能概览', link: '/zh/guide/features' },
      { text: '全部文档', link: '/zh/guide/' },
      { text: '参与贡献', link: '/zh/contributing' },
    ],
  },
]

export default defineConfig({
  title: 'Slidev Theme Scholarly',
  description: 'Build clear academic presentations with Slidev and Markdown.',
  cleanUrls: true,
  lastUpdated: true,
  srcExclude: ['superpowers/**'],

  themeConfig: {
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
              modal: {
                displayDetails: '显示详细内容',
                resetButtonTitle: '清空搜索',
                backButtonTitle: '返回搜索',
                noResultsText: '没有找到相关结果',
                footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
              },
            },
          },
        },
      },
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/jxpeng98/slidev-theme-scholarly' },
    ],
  },

  locales: {
    en: {
      label: 'English',
      lang: 'en',
      link: '/en/',
      themeConfig: {
        nav: [
          {
            text: 'Start',
            items: [
              { text: 'Quick start', link: '/en/guide/quick-start' },
              { text: 'VS Code extension', link: '/en/guide/vscode-extension' },
              { text: 'Choose a workflow', link: '/en/guide/workflows/' },
              { text: 'Upgrade a deck', link: '/en/guide/upgrade' },
            ],
          },
          {
            text: 'Build',
            items: [
              { text: 'Layouts', link: '/en/layouts/' },
              { text: 'Components', link: '/en/components/' },
              { text: 'Citations', link: '/en/components/cite' },
              { text: 'Syntax sugar', link: '/en/syntax-sugar' },
              { text: 'Examples', link: '/en/examples' },
            ],
          },
          {
            text: 'Customize',
            items: [
              { text: 'Configuration', link: '/en/guide/configurations' },
              { text: 'Colors and typography', link: '/en/guide/themes' },
              { text: 'Modes and contrast', link: '/en/guide/theme-mode-contrast' },
            ],
          },
          {
            text: 'Reference',
            items: [
              { text: 'Feature overview', link: '/en/guide/features' },
              { text: 'All guides', link: '/en/guide/' },
              { text: 'Contributing', link: '/en/contributing' },
            ],
          },
        ],
        sidebar: { '/en/': enSidebar },
        outline: { label: 'On this page', level: [2, 3] },
        docFooter: { prev: 'Previous', next: 'Next' },
        lastUpdated: { text: 'Updated' },
      },
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      themeConfig: {
        nav: [
          {
            text: '开始',
            items: [
              { text: '快速开始', link: '/zh/guide/quick-start' },
              { text: 'VS Code 插件', link: '/zh/guide/vscode-extension' },
              { text: '选择工作流', link: '/zh/guide/workflows/' },
              { text: '升级演示', link: '/zh/guide/upgrade' },
            ],
          },
          {
            text: '制作',
            items: [
              { text: '布局', link: '/zh/layouts/' },
              { text: '组件', link: '/zh/components/' },
              { text: '引用', link: '/zh/components/cite' },
              { text: '语法糖', link: '/zh/syntax-sugar' },
              { text: '示例', link: '/zh/examples' },
            ],
          },
          {
            text: '定制',
            items: [
              { text: '配置', link: '/zh/guide/configurations' },
              { text: '颜色与字体', link: '/zh/guide/themes' },
              { text: '模式与对比度', link: '/zh/guide/theme-mode-contrast' },
            ],
          },
          {
            text: '参考',
            items: [
              { text: '功能概览', link: '/zh/guide/features' },
              { text: '全部文档', link: '/zh/guide/' },
              { text: '参与贡献', link: '/zh/contributing' },
            ],
          },
        ],
        sidebar: { '/zh/': zhSidebar },
        outline: { label: '本页内容', level: [2, 3] },
        sidebarMenuLabel: '文档目录',
        returnToTopLabel: '返回顶部',
        darkModeSwitchLabel: '外观',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式',
        langMenuLabel: '选择语言',
        docFooter: { prev: '上一篇', next: '下一篇' },
        lastUpdated: { text: '更新于' },
      },
    },
  },
})
