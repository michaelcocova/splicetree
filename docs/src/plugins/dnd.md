# 拖拽插件

为树节点提供拖拽移动能力，支持插入到目标之前、之后或作为子节点。

## 安装

`pnpm add @splicetree/plugin-dnd`

## 使用

```ts
import { createSpliceTree } from '@splicetree/core'
import dnd from '@splicetree/plugin-dnd'

const tree = createSpliceTree(data, {
  plugins: [dnd],
  configuration: {
    dnd: {
      autoUpdateParent: true,
      autoExpandOnDrop: true,
    },
  },
})
```

## 示例

### 基本拖拽

<demo vue="../examples/dnd/BasicDrag.vue" />

### 禁止更新父字段

<demo vue="../examples/dnd/DisableAutoUpdateParent.vue" />

::: tip 禁止更新父字段需要您手动处理移动, 插件内部不会处理修改数据的 parent 和 移动后的位置

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

<demo vue="../examples/dnd/DisableAutoExpandOnDrop.vue" />

## Api

### Configuration

| 选项                                 | 类型      | 默认值 | 说明                                                            |
| ------------------------------------ | --------- | ------ | --------------------------------------------------------------- |
| `configuration.dnd.autoUpdateParent` | `boolean` | `true` | 拖拽后自动更新源节点的父字段；为 `false` 时不写回元数据且不移动 |
| `configuration.dnd.autoExpandOnDrop` | `boolean` | `true` | 拖入后自动展开目标节点                                          |

### Events

| 事件   | 负载                                                                           | 说明         |
| ------ | ------------------------------------------------------------------------------ | ------------ |
| `move` | `{ id: string, parentId?: string, position: DropPosition, beforeId?: string }` | 节点移动事件 |

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
