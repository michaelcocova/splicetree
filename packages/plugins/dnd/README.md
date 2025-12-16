# @splicetree/plugin-dnd

[![version](https://img.shields.io/npm/v/@splicetree/plugin-dnd.svg?label=version)](https://www.npmjs.com/package/@splicetree/plugin-dnd)
[![downloads](https://img.shields.io/npm/dm/@splicetree/plugin-dnd.svg)](https://npmcharts.com/compare/%40splicetree%2Fplugin-dnd?minimal=true)
[![license](https://img.shields.io/npm/l/@splicetree/plugin-dnd.svg)](https://www.npmjs.com/package/@splicetree/plugin-dnd)
[![Website](https://img.shields.io/static/v1?label=Website&message=splicetree.dev&color=blue)](https://www.splicetree.dev)
[![GitHub](https://img.shields.io/static/v1?label=GitHub&message=splicetree%2Fsplicetree&logo=github)](https://github.com/michaelcocova/splicetree)

为树节点提供拖拽移动能力，支持插入到目标之前、之后或作为子节点。

## 安装

`pnpm add @splicetree/plugin-dnd`

## 使用

```ts
import { createSpliceTree } from '@splicetree/core'
import dnd from '@splicetree/plugin-dnd'

const tree = createSpliceTree(data, {
  plugins: [dnd],
})
```

## Api

### Options

| 选项               | 类型      | 默认值 | 说明                                                      |
| ------------------ | --------- | ------ | --------------------------------------------------------- |
| `autoUpdateParent` | `boolean` | `true` | 拖拽后自动更新源节点的父字段；为 `false` 时不写回且不移动 |
| `autoExpandOnDrop` | `boolean` | `true` | 拖入后自动展开目标节点                                    |

### Events

| 事件   | 负载                                                                           | 说明     |
| ------ | ------------------------------------------------------------------------------ | -------- |
| `move` | `{ id: string, parentId?: string, position: DropPosition, beforeId?: string }` | 节点移动 |

### 实例方法

| 名称             | 参数                                                      | 说明                     |
| ---------------- | --------------------------------------------------------- | ------------------------ |
| `drop`           | `srcId: string; targetId: string; position: DropPosition` | 执行移动                 |
| `onDragStart`    | `id: string`                                              | 标记拖拽源               |
| `onDragOver`     | `id: string; el: HTMLElement; e: DragEvent \| MouseEvent` | 更新目标悬停位置         |
| `onDragLeave`    | `id: string`                                              | 清理悬停位置             |
| `onDrop`         | `targetId: string`                                        | 根据当前悬停位置执行移动 |
| `hoverPositions` | `无`                                                      | 目标悬停位置缓存         |
| `draggingId`     | `无`                                                      | 当前正在拖拽的节点 id    |
| `dragProps`      | `无`                                                      | DOM 事件绑定集合         |

### 节点方法

| 名称                | 参数 | 说明                 |
| ------------------- | ---- | -------------------- |
| `getDropPosition()` | `无` | 当前节点的悬停位置   |
| `isDragging()`      | `无` | 当前节点是否为拖拽源 |
