import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { tmpdir } from 'node:os'
import test from 'node:test'

const modulePath = '../scripts/screenshot-export-utils.mjs'
const {
  expandSlideRange,
  replaceMappedScreenshots,
} = await import(modulePath).catch((error) => {
  assert.fail(`Expected ${modulePath} to export screenshot helpers, got ${error.message}`)
})

async function createWorkspace() {
  const root = await mkdtemp(path.join(tmpdir(), 'screenshot-export-'))
  const tempOutDir = path.join(root, 'exported')
  const docsOutDir = path.join(root, 'docs')
  await mkdir(tempOutDir, { recursive: true })
  await mkdir(docsOutDir, { recursive: true })
  await writeFile(path.join(docsOutDir, 'existing.png'), 'keep-me')
  return { root, tempOutDir, docsOutDir }
}

test('expands Slidev range strings into slide numbers', () => {
  assert.deepEqual(expandSlideRange('1-3,5,7-8'), [1, 2, 3, 5, 7, 8])
})

test('does not replace existing screenshots when export produced no PNG files', async () => {
  const workspace = await createWorkspace()
  try {
    await assert.rejects(
      replaceMappedScreenshots({
        tempOutDir: workspace.tempOutDir,
        docsOutDir: workspace.docsOutDir,
        mapping: { 1: 'cover' },
        label: 'layout',
      }),
      /No PNG files found/,
    )

    assert.equal(await readFile(path.join(workspace.docsOutDir, 'existing.png'), 'utf8'), 'keep-me')
  } finally {
    await rm(workspace.root, { recursive: true, force: true })
  }
})

test('fails before replacing screenshots when a mapped slide is missing', async () => {
  const workspace = await createWorkspace()
  try {
    await writeFile(path.join(workspace.tempOutDir, '1.png'), 'cover')

    await assert.rejects(
      replaceMappedScreenshots({
        tempOutDir: workspace.tempOutDir,
        docsOutDir: workspace.docsOutDir,
        mapping: { 1: 'cover', 2: 'default' },
        label: 'layout',
      }),
      /Missing exported PNG for slide 2/,
    )

    assert.equal(await readFile(path.join(workspace.docsOutDir, 'existing.png'), 'utf8'), 'keep-me')
  } finally {
    await rm(workspace.root, { recursive: true, force: true })
  }
})

test('replaces screenshots after every mapped PNG is present', async () => {
  const workspace = await createWorkspace()
  try {
    await writeFile(path.join(workspace.tempOutDir, '1.png'), 'cover')
    await writeFile(path.join(workspace.tempOutDir, '002.png'), 'default')

    const result = await replaceMappedScreenshots({
      tempOutDir: workspace.tempOutDir,
      docsOutDir: workspace.docsOutDir,
      mapping: { 1: 'cover', 2: 'default' },
      label: 'layout',
    })

    assert.equal(result.successCount, 2)
    assert.equal(await readFile(path.join(workspace.docsOutDir, 'cover.png'), 'utf8'), 'cover')
    assert.equal(await readFile(path.join(workspace.docsOutDir, 'default.png'), 'utf8'), 'default')
    await assert.rejects(readFile(path.join(workspace.docsOutDir, 'existing.png')))
  } finally {
    await rm(workspace.root, { recursive: true, force: true })
  }
})
