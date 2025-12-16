# @splicetree/plugin-search

[![version](https://img.shields.io/npm/v/@splicetree/plugin-search.svg?label=version)](https://www.npmjs.com/package/@splicetree/plugin-search)
[![downloads](https://img.shields.io/npm/dm/@splicetree/plugin-search.svg)](https://npmcharts.com/compare/%40splicetree%2Fplugin-search?minimal=true)
[![license](https://img.shields.io/npm/l/@splicetree/plugin-search.svg)](https://www.npmjs.com/package/@splicetree/plugin-search)
[![Website](https://img.shields.io/static/v1?label=Website&message=splicetree.dev&color=blue)](https://www.splicetree.dev)
[![GitHub](https://img.shields.io/static/v1?label=GitHub&message=splicetree%2Fsplicetree&logo=github)](https://github.com/michaelcocova/splicetree)

为树提供搜索匹配能力，可自定义匹配器。

## 安装

`pnpm add @splicetree/plugin-search`

## 使用

```ts
import { createSpliceTree } from '@splicetree/core'
import search from '@splicetree/plugin-search'

const tree = createSpliceTree(data, {
  plugins: [search],
  matcher: (node, q) => String(node.original.title ?? '').toLowerCase().includes(q.toLowerCase()),
})

tree.search('readme')
```

## Api

### Options

| 选项      | 类型                                               | 默认值                                     | 说明         |
| --------- | -------------------------------------------------- | ------------------------------------------ | ------------ |
| `matcher` | `(node: SpliceTreeNode, query: string) => boolean` | `JSON.stringify(original).includes(query)` | 自定义匹配器 |

### Events

| 事件     | 负载                                | 说明         |
| -------- | ----------------------------------- | ------------ |
| `search` | `{ keys: string[], query: string }` | 搜索完成事件 |

### 实例方法

| 名称            | 参数            | 说明         |
| --------------- | --------------- | ------------ |
| `matchedKeys`   | `无`            | 匹配集合     |
| `isMatched(id)` | `id: string`    | 节点是否匹配 |
| `search(query)` | `query: string` | 执行搜索     |

### 节点方法

| 名称          | 参数 | 说明             |
| ------------- | ---- | ---------------- |
| `isMatched()` | `无` | 当前节点是否匹配 |
