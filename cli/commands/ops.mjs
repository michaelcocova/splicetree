import process from 'node:process'
import ora from 'ora'
import { runCommand } from '../lib/process.mjs'
import { askConfirm } from '../lib/prompt.mjs'
import { findWorkspaceRoot } from '../lib/workspace.mjs'

/**
 * 构建整个工作区（递归执行每个包的 build）。
 * @returns {Promise<void>}
 */
export async function runBuild() {
  const spinner = ora({ text: '执行 pnpm -r run build ...' }).start()
  try {
    await runCommand('pnpm', ['-r', 'run', 'build'], {})
    spinner.succeed('工作区构建完成。')
  } catch (e) {
    spinner.fail(`工作区构建失败：${e.message}`)
    process.exit(1)
  }
}

/**
 * 运行文档开发服务器（docs）。
 * @returns {Promise<void>}
 */
export async function runDevDocs() {
  const spinner = ora({ text: '启动 docs 开发服务 ...' }).start()
  try {
    await runCommand('pnpm', ['run', '-F', 'docs', 'docs:dev'], {})
    spinner.succeed('已退出 docs 开发服务。')
  } catch (e) {
    spinner.fail(`启动 docs 开发服务失败：${e.message}`)
    process.exit(1)
  }
}

/**
 * 执行 version-packages 等效流程：changeset version + changelog 聚合。
 * @returns {Promise<void>}
 */
export async function runVersionPackages() {
  const rootDir = findWorkspaceRoot(process.cwd())
  const spinnerVer = ora({ text: '执行 changeset version ...' }).start()
  try {
    await runCommand('pnpm', ['changeset', 'version'], { cwd: rootDir })
    spinnerVer.succeed('changeset version 完成。')
  } catch (e) {
    spinnerVer.fail(`changeset version 失败：${e.message}`)
    process.exit(1)
  }
  const spinnerChangelog = ora({ text: '聚合 changelog ...' }).start()
  try {
    await runCommand('pnpm', ['run', 'changelog:aggregate'], { cwd: rootDir })
    spinnerChangelog.succeed('changelog 聚合完成。')
  } catch (e) {
    spinnerChangelog.fail(`changelog 聚合失败：${e.message}`)
    process.exit(1)
  }
}

/**
 * 清理工作区构建与依赖产物。
 * @returns {Promise<void>}
 */
export async function runClean() {
  const rootDir = findWorkspaceRoot(process.cwd())
  const spinner = ora({ text: '清理工作区产物 ...' }).start()
  try {
    await runCommand('pnpm', ['exec', 'rimraf', 'packages/*/{node_modules,dist}'], { cwd: rootDir })
    await runCommand('pnpm', ['exec', 'rimraf', '{node_modules,dist}'], { cwd: rootDir })
    spinner.succeed('清理完成。')
  } catch (e) {
    spinner.fail(`清理失败：${e.message}`)
    process.exit(1)
  }
}

/**
 * 生成聚合 changelog。
 * @returns {Promise<void>}
 */
export async function runChangelog() {
  const rootDir = findWorkspaceRoot(process.cwd())
  const spinner = ora({ text: '生成聚合 changelog ...' }).start()
  try {
    await runCommand('node', ['scripts/aggregate-changeset.js'], { cwd: rootDir })
    spinner.succeed('已生成聚合 changelog。')
  } catch (e) {
    spinner.fail(`生成 changelog 失败：${e.message}`)
    process.exit(1)
  }
}

/**
 * 运行 ESLint，支持选择是否自动修复。
 * @returns {Promise<void>}
 */
export async function runLint() {
  const rootDir = findWorkspaceRoot(process.cwd())
  const doFix = await askConfirm('是否自动修复（--fix）？', false)
  const args = ['exec', 'eslint', '.', '--ext', '.ts,.vue']
  if (doFix) {
    args.push('--fix')
  }
  const spinner = ora({ text: `运行 ESLint${doFix ? '（含修复）' : ''} ...` }).start()
  try {
    await runCommand('pnpm', args, { cwd: rootDir })
    spinner.succeed('Lint 完成。')
  } catch (e) {
    spinner.fail(`Lint 失败：${e.message}`)
    process.exit(1)
  }
}
