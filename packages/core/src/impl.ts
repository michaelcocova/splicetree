import type { SpliceTreeNode } from './types'

/**
 * 创建运行时树节点，并注入必要的 API
 */
export function createSpliceTreeNode<T>(
  id: string,
  original: T,
  api: {
    hasChildren: () => boolean
    getParent: () => SpliceTreeNode<T> | undefined
    getChildren: () => SpliceTreeNode<T>[]
    isExpanded: () => boolean
    toggleExpand: (expand?: boolean) => void
  },
): SpliceTreeNode<T> {
  return {
    id,
    original,
    level: 0,
    isExpanded: api.isExpanded,
    hasChildren: api.hasChildren,
    getParent: api.getParent,
    getChildren: api.getChildren,
    toggleExpand: api.toggleExpand as any,
  }
}

/**
 * 基于扁平数据构建树结构缓存
 * - by id 的节点 map
 * - parent/children 缓存
 * - 根节点列表
 * 并计算每个节点的 level
 */
export function buildTree<T extends Record<string, any>>(
  data: T[],
  keyField: string,
  parentField: string,
  expandedKeys: Set<string> = new Set(),
) {
  const map = new Map<string, SpliceTreeNode<T>>()
  const roots: SpliceTreeNode<T>[] = []
  const parentCache = new Map<string, SpliceTreeNode<T> | undefined>()
  const childrenCache = new Map<string, SpliceTreeNode<T>[]>()

  data.forEach((item) => {
    const id = String(Reflect.get(item, keyField || 'id'))
    const node = createSpliceTreeNode<T>(id, item, {
      hasChildren: () => !!childrenCache.get(id)?.length,
      getParent: () => parentCache.get(id),
      getChildren: () => childrenCache.get(id) ?? [],
      isExpanded: () => expandedKeys.has(id),
      toggleExpand: () => {
        if (expandedKeys.has(id)) expandedKeys.delete(id)
        else expandedKeys.add(id)
      },
    })
    map.set(id, node)
  })

  for (const id of map.keys()) childrenCache.set(id, [])

  for (const node of map.values()) {
    const parentId = Reflect.get(node.original as any, parentField || 'parentId')
    if (!parentId) {
      parentCache.set(node.id, undefined)
      roots.push(node)
      continue
    }
    const parentNode = map.get(String(parentId))
    parentCache.set(node.id, parentNode ?? undefined)
    if (parentNode) (childrenCache.get(parentNode.id)!).push(node)
    else roots.push(node)
  }

  const dfs = (node: SpliceTreeNode<T>, level: number) => {
    node.level = level
    for (const child of childrenCache.get(node.id) ?? []) dfs(child, level + 1)
  }
  for (const r of roots) dfs(r, 0)

  return { roots, map, parentCache, childrenCache }
}
