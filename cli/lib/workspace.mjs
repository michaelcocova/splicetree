import fs from 'node:fs'
import path from 'node:path'

/**
 * 向上查找仓库根目录（以存在 .git 为准）。
 * @param {string} startDir 起始目录
 * @returns {string} 仓库根目录
 */
export function findWorkspaceRoot(startDir) {
  let dir = startDir
  while (true) {
    const gitDir = path.join(dir, '.git')
    if (fs.existsSync(gitDir)) {
      return dir
    }
    const parent = path.dirname(dir)
    if (parent === dir) {
      return startDir
    }
    dir = parent
  }
}

function collectPackagesUnder(dir) {
  if (!fs.existsSync(dir)) {
    return []
  }
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const result = []
  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue
    }
    const pkgDir = path.join(dir, entry.name)
    const pkgJsonPath = path.join(pkgDir, 'package.json')
    if (!fs.existsSync(pkgJsonPath)) {
      continue
    }
    try {
      const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'))
      if (pkgJson.private) {
        continue
      }
      result.push({
        name: pkgJson.name || entry.name,
        version: pkgJson.version || '0.0.0',
        dir: pkgDir,
      })
    } catch {}
  }
  return result
}

/**
 * 收集工作区可发布包，包含 packages/*、packages/plugins/*、packages/adapters/*。
 * @param {string} rootDir 仓库根目录
 * @returns {{name:string,version:string,dir:string}[]} 包列表（按 name 排序）
 */
export function findAllWorkspacePackages(rootDir) {
  const base = path.join(rootDir, 'packages')
  const groups = [
    base,
    path.join(base, 'plugins'),
    path.join(base, 'adapters'),
  ]
  const list = []
  for (const g of groups) {
    list.push(...collectPackagesUnder(g))
  }
  return list.sort((a, b) => a.name.localeCompare(b.name))
}
