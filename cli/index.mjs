#!/usr/bin/env node

import fs from 'node:fs'
import process from 'node:process'
import { Command } from 'commander'
import {
  runBuild,
  runChangelog,
  runClean,
  runDevDocs,
  runLint,
  runVersionPackages,
} from './commands/ops.mjs'
import { runInteractivePublish } from './commands/publish.mjs'
import { askSingleChoice } from './lib/prompt.mjs'

const pkgJsonUrl = new URL('./package.json', import.meta.url)
const pkgJson = JSON.parse(fs.readFileSync(pkgJsonUrl, 'utf8'))
const cliVersion = pkgJson.version || '0.0.0'

/**
 * CLI 主入口，提供交互式发布命令。
 * - 默认无参数进入交互菜单
 * - 支持直接执行 `splicetree publish`
 */
async function main() {
  const program = new Command()
  program
    .name('splicetree')
    .description('SpliceTree monorepo 发布 CLI')
    .version(cliVersion)

  program
    .command('menu')
    .description('交互式主菜单（Build/Dev/Version/Publish/Clean/Changelog/Lint）')
    .action(async () => {
      const index = await askSingleChoice('选择要执行的操作：', [
        'Build',
        'Dev',
        'Version Packages',
        'Publish',
        'Clean',
        'Changelog',
        'Lint',
      ])
      const actions = [
        runBuild,
        runDevDocs,
        runVersionPackages,
        runInteractivePublish,
        runClean,
        runChangelog,
        runLint,
      ]
      const fn = actions[index] || runBuild
      await fn()
    })
  program
    .command('publish')
    .description('交互式发布包')
    .action(async () => {
      await runInteractivePublish()
    })

  const argv = process.argv
  const userArgs = argv.slice(2)

  if (!userArgs.length) {
    const index = await askSingleChoice('选择要执行的操作：', ['打开主菜单', '交互式发布包'])
    const commands = ['menu', 'publish']
    const cmd = commands[index] || 'menu'
    await program.parseAsync(['node', 'splicetree', cmd])
  } else if (userArgs[0] === '--') {
    await program.parseAsync(['node', 'splicetree', ...userArgs.slice(1)])
  } else {
    await program.parseAsync(argv)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
