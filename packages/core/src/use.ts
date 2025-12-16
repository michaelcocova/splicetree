import type {
  SpliceTreeData,
  SpliceTreeInstance,
  SpliceTreePluginContext,
  UseSpliceTreeOptions,
} from './types'
import type { NodeContext } from './utils/node'
import { createEmitter } from './emitter'
import { buildTree } from './impl'
import { createReactive, initDefaultExpansion } from './utils'
import { appendChildren as appendChildrenUtil, computeVisibleItems, moveNode as moveNodeUtil } from './utils/node'

/**
 * 创建 SpliceTree 树实例
 * - 构建缓存结构
 * - 暴露操作方法（展开/收起/追加/移动）
 * - 提供插件扩展点（setup/extendNode）
 */
export function createSpliceTree<T extends SpliceTreeData = SpliceTreeData>(
  data: T[],
  options: UseSpliceTreeOptions<T> = {},
): SpliceTreeInstance<T> {
  const keyField = options.keyField ?? 'id'
  const parentField = options.parentField ?? 'parent'
  const events = createEmitter()
  const expandedKeys = createReactive(new Set<string>(), (payload) => {
    events.emit({ name: 'visibility', keys: Array.from(payload.target) })
  })

  const { roots, map, parentCache, childrenCache } = buildTree<T>(data, keyField, parentField, expandedKeys)

  initDefaultExpansion<T>(map, expandedKeys, options.defaultExpanded, options.defaultExpandedLevel)

  const emitVisibility = () => {
    events.emit({ name: 'visibility', keys: Array.from(expandedKeys) })
  }

  const tree: SpliceTreeInstance<T> = {
    data,
    options,
    items: () => computeVisibleItems<T>(roots),
    getNode: (id: string) => map.get(id),
    events,
    expandedKeys: () => Array.from(expandedKeys),
    isExpanded: (id: string) => (expandedKeys).has(id),
    expand(ids: string | string[]) {
      const list = Array.isArray(ids) ? ids : [ids]
      for (const id of list) {
        if (!(expandedKeys).has(id))
          (expandedKeys).add(id)
      }
      emitVisibility()
    },
    collapse(ids: string | string[]) {
      const list = Array.isArray(ids) ? ids : [ids]
      for (const id of list) {
        if ((expandedKeys).has(id))
          (expandedKeys).delete(id)
      }
      emitVisibility()
    },
    toggleExpand(ids: string | string[]) {
      const list = Array.isArray(ids) ? ids : [ids]
      const toExpand: string[] = []
      const toCollapse: string[] = []
      for (const id of list) {
        if (tree.isExpanded(id))
          toCollapse.push(id)
        else toExpand.push(id)
      }
      if (toExpand.length)
        tree.expand(toExpand)
      if (toCollapse.length)
        tree.collapse(toCollapse)
    },
    expandAll() {
      for (const id of map.keys()) (expandedKeys as any).add(id)
      emitVisibility()
    },
    collapseAll() {
      expandedKeys.clear()
      emitVisibility()
    },
    toggleExpandAll() {
      if (expandedKeys.size > 0)
        tree.collapseAll()
      else tree.expandAll()
    },
    appendChildren(parentId: string | undefined, children: T[]) {
      const ctx: NodeContext<T> = {
        map,
        tree,
        roots,
        keyField,
        parentCache,
        childrenCache,
        expandedKeys,
        notify: emitVisibility,
      }
      appendChildrenUtil<T>(ctx, parentId, children)
    },
    moveNode(id: string, newParentId: string | undefined, beforeId?: string) {
      const ctx: NodeContext<T> = {
        map,
        tree,
        roots,
        keyField,
        parentCache,
        childrenCache,
        expandedKeys,
        notify: emitVisibility,
      }
      moveNodeUtil<T>(ctx, id, newParentId, beforeId)
    },
  }

  const pluginCtx: SpliceTreePluginContext<T> = { tree, options, events }
  options?.plugins?.forEach((plugin) => {
    const api = plugin.setup?.(pluginCtx)
    Object.assign(tree, api)
  })
  if (options?.plugins?.length) {
    for (const n of map.values()) {
      for (const plugin of options.plugins!) plugin.extendNode?.(n, pluginCtx)
    }
  }
  for (const node of map.values()) {
    node.isExpanded = () => tree.isExpanded(node.id)
    node.toggleExpand = (expand?: boolean) => {
      if (expand === undefined)
        tree.toggleExpand(node.id)
      else if (expand)
        tree.expand(node.id)
      else tree.collapse(node.id)
    }
  }
  return tree
}
