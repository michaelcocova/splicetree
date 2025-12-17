<script setup>
import { useSpliceTree } from '@splicetree/adapter-vue'
import keyboard from '@splicetree/plugin-keyboard'
import pointer from '@splicetree/plugin-pointer'
import selectable from '@splicetree/plugin-selectable'
import { ChevronRight } from 'lucide-vue-next'
import { cn } from '@/utils/shadcn'
import { treeData } from '@/utils/tree'

const api = useSpliceTree(treeData, {
  plugins: [keyboard, pointer, selectable],
  configuration: {
    keyboard: { keymap: { right: 'l', left: 'h', down: 'j', up: 'k' } },
    selectable: { multiple: true },
  },
})
const { items } = api
</script>

<template>
  <div tabindex="0" class="w-full py-6 keyboard-wrapper">
    <div class="flex flex-col items-stretch gap-1 border rounded p-1">
      <div
        v-for="item in items"
        :key="item.id"
        :style="{ 'padding-left': `calc(var(--spacing) * 3 * ${item.level})` }"
        :class="cn('min-min-h-8 flex items-center gap-1 rounded relative dark:hover:bg-zinc-800 hover:bg-zinc-100', {
          'ring-[1px] ring-primary': item.isSelected(),
        })"
        @click="item.toggleSelect(true)"
      >
        <button
          :class="cn('ml-1 transition-all rounded-full size-5 flex items-center justify-center hover:bg-zinc-200', { 'opacity-0': !item.hasChildren() })"
          @click="item.toggleExpand()"
        >
          <ChevronRight :class="cn('size-3.5 transition-transform duration-200', { 'rotate-90': item.isExpanded() })" />
        </button>
        <label :class="cn('px-1 rounded')" @click="item.toggleSelect(true)">
          {{ item.original.title }}
        </label>
      </div>
    </div>
    <div class="text-xs text-zinc-500 text-center">
      快捷键：j/k 下一项/上一项 · h/l 收起/展开
    </div>
  </div>
</template>
