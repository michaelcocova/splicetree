import type { SpliceTreeData, SpliceTreeInstance, SpliceTreeNode, UseSpliceTreeOptions } from '@splicetree/core'
import type { Ref, ShallowRef, WritableComputedRef } from 'vue'
import { createSpliceTree } from '@splicetree/core'
import { shallowRef, toValue, watch } from 'vue'

export interface UseSpliceTreeReturn<T extends SpliceTreeData = SpliceTreeData>
  extends Omit<SpliceTreeInstance<T>, 'items' | 'selectedKeys'> {
  items: ShallowRef<SpliceTreeNode<T>[]>
  selectedKeys: ShallowRef<string[]>
  /** 原始 Set 引用（当启用 selectable 插件时存在） */
  selectedKeysSet?: Set<string>
}
/**
 * Vue 3 适配器
 * - 以 shallowRef 暴露 items，使其在核心派发 visibility 事件时刷新
 * - 保留核心 API 的完整返回（展开/收起/移动等方法）
 * - 适用于任意自定义渲染逻辑与组件绑定
 */
export function useSpliceTree<T extends SpliceTreeData = SpliceTreeData>(
  data: Ref<T[]> | T[] | WritableComputedRef<T[]>,
  options: UseSpliceTreeOptions<T> = {},
): UseSpliceTreeReturn<T> {
  const api = shallowRef()
  const items = shallowRef<SpliceTreeNode<T>[]>(api.value?.items?.() ?? [])
  const selectedKeys = shallowRef<string[]>([])
  const createTree = () => {
    api.value = createSpliceTree<T>(toValue(data), options)
    api.value.events.on('visibility', () => {
      items.value = api.value.items()
      if (api.value?.selectedKeys instanceof Set) {
        selectedKeys.value = Array.from(api.value.selectedKeys)
      }
    })
    items.value = api.value.items()
    if (api.value?.selectedKeys instanceof Set) {
      selectedKeys.value = Array.from(api.value.selectedKeys)
    }
  }
  createTree()
  watch(
    () => toValue(data),
    () => {
      api.value.syncData(toValue(data))
    },
    { deep: true, immediate: false },
  )
  return {
    ...api.value,
    items,
    selectedKeys,
    selectedKeysSet: api.value?.selectedKeys,
  }
}

export type {
  SpliceTreeData,
  SpliceTreeInstance,
  SpliceTreeNode,
  UseSpliceTreeOptions,
} from '@splicetree/core'
