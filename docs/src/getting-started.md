# 快速开始

SpliceTree 是一个框架无关、高性能的 Headless 树运行时。它将扁平数据构造成可操作的树结构，并通过插件扩展搜索、拖拽、勾选、键盘导航与懒加载等能力。核心可直接在任何环境中使用，Vue 3 可选用官方适配器快速绑定组件。

## 安装

```bash
# 安装依赖
pnpm install

# 安装核心（必选）
pnpm add @splicetree/core

```

::: tip 安装插件与适配器（按需）

```ts
pnpm add @splicetree/plugin-checkable \
 @splicetree/plugin-dnd \
 @splicetree/plugin-keyboard \
 @splicetree/plugin-lazy-load \
 @splicetree/plugin-search \
 @splicetree/adapter-vue
```

:::

## 核心用法示例

```ts
import { createSpliceTree } from '@splicetree/core'
import checkable from '@splicetree/plugin-checkable'

const data = [
  { id: 'a', title: '节点 A' },
  { id: 'b', title: '节点 B', parent: 'a' },
]

const tree = createSpliceTree(data, {
  keyField: 'id',
  parentField: 'parent',
  defaultExpanded: ['a'],
  plugins: [checkable],
})

for (const node of tree.items()) {
  console.log(node.id, node.level)
}
```

## Vue 3 适配器用法

```ts
import { useSpliceTree } from '@splicetree/adapter-vue'
import checkable from '@splicetree/plugin-checkable'

const { items } = useSpliceTree(data, {
  defaultExpanded: ['a'],
  plugins: [checkable],
})
```

```vue
<template>
  <div v-for="n in items" :key="n.id">
    {{ n.original.title }}
  </div>
</template>
```

## 常用脚本

- 开发全仓库：`pnpm dev`
- 开发单包：`pnpm --filter <package-name> dev`
- 构建全仓库：`pnpm build`
- 构建单包：`pnpm --filter <package-name> build`
- 文档站开发：`pnpm --filter @splicetree/docs dev`
- 文档站构建：`pnpm --filter @splicetree/docs build`

## 插件与适配器

- 插件总览与示例：[插件](/plugins)
- Vue 3 适配器文档：[Vue 3 适配](/adapters/vue)

## 目录结构

- `packages/core`：核心库 `@splicetree/core`
- `packages/plugins/*`：插件包（Checkable/DnD/Keyboard/LazyLoad/Search）
- `packages/adapters/*`：适配器（例如 Vue 3）
- `docs`：VitePress 文档站
- `.changeset`：变更与发布配置
