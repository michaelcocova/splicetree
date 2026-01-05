import { spawn } from 'node:child_process'
import process from 'node:process'

/**
 * 以继承 stdio 的方式执行命令。
 * @param {string} cmd 可执行程序名称
 * @param {string[]} args 参数列表
 * @param {{cwd?: string, env?: Record<string,string>}} [options] 选项
 * @returns {Promise<void>} 异步完成
 */
export function runCommand(cmd, args, options) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
      ...options,
    })
    child.on('exit', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`${cmd} ${args.join(' ')} exited with code ${code}`))
      }
    })
  })
}

/**
 * 执行命令并捕获标准输出。
 * @param {string} cmd 可执行程序名称
 * @param {string[]} args 参数列表
 * @param {{cwd?: string, env?: Record<string,string>}} [options] 选项
 * @returns {Promise<string>} 捕获到的标准输出
 */
export function runCommandCapture(cmd, args, options) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: ['inherit', 'pipe', 'inherit'],
      shell: process.platform === 'win32',
      ...options,
    })
    let stdout = ''
    child.stdout.on('data', (data) => {
      stdout += String(data)
    })
    child.on('exit', (code) => {
      if (code === 0) {
        resolve(stdout)
      } else {
        reject(new Error(`${cmd} ${args.join(' ')} exited with code ${code}`))
      }
    })
  })
}
