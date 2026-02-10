# 搜索插件

为树提供搜索匹配能力，可自定义匹配器。

## 安装

`pnpm add @splicetree/plugin-search`

## 使用

```ts
import { createSpliceTree } from '@splicetree/core'
import search from '@splicetree/plugin-search'

const tree = createSpliceTree(data, {
  plugins: [search],
  configuration: {
    search: {
      method: (node, keyword) => String(node.original.title ?? '').toLowerCase().includes(keyword.toLowerCase()),
    },
  },
})

tree.search('readme')
```

## 示例

### 基本树搜索

<demo vue="../examples/search/BasicSearch.vue" />

## Api

### Configuration

| 选项                          | 类型                                                 | 默认值 | 说明                   |
| ----------------------------- | ---------------------------------------------------- | ------ | ---------------------- |
| `configuration.search.method` | `(node: SpliceTreeNode, keyword: string) => boolean` | `无`   | 自定义匹配方法（必填） |

### Events

| 事件     | 负载                                | 说明         |
| -------- | ----------------------------------- | ------------ |
| `search` | `{ keys: string[], query: string }` | 搜索完成事件 |

### 实例方法

| 名称            | 参数            | 说明                                                                   |
| --------------- | --------------- | ---------------------------------------------------------------------- |
| `matchedKeys`   | `无`            | 匹配集合（可用于自定义渲染逻辑）                                       |
| `search(query)` | `query: string` | 执行搜索（树搜索：展开命中的祖先链；未提供匹配方法时不执行并打印警告） |

（节点不再扩展 isMatched 方法）
