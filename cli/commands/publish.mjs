import fs from 'node:fs'
import path from 'node:path'
import process, { stdout as output } from 'node:process'
import chalk from 'chalk'
import ora from 'ora'
import { getDefaultNpmToken } from '../lib/env.mjs'
import { runCommand } from '../lib/process.mjs'
import { askConfirm, askInput, askMultiChoice, askSingleChoice } from '../lib/prompt.mjs'
import { findAllWorkspacePackages, findWorkspaceRoot } from '../lib/workspace.mjs'

/**
 * 交互式发布流程：
 * 1. 是否打包（默认是）
 * 2. 是否执行 version-packages（默认否）
 * 3. 选择包 + 设置 NPM_TOKEN（默认读取 .env/.env.local）
 * 4. 选择发布目标（默认本地 http://localhost:4873/）
 * 5. 是否 dry-run（默认是）
 * 6. 是否 git-checks（默认否）
 */
export async function runInteractivePublish() {
  const cwd = process.cwd()
  const rootDir = findWorkspaceRoot(cwd)

  const pkgs = findAllWorkspacePackages(rootDir)
  if (pkgs.length === 0) {
    output.write(`${chalk.red('未在 packages/*, packages/plugins/*, packages/adapters/* 下找到可发布的 package。')}\n`)
    process.exit(1)
  }

  const labels = pkgs.map(p => `${p.name} (${p.version})`)

  const shouldBuild = await askConfirm('是否打包（默认是）？', true)

  const shouldVersion = await askConfirm('是否执行 version-packages（默认否）？', false)

  const pkgIndices = await askMultiChoice('选择包（可多选，默认全选）', labels, Array.from({ length: labels.length }, (_, i) => i))
  const selectedPkgs = pkgIndices.map(i => pkgs[i])

  const defaultToken = getDefaultNpmToken(cwd)
  const npmToken = await askInput('设置 NPM_TOKEN（可留空）', defaultToken)
  if (npmToken && typeof npmToken === 'string' && npmToken.length > 0) {
    process.env.NPM_TOKEN = npmToken
    process.env.NODE_AUTH_TOKEN = npmToken
  }

  const targetIndex = await askSingleChoice('选择发布目标（默认本地 http://localhost:4873/）', [
    '本地 verdaccio (http://localhost:4873/)',
    'npm registry (https://registry.npmjs.org/)',
  ])
  const target = targetIndex === 1 ? 'npm' : 'local'
  const registry = target === 'local' ? 'http://localhost:4873/' : 'https://registry.npmjs.org/'

  const dryRun = await askConfirm('是否 dry-run（默认是）？', true)

  const gitChecks = await askConfirm('是否 git-checks（默认否）？', false)

  if (shouldVersion) {
    const spinnerVersion = ora({ text: '执行 pnpm version-packages...' }).start()
    try {
      await runCommand('pnpm', ['version-packages'], { cwd: rootDir })
      spinnerVersion.succeed('version-packages 执行完成')
    } catch (e) {
      spinnerVersion.fail(`version-packages 失败：${e.message}`)
      process.exit(1)
    }
  }

  if (shouldBuild) {
    for (const selected of selectedPkgs) {
      const pkgJsonPath = path.join(selected.dir, 'package.json')
      const spinnerBuild = ora({ text: `构建 ${selected.name}@${selected.version} ...` }).start()
      try {
        const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'))
        const hasBuildScript = pkgJson.scripts && Object.prototype.hasOwnProperty.call(pkgJson.scripts, 'build')
        if (hasBuildScript) {
          await runCommand('pnpm', ['build'], { cwd: selected.dir })
          spinnerBuild.succeed(`构建成功 ${selected.name}@${selected.version}`)
        } else {
          spinnerBuild.info(`跳过构建 ${selected.name}@${selected.version}（未定义 build 脚本）`)
        }
      } catch (error) {
        spinnerBuild.fail(`构建失败 ${selected.name}@${selected.version}`)
        throw error
      }
    }
  }

  const args = ['publish', '--access', 'public', '--registry', registry]
  if (dryRun) {
    args.push('--dry-run')
  }
  if (gitChecks) {
    args.push('--git-checks')
  } else {
    args.push('--no-git-checks')
  }

  output.write(`\n${chalk.cyan('发布任务预览：')}\n`)
  for (const selected of selectedPkgs) {
    output.write(`  - ${chalk.green(selected.name)}@${selected.version}\n    pnpm ${args.join(' ')}  (cwd: ${path.relative(rootDir, selected.dir)})\n`)
  }

  // 预览中不包含 tag 信息

  const ok = await askConfirm('确认执行以上发布任务吗？', true)
  if (!ok) {
    output.write(`${chalk.yellow('已取消发布。')}\n`)
    process.exit(0)
  }

  for (const selected of selectedPkgs) {
    const spinnerPublish = ora({ text: `正在发布 ${selected.name}@${selected.version} ...` }).start()
    try {
      await runCommand('pnpm', args, { cwd: selected.dir })
      spinnerPublish.succeed(`发布成功 ${selected.name}@${selected.version}`)
    } catch (error) {
      spinnerPublish.fail(`发布失败 ${selected.name}@${selected.version}: ${error.message}`)
      process.exit(1)
    }
  }
}
