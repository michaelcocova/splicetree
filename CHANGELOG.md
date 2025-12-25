# Changelog


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

