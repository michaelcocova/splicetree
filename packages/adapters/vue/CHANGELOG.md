# @splicetree/adapter-vue

## 0.0.1

### Patch Changes

- chore: 搭建 SpliceTree 框架基础架构与工程体系

  框架架构：
  - 建立无头树（Headless Tree）核心模型与数据结构
  - 定义节点操作 API、事件系统和状态管理机制
  - 设计并实现插件体系（生命周期、注册机制、能力扩展）
  - 引入模块化架构，明确 core / plugins / adapters 的边界
  - 预留扩展点与内部协议，构建可插拔式架构基础

  适配层与生态：
  - 添加 Vue 3 适配层（渲染无关、纯接口绑定）
  - 设计独立的 UI 层解耦策略，确保跨框架可迁移
  - 预留未来 React/Svelte/WebComponents 的适配接口

  工程化与工具链：
  - 初始化 monorepo 工程结构（packages + docs）
  - 配置构建工具链 tsdown（多包构建、类型输出）
  - 构建文档系统（VitePress）与基础导航结构
  - 设置开发环境、代码规范（ESLint）、格式化流程
