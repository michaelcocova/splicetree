/**
 * 抽象的函数类型
 * - 若不传泛型参数 `D`，表示无参函数
 * - 若传入 `D`，表示函数可选择性接收该参数类型
 */
export type Fn<T, D = undefined> = [D] extends [undefined] ? () => T : (data?: D) => T

/** 可能是数组的类型 */
export type MaybeArray<T> = T | T[]
/** 可能是函数的类型 */
export type MaybeFn<T, Args extends any[] = []> = T | ((...args: Args) => T)

/**
 * 输入数据的通用结构
 * - 表示原始树数据的任意键值对对象
 */
export interface SpliceTreeData {
  [key: string]: any
}

/**
 * 树节点的运行时结构
 * - `id`：节点唯一标识（来自原始数据的主键）
 * - `original`：原始数据引用
 * - `level`：层级（根为 0）
 * - `isExpanded()`：当前是否展开
 * - `hasChildren()`：是否存在子节点（懒加载插件可覆盖）
 * - `getParent()`：获取父节点
 * - `getChildren()`：获取子节点列表
 * - `toggleExpand(expand?)`：切换或显式设置展开状态
 */
export interface SpliceTreeNode<T = SpliceTreeData> {
  /**
   * 节点唯一标识
   */
  id: string
  /**
   * 原始数据引用
   */
  original: T
  /**
   * 节点层级（根为 0）
   */
  level: number
  /**
   * 当前是否处于展开状态
   */
  isExpanded: Fn<boolean>
  /**
   * 是否存在子节点
   * 懒加载插件可能在未加载时返回 true 以保持交互一致性
   */
  hasChildren: Fn<boolean>
  /**
   * 获取父节点（根节点时返回 undefined）
   */
  getParent: Fn<SpliceTreeNode<T> | undefined>
  /**
   * 获取子节点列表（无子节点时返回空数组）
   */
  getChildren: Fn<SpliceTreeNode<T>[]>
  /**
   * 切换或显式设置展开状态
   * @param expand 不传表示切换；true/false 表示显式设置
   */
  toggleExpand: Fn<void, boolean | undefined>
}

/**
 * 事件负载映射（可被插件扩展）
 * - `visibility`：视图可见性相关事件（携带当前展开的节点 id 集合）
 */
export interface SpliceTreeEventPayloadMap {
  /**
   * 视图可见性事件负载
   * @property keys 当前展开的节点 id 集合
   */
  visibility: { keys: string[] }
}

export type SpliceTreeEventName = keyof SpliceTreeEventPayloadMap
export type SpliceTreeEventPayload = {
  [K in keyof SpliceTreeEventPayloadMap]: { name: K } & SpliceTreeEventPayloadMap[K]
}[keyof SpliceTreeEventPayloadMap]

/**
 * 事件总线接口
 * - `on(name, handler)`：订阅事件，返回取消订阅函数
 * - `emit(payload)`：派发事件
 */
export interface SpliceTreeEvents {
  /**
   * 订阅指定事件
   * @param name 事件名称
   * @param handler 事件处理函数，接收事件负载
   * @returns 取消订阅函数（返回 true 表示取消成功）
   */
  on: (name: keyof SpliceTreeEventPayloadMap, handler: (payload: SpliceTreeEventPayload) => void) => () => boolean
  /**
   * 派发事件
   * @param payload 事件负载，包含名称与数据
   */
  emit: (payload: SpliceTreeEventPayload) => void
}

/**
 * `createSpliceTree` 的选项
 * - `plugins`：插件列表
 * - 其余键允许被插件进行选项扩展
 */
export interface SpliceTreeConfiguration {
  /**
   * 主键字段名
   * @default 'id'
   */
  keyField?: string
  /**
   * 父级字段名
   * @default 'parent'
   */
  parentField?: string
  /**
   * 默认展开的节点 ID 列表
   * 设为 true 表示默认展开所有节点
   */
  defaultExpanded?: true | string[]
  /**
   * 默认展开的层级
   * 设为 'deepest' 表示默认展开所有层级
   */
  defaultExpandedLevel?: number | 'deepest'
  autoExpandParent?: boolean
}

export interface UseSpliceTreeOptions<T = SpliceTreeData> {
  /**
   * 插件列表
   */
  plugins?: SpliceTreePlugin<T>[]
  /**
   * 插件配置聚合入口（按插件名分类）
   */
  configuration?: Partial<SpliceTreeConfiguration>
  /**
   * 其余选项键，供插件扩展使用
   */
}

/**
 * 核心实例结构（可被插件扩展）
 * - 数据与选项：`data`、`options`
 * - 查询与遍历：`items()`、`getNode(id)`
 * - 展开控制：`expand/collapse/toggleExpand` 及其全量版本
 * - 结构操作：`appendChildren` 追加子节点、`moveNode` 移动节点
 * - 事件：`events` 事件总线（`on/emit`）
 */
export interface SpliceTreeInstance<T = SpliceTreeData> {
  /**
   * 原始数据列表
   */
  data: T[]
  /**
   * 实例选项
   */
  options: UseSpliceTreeOptions<T>
  /**
   * 返回当前可见节点序列（按展开状态计算）
   */
  items: () => SpliceTreeNode<T>[]
  /**
   * 通过 id 获取节点（不存在时返回 undefined）
   * @param id 节点 id
   */
  getNode: (id: string) => SpliceTreeNode<T> | undefined
  /**
   * 事件总线
   */
  events: SpliceTreeEvents
  /**
   * 返回当前展开的节点 id 集合
   */
  expandedKeys: () => string[]
  /**
   * 查询指定节点是否展开
   * @param id 节点 id
   */
  isExpanded: (id: string) => boolean
  /**
   * 展开指定节点或节点列表
   * @param id 单个 id 或 id 数组
   */
  expand: (id: string | string[]) => void
  /**
   * 收起指定节点或节点列表
   * @param id 单个 id 或 id 数组
   */
  collapse: (id: string | string[]) => void
  /**
   * 切换指定节点或节点列表的展开状态
   * @param id 单个 id 或 id 数组
   */
  toggleExpand: (id: string | string[]) => void
  /**
   * 展开所有节点
   */
  expandAll: () => void
  /**
   * 收起所有节点
   */
  collapseAll: () => void
  /**
   * 切换所有节点的展开状态
   */
  toggleExpandAll: () => void
  /**
   * 追加子节点
   * @param parentId 父节点 id（传 undefined 表示追加到根）
   * @param children 子节点数据列表
   */
  appendChildren: (parentId: string | undefined, children: T[]) => void
  /**
   * 移动节点到新父级并指定插入位置
   * @param id 要移动的节点 id
   * @param newParentId 新父级节点 id（传 undefined 移动到根）
   * @param beforeId 插入到指定兄弟节点之前（不传表示末尾）
   */
  moveNode: (id: string, newParentId: string | undefined, beforeId?: string) => void
  syncData: (next: T[]) => void
}

/**
 * 插件上下文
 * - `tree`：核心实例引用
 * - `options`：插件自身选项
 * - `events`：事件总线
 */
export interface SpliceTreePluginContext<T = SpliceTreeData> {
  /**
   * 核心实例
   */
  tree: SpliceTreeInstance<T>
  /**
   * 插件选项（来自用户传入的 `options` 合并）
   */
  options: Record<string, any>
  /**
   * 事件总线
   */
  events: SpliceTreeEvents
}

/**
 * 插件定义接口
 * - `name`：插件名称
 * - `options`：插件选项（可用于配置行为）
 * - `setup(ctx)`：实例级扩展，返回扩展的字段与方法
 * - `extendNode(node, ctx)`：节点级扩展，直接为节点追加方法/属性
 */
export interface SpliceTreePlugin<T = SpliceTreeData, TExt = Record<string, any>> {
  /**
   * 插件名称
   */
  name: string
  /**
   * 插件选项
   */
  options?: Record<string, any>
  /**
   * 设置实例扩展
   * @param ctx 插件上下文
   * @returns 扩展的字段与方法，将合并到实例上
   */
  setup?: (ctx: SpliceTreePluginContext<T>) => TExt
  /**
   * 扩展节点
   * @param node 当前节点
   * @param ctx 插件上下文
   */
  extendNode?: (node: SpliceTreeNode<T>, ctx: SpliceTreePluginContext<T>) => void
}

/**
 * 工厂函数类型：创建 SpliceTree 实例
 * @param data 原始树数据列表
 * @param options 实例选项（支持插件扩展）
 * @returns SpliceTree 实例
 */
export type CreateSpliceTree = <T = SpliceTreeData>(data: T[], options?: UseSpliceTreeOptions<T>) => SpliceTreeInstance<T>
