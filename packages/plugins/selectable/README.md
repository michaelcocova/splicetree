# @splicetree/plugin-selectable

提供选择与激活能力，支持单选/多选与 Shift 范围选择；消费 `input:node-click` 与 `input:direction` 语义事件。

[![version](https://img.shields.io/npm/v/@splicetree/plugin-selectable.svg?label=version)](https://www.npmjs.com/package/@splicetree/plugin-selectable)
[![downloads](https://img.shields.io/npm/dm/@splicetree/plugin-selectable.svg)](https://npmcharts.com/compare/%40splicetree%2Fplugin-selectable?minimal=true)
[![license](https://img.shields.io/npm/l/@splicetree/plugin-selectable.svg)](https://www.npmjs.com/package/@splicetree/plugin-selectable)
[![Website](https://img.shields.io/static/v1?label=Website&message=splicetree.dev&color=blue)](https://www.splicetree.dev)
[![GitHub](https://img.shields.io/static/v1?label=GitHub&message=splicetree%2Fsplicetree&logo=github)](https://github.com/michaelcocova/splicetree)

## 安装

`pnpm add @splicetree/plugin-selectable`

## 使用

```ts
import { createSpliceTree } from '@splicetree/core'
import keyboard from '@splicetree/plugin-keyboard'
import pointer from '@splicetree/plugin-pointer'
import selectable from '@splicetree/plugin-selectable'

const tree = createSpliceTree(data, {
  plugins: [keyboard, pointer, selectable],
  configuration: {
    selectable: {
      multiple: true,
      defaultSelected: ['a'],
    },
    keyboard: {
      autoListen: true,
      target: '.keyboard-wrap',
    },
  },
})
```

## Api

- 实例
  - `selectedKeys: Set<string>` 当前选中集合
  - `lastSelectedKey?: string` 最近一次选中的 id
  - `activeId?: string` 当前激活 id（用于键盘导航）
  - `isSelected(id: string): boolean`
  - `toggleSelect(id: string, selected?: boolean): void`
- 节点
  - `isSelected(): boolean`
  - `toggleSelect(selected?: boolean): void`
- 配置（`configuration.selectable`）
  - `multiple?: boolean` 是否多选
  - `defaultSelected?: string[]` 默认选中集合
