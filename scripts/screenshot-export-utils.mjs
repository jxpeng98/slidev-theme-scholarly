import { cp, mkdir, readdir, rename, rm } from 'node:fs/promises'
import path from 'node:path'

export function expandSlideRange(range) {
  return String(range)
    .split(',')
    .flatMap((part) => {
      const trimmed = part.trim()
      if (!trimmed)
        return []

      const [startRaw, endRaw] = trimmed.split('-')
      const start = Number(startRaw)
      const end = endRaw === undefined ? start : Number(endRaw)

      if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end < start)
        throw new Error(`Invalid slide range segment "${trimmed}"`)

      return Array.from({ length: end - start + 1 }, (_, index) => start + index)
    })
}

export function createSlideRangeMapping(range) {
  return Object.fromEntries(expandSlideRange(range).map(slideNum => [slideNum, String(slideNum)]))
}

export const slidePngCandidates = (slideNum) => [
  `${String(slideNum).padStart(3, '0')}.png`,
  `${String(slideNum).padStart(2, '0')}.png`,
  `${slideNum}.png`,
  `slide-${slideNum}.png`,
]

export async function resolveMappedScreenshots({
  tempOutDir,
  mapping,
  label = 'screenshot',
}) {
  const allFiles = await readdir(tempOutDir)
  const exportedPngs = allFiles.filter(name => name.endsWith('.png'))

  if (exportedPngs.length === 0)
    throw new Error(`No PNG files found in ${tempOutDir} for ${label} screenshots`)

  const mapped = []
  const missing = []

  for (const [slideNum, outputName] of Object.entries(mapping)) {
    const foundName = slidePngCandidates(slideNum).find(candidate => exportedPngs.includes(candidate))
    if (!foundName) {
      missing.push(`slide ${slideNum} (${outputName})`)
      continue
    }

    mapped.push({
      slideNum,
      outputName,
      sourceName: foundName,
      sourcePath: path.join(tempOutDir, foundName),
    })
  }

  if (missing.length) {
    const first = missing[0]
    throw new Error(`Missing exported PNG for ${first}; missing ${missing.length}/${Object.keys(mapping).length} ${label} screenshots`)
  }

  return { allFiles, exportedPngs, mapped }
}

export async function replaceMappedScreenshots({
  tempOutDir,
  docsOutDir,
  mapping,
  label = 'screenshot',
}) {
  const result = await resolveMappedScreenshots({ tempOutDir, mapping, label })
  const stagingDir = `${docsOutDir}.tmp-${process.pid}-${Date.now()}`

  await rm(stagingDir, { recursive: true, force: true })
  await mkdir(stagingDir, { recursive: true })

  try {
    for (const item of result.mapped) {
      await cp(
        item.sourcePath,
        path.join(stagingDir, `${item.outputName}.png`),
        { force: true },
      )
    }

    await mkdir(path.dirname(docsOutDir), { recursive: true })
    await rm(docsOutDir, { recursive: true, force: true })
    await rename(stagingDir, docsOutDir)
  } catch (error) {
    await rm(stagingDir, { recursive: true, force: true })
    throw error
  }

  return {
    ...result,
    successCount: result.mapped.length,
  }
}
