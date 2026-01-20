# @splicetree/plugin-dnd

## 1.1.0

## 1.0.0

## 0.3.0

### Minor Changes

- 多节点拖拽增强：
  - 当拖拽源节点属于当前选择集合时，启用“组拖拽”，保持被选节点的相对顺序。
  - 悬停与释放阶段同时校验整组节点的 draggable / nestable / sortable 规则；任一节点不满足则整组操作禁用。
  - 防止将节点拖入自身或其后代，确保结构合法性。
  - 在 AFTER 场景按逆序处理，被选节点相对顺序保持正确。

  影响与迁移：
  - 若需要为部分节点放开“入内/前后排序”，请在 v-bind 拖拽行为中设置 nestable / sortable。

## 0.2.0

## 0.1.1

### Patch Changes

- fix: republish plugin-dnd after partial release failure

## 0.1.0

## 0.0.1

### Patch Changes

- chore: 搭建 SpliceTree 框架基础架构与工程体系
