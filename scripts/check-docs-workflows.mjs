import fs from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve(new URL('..', import.meta.url).pathname)
const docsRoot = path.join(root, 'docs')
const failures = []

const workflows = [
  'paper-talk',
  'thesis-defense',
  'literature-review',
  'results-heavy',
  'course-lecture',
]

const localeConfig = {
  en: {
    labels: {
      workflowsTitle: '# Academic Workflows',
      recommendedLayouts: '## Recommended layouts',
      recommendedComponents: '## Recommended components',
      usefulSnippets: '## Useful snippets',
      themeMode: '## Theme mode and contrast',
    },
    indexNeedles: [
      '[Academic Workflows](./guide/workflows/)',
      '[Theme Mode and Contrast](./guide/theme-mode-contrast)',
    ],
  },
  zh: {
    labels: {
      workflowsTitle: '# 学术工作流',
      recommendedLayouts: '## 推荐布局',
      recommendedComponents: '## 推荐组件',
      usefulSnippets: '## 常用片段',
      themeMode: '## 主题模式与对比度',
    },
    indexNeedles: [
      '[学术工作流](./guide/workflows/)',
      '[主题模式与对比度](./guide/theme-mode-contrast)',
    ],
  },
}

async function readText(file) {
  try {
    return await fs.readFile(file, 'utf8')
  } catch {
    failures.push(`Missing expected file: ${path.relative(root, file)}`)
    return ''
  }
}

function expect(condition, message) {
  if (!condition)
    failures.push(message)
}

function expectIncludes(name, text, needle) {
  expect(text.includes(needle), `${name} should include "${needle}"`)
}

function expectWorkflowLinks(locale, text) {
  for (const workflow of workflows)
    expectIncludes(`${locale} workflows index`, text, `./${workflow}`)
}

async function checkLayoutLinks(file, text) {
  const links = text.matchAll(/\]\((\.\.\/\.\.\/layouts\/[^)#]+)#([^)]+)\)/g)
  for (const [, target, anchor] of links) {
    const targetFile = path.resolve(path.dirname(file), `${target}.md`)
    const targetText = await readText(targetFile)
    expect(
      targetText.includes(`{#${anchor}}`),
      `${path.relative(root, file)} links to missing anchor ${target}#${anchor}`,
    )
  }
}

async function checkLocale(locale, config) {
  const localeRoot = path.join(docsRoot, locale)
  const home = await readText(path.join(localeRoot, 'index.md'))
  const quickStart = await readText(path.join(localeRoot, 'guide', 'quick-start.md'))
  const workflowsIndex = await readText(path.join(localeRoot, 'guide', 'workflows', 'index.md'))
  const contrast = await readText(path.join(localeRoot, 'guide', 'theme-mode-contrast.md'))

  expectIncludes(`${locale}/guide/quick-start.md`, quickStart, 'npx -y slidev-theme-scholarly')
  expectIncludes(`${locale}/guide/quick-start.md`, quickStart, 'pnpm exec sch')
  expectIncludes(`${locale}/guide/quick-start.md`, quickStart, 'npm i -g slidev-theme-scholarly')
  expect(!quickStart.includes('npx -y --package slidev-theme-scholarly'), `${locale} quick start should use the package name directly with npx`)
  expect(!/^npx sch\b/m.test(quickStart), `${locale} quick start should not rely on an implicit local npx binary`)

  for (const needle of config.indexNeedles)
    expectIncludes(`${locale}/index.md`, home, needle)

  expectIncludes(`${locale}/guide/quick-start.md`, quickStart, './workflows/')
  expectIncludes(`${locale} workflows index`, workflowsIndex, config.labels.workflowsTitle)
  expectWorkflowLinks(locale, workflowsIndex)
  expectIncludes(`${locale} workflows index`, workflowsIndex, '../theme-mode-contrast')

  expectIncludes(`${locale} contrast guide`, contrast, 'contentMode')
  expectIncludes(`${locale} contrast guide`, contrast, 'chromeMode')
  expectIncludes(`${locale} contrast guide`, contrast, 'sectionMode')
  expectIncludes(`${locale} contrast guide`, contrast, 'high-contrast')
  expectIncludes(`${locale} contrast guide`, contrast, 'quote')
  expectIncludes(`${locale} contrast guide`, contrast, 'Highlight')

  for (const workflow of workflows) {
    const file = path.join(localeRoot, 'guide', 'workflows', `${workflow}.md`)
    const text = await readText(file)
    const name = `${locale}/guide/workflows/${workflow}.md`

    expectIncludes(name, text, config.labels.recommendedLayouts)
    expectIncludes(name, text, config.labels.recommendedComponents)
    expectIncludes(name, text, config.labels.usefulSnippets)
    expectIncludes(name, text, config.labels.themeMode)
    expectIncludes(name, text, '../theme-mode-contrast')
    expectIncludes(name, text, 'contentMode')
    expect(!/`colorMode:\s*(light|dark)`/.test(text), `${name} should not recommend colorMode as the primary mode`)
    expectIncludes(name, text, '../../layouts/')
    expectIncludes(name, text, '../../components/')
    expect(/(?:npx -y slidev-theme-scholarly|pnpm exec sch) (?:init|snippet|workflow)/.test(text), `${name} should include an explicit Scholarly CLI command`)
    expect(!/^sch\b/m.test(text), `${name} should not rely on a globally installed sch binary`)
    await checkLayoutLinks(file, text)
  }
}

const rootReadme = await readText(path.join(root, 'README.md'))
const rootReadmeZh = await readText(path.join(root, 'README-zh.md'))
for (const [name, text] of [['README.md', rootReadme], ['README-zh.md', rootReadmeZh]]) {
  expectIncludes(name, text, 'npx -y slidev-theme-scholarly')
  expectIncludes(name, text, 'pnpm exec sch')
  expectIncludes(name, text, 'npm i -g slidev-theme-scholarly')
  expect(!text.includes('npx -y --package slidev-theme-scholarly'), `${name} should use the package name directly with npx`)
  expect(!/^npx sch\b/m.test(text), `${name} should not rely on an implicit local npx binary`)
}

const configSource = await readText(path.join(docsRoot, '.vitepress', 'config.ts'))
expectIncludes('docs/.vitepress/config.ts', configSource, "srcExclude: ['superpowers/**']")
expectIncludes('docs/.vitepress/config.ts', configSource, 'locales: {\n    en:')
expectIncludes('docs/.vitepress/config.ts', configSource, "link: '/en/guide/workflows/'")
expectIncludes('docs/.vitepress/config.ts', configSource, "link: '/zh/guide/workflows/'")
expectIncludes('docs/.vitepress/config.ts', configSource, "link: '/en/guide/theme-mode-contrast'")
expectIncludes('docs/.vitepress/config.ts', configSource, "link: '/zh/guide/theme-mode-contrast'")

for (const [locale, config] of Object.entries(localeConfig))
  await checkLocale(locale, config)

if (failures.length) {
  console.error('Documentation workflow IA checks failed:')
  for (const failure of failures)
    console.error(`- ${failure}`)
  process.exit(1)
}

console.log('Documentation workflow IA checks passed.')
