# @splicetree/plugin-keyboard

提供快捷键导航能力：上下移动、展开与收起。

[![version](https://img.shields.io/npm/v/@splicetree/plugin-keyboard.svg?label=version)](https://www.npmjs.com/package/@splicetree/plugin-keyboard)
[![downloads](https://img.shields.io/npm/dm/@splicetree/plugin-keyboard.svg)](https://npmcharts.com/compare/%40splicetree%2Fplugin-keyboard?minimal=true)
[![license](https://img.shields.io/npm/l/@splicetree/plugin-keyboard.svg)](https://www.npmjs.com/package/@splicetree/plugin-keyboard)
[![Website](https://img.shields.io/static/v1?label=Website&message=splicetree.dev&color=blue)](https://www.splicetree.dev)
[![GitHub](https://img.shields.io/static/v1?label=GitHub&message=splicetree%2Fsplicetree&logo=github)](https://github.com/michaelcocova/splicetree)

## 安装

`pnpm add @splicetree/plugin-keyboard`

## 使用

```ts
import { createSpliceTree } from '@splicetree/core'
import keyboardNavigation from '@splicetree/plugin-keyboard'

const tree = createSpliceTree(data, {
  plugins: [keyboardNavigation],
  configuration: {
    keyboard: {
      autoListen: true,
      target: '.keyboard-wrap',
      keymap: { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' },
    },
  },
})
```

## Api

### Configuration

- `configuration.keyboard.autoListen: boolean` 是否自动监听键盘（默认 `true`）
- `configuration.keyboard.target: HTMLElement | string | (() => HTMLElement | null)` 监听目标
- `configuration.keyboard.keymap: { up?: string; down?: string; left?: string; right?: string }` 快捷键映射

### 实例方法

- `activeId?: string` 当前激活节点 id（与选择插件协同）

### 节点方法

- 无（键盘插件不扩展节点方法，专注输入事件）
