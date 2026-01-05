import type { SpliceTreePlugin, SpliceTreePluginContext } from '@splicetree/core'
import type { DndNode, DndOptions, DragBehavior } from './types'
import { computePosition } from './position'
import { DropPosition } from './types'
import '@splicetree/core'

declare module '@splicetree/core' {
  interface SpliceTreeConfiguration {
    dnd?: DndOptions
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
    /** 当前拖拽源节点 id */
    draggingId?: string
    /** 目标节点的悬停位置映射 */
    hoverPositions: Map<string, DropPosition>
    /** DOM 事件：开始拖拽 */
    onDragStart: (id: string) => void
    /** DOM 事件：悬停计算并更新位置 */
    onDragOver: (id: string, el: HTMLElement, e: DragEvent | MouseEvent) => void
    /** DOM 事件：离开目标，清理悬停状态 */
    onDragLeave: (id: string) => void
    /** DOM 事件：在目标上释放后执行移动 */
    onDrop: (targetId: string) => void
    /** 可直接 v-bind 到节点的拖拽属性集合（逐节点） */
    dragProps: (id: string, behavior?: DragBehavior) => {
      /** 是否可拖拽 */
      draggable: boolean
      /** 原生拖拽开始事件处理 */
      onDragstart: (e: DragEvent) => void
      /** 原生拖拽悬停事件处理 */
      onDragover: (e: DragEvent) => void
      /** 原生拖拽离开事件处理 */
      onDragleave: (e: DragEvent) => void
      /** 原生拖拽释放事件处理 */
      onDrop: (e: DragEvent) => void
    }
    /** 统一占位样式绑定对象 */
    ghostStyle: (opts?: { padding?: boolean, margin?: boolean }) => Record<string, any>
  }

  /**
   * 节点扩展（DnD）
   */
  interface SpliceTreeNode {
    /** 获取当前节点的悬停落点位置 */
    getDropPosition: () => (DropPosition | undefined)
    /** 当前节点是否为拖拽源 */
    isDragging: () => boolean

    /** 当前节点是否被禁用  */
    isDisabled?: () => boolean
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
    const opts = (ctx.options?.configuration?.dnd ?? {}) as DndOptions
    const {
      autoExpandOnDrop = true,
      autoUpdateParent = true,
      readonly = false,
    } = opts
    const parentField = ctx.tree.options?.configuration?.parentField ?? 'parent'
    let draggingId: string | undefined
    const hoverPositions = new Map<string, DropPosition>()
    let ghostTop = 0
    let ghostHeight = 0
    let ghostPos: DropPosition | undefined
    let ghostInsetLeft = 0
    let ghostInsetRight = 0
    let ghostMarginLeft = 0
    let ghostMarginRight = 0
    const behaviors = new Map<string, DragBehavior>()

    const isDisabledById = (_id: string | undefined): boolean => !!readonly

    const getDraggedNodeIds = (primaryId: string): string[] => {
      const tree = ctx.tree as any
      if (tree.selectedKeys && tree.selectedKeys.has(primaryId)) {
        const selected = new Set(tree.selectedKeys as Set<string>)
        const validIds = Array.from(selected).filter((id) => {
          if (isDisabledById(id)) {
            return false
          }
          const ov = behaviors.get(id as string)
          if (ov?.draggable === false) {
            return false
          }
          return true
        })

        const allItems = ctx.tree.items()
        const sorted = allItems.filter(node => validIds.includes(node.id)).map(n => n.id)
        return sorted
      }
      return [primaryId]
    }

    /**
     * 开始拖拽：记录拖拽源并通知视图刷新（用于高亮拖拽源）
     * @param id 源节点 id
     */
    const onDragStart = (id: string) => {
      if (isDisabledById(id)) {
        return
      }
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
    // 使用独立位置计算模块

    /**
     * 悬停：更新目标的悬停位置映射并刷新视图
     * @param id 目标节点 id
     * @param el 目标节点元素
     * @param e 拖拽/鼠标事件
     */
    const onDragOver = (id: string, el: HTMLElement, e: DragEvent | MouseEvent) => {
      // 如果没有拖拽源，直接返回
      if (!draggingId) {
        return
      }

      const draggedIds = getDraggedNodeIds(draggingId)
      const targetNode = ctx.tree.getNode(id)

      // 1. 目标节点不能是拖拽节点之一
      if (draggedIds.includes(id)) {
        hoverPositions.delete(id)
        ctx.events.emit({ name: 'visibility', keys: ctx.tree.expandedKeys() })
        return
      }

      // 2. 目标节点不能是任何拖拽节点的后代（防止循环）
      let ancestor = targetNode?.getParent()
      while (ancestor) {
        if (draggedIds.includes(ancestor.id)) {
          hoverPositions.delete(id)
          ctx.events.emit({ name: 'visibility', keys: ctx.tree.expandedKeys() })
          return
        }
        ancestor = ancestor.getParent()
      }

      // 这里的 src 参数传 undefined，因为我们已经手动检查了 draggedIds
      const pos = computePosition(id, el, e, undefined)

      if (!targetNode || pos === undefined) {
        hoverPositions.delete(id)
        ctx.events.emit({ name: 'visibility', keys: ctx.tree.expandedKeys() })
        return
      }

      // 3. 检查所有拖拽节点的行为约束
      if (pos === DropPosition.INSIDE) {
        // 如果目标已经是某个拖拽节点的父节点，则 INSIDE 无意义（或者是 no-op）
        // computePosition 原逻辑是 parentId === targetId 返回 undefined
        const isParentOfAny = draggedIds.some((dId) => {
          const node = ctx.tree.getNode(dId)
          return node?.getParent()?.id === id
        })
        if (isParentOfAny) {
          hoverPositions.delete(id)
          ctx.events.emit({ name: 'visibility', keys: ctx.tree.expandedKeys() })
          return
        }

        const allNestable = draggedIds.every((dId) => {
          const ov = behaviors.get(dId)
          return ov?.nestable !== false
        })
        if (!allNestable) {
          hoverPositions.delete(id)
          ctx.events.emit({ name: 'visibility', keys: ctx.tree.expandedKeys() })
          return
        }
      } else {
        const allSortable = draggedIds.every((dId) => {
          const ov = behaviors.get(dId)
          return ov?.sortable !== false
        })
        if (!allSortable) {
          hoverPositions.delete(id)
          ctx.events.emit({ name: 'visibility', keys: ctx.tree.expandedKeys() })
          return
        }
      }

      hoverPositions.set(id, pos)
      ghostTop = el.offsetTop
      ghostHeight = el.offsetHeight
      ghostPos = pos
      const parent = el.parentElement
      if (parent) {
        const styles = getComputedStyle(parent)
        ghostInsetLeft = Number.parseFloat(styles.paddingLeft || '0')
        ghostInsetRight = Number.parseFloat(styles.paddingRight || '0')
        ghostMarginLeft = Number.parseFloat(styles.marginLeft || '0')
        ghostMarginRight = Number.parseFloat(styles.marginRight || '0')
      } else {
        ghostInsetLeft = 0
        ghostInsetRight = 0
        ghostMarginLeft = 0
        ghostMarginRight = 0
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
      if (readonly) {
        return
      }
      const ov = behaviors.get(src.id)
      if (ov?.draggable === false) {
        return
      }
      if (position === DropPosition.INSIDE && ov?.nestable === false) {
        return
      }
      if (position !== DropPosition.INSIDE && ov?.sortable === false) {
        return
      }
      // 基础非法：不能拖到自身或其父
      if (srcId === targetId) {
        return
      }
      const srcParentId = src.getParent()?.id
      if (position === DropPosition.INSIDE && srcParentId === targetId) {
        return
      }

      if (position === DropPosition.INSIDE) {
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
      if (pos === undefined) {
        hoverPositions.clear()
        draggingId = undefined
        ctx.events.emit({ name: 'visibility', keys: ctx.tree.expandedKeys() })
        return
      }

      const draggedIds = getDraggedNodeIds(draggingId)
      let idsToProcess = draggedIds
      if (pos === DropPosition.AFTER) {
        idsToProcess = [...draggedIds].reverse()
      }

      for (const id of idsToProcess) {
        drop(id, targetId, pos)
      }

      hoverPositions.clear()
      draggingId = undefined
      ctx.events.emit({ name: 'visibility', keys: ctx.tree.expandedKeys() })
    }

    /**
     * 绑定到节点的拖拽属性集，便于直接 v-bind
     * @param id 节点 ID
     */
    const dragProps = (id: string, behavior?: DragBehavior) => {
      if (behavior) {
        behaviors.set(id, behavior)
      }
      const canDrag = behavior?.draggable === false ? false : !isDisabledById(id)
      return {
        draggable: canDrag,
        onDragstart: (e: DragEvent) => {
          if (canDrag) {
            e.dataTransfer?.setData('text/plain', id)
            onDragStart(id)
          }
        },
        onDragover: (e: DragEvent) => {
          e.preventDefault()
          const el = e.currentTarget as HTMLElement
          onDragOver(id, el, e)
        },
        onDragleave: (_e: DragEvent) => {
          onDragLeave(id)
        },
        onDrop: (e: DragEvent) => {
          e.preventDefault()
          onDrop(id)
        },
      }
    }

    const ghostStyle = (opts?: { padding?: boolean, margin?: boolean }) => {
      if (!draggingId || ghostPos === undefined) {
        return { style: { display: 'none' } }
      }
      const usePadding = opts?.padding ?? true
      const useMargin = opts?.margin ?? true
      const leftInset = usePadding ? ghostInsetLeft : 0
      const rightInset = usePadding ? ghostInsetRight : 0
      const leftMargin = useMargin ? ghostMarginLeft : 0
      const rightMargin = useMargin ? ghostMarginRight : 0
      const left = `${leftInset + leftMargin}px`
      const right = `${rightInset + rightMargin}px`
      const base: Record<string, any> = { position: 'absolute', left, right, pointerEvents: 'none' }
      if (ghostPos === DropPosition.BEFORE) {
        return { 'style': { ...base, top: `${ghostTop}px`, height: '2px', background: 'var(--vp-code-color)', borderRadius: '2px' }, 'data-drop-position': -1 }
      }
      if (ghostPos === DropPosition.AFTER) {
        return { 'style': { ...base, top: `${ghostTop + ghostHeight}px`, height: '2px', background: 'var(--vp-code-color)', borderRadius: '2px' }, 'data-drop-position': 1 }
      }
      return { 'style': { ...base, top: `${ghostTop}px`, height: `${ghostHeight}px`, background: 'var(--vp-code-color)', opacity: 0.15, borderRadius: '4px' }, 'data-drop-position': 0 }
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
      ghostStyle,
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
    const opts = (ctx.options?.configuration?.dnd ?? {}) as DndOptions
    node.isDisabled = () => !!opts.readonly
  },
}

export default dnd
export { DropPosition }
export type { DndNode, DndOptions }
