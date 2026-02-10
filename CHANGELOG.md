# Changelog


## v2.0.0 – 2026-02-10

### @splicetree/plugin-dnd – 2.0.0

### Minor Changes

- 拖拽插件增强：
  - 新增 `configuration.dnd.handle`：仅在指定句柄元素上允许拖拽（如 `.handle`）；未设置时整个节点可拖拽
  - 新增 `configuration.dnd.color`：统一占位（ghost）颜色配置

### @splicetree/plugin-search – 2.0.0

### Major Changes

- 搜索插件增强为“树搜索”，并统一到新的 API：
  - 新增配置项 `configuration.search.method(node, keyword)`（必填）
  - 搜索时展开所有命中节点的祖先链，清晰展示匹配路径；清空搜索时恢复此前的展开状态。
  - 移除 `isMatched`（实例与节点扩展），以过滤后的 `items` 与 `matchedKeys` 驱动渲染
  - 未提供 `method` 时不执行搜索并打印警告

### @splicetree/adapter-vue – 2.0.0

### Minor Changes

- Vue 适配器增强：暴露 `selectedKeys` 为响应式 `ShallowRef<string[]>`，并保留原始 `Set` 于 `selectedKeysSet`。
  - 监听核心的 `visibility` 事件，同步 `items` 与 `selectedKeys`。
  - 无需在应用层手动订阅事件更新选择集合。
  - 向后兼容：原有插件的 `selectedKeys: Set<string>` 仍可通过 `selectedKeysSet` 访问。

---

## v1.0.0 – 2026-01-07

### @splicetree/core – 1.0.0

### Minor Changes

- 添加配置项 `autoExpandParent`：当开启时，`configuration.defaultExpanded` 中的每个节点将递归展开其所有父节点（祖先链）。例如：`defaultExpanded: ['strawberry-cream']` 与 `autoExpandParent: true` 将最终展开 `['berries', 'strawberry', 'strawberry-cream']`。

### @splicetree/plugin-pointer – 1.0.0

### Major Changes

- 重命名实例方法：`onClick` 更名为 `inputNodeClick`，与事件 `input:node-click` 保持一致的语义。请将调用更新为：`tree.inputNodeClick(nodeId, e)`；所有文档与示例已同步更新。此更改为不兼容更新。

---

## v0.3.0 – 2026-01-05

### @splicetree/plugin-dnd – 0.3.0

### Minor Changes

- 多节点拖拽增强：
  - 当拖拽源节点属于当前选择集合时，启用“组拖拽”，保持被选节点的相对顺序。
  - 悬停与释放阶段同时校验整组节点的 draggable / nestable / sortable 规则；任一节点不满足则整组操作禁用。
  - 防止将节点拖入自身或其后代，确保结构合法性。
  - 在 AFTER 场景按逆序处理，被选节点相对顺序保持正确。

  影响与迁移：
  - 若需要为部分节点放开“入内/前后排序”，请在 v-bind 拖拽行为中设置 nestable / sortable。

### @splicetree/plugin-selectable – 0.3.0

### Minor Changes

- 选择行为优化：
  - 普通点击在 multiple: true 时采用单选语义：清空其它选中，仅选中当前节点；若再次点击已选中节点则取消选中。
  - ⌘/Ctrl + 点击 支持多选；Shift + 点击 支持范围选择。
  - 示例已统一接入标准 onClick 事件，避免直接调用 toggleSelect 导致行为不一致。

  影响与迁移：
  - 若项目依赖旧的“普通点击追加选择”行为，请改为使用 ⌘/Ctrl + 点击 完成多选。

---

## v0.2.0 – 2025-12-25

### @splicetree/core – 0.2.0

### Minor Changes

- ### @splicetree/core
  - 新增 `syncData(next)`：同步数据源并刷新内部缓存与节点扩展
  - 核心配置聚合到 `options.configuration`

### @splicetree/plugin-pointer – 0.2.0

### Minor Changes

- chore: align pointer/selectable versions with other plugins

### @splicetree/plugin-selectable – 0.2.0

### Minor Changes

- chore: align pointer/selectable versions with other plugins

### @splicetree/adapter-vue – 0.2.0

### Patch Changes

- ### @splicetree/adapter-vue
  - 在构建产物中将 `@splicetree/core` 标记为 external，避免被打包进适配器产物
  - 当传入 `Ref` 数据源时，使用 core 的 `syncData(next)` 同步更新，避免重建实例导致插件交互失效

---

## v0.2.0, v0.1.0 – 2025-12-24

### @splicetree/core – 0.2.0

### Minor Changes

- ### @splicetree/core
  - 新增 `syncData(next)`：同步数据源并刷新内部缓存与节点扩展
  - 核心配置聚合到 `options.configuration`

### @splicetree/plugin-pointer – 0.1.0

### Minor Changes

- ### @splicetree/plugin-pointer
  - 新增输入插件，采集节点点击事件并派发 `input:node-click`
  - 事件负载包含修饰键：`shift/ctrl/meta/alt`

### @splicetree/plugin-selectable – 0.1.0

### Minor Changes

- ### @splicetree/plugin-selectable
  - 新增行为插件，消费 `input:node-click` 与 `input:direction`
  - 支持单选/多选与 Shift 范围选择
  - 配置聚合到 `configuration.selectable`：`multiple/defaultSelected`

### @splicetree/adapter-vue – 0.2.0

### Patch Changes

- ### @splicetree/adapter-vue
  - 在构建产物中将 `@splicetree/core` 标记为 external，避免被打包进适配器产物
  - 当传入 `Ref` 数据源时，使用 core 的 `syncData(next)` 同步更新，避免重建实例导致插件交互失效

---

## v0.2.0, v0.1.0 – 2025-12-24

### @splicetree/core – 0.2.0

### Minor Changes

- ### @splicetree/core
  - 新增 `syncData(next)`：同步数据源并刷新内部缓存与节点扩展
  - 核心配置聚合到 `options.configuration`

### @splicetree/plugin-pointer – 0.1.0

### Minor Changes

- ### @splicetree/plugin-pointer
  - 新增输入插件，采集节点点击事件并派发 `input:node-click`
  - 事件负载包含修饰键：`shift/ctrl/meta/alt`

### @splicetree/plugin-selectable – 0.1.0

### Minor Changes

- ### @splicetree/plugin-selectable
  - 新增行为插件，消费 `input:node-click` 与 `input:direction`
  - 支持单选/多选与 Shift 范围选择
  - 配置聚合到 `configuration.selectable`：`multiple/defaultSelected`

### @splicetree/adapter-vue – 0.2.0

### Patch Changes

- ### @splicetree/adapter-vue
  - 在构建产物中将 `@splicetree/core` 标记为 external，避免被打包进适配器产物
  - 当传入 `Ref` 数据源时，使用 core 的 `syncData(next)` 同步更新，避免重建实例导致插件交互失效

---

## v0.1.1, v0.1.0 – 2025-12-17

### @splicetree/plugin-dnd – 0.1.1

### Patch Changes

- fix: republish plugin-dnd after partial release failure

### @splicetree/plugin-keyboard – 0.1.1

### Patch Changes

- fix: republish plugin-keyboard after partial release failure

### @splicetree/plugin-lazy-load – 0.1.1

### Patch Changes

- fix: republish plugin-lazy-load after partial release failure

### @splicetree/plugin-pointer – 0.1.0

### Minor Changes

- ### @splicetree/plugin-pointer
  - 新增输入插件，采集节点点击事件并派发 `input:node-click`
  - 事件负载包含修饰键：`shift/ctrl/meta/alt`

### @splicetree/plugin-search – 0.1.1

### Patch Changes

- fix: republish plugin-search after partial release failure

### @splicetree/plugin-selectable – 0.1.0

### Minor Changes

- ### @splicetree/plugin-selectable
  - 新增行为插件，消费 `input:node-click` 与 `input:direction`
  - 支持单选/多选与 Shift 范围选择
  - 配置聚合到 `configuration.selectable`：`multiple/defaultSelected`

---

## v0.1.1, v0.1.0 – 2025-12-17

### @splicetree/plugin-dnd – 0.1.1

### Patch Changes

- fix: republish plugin-dnd after partial release failure

### @splicetree/plugin-keyboard – 0.1.1

### Patch Changes

- fix: republish plugin-keyboard after partial release failure

### @splicetree/plugin-lazy-load – 0.1.1

### Patch Changes

- fix: republish plugin-lazy-load after partial release failure

### @splicetree/plugin-pointer – 0.1.0

### Minor Changes

- ### @splicetree/plugin-pointer
  - 新增输入插件，采集节点点击事件并派发 `input:node-click`
  - 事件负载包含修饰键：`shift/ctrl/meta/alt`

### @splicetree/plugin-search – 0.1.1

### Patch Changes

- fix: republish plugin-search after partial release failure

### @splicetree/plugin-selectable – 0.1.0

### Minor Changes

- ### @splicetree/plugin-selectable
  - 新增行为插件，消费 `input:node-click` 与 `input:direction`
  - 支持单选/多选与 Shift 范围选择
  - 配置聚合到 `configuration.selectable`：`multiple/defaultSelected`

---

## v0.1.0 – 2025-12-17

### @splicetree/plugin-checkable – 0.1.0

### Minor Changes

- ### @splicetree/plugin-checkable
  - 更新为配置聚合：`configuration.checkable.defaultChecked/triggerByClick`
  - 可选：通过点击节点触发勾选切换（与 Pointer 协同）

### @splicetree/plugin-keyboard – 0.1.0

### Minor Changes

- ### @splicetree/plugin-keyboard
  - 只采集方向键并统一派发 `input:direction`
  - 配置聚合到 `configuration.keyboard`：`autoListen/target/keymap`
  - 自动为目标容器添加 `tabindex="0"` 并聚焦

### @splicetree/plugin-pointer – 0.1.0

### Minor Changes

- ### @splicetree/plugin-pointer
  - 新增输入插件，采集节点点击事件并派发 `input:node-click`
  - 事件负载包含修饰键：`shift/ctrl/meta/alt`

### @splicetree/plugin-selectable – 0.1.0

### Minor Changes

- ### @splicetree/plugin-selectable
  - 新增行为插件，消费 `input:node-click` 与 `input:direction`
  - 支持单选/多选与 Shift 范围选择
  - 配置聚合到 `configuration.selectable`：`multiple/defaultSelected`

---

## v0.0.1 – 2025-12-17

### @splicetree/core – 0.0.1

### Patch Changes

- chore: 搭建 SpliceTree 框架基础架构与工程体系

### @splicetree/plugin-checkable – 0.0.1

### Patch Changes

- chore: 搭建 SpliceTree 框架基础架构与工程体系

### @splicetree/plugin-dnd – 0.0.1

### Patch Changes

- chore: 搭建 SpliceTree 框架基础架构与工程体系

### @splicetree/plugin-keyboard – 0.0.1

### Patch Changes

- chore: 搭建 SpliceTree 框架基础架构与工程体系

### @splicetree/plugin-lazy-load – 0.0.1

### Patch Changes

- chore: 搭建 SpliceTree 框架基础架构与工程体系

### @splicetree/plugin-search – 0.0.1

### Patch Changes

- chore: 搭建 SpliceTree 框架基础架构与工程体系

### @splicetree/adapter-vue – 0.0.1

### Patch Changes

- chore: 搭建 SpliceTree 框架基础架构与工程体系

---

## v0.0.1 – 2025-12-17

### @splicetree/core – 0.0.1

### Patch Changes

- chore: 搭建 SpliceTree 框架基础架构与工程体系

### @splicetree/plugin-checkable – 0.0.1

### Patch Changes

- chore: 搭建 SpliceTree 框架基础架构与工程体系

### @splicetree/plugin-dnd – 0.0.1

### Patch Changes

- chore: 搭建 SpliceTree 框架基础架构与工程体系

### @splicetree/plugin-keyboard – 0.0.1

### Patch Changes

- chore: 搭建 SpliceTree 框架基础架构与工程体系

### @splicetree/plugin-lazy-load – 0.0.1

### Patch Changes

- chore: 搭建 SpliceTree 框架基础架构与工程体系

### @splicetree/plugin-search – 0.0.1

### Patch Changes

- chore: 搭建 SpliceTree 框架基础架构与工程体系

### @splicetree/adapter-vue – 0.0.1

### Patch Changes

- chore: 搭建 SpliceTree 框架基础架构与工程体系

---

