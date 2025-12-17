# @splicetree/plugin-lazy-load

提供懒加载子节点能力，在首次展开时动态加载并追加到树。

[![version](https://img.shields.io/npm/v/@splicetree/plugin-lazy-load.svg?label=version)](https://www.npmjs.com/package/@splicetree/plugin-lazy-load)
[![downloads](https://img.shields.io/npm/dm/@splicetree/plugin-lazy-load.svg)](https://npmcharts.com/compare/%40splicetree%2Fplugin-lazy-load?minimal=true)
[![license](https://img.shields.io/npm/l/@splicetree/plugin-lazy-load.svg)](https://www.npmjs.com/package/@splicetree/plugin-lazy-load)
[![Website](https://img.shields.io/static/v1?label=Website&message=splicetree.dev&color=blue)](https://www.splicetree.dev)
[![GitHub](https://img.shields.io/static/v1?label=GitHub&message=splicetree%2Fsplicetree&logo=github)](https://github.com/michaelcocova/splicetree)

## 安装

`pnpm add @splicetree/plugin-lazy-load`

## 使用

```ts
import { createSpliceTree } from '@splicetree/core'
import lazyLoad from '@splicetree/plugin-lazy-load'

const tree = createSpliceTree(data, {
  plugins: [lazyLoad],
  loadChildren: async (node) => {
    const resp = await fetch(`/api/children?parent=${node.id}`)
    const children = await resp.json()
    return children
  },
})
```

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
