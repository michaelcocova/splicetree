# @splicetree/plugin-search

## 2.0.0

### Major Changes

- 搜索插件增强为“树搜索”，并统一到新的 API：
  - 新增配置项 `configuration.search.method(node, keyword)`（必填）
  - 搜索时展开所有命中节点的祖先链，清晰展示匹配路径；清空搜索时恢复此前的展开状态。
  - 移除 `isMatched`（实例与节点扩展），以过滤后的 `items` 与 `matchedKeys` 驱动渲染
  - 未提供 `method` 时不执行搜索并打印警告

## 1.1.0

## 1.0.0

## 0.3.0

## 0.2.0

## 0.1.1

### Patch Changes

- fix: republish plugin-search after partial release failure

## 0.1.0

## 0.0.1

### Patch Changes

- chore: 搭建 SpliceTree 框架基础架构与工程体系
