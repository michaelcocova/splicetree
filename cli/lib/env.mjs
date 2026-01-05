import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'dotenv';
import { findWorkspaceRoot } from './workspace.mjs';

/**
 * 读取并合并根目录下的 .env 与 .env.local，local 优先覆盖。
 * @param {string} startDir 起始目录（通常为 process.cwd()）
 * @returns {Record<string, string>} 合并后的环境键值
 */
export function loadRootEnv(startDir) {
  const root = findWorkspaceRoot(startDir);
  const envVars = {};
  const envPath = path.join(root, '.env');
  const envLocalPath = path.join(root, '.env.local');
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      Object.assign(envVars, parse(content));
    } catch {}
  }
  if (fs.existsSync(envLocalPath)) {
    try {
      const content = fs.readFileSync(envLocalPath, 'utf8');
      Object.assign(envVars, parse(content));
    } catch {}
  }
  return envVars;
}

/**
 * 从 .env/.env.local 或进程环境中获取默认的 NPM token。
 * 优先顺序：.env.local/.env 的 NPM_TOKEN -> NODE_AUTH_TOKEN -> process.env。
 * @param {string} startDir 起始目录（通常为 process.cwd()）
 * @returns {string} 若未找到则返回空字符串
 */
export function getDefaultNpmToken(startDir) {
  const envVars = loadRootEnv(startDir);
  return (
    envVars.NPM_TOKEN ||
    envVars.NODE_AUTH_TOKEN ||
    process.env.NPM_TOKEN ||
    process.env.NODE_AUTH_TOKEN ||
    ''
  );
}
