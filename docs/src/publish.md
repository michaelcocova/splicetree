# 版本与发布

## 版本管理（Changesets）
- 录入变更：`pnpm changeset` 按提示选择受影响包与语义版本
- 应用版本：`pnpm version-packages`（生成版本与变更日志）
- 发布到 npm：`pnpm release`

Changesets 已配置为联动 `@splicetree/plugin-*` 包版本。

## 发布准备
- 登录 npm：`npm login`
- 检查 `package.json` 的 `publishConfig.access` 为 `public`
- 确保 `exports/main/module/types` 指向 `dist` 产物

## 文档站
- 开发：`pnpm --filter @splicetree/docs dev`
- 构建：`pnpm --filter @splicetree/docs build`

## 常见问题
- 本地包解析失败：确保插件包 `devDependencies["@splicetree/core"] = "workspace:*"`
- 源码缺失：可暂以 `dist/index.mjs` 作为构建入口（见 `tsdown.config.ts`）
