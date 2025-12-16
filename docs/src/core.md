# 核心（@splicetree/core）

## 安装

`pnpm add @splicetree/core`

## 使用

```ts
import { createSpliceTree } from '@splicetree/core'

const data = [
  { id: 'a' },
  { id: 'b', parent: 'a' },
]

const tree = createSpliceTree(data, {
  keyField: 'id',
  parentField: 'parent',
  defaultExpanded: ['a'],
})

for (const node of tree.items()) {
  console.log(node.id, node.level)
}
```

## 示例

### 基本用法

<demo vue="./examples/core/BasicTree.vue" />

### 展开指定节点

<demo vue="./examples/core/DefaultExpanded.vue" />

### 默认展开所有节点

<demo vue="./examples/core/DefaultExpandedAll.vue" />

### 展开指定层级

<demo vue="./examples/core/ExpandedLevel.vue" />

### 默认展开所有层级

<demo vue="./examples/core/ExpandedAllLevel.vue" />

::: tip 从上面示例可以看到 默认展开所有层级 支持 2 种方式

- `defaultExpanded: true`
- `defaultExpandedLevel: 'deepest'`

:::

### 展开/收起所有节点

<demo vue="./examples/core/ToggleExpandedAll.vue" />

### 自定义 `Key` 字段

<demo vue="./examples/core/CustomKeyField.vue" />

### 自定义 `Parent` 字段

<demo vue="./examples/core/CustomParentField.vue" />

## Api

### 参数

| 参数                   | 类型                  | 默认值      | 说明                                    |
| ---------------------- | --------------------- | ----------- | --------------------------------------- |
| `keyField`             | `string`              | `'id'`      | 作为节点唯一键的字段名                  |
| `parentField`          | `string`              | `'parent'`  | 作为父引用的字段名                      |
| `plugins`              | `SpliceTreePlugin[]`  | `[]`        | 插件列表                                |
| `defaultExpanded`      | `true \| string[]`    | `[]`        | 初始展开：`true` 展开全部或指定 ID 列表 |
| `defaultExpandedLevel` | `number \| 'deepest'` | `undefined` | 初始展开层级：数字或 `'deepest'`        |

::: danger 默认展开的优先级与规则

- 当 `defaultExpanded === true`：忽略 `defaultExpandedLevel`，直接展开全部
- 当 `defaultExpanded` 为 `string[]`：
  - 展开这些 ID 对应节点
  - 若同时提供 `defaultExpandedLevel`：`'deepest'` 则展开全部；数字则按层级追加展开
- 当未提供 `defaultExpanded`：使用 `defaultExpandedLevel`（`'deepest'` 展开全部，数字按层级展开）

:::

### 实例方法

| 名称                                   | 参数                                                              | 说明                             |
| -------------------------------------- | ----------------------------------------------------------------- | -------------------------------- |
| `items()`                              | -                                                                 | 返回当前可见节点序列             |
| `getNode(id)`                          | `id: string`                                                      | 通过 id 获取节点                 |
| `events`                               | -                                                                 | 事件总线（`on/emit`）            |
| `expandedKeys()`                       | -                                                                 | 获取已展开的节点集合（数组）     |
| `isExpanded(id)`                       | `id: string`                                                      | 判断节点是否展开                 |
| `expand(ids)`                          | `ids: string \| string[]`                                         | 展开单个或多个节点               |
| `collapse(ids)`                        | `ids: string \| string[]`                                         | 收起单个或多个节点               |
| `toggleExpand(ids)`                    | `ids: string \| string[]`                                         | 切换单个或多个节点的展开状态     |
| `expandAll()`                          | -                                                                 | 展开全部节点                     |
| `collapseAll()`                        | -                                                                 | 收起全部节点                     |
| `toggleExpandAll()`                    | -                                                                 | 切换“全部展开/全部收起”          |
| `appendChildren(parentId, children)`   | `parentId: string \| undefined; children: T[]`                    | 追加子节点                       |
| `moveNode(id, newParentId, beforeId?)` | `id: string; newParentId: string \| undefined; beforeId?: string` | 移动节点到新父级并可指定插入位置 |

### 节点属性

| 名称       | 说明              |
| ---------- | ----------------- |
| `id`       | 节点唯一标识      |
| `original` | 原始数据          |
| `level`    | 层级（从 0 开始） |

### 节点方法

| 名称           | 参数 | 说明           |
| -------------- | ---- | -------------- |
| `isExpanded`   | -    | 是否展开       |
| `hasChildren`  | -    | 是否有子节点   |
| `getParent`    | -    | 获取父节点     |
| `getChildren`  | -    | 获取子节点数组 |
| `toggleExpand` | -    | 切换展开状态   |
