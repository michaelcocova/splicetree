# @splicetree/adapter-vue

## 简介

SpliceTree Vue 适配层，将核心 `items()` 适配为 `shallowRef` 响应式数据，并复用核心 API。

提供响应式 `items` 与操作方法，自动监听核心事件刷新视图。

[![version](https://img.shields.io/npm/v/@splicetree/adapter-vue.svg?label=version)](https://www.npmjs.com/package/@splicetree/adapter-vue)
[![downloads](https://img.shields.io/npm/dm/@splicetree/adapter-vue.svg)](https://npmcharts.com/compare/%40splicetree%2Fadapter-vue?minimal=true)
[![license](https://img.shields.io/npm/l/@splicetree/adapter-vue.svg)](https://www.npmjs.com/package/@splicetree/adapter-vue)
[![Website](https://img.shields.io/static/v1?label=Website&message=splicetree.dev&color=blue)](https://www.splicetree.dev)
[![GitHub](https://img.shields.io/static/v1?label=GitHub&message=splicetree%2Fsplicetree&logo=github)](https://github.com/michaelcocova/splicetree)

## 官方文档

文档与示例位于 [https://www.splicetree.dev](https://www.splicetree.dev)

## 安装

```sh
pnpm add @splicetree/adapter-vue
```

## 使用

```ts
import { useSpliceTree } from '@splicetree/adapter-vue'

const { items, expand, collapse, toggleExpand } = useSpliceTree(data, {
  defaultExpanded: ['a'],
})

// 在组件中渲染
// <template>
//   <div v-for="n in items" :key="n.id">{{ n.original.title }}</div>
// </template>
```

## 返回值

- `items: ShallowRef<SpliceTreeNode[]>` 响应式可见节点列表
- 其余方法属性与核心一致（除 `items()`）

## 选项（继承 Core）

| 名称              | 类型                 | 默认值     | 说明         |
| ----------------- | -------------------- | ---------- | ------------ |
| `keyField`        | `string`             | `'id'`     | 主键字段名   |
| `parentField`     | `string`             | `'parent'` | 父级字段名   |
| `plugins`         | `SpliceTreePlugin[]` | `[]`       | 插件列表     |
| `defaultExpanded` | `string[]`           | `[]`       | 初始展开集合 |

## License

[MIT](https://github.com/michaelcocova/splicetree/blob/main/LICENSE)，仓库地址 [https://github.com/michaelcocova/splicetree](https://github.com/michaelcocova/splicetree)
