# 拖拽插件

为树节点提供拖拽移动能力，支持插入到目标之前、之后或作为子节点。

## 安装

`pnpm add @splicetree/plugin-dnd`

## 使用

```ts
import { createSpliceTree } from '@splicetree/core'
import dnd, { DropPosition } from '@splicetree/plugin-dnd'

const tree = createSpliceTree(data, {
  plugins: [dnd],
})
const { dragProps, ghostStyle } = tree
// 默认同时减去容器 padding 与 margin
// <div v-bind="ghostStyle()" />
// 关闭：不减任何边距
// <div v-bind="ghostStyle({ padding: false, margin: false })" />
// 仅减 padding（不减 margin）
// <div v-bind="ghostStyle({ padding: true, margin: false })" />
```

## 示例

### 基本拖拽 + 统一占位（ghost）

<demo vue="../../examples/dnd/Basic.vue" />

### 禁止更新父字段

<demo vue="../../examples/dnd/NoAutoUpdate.vue" />

::: tip 禁止更新父字段需要您手动处理移动

当设置 `configuration.dnd.autoUpdateParent: false` 时，插件不会执行运行时移动与元数据写回。可以监听 `move` 事件按需处理：

```ts
import { useSpliceTree } from '@splicetree/adapter-vue'
import dnd from '@splicetree/plugin-dnd'

const { events, moveNode, getNode } = useSpliceTree(data, {
  plugins: [dnd],
  configuration: { dnd: { autoUpdateParent: false } },
})

events.on('move', ({ id, parentId, beforeId }) => {
  const node = getNode(id)
  if (node) {
    Reflect.set(node.original, 'parentId', parentId)
  }
  moveNode(id, parentId, beforeId)
})
```

:::

### 禁止拖入后自动展开

<demo vue="../../examples/dnd/NoAutoExpand.vue" />

### 只读模式

<demo vue="../../examples/dnd/Readonly.vue" />

### 按节点行为覆盖

#### 禁拖拽源

<demo vue="../../examples/dnd/BehaviorDraggable.vue" />

#### 拖这个节点：不能排到其它节点前后

<demo vue="../../examples/dnd/BehaviorSortable.vue" />

#### 拖这个节点：不能进其它节点里面

<demo vue="../../examples/dnd/BehaviorNestable.vue" />

> 说明：这些设置说的是“被你拖的那个节点能不能做事”。比如 `nestable: false` 就是“拖这个节点，不能进其它节点里面”。不影响目标愿不愿意接收。

## API

### Configuration（简化）

| 选项                                 | 类型      | 默认值  | 说明                                 |
| ------------------------------------ | --------- | ------- | ------------------------------------ |
| `configuration.dnd.autoUpdateParent` | `boolean` | `true`  | 是否在 `onDrop` 时执行实际移动与写回 |
| `configuration.dnd.autoExpandOnDrop` | `boolean` | `true`  | 拖入后自动展开目标节点               |
| `configuration.dnd.readonly`         | `boolean` | `false` | 全局只读，禁止所有拖拽与排序         |

### Events

| 事件   | 负载                                                                           | 说明         |
| ------ | ------------------------------------------------------------------------------ | ------------ |
| `move` | `{ id: string, parentId?: string, position: DropPosition, beforeId?: string }` | 节点移动事件 |

### 实例方法

| 名称             | 参数                                                                                     | 说明                                                         |
| ---------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `drop`           | `srcId: string; targetId: string; position: DropPosition`                                | 执行移动                                                     |
| `onDragStart`    | `id: string`                                                                             | 标记拖拽源                                                   |
| `onDragOver`     | `id: string; el: HTMLElement; e: DragEvent \| MouseEvent`                                | 更新目标悬停位置                                             |
| `onDragLeave`    | `id: string`                                                                             | 清理悬停位置                                                 |
| `onDrop`         | `targetId: string`                                                                       | 根据当前悬停位置执行移动                                     |
| `hoverPositions` | `无`                                                                                     | 目标悬停位置缓存                                             |
| `draggingId`     | `无`                                                                                     | 当前正在拖拽的节点 id                                        |
| `dragProps`      | `id: string; behavior?: { draggable?: boolean; sortable?: boolean; nestable?: boolean }` | DOM 事件绑定集合（逐节点），可覆盖节点拖动/排序/拖入能力     |
| `ghostStyle`     | `opts?: { padding?: boolean, margin?: boolean }`                                         | 统一占位样式绑定对象；默认同时减去容器左右 padding 与 margin |

### 节点方法

| 名称                | 参数 | 说明                 |
| ------------------- | ---- | -------------------- |
| `getDropPosition()` | `无` | 当前节点的悬停位置   |
| `isDragging()`      | `无` | 当前节点是否为拖拽源 |
| `isDisabled()`      | `无` | 当前节点是否被禁用   |
