# SpliceTree

[![Website](https://img.shields.io/static/v1?label=Website&message=splicetree.dev&color=blue)](https://www.splicetree.dev)
[![GitHub](https://img.shields.io/static/v1?label=GitHub&message=splicetree%2Fsplicetree&logo=github)](https://github.com/michaelcocova/splicetree)
[![License](https://img.shields.io/static/v1?label=License&message=MIT&color=success)](https://github.com/michaelcocova/splicetree/blob/main/LICENSE)

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

| 名称                            | 功能         | 类型   | Version                                                                                                                                                 | Downloads                                                                                                                                                     |
| ------------------------------- | ------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@splicetree/core`              | 核心运行时   | 核心   | [![version](https://img.shields.io/npm/v/@splicetree/core.svg?label=version)](https://www.npmjs.com/package/@splicetree/core)                           | [![downloads](https://img.shields.io/npm/dm/@splicetree/core.svg)](https://npmcharts.com/compare/%40splicetree%2Fcore?minimal=true)                           |
| `@splicetree/adapter-vue`       | Vue 3 适配层 | 适配器 | [![version](https://img.shields.io/npm/v/@splicetree/adapter-vue.svg?label=version)](https://www.npmjs.com/package/@splicetree/adapter-vue)             | [![downloads](https://img.shields.io/npm/dm/@splicetree/adapter-vue.svg)](https://npmcharts.com/compare/%40splicetree%2Fadapter-vue?minimal=true)             |
| `@splicetree/plugin-checkable`  | 勾选与半选   | 插件   | [![version](https://img.shields.io/npm/v/@splicetree/plugin-checkable.svg?label=version)](https://www.npmjs.com/package/@splicetree/plugin-checkable)   | [![downloads](https://img.shields.io/npm/dm/@splicetree/plugin-checkable.svg)](https://npmcharts.com/compare/%40splicetree%2Fplugin-checkable?minimal=true)   |
| `@splicetree/plugin-dnd`        | 拖拽移动节点 | 插件   | [![version](https://img.shields.io/npm/v/@splicetree/plugin-dnd.svg?label=version)](https://www.npmjs.com/package/@splicetree/plugin-dnd)               | [![downloads](https://img.shields.io/npm/dm/@splicetree/plugin-dnd.svg)](https://npmcharts.com/compare/%40splicetree%2Fplugin-dnd?minimal=true)               |
| `@splicetree/plugin-keyboard`   | 键盘导航     | 插件   | [![version](https://img.shields.io/npm/v/@splicetree/plugin-keyboard.svg?label=version)](https://www.npmjs.com/package/@splicetree/plugin-keyboard)     | [![downloads](https://img.shields.io/npm/dm/@splicetree/plugin-keyboard.svg)](https://npmcharts.com/compare/%40splicetree%2Fplugin-keyboard?minimal=true)     |
| `@splicetree/plugin-lazy-load`  | 懒加载子节点 | 插件   | [![version](https://img.shields.io/npm/v/@splicetree/plugin-lazy-load.svg?label=version)](https://www.npmjs.com/package/@splicetree/plugin-lazy-load)   | [![downloads](https://img.shields.io/npm/dm/@splicetree/plugin-lazy-load.svg)](https://npmcharts.com/compare/%40splicetree%2Fplugin-lazy-load?minimal=true)   |
| `@splicetree/plugin-search`     | 搜索匹配     | 插件   | [![version](https://img.shields.io/npm/v/@splicetree/plugin-search.svg?label=version)](https://www.npmjs.com/package/@splicetree/plugin-search)         | [![downloads](https://img.shields.io/npm/dm/@splicetree/plugin-search.svg)](https://npmcharts.com/compare/%40splicetree%2Fplugin-search?minimal=true)         |
| `@splicetree/plugin-pointer`    | 指针输入     | 插件   | [![version](https://img.shields.io/npm/v/@splicetree/plugin-pointer.svg?label=version)](https://www.npmjs.com/package/@splicetree/plugin-pointer)       | [![downloads](https://img.shields.io/npm/dm/@splicetree/plugin-pointer.svg)](https://npmcharts.com/compare/%40splicetree%2Fplugin-pointer?minimal=true)       |
| `@splicetree/plugin-selectable` | 选择与激活   | 插件   | [![version](https://img.shields.io/npm/v/@splicetree/plugin-selectable.svg?label=version)](https://www.npmjs.com/package/@splicetree/plugin-selectable) | [![downloads](https://img.shields.io/npm/dm/@splicetree/plugin-selectable.svg)](https://npmcharts.com/compare/%40splicetree%2Fplugin-selectable?minimal=true) |

> 所有插件可按需组合使用，适配器仅为方便绑定 UI 组件，核心功能不依赖任何框架。

## 🔹 安装

```bash
pnpm add @splicetree/core
# 安装插件和适配器（可选）
pnpm add @splicetree/plugin-checkable @splicetree/plugin-dnd @splicetree/plugin-keyboard @splicetree/plugin-lazy-load @splicetree/plugin-search @splicetree/adapter-vue
```

### 🔹 快速开始（核心）

使用核心 API 构建树，并通过 configuration 定义默认展开与插件配置

```ts
import { createSpliceTree } from '@splicetree/core'
import checkable from '@splicetree/plugin-checkable'
import pointer from '@splicetree/plugin-pointer'
import selectable from '@splicetree/plugin-selectable'

const data = [
  { id: 'a', label: '节点 A' },
  { id: 'b', label: '节点 B', parent: 'a' }
]

const tree = createSpliceTree(data, {
  plugins: [checkable, pointer, selectable],
  configuration: {
    defaultExpanded: ['a'],
    autoExpandParent: true,
    checkable: {
      defaultChecked: ['b'],
      triggerByClick: false,
    },
    selectable: {
      multiple: true,
      defaultSelected: [],
    },
  },
})

// 遍历节点
for (const node of tree.items()) {
  console.log(node.id, node.level, node.isExpanded(), node.isSelected?.())
}
```

> 核心 API 与插件可直接使用在任何环境，适配器仅提供便利绑定。

⸻

### 🔹 Vue 3 集成

通过适配器将核心运行时与 Vue 绑定，items 以 shallowRef 暴露；点击节点时调用 inputNodeClick 产生语义事件。

```ts
import { useSpliceTree } from '@splicetree/adapter-vue'
import keyboard from '@splicetree/plugin-keyboard'
import pointer from '@splicetree/plugin-pointer'
import selectable from '@splicetree/plugin-selectable'
import { ref } from 'vue'

const data = ref([
  { id: 'a', label: '节点 A' },
  { id: 'b', label: '节点 B', parent: 'a' },
])

const tree = useSpliceTree(data, {
  plugins: [pointer, selectable, keyboard],
  configuration: {
    defaultExpanded: ['a'],
    autoExpandParent: true,
    selectable: { multiple: true },
    keyboard: { autoListen: true, target: '.keyboard-wrap' },
  },
})

// 在模板中：
// <div class="keyboard-wrap">
//   <div v-for="n in tree.items" :key="n.id" @click="tree.inputNodeClick(n.id, $event)">
//     {{ n.original.label }}
//   </div>
// </div>
```

⸻

### 🔹 CLI 使用

根目录提供交互式 CLI，统一进行构建、版本与发布等工作：

- 运行：pnpm run cli
- 主菜单：
  - Build
  - Dev
  - Version Packages
  - Publish（交互式发布，支持多选，默认全选）
  - Clean
  - Changelog
  - Lint
- 发布流程要点：
  - 可选择“是否执行 version-packages（默认否）”，选择“是”将执行 changeset version
  - 支持设置 NPM_TOKEN（可留空，自动读取 .env/.env.local）
  - 支持选择发布到本地 Verdaccio（默认 http://localhost:4873/）或 npm
  - 强制在正式发布前执行一次 dry-run
  - 递归 -r 发布并按所选包添加 --filter
  - git-checks 默认关闭，可在交互中开启

⸻

### 🔹 发布与变更记录

- 版本变更：pnpm run version-packages
- 根目录聚合 Changelog：pnpm run changelog:aggregate（脚本位置见 scripts/aggregate-changeset.js）
- 交互式发布：pnpm run cli → 选择 Publish

⸻

### 🔹 官方文档

完整文档、示例和 API 说明请访问：https://www.splicetree.dev￼

### 🔹 License

[MIT](./LICENSE)
