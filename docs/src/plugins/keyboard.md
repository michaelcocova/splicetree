# 键盘插件

采集键盘方向输入，派发语义化事件供行为插件消费。

## 安装

`pnpm add @splicetree/plugin-keyboard`

## 使用

```ts
import { createSpliceTree } from '@splicetree/core'
import keyboard from '@splicetree/plugin-keyboard'
import selectable from '@splicetree/plugin-selectable'

const tree = createSpliceTree(data, {
  plugins: [
    keyboard,
    selectable,
  ],
  configuration: {
    keyboard: {
      autoListen: true,
      target: '.keyboard-area',
      keymap: { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' },
    },
    selectable: { multiple: true },
  },
})
```

## 示例

### 基本键盘导航

<demo vue="../examples/keyboard/BasicNavigation.vue" />
### 自定义键位映射
<demo vue="../examples/keyboard/CustomKeymap.vue" />
### 自定义键盘监听目标
<demo vue="../examples/keyboard/CustomTarget.vue" />

## 事件

| 配置项            | 参数                                                            | 说明                                           |
| ----------------- | --------------------------------------------------------------- | ---------------------------------------------- |
| `input:direction` | `{ direction: 'up' \| 'down' \| 'left' \| 'right', modifiers }` | 仅派发语义事件；行为由 `selectable` 等插件消费 |

## Configuration

| 配置项                              | 类型                                         | 默认值          | 说明         |
| ----------------------------------- | -------------------------------------------- | --------------- | ------------ |
| `configuration.keyboard.autoListen` | `boolean`                                    | `true`          | 自动监听键盘 |
| `configuration.keyboard.target`     | `HTMLElement \| string \| () => HTMLElement` | `document.body` | 监听目标     |
| `configuration.keyboard.keymap`     | `{ up?, down?, left?, right? }`              | 箭头键          | 键位映射     |

::: tip 行为配合

- 与 `@splicetree/plugin-selectable` 组合后：
  - `up/down`：在可见节点间导航并选中
  - `left/right`：收起/展开当前激活节点

:::
