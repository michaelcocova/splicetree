import type { SpliceTreePlugin, SpliceTreePluginContext } from '@splicetree/core'
import '@splicetree/core'

declare module '@splicetree/core' {
  /**
   * 选项扩展（Search）
   * - matcher：自定义匹配器（默认按 JSON 字符串包含匹配）
   */
  interface UseSpliceTreeOptions<T> {
    /**
     * 自定义匹配器
     * 返回 true 表示节点命中查询
     * @param node 当前遍历节点
     * @param query 查询串
     */
    matcher?: (node: SpliceTreeNode<T>, query: string) => boolean
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
   * - isMatched：查询是否匹配
   * - search：执行搜索
   */
  interface SpliceTreeInstance {
    /**
     * 当前查询命中的节点 id 集合
     */
    matchedKeys: Set<string>
    /**
     * 查询指定节点是否命中当前搜索
     */
    isMatched: (id: string) => boolean
    /**
     * 执行搜索并更新匹配集合
     * @param query 查询串
     */
    search: (query: string) => void
  }

  /**
   * 节点扩展（Search）
   * - isMatched：当前节点是否匹配
   */
  interface SpliceTreeNode {
    /**
     * 当前节点是否匹配当前搜索
     * @returns true 表示匹配
     */
    isMatched: () => boolean
  }
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
    const { matcher } = ctx.options
    const matchedKeys = new Set<string>()
    const isMatched = (id: string) => matchedKeys.has(id)

    /**
     * 默认匹配器：按节点数据的 JSON 字符串执行包含匹配（大小写不敏感）
     * @param node 节点
     * @param q 查询串
     */
    const defaultMatcher = (node: any, q: string) => {
      const str = JSON.stringify(node.original ?? node).toLowerCase()
      return str.includes(q.toLowerCase())
    }

    /**
     * 执行搜索：清空旧结果，按 items() 的可见节点进行匹配与标记
     * - 空查询时派发空集合并返回
     * - 命中节点将其 id 记录到 matchedKeys
     * - 完成后派发 search 事件，携带 keys 与 query
     * @param query 查询串
     */
    const search = (query: string) => {
      matchedKeys.clear()
      if (!query) {
        ctx.events.emit({ name: 'search', keys: [], query } as any)
        return
      }
      const items = ctx.tree.items()
      for (const n of items) {
        const ok = matcher ? matcher(n, query) : defaultMatcher(n, query)
        if (ok) {
          matchedKeys.add(n.id)
        }
      }
      ctx.events.emit({ name: 'search', keys: Array.from(matchedKeys), query } as any)
    }

    return {
      matchedKeys,
      isMatched,
      search,
    }
  },
  /**
   * 为节点扩展匹配态判断方法
   * - isMatched：当前节点是否匹配当前查询
   */
  extendNode(node, ctx) {
    ;(node as any).isMatched = () => (ctx.tree as any).isMatched(node.id)
  },
}

export default search
