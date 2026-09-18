import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
const vsix = process.argv[2]
  ? path.resolve(process.argv[2])
  : fileURLToPath(new URL(`../${manifest.name}-${manifest.version}.vsix`, import.meta.url))
const temporary = await mkdtemp(path.join(tmpdir(), 'scholarly-vsix-check-'))
try {
  execFileSync('unzip', ['-q', vsix, '-d', temporary])
  const extension = path.join(temporary, 'extension')
  const packaged = JSON.parse(await readFile(path.join(extension, 'package.json'), 'utf8'))
  assert.equal(packaged.name, manifest.name)
  assert.equal(packaged.version, manifest.version)
  const previews = JSON.parse(await readFile(path.join(extension, 'media/previews/manifest.json'), 'utf8'))
  assert.equal(previews.entries.length, 91)
  for (const entry of previews.entries) {
    const bytes = await readFile(path.join(extension, entry.output.replace(/^vscode-extension\//, '')))
    assert.equal(createHash('sha256').update(bytes).digest('hex'), entry.outputSha256, entry.output)
  }
  assert.match(await readFile(path.join(extension, 'out/vendor/js-yaml-LICENSE'), 'utf8'), /Permission is hereby granted/)
  assert.match(await readFile(path.join(extension, 'out/vendor/yaml-LICENSE'), 'utf8'), /Permission to use/);
  // Execute outside the repository, with no workspace dependency resolution.
  const result = execFileSync(process.execPath, ['-e', `
    const assert = require('node:assert/strict');
    const { renderBuilderMarkdown, renderBuilderSlides } = require('./extension/out/guiBuilderModel');
    const yaml = require('./extension/out/vendor/js-yaml');
    const document = require('./extension/out/vendor/yaml').parseDocument('# keep comment\\nthemeConfig: {}');
    document.setIn(['themeConfig', 'colorTheme'], 'yale-blue');
    assert.ok(document.toString().includes('# keep comment'));
    const { BUILDER_TEMPLATES } = require('./extension/out/sharedData');
    assert.equal(BUILDER_TEMPLATES.length, 8);
    for (const { deck } of BUILDER_TEMPLATES) {
      const markdown = renderBuilderMarkdown(deck);
      const head = yaml.load(markdown.split('---')[1]);
      assert.equal(typeof head.title, 'string');
      assert.ok(renderBuilderSlides(deck.slides).includes('layout:'));
    }
    console.log('Packaged Builder generated all 8 templates without workspace dependencies.');
  `], { cwd: temporary, env: { ...process.env, NODE_PATH: '' }, encoding: 'utf8' })
  console.log(result.trim())
  console.log(`VSIX checks passed: ${manifest.version}, 91 preview hashes, YAML runtime and license.`)
} finally {
  await rm(temporary, { recursive: true, force: true })
}
