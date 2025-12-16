# @splicetree/plugin-keyboard

[![version](https://img.shields.io/npm/v/@splicetree/plugin-keyboard.svg?label=version)](https://www.npmjs.com/package/@splicetree/plugin-keyboard)
[![downloads](https://img.shields.io/npm/dm/@splicetree/plugin-keyboard.svg)](https://npmcharts.com/compare/%40splicetree%2Fplugin-keyboard?minimal=true)
[![license](https://img.shields.io/npm/l/@splicetree/plugin-keyboard.svg)](https://www.npmjs.com/package/@splicetree/plugin-keyboard)
[![Website](https://img.shields.io/static/v1?label=Website&message=splicetree.dev&color=blue)](https://www.splicetree.dev)
[![GitHub](https://img.shields.io/static/v1?label=GitHub&message=splicetree%2Fsplicetree&logo=github)](https://github.com/michaelcocova/splicetree)

提供快捷键导航能力：上下移动、展开与收起。

## 安装

`pnpm add @splicetree/plugin-keyboard`

## 使用

```ts
import { createSpliceTree } from '@splicetree/core'
import keyboardNavigation from '@splicetree/plugin-keyboard'

const tree = createSpliceTree(data, {
  plugins: [keyboardNavigation],
  defaultActive: 'a',
  autoListenKeyboard: true,
  keymap: { expand: 'ArrowRight', collapse: 'ArrowLeft', next: 'ArrowDown', prev: 'ArrowUp' },
})
```

## Api

### Options

| 选项                 | 类型                                                                   | 默认值          | 说明                             |
| -------------------- | ---------------------------------------------------------------------- | --------------- | -------------------------------- |
| `defaultActive`      | `string`                                                               | `undefined`     | 默认激活节点                     |
| `autoListenKeyboard` | `boolean`                                                              | `true`          | 是否自动监听键盘事件             |
| `keymap`             | `{ expand?: string; collapse?: string; next?: string; prev?: string }` | `见下`          | 快捷键映射（默认：左右上下箭头） |
| `keyboardTarget`     | `HTMLElement`                                                          | `document.body` | 键盘监听目标                     |

### 实例方法

| 名称                    | 参数                       | 说明                   |
| ----------------------- | -------------------------- | ---------------------- |
| `activeId`              | `无`                       | 当前激活的节点         |
| `toggleActive(id, on?)` | `id: string; on?: boolean` | 切换或显式设置激活状态 |

### 节点方法

| 名称                | 参数           | 说明                 |
| ------------------- | -------------- | -------------------- |
| `toggleActive(on?)` | `on?: boolean` | 切换或显式设置激活态 |
