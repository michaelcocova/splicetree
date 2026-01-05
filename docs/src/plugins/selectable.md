# 选择插件

消费输入事件，实现单选/多选/范围选择与方向键导航。

## 安装

`pnpm add @splicetree/plugin-selectable`

## 使用

```ts
import { createSpliceTree } from '@splicetree/core'
import keyboard from '@splicetree/plugin-keyboard'
import pointer from '@splicetree/plugin-pointer'
import selectable from '@splicetree/plugin-selectable'

const tree = createSpliceTree(data, {
  plugins: [
    keyboard,
    pointer,
    selectable,
  ],
  configuration: {
    keyboard: { target: '.list' },
    selectable: { multiple: true, defaultSelected: ['a'] },
  },
})
```

## Configuration

| 选项                                       | 类型       | 默认值  | 说明                 |
| ------------------------------------------ | ---------- | ------- | -------------------- |
| `configuration.selectable.multiple`        | `boolean`  | `false` | 是否启用多选         |
| `configuration.selectable.defaultSelected` | `string[]` | `[]`    | 初始选中节点 id 集合 |

## 行为

- 点击（`input:node-click`）
  - 单选模式：点击选中当前节点
  - 多选模式：
    - 普通点击采用单选语义：清空其它选中，仅选中当前节点；再次点击已选中节点则取消选中
    - `Ctrl/Cmd` 切换选中；`Shift` 范围选择
- 键盘（`input:direction`）
  - `↑/↓`：在可见节点间移动并选中
  - `←`：若当前节点已展开则收起，否则移动到父节点
  - `→`：若当前节点有子节点则展开

## 事件

| 名称               | 负载                                                                       | 说明             |
| ------------------ | -------------------------------------------------------------------------- | ---------------- |
| `input:node-click` | `{ nodeId: string, modifiers: Modifiers }`                                 | 节点点击输入事件 |
| `input:direction`  | `{ direction: 'up' \| 'down' \| 'left' \| 'right', modifiers: Modifiers }` | 方向键输入事件   |

## 扩展

| 扩展              | 类型                        | 说明                   |
| ----------------- | --------------------------- | ---------------------- |
| `selectedKeys`    | `Set<string>`               | 当前选中集合           |
| `lastSelectedKey` | `string \| undefined`       | 最近一次选中的节点 id  |
| `activeId`        | `string \| undefined`       | 当前激活节点 id        |
| `isSelected(id)`  | `(id: string) => boolean`   | 查询节点是否选中       |
| `toggleSelect`    | `(id: string, on?) => void` | 切换或显式设置选中状态 |

## 节点方法

- `isSelected()`：是否选中
- `toggleSelect(on?)`：切换或显式设置选中
