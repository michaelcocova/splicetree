import type { SpliceTreeData, SpliceTreeInstance, SpliceTreeNode, UseSpliceTreeOptions } from '@splicetree/core'
import type { Ref, ShallowRef, WritableComputedRef } from 'vue'
import { createSpliceTree } from '@splicetree/core'
import { shallowRef, toValue, watch } from 'vue'

export interface UseSpliceTreeReturn<T extends SpliceTreeData = SpliceTreeData> extends Omit<SpliceTreeInstance<T>, 'items'> {
  items: ShallowRef<SpliceTreeNode<T>[]>
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
  const createTree = () => {
    api.value = createSpliceTree<T>(toValue(data), options)
    api.value.events.on('visibility', () => {
      items.value = api.value.items()
    })
    items.value = api.value.items()
  }
  createTree()
  watch(
    () => toValue(data),
    () => {
      createTree()
    },
    { deep: true, immediate: false },
  )
  return { ...api.value, items }
}

export type {
  SpliceTreeData,
  SpliceTreeInstance,
  SpliceTreeNode,
  UseSpliceTreeOptions,
} from '@splicetree/core'
