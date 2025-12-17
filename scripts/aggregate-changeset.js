const fs = require('node:fs')
const path = require('node:path')
const process = require('node:process')

const root = process.cwd()
const groups = ['packages', 'packages/plugins', 'packages/adapters']

function findPackages(dir) {
  const abs = path.join(root, dir)
  if (!fs.existsSync(abs)) {
    return []
  }
  return fs
    .readdirSync(abs)
    .map(name => path.join(abs, name))
    .filter(p => fs.existsSync(path.join(p, 'package.json')))
}

const pkgDirs = groups.flatMap(findPackages)
const sections = []

for (const pkgDir of pkgDirs) {
  const changelogPath = path.join(pkgDir, 'CHANGELOG.md')
  if (!fs.existsSync(changelogPath)) {
    continue
  }
  const content = fs.readFileSync(changelogPath, 'utf8')
  const lines = content.split('\n')
  let start = -1
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('## ')) {
      start = i
      break
    }
  }
  if (start === -1) {
    continue
  }
  const versionTitle = lines[start].slice(3).trim()
  const bodyLines = []
  for (let j = start + 1; j < lines.length && !lines[j].startsWith('## '); j++) {
    bodyLines.push(lines[j])
  }
  const body = bodyLines.join('\n').trim()
  const pkgJson = JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf8'))
  const pkgName = pkgJson.name
  sections.push({ pkgName, versionTitle, body })
}

if (!sections.length) {
  process.exit(0)
}

const date = new Date().toISOString().slice(0, 10)
const header = '# Changelog\n\n'
const rootPath = path.join(root, 'CHANGELOG.md')
let existing = fs.existsSync(rootPath) ? fs.readFileSync(rootPath, 'utf8') : ''
if (!existing.startsWith('#')) {
  existing = header + existing
}

const uniqueVersions = Array.from(new Set(sections.map(s => s.versionTitle)))
const title
  = uniqueVersions.length === 1
    ? `## v${uniqueVersions[0]} – ${date}\n\n`
    : `## ${uniqueVersions.map(v => `v${v}`).join(', ')} – ${date}\n\n`

let entry = `\n${title}`
for (const s of sections) {
  if (s.body) {
    entry += `### ${s.pkgName} – ${s.versionTitle}\n\n${s.body}\n\n`
  }
}

const withoutHeader = existing.replace(/^#\s*Changelog\s*/, '')
const parts = [header, entry, '---\n\n', withoutHeader.trimStart()]
const final = parts.join('')
fs.writeFileSync(rootPath, final)
