# @splicetree/plugin-lazy-load

## 1.1.0

### Minor Changes

- 为懒加载插件新增“加载中”状态与渲染联动：
  - 新增 `loadingKeys: Set<string>` 与 `isLoading(id)` 实例方法；节点新增 `isLoading()`。
  - 在 `load(id)` 开始/结束时派发 `visibility` 事件，触发适配层刷新，便于 UI 立刻显示 Loading。
  - 文档示例在加载中禁用展开按钮，并以旋转图标显示 Loading。

  此为向后兼容更新；如需在加载中禁止交互，请在 UI 侧判断 `item.isLoading()`。

## 1.0.0

## 0.3.0

## 0.2.0

## 0.1.1

### Patch Changes

- fix: republish plugin-lazy-load after partial release failure

## 0.1.0

## 0.0.1

### Patch Changes

- chore: 搭建 SpliceTree 框架基础架构与工程体系
