import { copyFile, mkdir } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const yamlRoot = path.dirname(createRequire(import.meta.url).resolve('js-yaml/package.json'))
const output = fileURLToPath(new URL('../out/vendor/', import.meta.url))
await mkdir(output, { recursive: true })
// Use the dependency's existing standalone build, with its license. VSIX
// installs must not rely on pnpm links or a workspace node_modules directory.
await copyFile(path.join(yamlRoot, 'dist/js-yaml.js'), path.join(output, 'js-yaml.js'))
await copyFile(path.join(yamlRoot, 'LICENSE'), path.join(output, 'js-yaml-LICENSE'))
