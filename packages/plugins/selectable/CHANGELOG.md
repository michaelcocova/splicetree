# @splicetree/plugin-selectable

## 0.3.0

### Minor Changes

- 选择行为优化：
  - 普通点击在 multiple: true 时采用单选语义：清空其它选中，仅选中当前节点；若再次点击已选中节点则取消选中。
  - ⌘/Ctrl + 点击 支持多选；Shift + 点击 支持范围选择。
  - 示例已统一接入标准 onClick 事件，避免直接调用 toggleSelect 导致行为不一致。

  影响与迁移：
  - 若项目依赖旧的“普通点击追加选择”行为，请改为使用 ⌘/Ctrl + 点击 完成多选。

## 0.2.0

### Minor Changes

- chore: align pointer/selectable versions with other plugins

## 0.1.0

### Minor Changes

- ### @splicetree/plugin-selectable
  - 新增行为插件，消费 `input:node-click` 与 `input:direction`
  - 支持单选/多选与 Shift 范围选择
  - 配置聚合到 `configuration.selectable`：`multiple/defaultSelected`
