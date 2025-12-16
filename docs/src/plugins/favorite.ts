// 导入核心类型
import type { SpliceTreeNode, SpliceTreePlugin, SpliceTreePluginContext } from '@splicetree/core'
// 引入模块以支持后续的类型扩展
import '@splicetree/core'

/**
 * 通过模块扩展补充插件相关类型
 */
declare module '@splicetree/core' {
  /**
   * SpliceTree 配置选项扩展
   */
  interface UseSpliceTreeOptions {
    /** 默认收藏的节点 ID 列表 */
    favoriteDefault?: string[]
  }

  /**
   * SpliceTree 事件负载扩展
   */
  interface SpliceTreeEventPayloadMap {
    /** 收藏事件负载：当前收藏集合 */
    favorite: { keys: string[] }
  }

  /**
   * SpliceTree 实例扩展
   */
  interface SpliceTreeInstance {
    /** 收藏集合（实例级） */
    favoritedKeys: Set<string>
    /** 判断某节点是否收藏 */
    isFavorited: (id: string) => boolean
    /**
     * 批量收藏
     * @param ids 节点 ID 或 ID 数组
     */
    favorite: (ids: string | string[]) => void
    /**
     * 批量取消收藏
     * @param ids 节点 ID 或 ID 数组
     */
    unfavorite: (ids: string | string[]) => void
    /**
     * 批量切换收藏状态
     * @param ids 节点 ID 或 ID 数组
     */
    toggleFavorite: (ids: string | string[]) => void
  }

  /**
   * SpliceTree 节点扩展
   */
  interface SpliceTreeNode {
    /** 节点方法：是否收藏 */
    isFavorited: () => boolean
    /**
     * 节点方法：切换或显式设置收藏
     * @param favorited 如果未传则切换状态，true 表示收藏，false 表示取消收藏
     */
    toggleFavorite: (favorited?: boolean) => void
  }
}

/**
 * 定义示例插件：Favorite（收藏）
 */
export const favorite: SpliceTreePlugin = {
  /** 插件名称 */
  name: 'favorite',

  /**
   * 插件初始化入口
   * @param ctx 插件上下文
   * @returns 实例方法和收藏集合
   */
  setup(ctx: SpliceTreePluginContext) {
    /** 初始化收藏集合 */
    const set = new Set<string>(ctx.options.favoriteDefault ?? [])

    /** 派发收藏事件 */
    const emit = () => ctx.events.emit({ name: 'favorite', keys: Array.from(set) })
    /**
     * 入参归一化为数组
     * @param ids 节点 ID 或 ID 数组
     * @returns 标准化后的 ID 数组
     */
    const toList = (ids: string | string[]) => (Array.isArray(ids) ? ids : [ids])

    /**
     * 查询收藏状态
     * @param id 节点 ID
     * @returns 是否收藏
     */
    const isFavorited = (id: string) => set.has(id)

    /**
     * 批量收藏
     * @param ids 节点 ID 或 ID 数组
     */
    const favorite = (ids: string | string[]) => {
      for (const id of toList(ids)) set.add(id)
      emit()
    }

    /**
     * 批量取消收藏
     * @param ids 节点 ID 或 ID 数组
     */
    const unfavorite = (ids: string | string[]) => {
      for (const id of toList(ids)) set.delete(id)
      emit()
    }

    /**
     * 批量切换收藏
     * @param ids 节点 ID 或 ID 数组
     */
    const toggleFavorite = (ids: string | string[]) => {
      const add: string[] = []
      const del: string[] = []
      for (const id of toList(ids)) (set.has(id) ? del : add).push(id)
      if (add.length)
        favorite(add)
      if (del.length)
        unfavorite(del)
    }

    /** 暴露实例 API */
    return { favoritedKeys: set, isFavorited, favorite, unfavorite, toggleFavorite }
  },

  /**
   * 节点扩展入口
   * @param node 当前节点
   * @param ctx 插件上下文
   */
  extendNode(node: SpliceTreeNode, ctx: SpliceTreePluginContext) {
    /** 节点提供收藏态查询 */
    node.isFavorited = () => (ctx.tree as any).isFavorited(node.id)
    /**
     * 节点提供收藏切换
     * @param favorited 如果未传则切换状态，true 表示收藏，false 表示取消收藏
     */
    node.toggleFavorite = (favorited?: boolean) => {
      if (favorited === undefined)
        (ctx.tree as any).toggleFavorite(node.id)
      else if (favorited)
        (ctx.tree as any).favorite(node.id)
      else (ctx.tree as any).unfavorite(node.id)
    }
  },
}

/** 默认导出插件 */
export default favorite
