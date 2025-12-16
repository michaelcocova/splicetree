# SpliceTree

[![Website](https://img.shields.io/static/v1?label=Website&message=splicetree.dev&color=blue)](https://www.splicetree.dev)
[![GitHub](https://img.shields.io/static/v1?label=GitHub&message=splicetree%2Fsplicetree&logo=github)](https://github.com/michaelcocova/splicetree)
[![License](https://img.shields.io/static/v1?label=License&message=MIT&color=success)](https://github.com/michaelcocova/splicetree/blob/main/LICENSE)

---

## 🔹 简介

SpliceTree 是一个 无头（Headless）、框架无关的树形数据运行时，为现代 Web 应用提供灵活、高性能的树结构管理能力。

它只关注 状态、逻辑与行为，不关心 UI 表现，你可以在 Vue、React、Svelte 或任意运行环境 中自由构建你想要的树形界面 ——
文件树、级联选择、可编辑大纲、权限树,节点树等复杂场景，都可以由 SpliceTree 作为底层逻辑内核支撑。

核心包 @splicetree/core 可直接使用，官方提供 Vue 3 适配层与一系列插件，用于快速集成到实际应用中，但核心能力不依赖任何框架。

核心 API 精简、灵活，可用于文件树、级联选择等复杂场景，同时支持插件扩展丰富能力：

- 搜索匹配
- 拖拽移动
- 勾选与半选
- 键盘导航
- 懒加载子节点

---

✨ 特性

- 🌍 跨框架 / 跨环境
  - 核心完全框架无关
  - 可运行在 Vue / React / Svelte / Node / Web Worker 等环境
  - 官方适配器仅用于 UI 绑定，不侵入核心逻辑
- 🪶 Headless 设计
  - 只提供树结构、状态和行为
  - UI 结构、样式、交互方式完全由你决定
  - 非组件，而是“树运行时（Tree Runtime）”
- 🔌 插件系统
  - 通过插件扩展能力，而非堆叠配置
  - 已内置：勾选与半选、拖拽、键盘导航、搜索、懒加载
  - 插件可组合、可拆卸、不污染核心 API
- ⚡ 高性能
  - 面向扁平数据设计，避免深层递归
  - 批量操作优化、缓存可见节点
  - 适合大规模节点（万级以上）场景
- 🧩 灵活的数据模型
  - 天然支持 扁平结构 ↔ 树结构 转换
  - 节点关系、层级、展开态统一由运行时维护
  - 非侵入式节点数据，不强制特定 schema
- 🛠️ 优秀的开发体验
  - 完整 TypeScript 类型系统
  - 插件与节点能力可通过模块声明安全扩展
  - 核心 API 精简、可预测、易测试

## 🔹 插件与适配器总览

| 名称                           | 功能         | 类型   |
| ------------------------------ | ------------ | ------ |
| `@splicetree/core`             | 核心运行时   | 核心   |
| `@splicetree/adapter-vue`      | Vue 3 适配层 | 适配器 |
| `@splicetree/plugin-checkable` | 勾选与半选   | 插件   |
| `@splicetree/plugin-dnd`       | 拖拽移动节点 | 插件   |
| `@splicetree/plugin-keyboard`  | 键盘导航     | 插件   |
| `@splicetree/plugin-lazy-load` | 懒加载子节点 | 插件   |
| `@splicetree/plugin-search`    | 搜索匹配     | 插件   |

> 所有插件可按需组合使用，适配器仅为方便绑定 UI 组件，核心功能不依赖任何框架。

---

## 🔹 安装

```bash
pnpm add @splicetree/core
# 安装插件和适配器（可选）
pnpm add @splicetree/plugin-checkable @splicetree/plugin-dnd @splicetree/plugin-keyboard @splicetree/plugin-lazy-load @splicetree/plugin-search @splicetree/adapter-vue
```

⸻

### 🔹 快速开始

核心 API 使用

```ts
import { createSpliceTree } from '@splicetree/core'
import pluginCheckable from '@splicetree/plugin-checkable'

const data = [
  { id: 'a', label: '节点 A' },
  { id: 'b', label: '节点 B', parent: 'a' }
]

const tree = createSpliceTree(data, {
  defaultExpanded: ['a'],
  plugins: [pluginCheckable()],
})

// 遍历节点
for (const node of tree.items()) {
  console.log(node.id, node.level, node.checked)
}
```

> 核心 API 与插件可直接使用在任何环境，适配器仅提供便利绑定。

⸻

### 🔹 插件开发指南

- 插件应 可组合、类型安全、框架无关
- 遵循 事件驱动 更新机制，避免直接操作视图
- 插件命名：@splicetree/plugin-<name>
- 默认导出插件常量，支持命名导出
- 事件和节点扩展可通过 TypeScript 模块声明进行类型增强

完整文档请参阅 插件开发规范￼

⸻

### 🔹 官方文档

完整文档、示例和 API 说明请访问：https://www.splicetree.dev￼

### 🔹 License

[MIT](./LICENSE)
