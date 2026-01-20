# @splicetree/core

## 1.1.0

## 1.0.0

### Minor Changes

- 添加配置项 `autoExpandParent`：当开启时，`configuration.defaultExpanded` 中的每个节点将递归展开其所有父节点（祖先链）。例如：`defaultExpanded: ['strawberry-cream']` 与 `autoExpandParent: true` 将最终展开 `['berries', 'strawberry', 'strawberry-cream']`。

## 0.3.0

## 0.2.0

### Minor Changes

- ### @splicetree/core
  - 新增 `syncData(next)`：同步数据源并刷新内部缓存与节点扩展
  - 核心配置聚合到 `options.configuration`

## 0.1.1

## 0.1.0

## 0.0.1

### Patch Changes

- chore: 搭建 SpliceTree 框架基础架构与工程体系
