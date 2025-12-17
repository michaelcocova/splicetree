import type { SpliceTreePlugin, SpliceTreePluginContext } from '@splicetree/core'
import '@splicetree/core'

interface Modifiers {
  shift: boolean
  ctrl: boolean
  meta: boolean
  alt: boolean
}

declare module '@splicetree/core' {
  export interface SpliceTreeEventPayloadMap {
    'input:node-click': {
      nodeId: string
      modifiers: Modifiers
    }
  }
  export interface SpliceTreeInstance {
    onClick: (nodeId: string, e: MouseEvent) => void
  }
}

function getModifiers(e: MouseEvent) {
  return {
    shift: e.shiftKey,
    ctrl: e.ctrlKey,
    meta: e.metaKey,
    alt: e.altKey,
  }
}

export const pointerPlugin: SpliceTreePlugin = {
  name: 'pointer',
  setup(ctx: SpliceTreePluginContext) {
    const onClick = (nodeId: string, e: MouseEvent) => {
      ctx.events.emit({
        name: 'input:node-click',
        nodeId,
        modifiers: getModifiers(e),
      })
    }
    return { onClick }
  },
}

export default pointerPlugin
