import inquirer from 'inquirer'

/**
 * 询问单选题，返回所选项索引。
 * @param {string} question 提示文案
 * @param {string[]} choices 选项标签
 * @returns {Promise<number>} 所选索引
 */
export async function askSingleChoice(question, choices) {
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'index',
      message: question,
      choices: choices.map((label, idx) => ({
        name: label,
        value: idx,
      })),
    },
  ])
  return answer.index
}

/**
 * 询问多选题，返回所选项索引列表。
 * 默认全选可通过 defaultAll 控制。
 * @param {string} question 提示文案
 * @param {string[]} choices 选项标签
 * @param {boolean} [defaultAll] 是否默认全选
 * @returns {Promise<number[]>} 所选索引列表
 */
export async function askMultiChoice(question, choices, defaultAll = false) {
  const allIndices = choices.map((_, idx) => idx)
  const answer = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'indices',
      message: question,
      choices: choices.map((label, idx) => ({
        name: `${label}(current)`,
        value: idx,
      })),
      default: defaultAll ? allIndices : [],
      validate: (value) => {
        if (!value || value.length === 0) {
          return '至少选择一个条目。'
        }
        return true
      },
    },
  ])
  return answer.indices
}

/**
 * 询问确认题，返回布尔结果。
 * @param {string} message 提示文案
 * @param {boolean} [defaultValue] 默认值
 * @returns {Promise<boolean>} 是否确认
 */
export async function askConfirm(message, defaultValue = false) {
  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'ok',
      message,
      default: defaultValue,
    },
  ])
  return Boolean(answer.ok)
}

/**
 * 询问文本输入，返回输入值。
 * @param {string} message 提示文案
 * @param {string} [defaultValue] 默认值
 * @returns {Promise<string>} 输入值
 */
export async function askInput(message, defaultValue = '') {
  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: 'value',
      message,
      default: defaultValue,
    },
  ])
  return answer.value
}
