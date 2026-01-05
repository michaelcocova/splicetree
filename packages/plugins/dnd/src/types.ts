/** dnd types */

export interface DndNode {
  id: string
  level: number
  parentId?: string
  root?: boolean
}

export interface DragBehavior {
  draggable?: boolean
  sortable?: boolean
  nestable?: boolean
}

export enum DropPosition {
  BEFORE = -1,
  INSIDE = 0,
  AFTER = 1,
}

export interface DndOptions {
  /** 执行拖拽后是否自动写回父字段并同步树结构 */
  autoUpdateParent?: boolean
  /** 拖入为子节点后是否自动展开目标节点 */
  autoExpandOnDrop?: boolean
  /** 全局只读，禁用所有拖拽与排序 */
  readonly?: boolean
}
