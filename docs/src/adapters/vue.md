# Vue 3 适配

## 安装

`pnpm add @splicetree/adapter-vue`

## 使用

```ts
import { useSpliceTree } from '@splicetree/adapter-vue'

const { items, expand, collapse, toggleExpand } = useSpliceTree(data, {
  defaultExpanded: ['a'],
})
```

在组件中：

```vue
<template>
  <div v-for="n in items" :key="n.id">
    {{ n.original.title }}
  </div>
</template>
```

## 返回值

| 字段    | 类型                           | 说明                                            |
| ------- | ------------------------------ | ----------------------------------------------- |
| `items` | `ShallowRef<SpliceTreeNode[]>` | 响应式可见节点列表                              |
| 其他    | 与核心一致                     | 适配层复用核心 API（除 `items()` 改为 `items`） |
