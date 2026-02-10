# @splicetree/adapter-vue

## 2.0.0

### Minor Changes

- Vue 适配器增强：暴露 `selectedKeys` 为响应式 `ShallowRef<string[]>`，并保留原始 `Set` 于 `selectedKeysSet`。
  - 监听核心的 `visibility` 事件，同步 `items` 与 `selectedKeys`。
  - 无需在应用层手动订阅事件更新选择集合。
  - 向后兼容：原有插件的 `selectedKeys: Set<string>` 仍可通过 `selectedKeysSet` 访问。

## 1.1.0

## 1.0.0

## 0.3.0

## 0.2.0

### Patch Changes

- ### @splicetree/adapter-vue
  - 在构建产物中将 `@splicetree/core` 标记为 external，避免被打包进适配器产物
  - 当传入 `Ref` 数据源时，使用 core 的 `syncData(next)` 同步更新，避免重建实例导致插件交互失效

## 0.1.1

## 0.1.0

## 0.0.1

### Patch Changes

- chore: 搭建 SpliceTree 框架基础架构与工程体系
