import type { SpliceTreeData, SpliceTreeNode } from '../../src/types'

export function initDefaultExpansion<T extends SpliceTreeData>(
  map: Map<string, SpliceTreeNode<T>>,
  expanded: Set<string>,
  def: true | string[] | undefined,
  lvl: number | 'deepest' | undefined,
  autoExpandParent?: boolean,
) {
  const expandAll = () => {
    for (const id of map.keys()) {
      expanded.add(id)
    }
  }
  const expandByLevel = (lv: number) => {
    for (const n of map.values()) {
      if (n.level < lv) {
        expanded.add(n.id)
      }
    }
  }
  if (def === true) {
    expandAll()
    return
  }
  if (Array.isArray(def)) {
    for (const id of def) {
      expanded.add(id)
      if (autoExpandParent) {
        let cur = map.get(id)
        while (cur) {
          const p = cur.getParent()
          if (!p) {
            break
          }
          expanded.add(p.id)
          cur = p
        }
      }
    }
    if (lvl === 'deepest') {
      expandAll()
      return
    }
    if (typeof lvl === 'number' && Number.isFinite(lvl) && lvl > 0) {
      expandByLevel(lvl)
    }
    return
  }
  if (lvl === 'deepest') {
    expandAll()
    return
  }
  if (typeof lvl === 'number' && Number.isFinite(lvl) && lvl > 0) {
    expandByLevel(lvl)
  }
}
