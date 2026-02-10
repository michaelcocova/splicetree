# Vue 3 适配

## 安装

`pnpm add @splicetree/adapter-vue`

## 使用

```ts
import { useSpliceTree } from '@splicetree/adapter-vue'

const { items, selectedKeys, expand, collapse, toggleExpand } = useSpliceTree(data, {
  configuration: {
    defaultExpanded: ['a'],
  },
})
```

在组件中：

```vue
<template>
  <div v-for="n in items" :key="n.id">
    {{ n.original.title }}
  </div>
  <div>选中集合：{{ selectedKeys }}</div>
</template>
```

## 返回值

| 字段              | 类型                           | 说明                                            |
| ----------------- | ------------------------------ | ----------------------------------------------- |
| `items`           | `ShallowRef<SpliceTreeNode[]>` | 响应式可见节点列表                              |
| `selectedKeys`    | `ShallowRef<string[]>`         | 响应式选中集合（配合 selectable 插件）          |
| `selectedKeysSet` | `Set<string> \| undefined`     | 原始 Set 引用（用于兼容旧写法）                 |
| 其他              | 与核心一致                     | 适配层复用核心 API（除 `items()` 改为 `items`） |

## 实例方法

| 名称              | 参数                                             | 说明                           |
| ----------------- | ------------------------------------------------ | ------------------------------ |
| `getNode`         | `id: string`                                     | 获取节点                       |
| `expand`          | `id: string \| string[]`                         | 展开节点或节点列表             |
| `collapse`        | `id: string \| string[]`                         | 收起节点或节点列表             |
| `toggleExpand`    | `id: string \| string[]`                         | 切换展开状态                   |
| `expandAll`       | `无`                                             | 展开所有节点                   |
| `collapseAll`     | `无`                                             | 收起所有节点                   |
| `toggleExpandAll` | `无`                                             | 切换所有节点展开状态           |
| `appendChildren`  | `parentId: string \| undefined, children: any[]` | 追加子节点                     |
| `moveNode`        | `id: string, newParentId?: string, beforeId?`    | 移动节点到新父级并指定插入位置 |
| `events.on`       | `(name, handler) => () => boolean`               | 订阅事件                       |
| `events.emit`     | `payload`                                        | 派发事件                       |
