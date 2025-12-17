import type { SpliceTreePlugin, SpliceTreePluginContext } from '@splicetree/core'
import '@splicetree/core'

interface KeyboardKeymap {
  up?: string
  down?: string
  left?: string
  right?: string
}
type KeyboardTargetType = HTMLElement | string | null | undefined
type KeyboardTarget = KeyboardTargetType | (() => KeyboardTargetType)

interface Modifiers {
  shift: boolean
  ctrl: boolean
  meta: boolean
  alt: boolean
}

declare module '@splicetree/core' {
  export interface SpliceTreeConfiguration {
    keyboard?: {
      autoListen?: boolean
      target?: KeyboardTarget
      keymap?: KeyboardKeymap
    }
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
    emitNodeClick: (nodeId: string, e: MouseEvent) => void
  }
}
function resolveTarget(target?: KeyboardTarget): HTMLElement | null {
  if (typeof target === 'string') {
    return document.querySelector(target)
  }
  if (target instanceof HTMLElement) {
    return target
  }
  if (typeof target === 'function') {
    return resolveTarget(target())
  }
  return null
}

function getModifiers(e: KeyboardEvent | MouseEvent) {
  return {
    shift: e.shiftKey,
    ctrl: e.ctrlKey,
    meta: e.metaKey,
    alt: e.altKey,
  }
}

export const keyboardPlugin: SpliceTreePlugin = {
  name: 'keyboard',

  setup(ctx: SpliceTreePluginContext) {
    const config = (ctx.options?.configuration?.keyboard ?? {}) as {
      autoListen?: boolean
      target?: KeyboardTarget
      keymap?: KeyboardKeymap
    }
    const autoListenKeyboard = config.autoListen ?? true
    const keyboardTarget = config.target
    const keymap = config.keymap

    const keys = {
      up: keymap?.up ?? 'ArrowUp',
      down: keymap?.down ?? 'ArrowDown',
      left: keymap?.left ?? 'ArrowLeft',
      right: keymap?.right ?? 'ArrowRight',
    }

    const emitDirection = (direction: 'up' | 'down' | 'left' | 'right', e: KeyboardEvent) => {
      ctx.events.emit({
        name: 'input:direction',
        direction,
        modifiers: getModifiers(e),
      })
    }

    const onKeydown = (e: KeyboardEvent) => {
      switch (e.key) {
        case keys.up:
          e.preventDefault()
          emitDirection('up', e)
          break
        case keys.down:
          e.preventDefault()
          emitDirection('down', e)
          break
        case keys.left:
          e.preventDefault()
          emitDirection('left', e)
          break
        case keys.right:
          e.preventDefault()
          emitDirection('right', e)
          break
      }
    }

    const emitNodeClick = (nodeId: string, e: MouseEvent) => {
      ctx.events.emit({
        name: 'input:node-click',
        nodeId,
        modifiers: getModifiers(e),
      })
    }

    if (autoListenKeyboard && typeof document !== 'undefined') {
      setTimeout(() => {
        const root = resolveTarget(keyboardTarget)
        if (!root) {
          return
        }

        root.setAttribute('tabindex', '0')

        const handler = (e: KeyboardEvent) => {
          const active = document.activeElement
          if (root.contains(active)) {
            onKeydown(e)
          }
        }

        document.addEventListener('keydown', handler)
      })
    }

    return {
      emitNodeClick,
    }
  },
}

export default keyboardPlugin
