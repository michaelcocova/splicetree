# 搜索插件

为树提供搜索匹配能力，可自定义匹配器。

## 安装

`pnpm add @splicetree/plugin-search`

## 使用

```ts
import { createSpliceTree } from '@splicetree/core'
import { search } from '@splicetree/search'

const tree = createSpliceTree(data, {
  plugins: [search],
  configuration: {
    search: {
      matcher: (node, q) => String(node.original.title ?? '').toLowerCase().includes(q.toLowerCase()),
    },
  },
})

tree.search('readme')
```

## 示例

### 基本搜索

<demo vue="../examples/search/BasicSearch.vue" />

### 自定义匹配器

<demo vue="../examples/search/CustomMatcher.vue" />

## Api

### Configuration

| 选项                           | 类型                                               | 默认值                                     | 说明         |
| ------------------------------ | -------------------------------------------------- | ------------------------------------------ | ------------ |
| `configuration.search.matcher` | `(node: SpliceTreeNode, query: string) => boolean` | `JSON.stringify(original).includes(query)` | 自定义匹配器 |

### Events

| 事件     | 负载                                | 说明         |
| -------- | ----------------------------------- | ------------ |
| `search` | `{ keys: string[], query: string }` | 搜索完成事件 |

### 实例方法

| 名称            | 参数            | 说明         |
| --------------- | --------------- | ------------ |
| `matchedKeys`   | `无`            | 匹配集合     |
| `isMatched(id)` | `id: string`    | 节点是否匹配 |
| `search(query)` | `query: string` | 执行搜索     |

### 节点方法

| 名称          | 参数 | 说明             |
| ------------- | ---- | ---------------- |
| `isMatched()` | `无` | 当前节点是否匹配 |
