# 指针/点击插件

采集节点点击输入，派发语义化事件供行为插件消费。

## 安装

`pnpm add @splicetree/plugin-pointer`

## 使用

```ts
import { createSpliceTree } from '@splicetree/core'
import pointer from '@splicetree/plugin-pointer'
import selectable from '@splicetree/plugin-selectable'

const tree = createSpliceTree(data, {
  plugins: [
    pointer,
    selectable({ multiple: true }),
  ],
})

// 在视图层绑定
// onClick 节点被点击时触发输入事件
button.addEventListener('click', (e) => {
  tree.onClick(nodeId, e)
})
```

## 事件

- `input:node-click: { nodeId: string, modifiers }`
  - 仅派发语义事件；行为由 `selectable`、`checkable` 等插件消费

## 与其他插件配合

- 与 `selectable`：点击进行单选/多选/Shift 范围选择
- 与 `checkable`：开启 `checkable.triggerByClick` 后点击切换勾选
