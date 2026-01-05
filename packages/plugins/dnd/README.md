# @splicetree/plugin-dnd

为树节点提供拖拽移动能力，支持插入到目标之前、之后或作为子节点。新增工程化的规则引擎，可精细控制「谁可以拖」「拖到哪里」「允许的落点（前/内/后）」。

[![version](https://img.shields.io/npm/v/@splicetree/plugin-dnd.svg?label=version)](https://www.npmjs.com/package/@splicetree/plugin-dnd)
[![downloads](https://img.shields.io/npm/dm/@splicetree/plugin-dnd.svg)](https://npmcharts.com/compare/%40splicetree%2Fplugin-dnd?minimal=true)
[![license](https://img.shields.io/npm/l/@splicetree/plugin-dnd.svg)](https://www.npmjs.com/package/@splicetree/plugin-dnd)
[![Website](https://img.shields.io/static/v1?label=Website&message=splicetree.dev&color=blue)](https://www.splicetree.dev)
[![GitHub](https://img.shields.io/static/v1?label=GitHub&message=splicetree%2Fsplicetree&logo=github)](https://github.com/michaelcocova/splicetree)

## 安装

`pnpm add @splicetree/plugin-dnd`

## 使用

```ts
import { createSpliceTree } from '@splicetree/core'
import dnd, { DropPosition } from '@splicetree/plugin-dnd'

const tree = createSpliceTree(data, {
  plugins: [dnd],
  configuration: {
    dnd: {
      // 控制可拖拽
      disabledDrag: (n) => n.level === 2, // 例如：禁用所有 2 级节点的拖拽
      // 控制可放置
      levelMatrix: {
        // 例如：3 级可以放到 2 级「内」，但 2 级不能放到 1 级「内」
        3: { 2: { inside: true } },
        2: { 1: { inside: false } },
      },
      // 显式禁止某些 ID 对的放置
      denyDropPairs: [
        { fromId: 'a', toId: 'b', positions: [DropPosition.INSIDE] },
      ],
      // 完全自定义：覆盖所有规则（高优先级）
      canDrop: (src, tgt, pos) => {
        if (src.id === 'a' && tgt.id === 'b') return false
        return true
      },
    },
  },
})
```

## Api

### Options

| 选项               | 类型                                                         | 默认值 | 说明                                                                 |
| ------------------ | ------------------------------------------------------------ | ------ | -------------------------------------------------------------------- |
| `autoUpdateParent` | `boolean`                                                    | `true` | 拖拽后自动更新源节点的父字段；为 `false` 时不写回且不移动           |
| `autoExpandOnDrop` | `boolean`                                                    | `true` | 拖入后自动展开目标节点                                              |
| `readonly`         | `boolean`                                                    | `false`| 只读模式，禁用拖拽与放置                                            |
| `reorderOnly`      | `boolean`                                                    | `false`| 仅允许同层级排序（禁用 `INSIDE` 放入子级）                          |
| `disabledDrag`     | `boolean \| string[] \| (node: DndNode) => boolean`          | `无`   | 禁用拖拽：布尔、ID 列表或方法                                       |
| `levelMatrix`      | `Record<level, Record<level, { before?: boolean; inside?: boolean; after?: boolean }>>` | `无`   | 基于层级的允许矩阵。未显式配置的组合默认允许                        |
| `denyDropPairs`    | `{ fromId: string; toId: string; positions?: DropPosition[] }[]` | `无`   | 显式禁止某些源-目标的放置；未指定 `positions` 时，禁止所有落点      |
| `canDrop`          | `(src: DndNode, tgt: DndNode, position: DropPosition) => boolean` | `无`   | 自定义总规则（高优先级，返回 `true/false` 覆盖其它规则）            |

### Events

| 事件   | 负载                                                                           | 说明     |
| ------ | ------------------------------------------------------------------------------ | -------- |
| `move` | `{ id: string, parentId?: string, position: DropPosition, beforeId?: string }` | 节点移动 |

### 实例方法

| 名称             | 参数                                                      | 说明                       |
| ---------------- | --------------------------------------------------------- | -------------------------- |
| `drop`           | `srcId: string; targetId: string; position: DropPosition` | 执行移动                   |
| `onDragStart`    | `id: string`                                              | 标记拖拽源                 |
| `onDragOver`     | `id: string; el: HTMLElement; e: DragEvent \| MouseEvent` | 更新目标悬停位置           |
| `onDragLeave`    | `id: string`                                              | 清理悬停位置               |
| `onDrop`         | `targetId: string`                                        | 根据当前悬停位置执行移动   |
| `hoverPositions` | `无`                                                      | 目标悬停位置缓存           |
| `draggingId`     | `无`                                                      | 当前正在拖拽的节点 id      |
| `dragProps`      | `id: string`                                              | DOM 事件绑定集合（逐节点） |

### 节点方法

| 名称                | 参数 | 说明                 |
| ------------------- | ---- | -------------------- |
| `getDropPosition()` | `无` | 当前节点的悬停位置   |
| `isDragging()`      | `无` | 当前节点是否为拖拽源 |
| `isDisabled()`      | `无` | 当前节点是否禁用拖拽 |

## 规则优先级
- `readonly` → 全面禁止
- `canDrop` → 优先级最高，返回值直接决定是否允许
- `denyDropPairs` → 其次，命中即禁止
- `levelMatrix` → 再次，根据层级组合与落点决策
- 默认允许（除去基础非法场景：拖到自己或到父级）
