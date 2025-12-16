# @splicetree/plugin-checkable

[![version](https://img.shields.io/npm/v/@splicetree/plugin-checkable.svg?label=version)](https://www.npmjs.com/package/@splicetree/plugin-checkable)
[![downloads](https://img.shields.io/npm/dm/@splicetree/plugin-checkable.svg)](https://npmcharts.com/compare/%40splicetree%2Fplugin-checkable?minimal=true)
[![license](https://img.shields.io/npm/l/@splicetree/plugin-checkable.svg)](https://www.npmjs.com/package/@splicetree/plugin-checkable)
[![Website](https://img.shields.io/static/v1?label=Website&message=splicetree.dev&color=blue)](https://www.splicetree.dev)
[![GitHub](https://img.shields.io/static/v1?label=GitHub&message=splicetree%2Fsplicetree&logo=github)](https://github.com/michaelcocova/splicetree)

为树节点提供勾选与半选能力，支持向下级联与向上计算半选。

## 安装

`pnpm add @splicetree/plugin-checkable`

## 使用

```ts
import { createSpliceTree } from '@splicetree/core'
import checkable from '@splicetree/plugin-checkable'

const tree = createSpliceTree(data, {
  plugins: [checkable],
  defaultExpanded: ['a'],
  defaultChecked: ['a'],
})
```

## Api

### Options

| 选项             | 类型       | 默认值 | 说明         |
| ---------------- | ---------- | ------ | ------------ |
| `defaultChecked` | `string[]` | `[]`   | 初始勾选集合 |

### Events

| 事件      | 负载                 | 说明               |
| --------- | -------------------- | ------------------ |
| `checked` | `{ keys: string[] }` | 勾选状态变化时触发 |

### 实例方法

| 名称                | 参数 | 说明         |
| ------------------- | ---- | ------------ |
| `checkedKeys`       | `无` | 当前勾选集合 |
| `indeterminateKeys` | `无` | 当前半选集合 |

### 节点方法

| 名称                    | 参数                | 说明           |
| ----------------------- | ------------------- | -------------- |
| `isChecked()`           | `无`                | 是否勾选       |
| `isIndeterminate()`     | `无`                | 是否半选       |
| `toggleCheck(checked?)` | `checked?: boolean` | 切换或显式设置 |
