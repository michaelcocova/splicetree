import type { SpliceTreeData, SpliceTreeInstance, SpliceTreeNode } from '../../src/types'

/**
 * 以 DFS 方式计算当前可见节点序列
 * 仅在父节点展开时展开其子节点
 */
export function computeVisibleItems<T extends SpliceTreeData>(roots: SpliceTreeNode<T>[]) {
  const result: SpliceTreeNode<T>[] = []
  const walk = (node: SpliceTreeNode<T>) => {
    result.push(node)
    if (node.isExpanded() && node.hasChildren()) {
      for (const child of node.getChildren()) {
        walk(child as SpliceTreeNode<T>)
      }
    }
  }
  for (const root of roots) {
    walk(root)
  }
  return result
}

/**
 * 递归设置节点层级
 */
export function setLevelRecursively<T extends SpliceTreeData>(
  node: SpliceTreeNode<T>,
  childrenCache: Map<string, SpliceTreeNode<T>[]>,
  startLevel?: number,
) {
  node.level = startLevel ?? node.level
  for (const c of childrenCache.get(node.id) ?? []) {
    setLevelRecursively(c, childrenCache, (node.level ?? 0) + 1)
  }
}

/**
 * 追加与移动节点的上下文依赖
 */
export interface NodeContext<T extends SpliceTreeData> {
  map: Map<string, SpliceTreeNode<T>>
  parentCache: Map<string, SpliceTreeNode<T> | undefined>
  childrenCache: Map<string, SpliceTreeNode<T>[]>
  roots: SpliceTreeNode<T>[]
  expandedKeys: Set<string>
  keyField: string
  tree: SpliceTreeInstance<T>
  notify: () => void
}

/**
 * 追加子节点到指定父节点（或根）
 * 自动维护缓存与层级，并触发通知
 */
export function appendChildren<T extends SpliceTreeData>(
  ctx: NodeContext<T>,
  parentId: string | undefined,
  children: T[],
) {
  const parent = parentId ? ctx.map.get(parentId) : undefined
  for (const item of children) {
    const id = String(Reflect.get(item, ctx.keyField || 'id'))
    if (ctx.map.has(id)) {
      continue
    }
    const node: SpliceTreeNode<T> = {
      id,
      original: item,
      level: parent ? parent.level + 1 : 0,
      hasChildren: () => !!ctx.childrenCache.get(id)?.length,
      getParent: () => ctx.parentCache.get(id),
      getChildren: () => ctx.childrenCache.get(id) ?? [],
      isExpanded: () => ctx.expandedKeys.has(id),
      toggleExpand: (expand?: boolean) => {
        if (expand === undefined) {
          ctx.tree.toggleExpand(id)
        } else if (expand) {
          ctx.tree.expand(id)
        } else {
          ctx.tree.collapse(id)
        }
      },
    }
    ctx.map.set(id, node)
    ctx.childrenCache.set(id, [])
    ctx.parentCache.set(id, parent)
    if (parent) {
      (ctx.childrenCache.get(parent.id)!).push(node)
    } else {
      ctx.roots.push(node)
    }
  }
  if (parent) {
    setLevelRecursively(parent, ctx.childrenCache, parent.level)
  } else {
    ctx.roots.forEach(r => setLevelRecursively(r, ctx.childrenCache, 0))
  }
  ctx.notify()
}

/**
 * 移动节点到新父级，并支持在某个兄弟节点之前插入
 * 自动维护缓存与层级，并触发通知
 */
export function moveNode<T extends SpliceTreeData>(
  ctx: NodeContext<T>,
  id: string,
  newParentId: string | undefined,
  beforeId?: string,
) {
  const node = ctx.map.get(id)
  if (!node) {
    return
  }
  const oldParent = ctx.parentCache.get(id)
  const newParent = newParentId ? (ctx.map.get(newParentId)) : undefined
  if (oldParent) {
    const arr = (ctx.childrenCache.get(oldParent.id) ?? [])
    const idx = arr.findIndex(n => n.id === id)
    if (idx >= 0) {
      arr.splice(idx, 1)
    }
  } else {
    const idx = ctx.roots.findIndex(n => n.id === id)
    if (idx >= 0) {
      ctx.roots.splice(idx, 1)
    }
  }
  ctx.parentCache.set(id, newParent)
  node.level = newParent ? newParent.level + 1 : 0
  if (newParent) {
    const arr = (ctx.childrenCache.get(newParent.id) ?? [])
    if (!ctx.childrenCache.has(newParent.id)) {
      ctx.childrenCache.set(newParent.id, arr)
    }
    if (beforeId) {
      const idx = arr.findIndex(n => n.id === beforeId)
      if (idx >= 0) {
        arr.splice(idx, 0, node)
      } else {
        arr.push(node)
      }
    } else {
      arr.push(node)
    }
  } else if (beforeId) {
    const idx = ctx.roots.findIndex(n => n.id === beforeId)
    if (idx >= 0) {
      ctx.roots.splice(idx, 0, node)
    } else {
      ctx.roots.push(node)
    }
  } else {
    ctx.roots.push(node)
  }
  setLevelRecursively(node, ctx.childrenCache, node.level)
  ctx.notify()
}
