import type { SpliceTreeNode, SpliceTreePlugin, SpliceTreePluginContext } from '@splicetree/core'
import '@splicetree/core'

declare module '@splicetree/core' {
  export interface SpliceTreeConfiguration {
    lazyLoad?: {
      loadChildren?: (node: SpliceTreeNode<any>) => Promise<any[]>
    }
  }

  /**
   * 事件扩展（Lazy-Load）
   * - lazyload：派发已加载节点集合
   */
  interface SpliceTreeEventPayloadMap {
    lazyload: { keys: string[] }
  }

  /**
   * 实例扩展（Lazy-Load）
   * - loadedKeys：已加载集合
   * - loadingKeys：加载中的集合
   * - isLoaded：查询是否已加载
   * - isLoading：查询是否正在加载
   * - load：加载指定节点的子节点
   */
  interface SpliceTreeInstance {
    /**
     * 已完成加载的节点 id 集合
     */
    loadedKeys: Set<string>
    /**
     * 正在加载的节点 id 集合
     */
    loadingKeys: Set<string>
    /**
     * 查询指定节点是否已完成子节点加载
     */
    isLoaded: (id: string) => boolean
    /**
     * 查询指定节点是否正在加载
     */
    isLoading: (id: string) => boolean
    /**
     * 加载指定节点的子节点并追加到树中
     * @param id 目标节点 id
     */
    load: (id: string) => Promise<void>
  }

  /**
   * 节点扩展（Lazy-Load）
   * - isLoaded：当前节点是否已加载
   */
  interface SpliceTreeNode {
    isLoaded: () => boolean
    isLoading: () => boolean
  }
}

export const lazyLoad: SpliceTreePlugin = {
  name: 'lazy-load',
  /**
   * 懒加载插件
   * - 首次展开时按需加载子节点
   * - 覆盖 hasChildren/expand/toggleExpand 以接入加载流程
   * - 通过 loadedKeys 标记已加载节点
   */
  setup(ctx: SpliceTreePluginContext) {
    const cfg = (ctx.options?.configuration?.lazyLoad ?? {}) as {
      loadChildren?: (node: SpliceTreeNode<any>) => Promise<any[]>
    }
    const { loadChildren } = cfg
    const loadedKeys = new Set<string>()
    const loadingKeys = new Set<string>()
    const isLoaded = (id: string) => loadedKeys.has(id)
    const isLoading = (id: string) => loadingKeys.has(id)

    /**
     * 为节点应用懒加载相关的覆盖方法
     * - isLoaded：读取实例的已加载状态
     * - hasChildren：未加载时返回 true，避免展开箭头消失
     */
    const applyLazyOverrides = (node: any) => {
      node.isLoaded = () => ctx.tree.isLoaded?.(node.id)
      node.isLoading = () => ctx.tree.isLoading?.(node.id)
      node.hasChildren = () => {
        const loaded = ctx.tree.isLoaded?.(node.id)
        if (!loaded) {
          return true
        }
        return !!node.getChildren()?.length
      }
    }

    /**
     * 加载指定节点的子节点，并将其追加到树结构
     * - 若已加载或未提供加载器则跳过
     * - 追加后为新增节点应用覆盖方法
     * - 完成后记录 loadedKeys 并派发 lazyload 事件
     * @param id 目标节点 id
     */
    const load = async (id: string) => {
      if (!loadChildren) {
        return
      }
      if (loadedKeys.has(id)) {
        return
      }
      const node = ctx.tree.getNode(id)
      if (!node) {
        return
      }
      if (loadingKeys.has(id)) {
        return
      }
      loadingKeys.add(id)
      ctx.events.emit({ name: 'visibility', keys: ctx.tree.expandedKeys() })
      const children = await loadChildren(node)
      if (children?.length) {
        ctx.tree.appendChildren(id, children)
        for (const c of children) {
          const childId = String(Reflect.get(c, ctx.tree.options?.configuration?.keyField ?? 'id'))
          const childNode = ctx.tree.getNode(childId)
          if (childNode) {
            applyLazyOverrides(childNode)
          }
        }
      }
      loadedKeys.add(id)
      loadingKeys.delete(id)
      ctx.events.emit({ name: 'visibility', keys: ctx.tree.expandedKeys() })
      ctx.events.emit({ name: 'lazyload', keys: Array.from(loadedKeys) })
    }

    const origExpand = ctx.tree.expand.bind(ctx.tree)
    const origToggle = ctx.tree.toggleExpand.bind(ctx.tree)

    /**
     * 覆盖 expand：在展开前确保子节点已加载
     * @param ids 要展开的节点 id 或 id 数组
     */
    const expand = async (ids: string | string[]) => {
      const list = Array.isArray(ids) ? ids : [ids]
      if (loadChildren) {
        for (const id of list) {
          if (!isLoaded(id)) {
            await load(id)
          }
        }
      }
      origExpand(ids)
    }
    /**
     * 覆盖 toggleExpand：在切换前确保子节点已加载
     * @param ids 要切换的节点 id 或 id 数组
     */
    const toggleExpand = async (ids: string | string[]) => {
      const list = Array.isArray(ids) ? ids : [ids]
      if (loadChildren) {
        for (const id of list) {
          if (!isLoaded(id)) {
            await load(id)
          }
        }
      }
      origToggle(ids)
    }

    return {
      loadedKeys,
      loadingKeys,
      isLoaded,
      isLoading,
      load,
      expand,
      toggleExpand,
    }
  },
  /**
   * 为节点扩展懒加载相关方法与行为覆盖
   * - isLoaded：查询当前节点是否已加载
   * - hasChildren：未加载时返回 true，已加载后按实际子节点判断
   */
  extendNode(node, ctx) {
    node.isLoaded = () => ctx.tree.isLoaded?.(node.id)
    node.isLoading = () => ctx.tree.isLoading?.(node.id)
    node.hasChildren = () => {
      const loaded = ctx.tree.isLoaded?.(node.id)
      if (!loaded) {
        return true
      }
      return !!node.getChildren()?.length
    }
  },
}

export default lazyLoad
