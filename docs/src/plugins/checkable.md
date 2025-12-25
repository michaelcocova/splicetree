# 多选插件

为树节点提供勾选与半选能力，支持向下级联与向上计算半选。

## 安装

`pnpm add @splicetree/plugin-checkable`

## 使用

```ts
import { createSpliceTree } from '@splicetree/core'
import checkable from '@splicetree/plugin-checkable'

const tree = createSpliceTree(data, {
  plugins: [checkable],
  configuration: {
    defaultExpanded: ['a'],
    checkable: {
      defaultChecked: ['a'],
      // 可选：点击节点即切换勾选
      triggerByClick: true,
    },
  },
})
```

## 示例

### 基本勾选

<demo vue="../examples/checkable/BasicCheck.vue" />

### 默认勾选

<demo vue="../examples/checkable/DefaultChecked.vue" />

### 半选与级联

<demo vue="../examples/checkable/Indeterminate.vue" />

### 切换勾选

<demo vue="../examples/checkable/ToggleCheck.vue" />

## Api

### Configuration

| 选项                                     | 类型       | 默认值  | 说明                   |
| ---------------------------------------- | ---------- | ------- | ---------------------- |
| `configuration.checkable.defaultChecked` | `string[]` | `[]`    | 初始勾选的节点 id 集合 |
| `configuration.checkable.triggerByClick` | `boolean`  | `false` | 点击节点切换勾选       |

### Events

| 事件      | 负载                 | 说明               |
| --------- | -------------------- | ------------------ |
| `checked` | `{ keys: string[] }` | 勾选状态变化时触发 |

### 实例方法

| 名称                  | 参数         | 说明                     |
| --------------------- | ------------ | ------------------------ |
| `checkedKeys`         | `无`         | 当前勾选集合             |
| `indeterminateKeys`   | `无`         | 当前半选集合             |
| `isChecked(id)`       | `id: string` | 是否勾选                 |
| `isIndeterminate(id)` | `id: string` | 是否半选                 |
| `check(id)`           | `id: string` | 勾选并级联到所有子孙     |
| `uncheck(id)`         | `id: string` | 取消勾选并级联到所有子孙 |
| `toggleCheck(id)`     | `id: string` | 切换勾选                 |

### 节点方法

| 名称                    | 参数                | 说明           |
| ----------------------- | ------------------- | -------------- |
| `isChecked()`           | `无`                | 是否勾选       |
| `isIndeterminate()`     | `无`                | 是否半选       |
| `toggleCheck(checked?)` | `checked?: boolean` | 切换或显式设置 |
