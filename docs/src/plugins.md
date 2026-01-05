# 插件

| 插件 / 适配器                   | 功能               | 文档链接                   |
| ------------------------------- | ------------------ | -------------------------- |
| `@splicetree/plugin-checkable`  | 勾选能力（含半选） | [查看](plugins/checkable)  |
| `@splicetree/plugin-dnd`        | 拖拽移动节点       | [查看](/plugins/dnd/)      |
| `@splicetree/plugin-keyboard`   | 键盘输入采集       | [查看](plugins/keyboard)   |
| `@splicetree/plugin-pointer`    | 点击输入采集       | [查看](plugins/pointer)    |
| `@splicetree/plugin-selectable` | 选择（单/多/范围） | [查看](plugins/selectable) |
| `@splicetree/plugin-lazy-load`  | 懒加载子节点       | [查看](plugins/lazy-load)  |
| `@splicetree/plugin-search`     | 搜索与匹配         | [查看](plugins/search)     |

## 插件开发规范

### 目标

- 提供可组合、类型安全、框架无关的扩展能力
- 遵循事件驱动更新，避免直接操作视图层

### 命名与结构

- 包名：`@splicetree/plugin-<name>`
- 入口：`src/index.ts`，仅 ESM 输出
- 默认导出插件常量，同时命名导出以便组合

### 插件接口与配置聚合

```ts
import type { SpliceTreePlugin, SpliceTreePluginContext } from '@splicetree/core'
import '@splicetree/core'

declare module '@splicetree/core' {
  interface UseSpliceTreeOptions {
    /**
     * 插件配置聚合入口（按插件名分类）
     * 仅当启用对应插件时，才提供相应的配置键
     * 例如启用 keyboard+selectable：
     * configuration: {
     *   keyboard?: {...},
     *   selectable?: {...},
     * }
     */
    configuration?: Record<string, any>
  }
  interface SpliceTreeEventPayloadMap { /* 事件扩展：event: payload */ }
  interface SpliceTreeInstance { /* 实例扩展：方法/数据 */ }
  interface SpliceTreeNode { /* 节点扩展：方法/状态查询 */ }
}

export const myPlugin: SpliceTreePlugin = {
  name: 'my-plugin',
  setup(ctx: SpliceTreePluginContext) {
    // 读取分类配置：ctx.options.configuration.<pluginName>
    const cfg = (ctx.options?.configuration?.myPlugin ?? {}) as Record<string, unknown>
    // 初始化状态与方法；ctx.tree / ctx.options / ctx.events 可用
    // 需要触发渲染时，派发事件：
    // ctx.events.emit({ name: 'visibility', keys: ctx.tree.expandedKeys() })
    return {
      // 扩展到实例：属性/方法
    }
  },
  extendNode(node, ctx) {
    // 扩展到节点：方法/状态查询
  },
}
export default myPlugin
```

### 类型扩展

- 使用 `declare module '@splicetree/core'` 扩展：
  - `UseSpliceTreeOptions` 插件选项
  - `SpliceTreeEventPayloadMap` 插件事件负载
  - `SpliceTreeInstance` 插件暴露的实例方法/数据
  - `SpliceTreeNode` 节点方法/状态
- 事件命名语义化，负载结构稳定且可序列化

### 行为与性能

- 不直接依赖视图层；通过 `ctx.events.emit` 驱动更新
- 复用 `tree.items()/getNode()/expandedKeys()` 等核心方法与缓存
- 避免 O(n²) 操作；批量场景（如多选、多展开）应合并触发事件
