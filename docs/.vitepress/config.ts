import { defineConfig } from 'vitepress'

const enSidebar = [
  {
    text: 'Start here',
    items: [
      { text: 'Overview', link: '/en/' },
      { text: 'Quick start', link: '/en/guide/quick-start' },
      { text: 'VS Code extension', link: '/en/guide/vscode-extension' },
      { text: 'Choose a workflow', link: '/en/guide/workflows/' },
      { text: 'Upgrade notes', link: '/en/guide/upgrade' },
    ],
  },
  {
    text: 'Build your deck',
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
      { text: '选择工作流', link: '/zh/guide/workflows/' },
      { text: '升级说明', link: '/zh/guide/upgrade' },
    ],
  },
  {
    text: '制作演示',
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
    search: { provider: 'local' },
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
        docFooter: { prev: '上一篇', next: '下一篇' },
        lastUpdated: { text: '更新于' },
      },
    },
  },
})
