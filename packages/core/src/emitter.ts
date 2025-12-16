import type { SpliceTreeEventPayload, SpliceTreeEventPayloadMap } from './types'

/**
 * 轻量事件总线：支持订阅与派发，供核心与插件通信
 */
export function createEmitter() {
  const listeners = new Map<keyof SpliceTreeEventPayloadMap, Set<(payload: SpliceTreeEventPayload) => void>>()
  const on = (name: keyof SpliceTreeEventPayloadMap, handler: (payload: SpliceTreeEventPayload) => void) => {
    if (!listeners.has(name)) listeners.set(name, new Set())
    const set = listeners.get(name)!
    set.add(handler)
    return () => set.delete(handler)
  }
  const emit = (payload: SpliceTreeEventPayload) => {
    const set = listeners.get(payload.name)
    if (!set) return
    for (const h of set) h(payload)
  }
  return { on, emit }
}
