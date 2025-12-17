import type { SpliceTreePlugin, SpliceTreePluginContext } from '@splicetree/core'
import '@splicetree/core'

/**
 * 拖拽落点位置
 * - BEFORE: 目标之前插入
 * - INSIDE: 作为目标的子节点插入
 * - AFTER:  目标之后插入
 */
export enum DropPosition {
  BEFORE = -1,
  INSIDE = 0,
  AFTER = 1,
}
declare module '@splicetree/core' {
  interface SpliceTreeConfiguration {
    dnd?: {
      autoUpdateParent?: boolean
      autoExpandOnDrop?: boolean
    }
  }
  interface SpliceTreeEventPayloadMap {
    /**
     * 节点移动事件负载
     * @property id 源节点 id
     * @property parentId 新父级节点 id（INSIDE/BEFORE/AFTER 场景下可能不同）
     * @property position 落点位置（BEFORE/INSIDE/AFTER）
     * @property beforeId 插入到谁之前（AFTER/BEFORE 场景下提供）
     */
    move: { id: string, parentId?: string, position: DropPosition, beforeId?: string }
  }

  interface SpliceTreeInstance {
    /**
     * 执行拖拽移动
     * @param srcId 源节点 id
     * @param targetId 目标节点 id
     * @param position 落点位置（前/内/后）
     */
    drop: (srcId: string, targetId: string, position: DropPosition) => void
    /**
     * 当前拖拽源节点 id
     */
    draggingId?: string
    /**
     * 目标节点的悬停位置映射
     */
    hoverPositions: Map<string, DropPosition>
    /**
     * DOM 事件：开始拖拽
     */
    onDragStart: (id: string) => void
    /**
     * DOM 事件：悬停计算并更新位置
     */
    onDragOver: (id: string, el: HTMLElement, e: DragEvent | MouseEvent) => void
    /**
     * DOM 事件：离开目标，清理悬停状态
     */
    onDragLeave: (id: string) => void
    /**
     * DOM 事件：在目标上释放后执行移动
     */
    onDrop: (targetId: string) => void
    /**
     * 可直接 v-bind 到节点的拖拽属性集合
     */
    dragProps: {
      /**
       * 是否可拖拽
       */
      draggable: boolean
      /**
       * 原生拖拽开始事件处理
       */
      onDragstart: (e: DragEvent) => void
      /**
       * 原生拖拽悬停事件处理
       */
      onDragover: (e: DragEvent) => void
      /**
       * 原生拖拽离开事件处理
       */
      onDragleave: (e: DragEvent) => void
      /**
       * 原生拖拽释放事件处理
       */
      onDrop: (e: DragEvent) => void
    }
  }

  /**
   * 节点扩展（DnD）
   */
  interface SpliceTreeNode {
    /**
     * 获取当前节点的悬停落点位置
     */
    getDropPosition: () => (DropPosition | undefined)
    /**
     * 当前节点是否为拖拽源
     */
    isDragging: () => boolean
  }
}

export const dnd: SpliceTreePlugin = {
  name: 'dnd',
  /**
   * 拖拽插件
   * - 计算目标悬停位置：前（BEFORE）/内（INSIDE）/后（AFTER）
   * - 根据配置自动更新父字段与目标展开
   * - 通过 events 派发 move 与 visibility 事件驱动视图刷新
   */
  setup(ctx: SpliceTreePluginContext) {
    const cfg = (ctx.options?.configuration?.dnd ?? {}) as {
      autoUpdateParent?: boolean
      autoExpandOnDrop?: boolean
    }
    const { autoUpdateParent = true, autoExpandOnDrop = true } = cfg
    const parentField = ctx.tree.options?.parentField ?? 'parent'
    let draggingId: string | undefined
    const hoverPositions = new Map<string, DropPosition>()

    /**
     * 开始拖拽：记录拖拽源并通知视图刷新（用于高亮拖拽源）
     * @param id 源节点 id
     */
    const onDragStart = (id: string) => {
      draggingId = id
      ctx.events.emit({ name: 'visibility', keys: ctx.tree.expandedKeys() })
    }

    /**
     * 依据指针相对目标节点的垂直比例计算落点
     * - 上 1/3：BEFORE；下 1/3：AFTER；中间：INSIDE
     * - 过滤自身与其父级为目标的情况（返回 undefined）
     * @param id 目标节点 id
     * @param el 目标节点元素
     * @param e 拖拽/鼠标事件
     */
    const computePosition = (id: string, el: HTMLElement, e: DragEvent | MouseEvent): DropPosition | undefined => {
      const rect = el.getBoundingClientRect()
      const y = ('clientY' in e ? e.clientY : 0) - rect.top
      const ratio = Math.max(0, Math.min(1, y / rect.height))
      if (ratio < 0.33) {
        return DropPosition.BEFORE
      }
      if (ratio > 0.66) {
        return DropPosition.AFTER
      }
      if (draggingId === id) {
        return undefined
      }
      const parentId = ctx.tree.getNode(draggingId!)?.getParent()?.id
      if (parentId === id) {
        return undefined
      }
      return DropPosition.INSIDE
    }

    /**
     * 悬停：更新目标的悬停位置映射并刷新视图
     * @param id 目标节点 id
     * @param el 目标节点元素
     * @param e 拖拽/鼠标事件
     */
    const onDragOver = (id: string, el: HTMLElement, e: DragEvent | MouseEvent) => {
      const pos = computePosition(id, el, e)
      if (pos === undefined) {
        hoverPositions.delete(id)
      } else {
        hoverPositions.set(id, pos)
      }
      ctx.events.emit({ name: 'visibility', keys: ctx.tree.expandedKeys() })
    }

    /**
     * 离开目标：清理该目标的悬停位置并刷新视图
     * @param id 目标节点 id
     */
    const onDragLeave = (id: string) => {
      hoverPositions.delete(id)
      ctx.events.emit({ name: 'visibility', keys: ctx.tree.expandedKeys() })
    }

    /**
     * 执行移动：依据落点位置更新树结构，必要时写回父字段并派发事件
     * - INSIDE：成为子节点；可选自动展开目标
     * - BEFORE/AFTER：保持同父级，调整顺序
     * @param srcId 源节点 id
     * @param targetId 目标节点 id
     * @param position 落点位置
     */
    const drop = (srcId: string, targetId: string, position: DropPosition) => {
      const src = ctx.tree.getNode(srcId)
      const target = ctx.tree.getNode(targetId)
      if (!src || !target) {
        return
      }
      if (srcId === targetId) {
        return
      }
      const srcParentId = src.getParent()?.id

      if (position === DropPosition.INSIDE) {
        if (targetId === srcParentId) {
          return
        }
        if (autoUpdateParent) {
          ctx.tree.moveNode(srcId, targetId)
          Reflect.set(src.original, parentField, targetId)
          if (autoExpandOnDrop) {
            ctx.tree.expand(targetId)
          }
          ctx.events.emit({ name: 'visibility', keys: ctx.tree.expandedKeys() })
        }
        ctx.events.emit({ name: 'move', id: srcId, parentId: targetId, position })
        return
      }

      const parent = target.getParent()
      const parentId = parent?.id
      if (position === DropPosition.BEFORE) {
        if (autoUpdateParent) {
          ctx.tree.moveNode(srcId, parentId, targetId)
          Reflect.set(src.original, parentField, parentId)
          ctx.events.emit({ name: 'visibility', keys: ctx.tree.expandedKeys() })
        }
        ctx.events.emit({ name: 'move', id: srcId, parentId, position, beforeId: targetId })
        return
      }

      const rawSiblings = parentId ? ctx.tree.getNode(parentId)!.getChildren() : ctx.tree.items().filter(n => !n.getParent())
      const siblings = rawSiblings.filter(n => n.id !== srcId)
      const idx = siblings.findIndex(n => n.id === targetId)
      const afterSibling = idx >= 0 ? siblings[idx + 1]?.id : undefined
      if (autoUpdateParent) {
        ctx.tree.moveNode(srcId, parentId, afterSibling)
        Reflect.set(src.original, parentField, parentId)
        ctx.events.emit({ name: 'visibility', keys: ctx.tree.expandedKeys() })
      }
      ctx.events.emit({ name: 'move', id: srcId, parentId, position, beforeId: afterSibling })
    }

    /**
     * 完成拖拽：依据最后一次悬停位置执行移动并清理状态
     * @param targetId 释放时所处的目标节点 id
     */
    const onDrop = (targetId: string) => {
      if (!draggingId) {
        return
      }
      const pos = hoverPositions.get(targetId)
      if (pos === DropPosition.BEFORE) {
        drop(draggingId, targetId, DropPosition.BEFORE)
      } else if (pos === DropPosition.AFTER) {
        drop(draggingId, targetId, DropPosition.AFTER)
      } else if (pos === DropPosition.INSIDE) {
        drop(draggingId, targetId, DropPosition.INSIDE)
      }
      hoverPositions.clear()
      draggingId = undefined
      ctx.events.emit({ name: 'visibility', keys: ctx.tree.expandedKeys() })
    }

    /**
     * 绑定到节点的拖拽属性集，便于直接 v-bind
     */
    const dragProps = {
      draggable: true,
      onDragstart: (e: DragEvent) => {
        const el = e.currentTarget as HTMLElement
        const id = el?.dataset?.id
        if (id) {
          e.dataTransfer?.setData('text/plain', id)
          onDragStart(id)
        }
      },
      onDragover: (e: DragEvent) => {
        e.preventDefault()
        const el = e.currentTarget as HTMLElement
        const id = el?.dataset?.id
        if (id) {
          onDragOver(id, el, e)
        }
      },
      onDragleave: (e: DragEvent) => {
        const el = e.currentTarget as HTMLElement
        const id = el?.dataset?.id
        if (id) {
          onDragLeave(id)
        }
      },
      onDrop: (e: DragEvent) => {
        e.preventDefault()
        const el = e.currentTarget as HTMLElement
        const id = el?.dataset?.id
        if (id) {
          onDrop(id)
        }
      },
    }

    return {
      // 公开 API：直接编程操作拖拽移动
      drop,
      // 事件处理：用于绑定到节点的 DOM 上
      onDragStart,
      onDragOver,
      onDragLeave,
      onDrop,
      // 状态与查询：悬停位置与拖拽源
      hoverPositions,
      get draggingId() {
        return draggingId
      },
      // 通用 DOM 绑定集合
      dragProps,
    }
  },
  /**
   * 为节点扩展拖拽相关方法
   * - getDropPosition：查询当前节点的悬停位置
   * - isDragging：查询是否为当前拖拽源
   */
  extendNode(node, ctx) {
    node.getDropPosition = () => ctx.tree.hoverPositions.get(node.id)
    node.isDragging = () => ctx.tree.draggingId === node.id
  },
}

export default dnd
