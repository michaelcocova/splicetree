import type { SpliceTreeData } from '@splicetree/core'

function pickCount(v: number | [number, number], fallback = 1): number {
  if (Array.isArray(v)) {
    const min = Math.max(0, Math.floor(v[0]))
    const max = Math.max(min, Math.floor(v[1]))
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
  const n = Math.floor(v)
  return Number.isFinite(n) ? n : fallback
}

/**
 * 生成层级编号树
 * 顶层编号：1,2,3...
 * 子节点编号：parent-x（x 从 1 开始）
 */
function createFlatTreeData(
  maxDeep: number,
  maxChildren: number | [number, number],
  nodesNumber: number | [number, number],
  deep = 1,
  parentPath?: string,
): SpliceTreeData[] {
  const result: SpliceTreeData[] = []

  // 当前层节点数
  const count = pickCount(nodesNumber, 1)

  for (let i = 1; i <= count; i++) {
    // 当前层自己的编号
    const currentKey = parentPath ? `${parentPath}-${i}` : `${i}`

    result.push({
      id: currentKey,
      title: `node-${currentKey}`,
      parent: parentPath ?? null,
    })

    // 递归生成子节点
    if (deep < maxDeep) {
      const childrenCount = pickCount(maxChildren, 0)
      if (childrenCount > 0) {
        const children = createFlatTreeData(
          maxDeep,
          maxChildren,
          childrenCount,
          deep + 1,
          currentKey,
        )
        result.push(...children)
      }
    }
  }

  return result
}

// 示例
export const treeData = createFlatTreeData(5, [2, 4], [3, 5])

export function customFieldData(fields?: { key?: string, parent?: string }) {
  return treeData.map((item) => {
    return {
      title: item.title,
      [fields?.key || 'id']: item.id,
      [fields?.parent || 'parent']: item.parent,
    }
  })
}
