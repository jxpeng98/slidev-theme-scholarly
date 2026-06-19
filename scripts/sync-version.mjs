#!/usr/bin/env node

/**
 * Synchronise the root package.json (theme) version into:
 *   - docs/package.json
 *   - vscode-extension/package.json for stable releases
 *
 * For theme prereleases, VS Code Marketplace still requires a plain x.y.z
 * version. Pass --vscode-prerelease-version X.Y.Z when publishing an
 * extension prerelease; omit it to leave the extension version unchanged.
 *
 * Usage:
 *   node scripts/sync-version.mjs
 *   node scripts/sync-version.mjs --vscode-prerelease-version 1.3.3
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
    resolveVscodeSync,
    validateVscodeVersion,
} from './version-utils.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const rootPkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'))
const version = rootPkg.version

function readArgValue(flag) {
    const index = process.argv.indexOf(flag)
    if (index === -1)
        return ''

    const value = process.argv[index + 1]
    if (!value || value.startsWith('--'))
        throw new Error(`Missing value for ${flag}`)

    return value
}

function updatePackageVersion(file, version, indent) {
    const pkg = JSON.parse(fs.readFileSync(file, 'utf8'))
    const oldVersion = pkg.version
    pkg.version = version
    fs.writeFileSync(file, JSON.stringify(pkg, null, indent) + '\n')
    console.log(`✓  ${path.relative(rootDir, file)}: ${oldVersion} → ${version}`)
}

const explicitVscodePrereleaseVersion =
    readArgValue('--vscode-prerelease-version') ||
    process.env.SCHOLARLY_VSCODE_PRERELEASE_VERSION ||
    ''

if (explicitVscodePrereleaseVersion)
    validateVscodeVersion(explicitVscodePrereleaseVersion)

const targets = [
    { file: path.join(rootDir, 'docs', 'package.json'), indent: 4 },
]

for (const { file, indent } of targets) {
    if (!fs.existsSync(file)) {
        console.warn(`⚠  Skipped (not found): ${path.relative(rootDir, file)}`)
        continue
    }

    updatePackageVersion(file, version, indent)
}

const vscodePackageFile = path.join(rootDir, 'vscode-extension', 'package.json')
if (!fs.existsSync(vscodePackageFile)) {
    console.warn(`⚠  Skipped (not found): ${path.relative(rootDir, vscodePackageFile)}`)
} else {
    const vscodePkg = JSON.parse(fs.readFileSync(vscodePackageFile, 'utf8'))
    const vscodeSync = resolveVscodeSync({
        themeVersion: version,
        currentVscodeVersion: vscodePkg.version,
        explicitVscodePrereleaseVersion,
    })

    if (vscodeSync.action === 'sync') {
        updatePackageVersion(vscodePackageFile, vscodeSync.version, 2)
    } else {
        console.warn(
            `⚠  ${path.relative(rootDir, vscodePackageFile)} kept at ${vscodeSync.version}: ` +
            'theme prereleases need --vscode-prerelease-version X.Y.Z for Marketplace pre-release builds.',
        )
    }
}
