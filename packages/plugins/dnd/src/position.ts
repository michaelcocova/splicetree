import type { SpliceTreeNode } from '@splicetree/core'
import { DropPosition } from './types'

export function computePosition(targetId: string, el: HTMLElement, e: DragEvent | MouseEvent, src?: SpliceTreeNode<any>): DropPosition | undefined {
  const rect = el.getBoundingClientRect()
  const y = ('clientY' in e ? e.clientY : 0) - rect.top
  const ratio = Math.max(0, Math.min(1, rect.height ? y / rect.height : 0))
  if (ratio < 0.33) {
    return DropPosition.BEFORE
  }
  if (ratio > 0.66) {
    return DropPosition.AFTER
  }
  if (src?.id === targetId) {
    return undefined
  }
  const parentId = src?.getParent()?.id
  if (parentId === targetId) {
    return undefined
  }
  return DropPosition.INSIDE
}
