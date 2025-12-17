# @splicetree/plugin-checkable

为树节点提供勾选与半选能力，支持向下级联与向上计算半选。

[![version](https://img.shields.io/npm/v/@splicetree/plugin-checkable.svg?label=version)](https://www.npmjs.com/package/@splicetree/plugin-checkable)
[![downloads](https://img.shields.io/npm/dm/@splicetree/plugin-checkable.svg)](https://npmcharts.com/compare/%40splicetree%2Fplugin-checkable?minimal=true)
[![license](https://img.shields.io/npm/l/@splicetree/plugin-checkable.svg)](https://www.npmjs.com/package/@splicetree/plugin-checkable)
[![Website](https://img.shields.io/static/v1?label=Website&message=splicetree.dev&color=blue)](https://www.splicetree.dev)
[![GitHub](https://img.shields.io/static/v1?label=GitHub&message=splicetree%2Fsplicetree&logo=github)](https://github.com/michaelcocova/splicetree)

## 安装

`pnpm add @splicetree/plugin-checkable`

## 使用

```ts
import { createSpliceTree } from '@splicetree/core'
import checkable from '@splicetree/plugin-checkable'

const tree = createSpliceTree(data, {
  plugins: [checkable],
  configuration: {
    checkable: {
      defaultChecked: ['a'],
      // 可选：点击节点即切换勾选
      triggerByClick: true,
    },
  },
})
```

## Api

### Configuration

- `configuration.checkable.defaultChecked: string[]` 初始勾选集合
- `configuration.checkable.triggerByClick: boolean` 点击节点切换勾选

### Events

- `checked` 负载：`{ keys: string[] }` 勾选状态变化时触发

### 实例方法

- `checkedKeys` 当前勾选集合
- `indeterminateKeys` 当前半选集合

### 节点方法

- `isChecked(): boolean` 是否勾选
- `isIndeterminate(): boolean` 是否半选
- `toggleCheck(checked?: boolean)` 切换或显式设置
