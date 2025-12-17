type ReactiveCallback = (payload: any) => void

/**
 * 为 Set/Map/Object 创建响应式代理
 * 在集合或对象发生更改时，触发回调以便同步状态（如可见性）
 */
export function createReactive<T extends object>(target: T, callback: ReactiveCallback): T {
  const isSet = target instanceof Set
  const isMap = target instanceof Map
  return new Proxy(target as any, {
    get(obj, prop, receiver) {
      if (isSet) {
        if (prop === 'size') {
          return Reflect.get(obj, prop, obj)
        }
        const value = Reflect.get(obj, prop, obj)
        if (prop === 'add') {
          return (v: any) => {
            const existed = obj.has(v)
            const r = obj.add(v)
            if (!existed) {
              callback({ type: 'ADD', target: obj, newValue: v })
            }
            return r
          }
        }
        if (prop === 'delete') {
          return (v: any) => {
            const existed = obj.has(v)
            const old = v
            const r = obj.delete(v)
            if (existed) {
              callback({ type: 'DELETE', target: obj, oldValue: old })
            }
            return r
          }
        }
        if (prop === 'clear') {
          return () => {
            if (obj.size > 0) {
              callback({ type: 'CLEAR', target: obj })
            }
            return obj.clear()
          }
        }
        return typeof value === 'function' ? value.bind(obj) : value
      }
      if (isMap) {
        if (prop === 'size') {
          return Reflect.get(obj, prop, obj)
        }
        const value = Reflect.get(obj, prop, obj)
        if (prop === 'set') {
          return (k: any, v: any) => {
            const old = obj.get(k)
            const r = obj.set(k, v)
            callback({ type: 'MAP_SET', target: obj, property: k, oldValue: old, newValue: v })
            return r
          }
        }
        if (prop === 'delete') {
          return (k: any) => {
            const existed = obj.has(k)
            const old = obj.get(k)
            const r = obj.delete(k)
            if (existed) {
              callback({ type: 'DELETE', target: obj, property: k, oldValue: old })
            }
            return r
          }
        }
        if (prop === 'clear') {
          return () => {
            if (obj.size > 0) {
              callback({ type: 'CLEAR', target: obj })
            }
            return obj.clear()
          }
        }
        return typeof value === 'function' ? value.bind(obj) : value
      }
      return Reflect.get(obj, prop, receiver)
    },
    set(obj, prop, value, receiver) {
      const oldValue = Reflect.get(obj, prop, receiver)
      const r = Reflect.set(obj, prop, value)
      callback({ type: 'SET', target: obj, property: prop, oldValue, newValue: value })
      return r
    },
    deleteProperty(obj, prop) {
      const oldValue = Reflect.get(obj, prop)
      const r = Reflect.deleteProperty(obj, prop)
      callback({ type: 'DELETE', target: obj, property: prop, oldValue })
      return r
    },
  }) as T
}
