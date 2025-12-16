# @splicetree/core

[![version](https://img.shields.io/npm/v/@splicetree/core.svg?label=version)](https://www.npmjs.com/package/@splicetree/core)
[![downloads](https://img.shields.io/npm/dm/@splicetree/core.svg)](https://npmcharts.com/compare/%40splicetree%2Fcore?minimal=true)
[![license](https://img.shields.io/npm/l/@splicetree/core.svg)](https://www.npmjs.com/package/@splicetree/core)
[![Website](https://img.shields.io/static/v1?label=Website&message=splicetree.dev&color=blue)](https://www.splicetree.dev)
[![GitHub](https://img.shields.io/static/v1?label=GitHub&message=splicetree%2Fsplicetree&logo=github)](https://github.com/michaelcocova/splicetree)

为扁平数据提供轻量、可扩展的树运行时。支持插件扩展事件与能力。

## 简介

SpliceTree 是一个 Headless 树运行时，面向扁平数据构建可操作的树结构，提供精简 API，并通过插件扩展搜索、拖拽、懒加载、键盘导航等能力。

## 官方文档

文档与示例位于 [https://www.splicetree.dev](https://www.splicetree.dev)

## 安装

```sh
pnpm add @splicetree/core
```

## 使用

```ts
import { createSpliceTree } from '@splicetree/core'

const data = [
  { id: 'a' },
  { id: 'b', parent: 'a' },
]

const { items } = createSpliceTree(data, {
  keyField: 'id',
  parentField: 'parent',
  defaultExpanded: ['a'],
})

// 渲染可见节点
for (const node of items()) {
  console.log(node.id, node.level)
}
```

## 选项

| 名称              | 类型                 | 默认值     | 说明                         |
| ----------------- | -------------------- | ---------- | ---------------------------- |
| `keyField`        | `string`             | `'id'`     | 主键字段名                   |
| `parentField`     | `string`             | `'parent'` | 父级字段名                   |
| `plugins`         | `SpliceTreePlugin[]` | `[]`       | 插件列表（可扩展实例与节点） |
| `defaultExpanded` | `string[]`           | `[]`       | 初始展开的节点 id 集合       |

## 实例 API

- `items()` 返回当前可见节点序列
- `getNode(id)` 通过 id 获取节点
- `events` 事件总线（`on/emit`）
- `expand/collapse/toggleExpand(id)` 展开/收起/切换
- `appendChildren(parentId, children)` 追加子节点（支持追加到根）
- `moveNode(id, newParentId, beforeId?)` 移动到新父级，并指定插入位置

## 节点 API

- `id/original/level`
- `isExpanded()` 当前是否展开
- `hasChildren()` 是否存在子节点（懒加载插件可覆盖）
- `getParent()/getChildren()` 父子节点查询

## License

[MIT](https://github.com/michaelcocova/splicetree/blob/main/LICENSE)，仓库地址 [https://github.com/michaelcocova/splicetree](https://github.com/michaelcocova/splicetree)
