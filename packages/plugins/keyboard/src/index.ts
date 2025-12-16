import type { SpliceTreePlugin, SpliceTreePluginContext } from '@splicetree/core'
import '@splicetree/core'

type KeyboardTargetType = HTMLElement | string | null | undefined
type KeyboardTarget = KeyboardTargetType | (() => KeyboardTargetType)
declare module '@splicetree/core' {
  export interface UseSpliceTreeOptions {
    /**
     * 默认激活节点 ID
     * @default undefined
     */
    defaultActive?: string
    /**
     * 是否自动监听键盘事件
     * 开启后，插件会自动监听键盘事件
     * 关闭后，需要手动调用 `listenKeyboard` 方法监听键盘事件
     * @default true
     */
    autoListenKeyboard?: boolean
    /**
     * 键盘导航快捷键
     * @default { expand: 'ArrowRight', collapse: 'ArrowLeft', next: 'ArrowDown', prev: 'ArrowUp' }
     */
    keymap?: {
      expand?: string
      collapse?: string
      next?: string
      prev?: string
    }
    /**
     * 键盘导航目标元素
     * @default document.body
     */
    keyboardTarget?: KeyboardTarget
  }

  /**
   * 实例扩展（Keyboard）
   * - activeId：当前激活的节点 id
   * - toggleActive：切换或显式设置某节点的激活态
   */
  interface SpliceTreeInstance {
    /**
     * 当前激活的节点 id（未激活时为 undefined）
     */
    activeId?: string
    /**
     * 切换或显式设置某节点的激活态
     * @param id 节点 id
     * @param active 不传表示切换；true/false 表示显式设置
     */
    toggleActive: (id: string, active?: boolean) => void
  }

  /**
   * 节点扩展（Keyboard）
   * - isActive：当前节点是否激活
   * - toggleActive：切换当前节点的激活态
   */
  interface SpliceTreeNode {
    /**
     * 当前节点是否为激活态
     */
    isActive: () => boolean
    /**
     * 切换当前节点的激活态
     * @param active 不传表示切换；true/false 表示显式设置
     */
    toggleActive: (active?: boolean) => void
  }
}

/**
 * 解析键盘监听目标元素
 * 支持传入选择器、元素实例或函数
 */
function resolveKeyboardTarget(targe?: KeyboardTarget): HTMLElement | null {
  if (typeof targe === 'string') {
    return document.querySelector(targe)
  }
  if (targe instanceof HTMLElement) {
    return targe
  }
  if (typeof targe === 'function') {
    return resolveKeyboardTarget(targe?.())
  }
  return null
}
export const keyboardNavigation: SpliceTreePlugin = {
  name: 'keyboard',
  /**
   * 键盘导航插件
   * - 提供 activeId 概念与切换 API
   * - 支持上下移动、展开/收起与进入子级
   * - 自动或自定义监听目标元素的键盘事件
   */
  setup(ctx: SpliceTreePluginContext) {
    const { defaultActive, autoListenKeyboard = true, keyboardTarget, keymap } = ctx.options
    let activeId: string | undefined = defaultActive

    Object.defineProperty(ctx.tree, 'activeId', {
      get() {
        return activeId
      },
      configurable: true,
      enumerable: true,
    })

    /**
     * 切换或设置激活节点
     * 更新后派发 visibility 事件以刷新视图
     * @param id 节点 id
     * @param active 不传表示切换；true/false 表示显式设置
     */
    const toggleActive = (id: string, active?: boolean) => {
      if (active === undefined) {
        activeId = activeId === id ? undefined : id
      } else {
        if (active)
          activeId = id
        else if (activeId === id)
          activeId = undefined
      }
      ctx.events.emit({ name: 'visibility', keys: ctx.tree.expandedKeys() })
    }

    /**
     * 按可见序列移动激活项
     * @param delta 移动步长（-1 上一个，1 下一个）
     */
    const moveActive = (delta: number) => {
      const items = ctx.tree.items()
      if (!items.length) {
        return
      }
      const idx = activeId ? items.findIndex(n => n.id === activeId) : -1
      const next = Math.max(0, Math.min(items.length - 1, (idx < 0 ? 0 : idx + delta)))
      activeId = items[next]?.id
      ctx.events.emit({ name: 'visibility', keys: ctx.tree.expandedKeys() })
    }

    /**
     * 激活上一个可见节点
     */
    const keyUp = () => moveActive(-1)
    /**
     * 激活下一个可见节点
     */
    const keyDown = () => moveActive(1)
    /**
     * 左方向键：优先收起；否则激活父节点
     */
    const keyLeft = () => {
      if (!activeId) {
        return
      }
      const node = ctx.tree.getNode(activeId)
      if (!node) {
        return
      }
      if (ctx.tree.isExpanded(node.id)) {
        ctx.tree.collapse(node.id)
      } else if (node.getParent()?.id) {
        activeId = node.getParent()!.id
      }
      ctx.events.emit({ name: 'visibility', keys: ctx.tree.expandedKeys() })
    }
    /**
     * 右方向键：优先展开；已展开则进入第一个子节点
     */
    const keyRight = () => {
      if (!activeId) {
        return
      }
      const node = ctx.tree.getNode(activeId)
      if (!node) {
        return
      }
      if (!ctx.tree.isExpanded(node.id)) {
        ctx.tree.expand(node.id)
      } else {
        const first = node.getChildren()[0]
        if (first) {
          activeId = first.id
        }
      }
      ctx.events.emit({ name: 'visibility', keys: ctx.tree.expandedKeys() })
    }
    /**
     * 键盘按下事件处理
     * - 根据 keymap 映射调用对应处理函数
     * - 自动阻止默认行为以避免滚动
     */
    const onKeydown = (e: KeyboardEvent) => {
      const kExpand = keymap?.expand ?? 'ArrowRight'
      const kCollapse = keymap?.collapse ?? 'ArrowLeft'
      const kNext = keymap?.next ?? 'ArrowDown'
      const kPrev = keymap?.prev ?? 'ArrowUp'
      const key = e.key
      if (key === kPrev) {
        e.preventDefault()
        keyUp()
        return
      }
      if (key === kNext) {
        e.preventDefault()
        keyDown()
        return
      }
      if (key === kCollapse) {
        e.preventDefault()
        keyLeft()
        return
      }
      if (key === kExpand) {
        e.preventDefault()
        keyRight()
      }
    }
    if (autoListenKeyboard && typeof document !== 'undefined') {
      setTimeout(() => {
        const root = resolveKeyboardTarget(keyboardTarget)
        if (root) {
          root.setAttribute('tabindex', '0')
          root?.focus?.()
        }
        const handler = (e: KeyboardEvent) => {
          const active = document.activeElement
          // 仅当 activeElement 在树容器内时触发
          if (!root || root.contains(active)) {
            onKeydown(e)
          }
        }
        document.addEventListener('keydown', handler)
      })
    }
    return { toggleActive }
  },
  /**
   * 为节点扩展激活态判断方法
   * - isActive：是否为当前激活项
   * - toggleActive：切换当前节点的激活态
   */
  extendNode(node, ctx) {
    node.isActive = () => ctx.tree?.activeId === node.id
    node.toggleActive = (active?: boolean) => {
      ctx.tree.toggleActive(node.id, active)
    }
  },
}

export default keyboardNavigation
