import type { SpliceTreeNode, SpliceTreePlugin, SpliceTreePluginContext } from '@splicetree/core'
import '@splicetree/core'

declare module '@splicetree/core' {
  export interface SpliceTreeConfiguration {
    search?: {
      method?: (node: SpliceTreeNode<any>, keyword: string) => boolean
    }
  }

  /**
   * 事件扩展（Search）
   * - search：派发匹配 keys 与查询串
   */
  interface SpliceTreeEventPayloadMap {
    search: { keys: string[], query: string }
  }

  /**
   * 实例扩展（Search）
   * - matchedKeys：匹配集合
   * - search：执行搜索
   */
  interface SpliceTreeInstance {
    /**
     * 当前查询命中的节点 id 集合
     */
    matchedKeys: Set<string>
    /**
     * 执行搜索并更新匹配集合
     * @param query 查询串
     */
    search: (query: string) => void
  }

  // 节点不再扩展 isMatched
}

export const search: SpliceTreePlugin = {
  name: 'search',
  /**
   * 搜索插件
   * - 支持自定义 matcher(node, query) 或使用默认 JSON 字符串匹配
   * - 标记匹配节点集合 matchedKeys，并提供 isMatched 查询
   * - 通过 events 派发 search 事件，携带匹配 keys 与 query
   */
  setup(ctx: SpliceTreePluginContext) {
    const cfg = (ctx.options?.configuration?.search ?? {}) as {
      method?: (node: SpliceTreeNode<any>, keyword: string) => boolean
    }
    const { method } = cfg
    const matchedKeys = new Set<string>()
    let prevExpanded: string[] | null = null
    let currentQuery = ''
    const ancestorSet = new Set<string>()
    const origItems = ctx.tree.items.bind(ctx.tree)

    /**
     * 执行搜索：清空旧结果，按 items() 的可见节点进行匹配与标记
     * - 空查询时派发空集合并返回
     * - 命中节点将其 id 记录到 matchedKeys
     * - 完成后派发 search 事件，携带 keys 与 query
     * @param query 查询串
     */
    const search = (query: string) => {
      matchedKeys.clear()
      ancestorSet.clear()
      currentQuery = query
      if (!query) {
        if (prevExpanded) {
          ctx.tree.collapseAll()
          ctx.tree.expand(prevExpanded)
          prevExpanded = null
        }
        ctx.events.emit({ name: 'visibility', keys: ctx.tree.expandedKeys() })
        ctx.events.emit({ name: 'search', keys: [], query })
        return
      }
      if (!method) {
        console.warn('[@splicetree/plugin-search] 请提供 configuration.search.method(node, keyword)')
        return
      }
      if (!prevExpanded) {
        prevExpanded = ctx.tree.expandedKeys()
      }
      ctx.tree.expandAll()
      const items = origItems()
      ancestorSet.clear()
      for (const n of items) {
        const ok = method!(n, query)
        if (ok) {
          matchedKeys.add(n.id)
          let p = n.getParent()
          while (p) {
            ancestorSet.add(p.id)
            p = p.getParent()
          }
        }
      }
      // 仅展开命中的祖先链，收起其它分支
      ctx.tree.collapseAll()
      if (ancestorSet.size > 0) {
        ctx.tree.expand(Array.from(ancestorSet))
      }
      ctx.events.emit({ name: 'visibility', keys: ctx.tree.expandedKeys() })
      ctx.events.emit({ name: 'search', keys: Array.from(matchedKeys), query })
    }

    return {
      matchedKeys,
      search,
      // 过滤不可见项：仅保留命中节点及其祖先链
      items: () => {
        const list = origItems()
        if (!currentQuery) {
          return list
        }
        const keep = new Set<string>(matchedKeys)
        // 合并祖先链
        for (const id of ancestorSet) {
          keep.add(id)
        }
        for (const n of list) {
          if (keep.has(n.id)) {
            let p = n.getParent()
            while (p) {
              keep.add(p.id)
              p = p.getParent()
            }
          }
        }
        return list.filter(n => keep.has(n.id))
      },
    }
  },
  // 不再为节点扩展 isMatched
}

export default search
