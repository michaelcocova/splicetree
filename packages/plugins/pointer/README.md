# @splicetree/plugin-pointer

采集节点点击事件，统一派发 `input:node-click` 语义事件，供行为插件消费（如 `@splicetree/plugin-selectable`、`@splicetree/plugin-checkable`）。

[![version](https://img.shields.io/npm/v/@splicetree/plugin-pointer.svg?label=version)](https://www.npmjs.com/package/@splicetree/plugin-pointer)
[![downloads](https://img.shields.io/npm/dm/@splicetree/plugin-pointer.svg)](https://npmcharts.com/compare/%40splicetree%2Fplugin-pointer?minimal=true)
[![license](https://img.shields.io/npm/l/@splicetree/plugin-pointer.svg)](https://www.npmjs.com/package/@splicetree/plugin-pointer)
[![Website](https://img.shields.io/static/v1?label=Website&message=splicetree.dev&color=blue)](https://www.splicetree.dev)
[![GitHub](https://img.shields.io/static/v1?label=GitHub&message=splicetree%2Fsplicetree&logo=github)](https://github.com/michaelcocova/splicetree)

## 安装

`pnpm add @splicetree/plugin-pointer`

## 使用

```ts
import { createSpliceTree } from '@splicetree/core'
import pointer from '@splicetree/plugin-pointer'

const tree = createSpliceTree(data, {
  plugins: [pointer],
})

// 在视图中调用
// inputNodeClick(nodeId, e) 会派发 input:node-click 事件（包含修饰键）
tree.inputNodeClick('a', mouseEvent)
```

## Api

- 事件派发
  - `inputNodeClick(nodeId, e: MouseEvent)` 派发 `input:node-click`
- 事件负载
  - `nodeId: string`
  - `modifiers: { shift: boolean; ctrl: boolean; meta: boolean; alt: boolean }`
