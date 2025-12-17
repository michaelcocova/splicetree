import type { SpliceTreePlugin, SpliceTreePluginContext } from '@splicetree/core'
import '@splicetree/core'

declare module '@splicetree/core' {
  export interface SpliceTreeConfiguration {
    checkable?: {
      defaultChecked?: string[]
      triggerByClick?: boolean
    }
  }
  export interface SpliceTreeEventPayloadMap {
    'input:node-click': {
      nodeId: string
      modifiers: {
        shift: boolean
        ctrl: boolean
        meta: boolean
        alt: boolean
      }
    }
  }

  /**
   * 节点扩展（Checkable）
   * - isChecked：是否已勾选
   * - isIndeterminate：是否半选
   * - toggleCheck：切换或显式设置勾选状态
   */
  interface SpliceTreeNode {
    /**
     * 当前节点是否已勾选
     */
    isChecked: () => boolean
    /**
     * 当前节点是否为半选状态
     */
    isIndeterminate: () => boolean
    /**
     * 切换或显式设置当前节点的勾选状态
     * @param checked 不传表示切换；true/false 表示显式设置
     */
    toggleCheck: (checked?: boolean) => void
  }

  /**
   * 事件扩展（Checkable）
   * - checked：勾选集合变化时派发
   */
  interface SpliceTreeEventPayloadMap {
    /**
     * 勾选集合变化事件负载
     * @property keys 当前所有已勾选节点的 id 列表
     */
    checked: { keys: string[] }
  }

  /**
   * 实例扩展（Checkable）
   * - checkedKeys/indeterminateKeys：当前勾选/半选集合
   * - isChecked/isIndeterminate：查询节点状态
   * - check/uncheck/toggleCheck：操作勾选状态
   */
  interface SpliceTreeInstance {
    /**
     * 已勾选的节点 id 集合
     */
    checkedKeys: Set<string>
    /**
     * 半选的节点 id 集合
     */
    indeterminateKeys: Set<string>
    /**
     * 查询指定节点是否已勾选
     */
    isChecked: (id: string) => boolean
    /**
     * 查询指定节点是否为半选状态
     */
    isIndeterminate: (id: string) => boolean
    /**
     * 勾选指定节点
     */
    check: (id: string) => void
    /**
     * 取消勾选指定节点
     */
    uncheck: (id: string) => void
    /**
     * 切换指定节点的勾选状态
     */
    toggleCheck: (id: string) => void
  }
}

/**
 * 设置某节点的勾选状态并维护集合
 * @param id 节点 id
 * @param state 目标状态（checked/unchecked/indeterminate）
 * @param checked 已勾选集合
 * @param indeterminate 半选集合
 */
function setChecked(
  id: string,
  state: 'checked' | 'unchecked' | 'indeterminate',
  checked: Set<string>,
  indeterminate: Set<string>,
) {
  if (state === 'checked') {
    checked.add(id)
    indeterminate.delete(id)
  } else if (state === 'unchecked') {
    checked.delete(id)
    indeterminate.delete(id)
  } else {
    checked.delete(id)
    indeterminate.add(id)
  }
}

export const checkable: SpliceTreePlugin = {
  name: 'checkable',

  /**
   * 勾选/半选插件：支持向下级联与向上计算半选
   */
  setup(ctx: SpliceTreePluginContext) {
    const cfg = (ctx.options?.configuration?.checkable ?? {}) as {
      defaultChecked?: string[]
      triggerByClick?: boolean
    }
    const { defaultChecked = [] } = cfg

    const checkedKeys = new Set<string>(defaultChecked)
    const indeterminateKeys = new Set<string>()

    const isChecked = (id: string) => checkedKeys.has(id)
    const isIndeterminate = (id: string) => indeterminateKeys.has(id)

    /**
     * 向下遍历所有子节点并执行回调
     * @param id 起始父节点 id
     * @param visit 对每个子节点执行的回调
     */
    const descend = (id: string, visit: (nid: string) => void) => {
      const n = ctx.tree.getNode(id)
      if (!n) {
        return
      }
      for (const c of n.getChildren()) {
        visit(c.id)
        descend(c.id, visit)
      }
    }

    /**
     * 自底向上更新祖先节点的勾选/半选状态
     * - 所有子节点全勾选 → 祖先设为勾选
     * - 所有子节点全未勾选 → 祖先设为未勾选
     * - 否则 → 祖先设为半选
     * 同步派发 visibility 与 checked 事件
     * @param id 起始子节点 id
     */
    const updateAncestors = (id: string) => {
      let cur = ctx.tree.getNode(id)?.getParent()
      while (cur) {
        const children = cur.getChildren()
        const allChecked = children.every(ch => checkedKeys.has(ch.id))
        const noneChecked = children.every(ch => !checkedKeys.has(ch.id) && !indeterminateKeys.has(ch.id))
        if (allChecked) {
          setChecked(cur.id, 'checked', checkedKeys, indeterminateKeys)
        } else if (noneChecked) {
          setChecked(cur.id, 'unchecked', checkedKeys, indeterminateKeys)
        } else {
          setChecked(cur.id, 'indeterminate', checkedKeys, indeterminateKeys)
        }
        cur = cur.getParent()
      }

      ctx.events.emit({ name: 'visibility', keys: ctx.tree.expandedKeys() })
      ctx.events.emit({ name: 'checked', keys: Array.from(checkedKeys) })
    }

    /**
     * 勾选指定节点，并向下级联勾选所有子节点
     * @param id 节点 id
     */
    const check = (id: string) => {
      setChecked(id, 'checked', checkedKeys, indeterminateKeys)
      descend(id, nid => setChecked(nid, 'checked', checkedKeys, indeterminateKeys))
      updateAncestors(id)
    }

    /**
     * 取消勾选指定节点，并向下级联取消所有子节点
     * @param id 节点 id
     */
    const uncheck = (id: string) => {
      setChecked(id, 'unchecked', checkedKeys, indeterminateKeys)
      descend(id, nid => setChecked(nid, 'unchecked', checkedKeys, indeterminateKeys))
      updateAncestors(id)
    }

    /**
     * 切换指定节点的勾选状态
     * @param id 节点 id
     */
    const toggleCheck = (id: string) => {
      if (isChecked(id)) {
        uncheck(id)
      } else {
        check(id)
      }
      updateAncestors(id)
    }

    for (const id of defaultChecked) {
      check(id)
    }
    ctx.events.emit({ name: 'visibility', keys: ctx.tree.expandedKeys() })
    ctx.events.emit({ name: 'checked', keys: Array.from(checkedKeys) })

    const triggerByClick = !!cfg?.triggerByClick
    if (triggerByClick) {
      ctx.events.on('input:node-click', (p) => {
        const nodeId = (p as any).nodeId as string
        if (!ctx.tree.getNode(nodeId)) {
          return
        }
        toggleCheck(nodeId)
      })
    }

    return {
      checkedKeys,
      indeterminateKeys,
      isChecked,
      isIndeterminate,
      check,
      uncheck,
      toggleCheck,
    }
  },

  /**
   * 为节点扩展勾选相关方法
   */
  extendNode(node, ctx) {
    node.isChecked = () => ctx.tree.isChecked(node.id)
    node.isIndeterminate = () => ctx.tree.isIndeterminate(node.id)
    node.toggleCheck = (checked?: boolean) => {
      if (checked === undefined) {
        ctx.tree.toggleCheck(node.id)
      } else if (checked) {
        ctx.tree.check(node.id)
      } else {
        ctx.tree.uncheck(node.id)
      }
    }
  },
}

export default checkable
