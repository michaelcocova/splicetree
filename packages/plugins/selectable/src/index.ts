import type { SpliceTreeNode, SpliceTreePlugin, SpliceTreePluginContext } from '@splicetree/core'
import '@splicetree/core'

interface Modifiers {
  shift: boolean
  ctrl: boolean
  meta: boolean
  alt: boolean
}

export interface SelectableOptions {
  multiple?: boolean
  defaultSelected?: string[]
}

declare module '@splicetree/core' {
  export interface SpliceTreeConfiguration {
    selectable?: SelectableOptions
  }
  export interface SpliceTreeEventPayloadMap {
    'input:direction': {
      direction: 'up' | 'down' | 'left' | 'right'
      modifiers: Modifiers
    }
    'input:node-click': {
      nodeId: string
      modifiers: Modifiers
    }
  }
  export interface SpliceTreeInstance {
    selectedKeys: Set<string>
    lastSelectedKey?: string
    activeId?: string
    isSelected: (id: string) => boolean
    toggleSelect: (id: string, selected?: boolean) => void
  }
  export interface SpliceTreeNode {
    isSelected: () => boolean
    toggleSelect: (selected?: boolean) => void
  }
}

function getOptions(ctx: SpliceTreePluginContext): Required<SelectableOptions> {
  const o = ctx.options?.configuration?.selectable
  return {
    multiple: o?.multiple ?? false,
    defaultSelected: o?.defaultSelected ?? [],
  }
}

export const selectablePlugin: SpliceTreePlugin = {
  name: 'selectable',
  setup(ctx: SpliceTreePluginContext) {
    const { multiple, defaultSelected } = getOptions(ctx)
    const selectedKeys = new Set<string>(defaultSelected)
    let lastSelectedKey: string | undefined

    const isSelected = (id: string) => selectedKeys.has(id)
    const toggleSelect = (id: string, selected?: boolean) => {
      const has = selectedKeys.has(id)
      const next = selected ?? !has
      if (next) {
        if (!multiple) {
          selectedKeys.clear()
        }
        selectedKeys.add(id)
      } else {
        selectedKeys.delete(id)
      }
      lastSelectedKey = id
      ctx.tree.activeId = id
      ctx.events.emit({ name: 'visibility', keys: ctx.tree.expandedKeys() })
    }

    const selectRange = (fromId: string, toId: string) => {
      const items: SpliceTreeNode[] = ctx.tree.items()
      const a = items.findIndex((n: SpliceTreeNode) => n.id === fromId)
      const b = items.findIndex((n: SpliceTreeNode) => n.id === toId)
      if (a < 0 || b < 0) {
        return
      }
      const [s, e] = a < b ? [a, b] : [b, a]
      for (let i = s; i <= e; i++) {
        selectedKeys.add((items[i] as SpliceTreeNode).id)
      }
      lastSelectedKey = toId
      ctx.tree.activeId = toId
      ctx.events.emit({ name: 'visibility', keys: ctx.tree.expandedKeys() })
    }

    ctx.events.on('input:node-click', (p: any) => {
      const nodeId = p.nodeId as string
      const modifiers = p.modifiers as Modifiers
      if (!ctx.tree.getNode(nodeId)) {
        return
      }
      const shift = modifiers.shift
      const multiToggle = multiple && (modifiers.ctrl || modifiers.meta)
      if (shift && lastSelectedKey) {
        selectRange(lastSelectedKey, nodeId)
      } else if (multiToggle) {
        toggleSelect(nodeId)
      } else {
        toggleSelect(nodeId, true)
      }
    })

    ctx.events.on('input:direction', (p: any) => {
      const direction = p.direction as 'up' | 'down' | 'left' | 'right'
      const modifiers = p.modifiers as Modifiers
      const items: SpliceTreeNode[] = ctx.tree.items()
      const activeId = ctx.tree.activeId
      if (!activeId) {
        return
      }
      const idx = items.findIndex((n: SpliceTreeNode) => n.id === activeId)
      if (idx < 0) {
        return
      }
      if (direction === 'left' || direction === 'right') {
        const node = ctx.tree.getNode(activeId) as SpliceTreeNode | undefined
        if (!node) {
          return
        }
        if (direction === 'left') {
          if (node.isExpanded()) {
            node.toggleExpand(false)
          } else {
            const parent = node.getParent() as SpliceTreeNode | undefined
            if (parent) {
              ctx.tree.activeId = parent.id
              if (!(modifiers.ctrl || modifiers.meta)) {
                toggleSelect(parent.id, true)
              }
            }
          }
        } else if (direction === 'right') {
          if (node.hasChildren()) {
            node.toggleExpand(true)
            if (!(modifiers.ctrl || modifiers.meta)) {
              toggleSelect(node.id, true)
            }
          }
        }
        return
      }
      let nextIdx = idx
      if (direction === 'up') {
        nextIdx = Math.max(0, idx - 1)
      } else if (direction === 'down') {
        nextIdx = Math.min(items.length - 1, idx + 1)
      }
      const nextId = (items[nextIdx] as SpliceTreeNode | undefined)?.id
      if (!nextId) {
        return
      }
      ctx.tree.activeId = nextId
      if (modifiers.shift && multiple && lastSelectedKey) {
        selectRange(lastSelectedKey, nextId)
      } else if (!(modifiers.ctrl || modifiers.meta)) {
        toggleSelect(nextId, true)
      }
    })

    for (const id of defaultSelected) {
      selectedKeys.add(id)
      lastSelectedKey = id
    }

    return {
      selectedKeys,
      lastSelectedKey,
      isSelected,
      toggleSelect,
    }
  },
  extendNode(node: SpliceTreeNode, ctx: SpliceTreePluginContext) {
    node.isSelected = () => ctx.tree.isSelected(node.id)
    node.toggleSelect = (selected?: boolean) => ctx.tree.toggleSelect(node.id, selected)
  },
}

export default selectablePlugin
