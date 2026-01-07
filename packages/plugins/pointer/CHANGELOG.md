# @splicetree/plugin-pointer

## 1.0.0

### Major Changes

- 重命名实例方法：`onClick` 更名为 `inputNodeClick`，与事件 `input:node-click` 保持一致的语义。请将调用更新为：`tree.inputNodeClick(nodeId, e)`；所有文档与示例已同步更新。此更改为不兼容更新。

## 0.3.0

## 0.2.0

### Minor Changes

- chore: align pointer/selectable versions with other plugins

## 0.1.0

### Minor Changes

- ### @splicetree/plugin-pointer
  - 新增输入插件，采集节点点击事件并派发 `input:node-click`
  - 事件负载包含修饰键：`shift/ctrl/meta/alt`
