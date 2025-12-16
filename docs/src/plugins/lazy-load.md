# 懒加载插件

提供懒加载子节点能力，在首次展开时动态加载并追加到树。

## 安装

`pnpm add @splicetree/plugin-lazy-load`

## 使用

```ts
import { createSpliceTree } from '@splicetree/core'
import { lazyLoad } from '@splicetree/lazy-load'

const tree = createSpliceTree(data, {
  plugins: [lazyLoad],
  loadChildren: async (node) => {
    const resp = await fetch(`/api/children?parent=${node.id}`)
    const children = await resp.json()
    return children
  },
})
```

## 示例

### 基本懒加载

<demo vue="../examples/lazy-load/BasicLazy.vue" />

### 展开时加载

<demo vue="../examples/lazy-load/ExpandLoad.vue" />

### 手动加载

<demo vue="../examples/lazy-load/ManualLoad.vue" />

## Api

### 实例方法

| 名称                | 参数                      | 说明                       |
| ------------------- | ------------------------- | -------------------------- |
| `loadedKeys`        | `无`                      | 已加载集合                 |
| `isLoaded(id)`      | `id: string`              | 是否已加载                 |
| `load(id)`          | `id: string`              | 手动加载                   |
| `expand(ids)`       | `ids: string \| string[]` | 覆盖：未加载时先加载再展开 |
| `toggleExpand(ids)` | `ids: string \| string[]` | 覆盖：未加载时先加载再切换 |

### 节点方法

| 名称            | 参数 | 说明                                          |
| --------------- | ---- | --------------------------------------------- |
| `isLoaded()`    | `无` | 当前节点是否已加载                            |
| `hasChildren()` | `无` | 重写：未加载返回 `true`，加载后根据子节点判断 |
