<script setup lang="ts">
import { useSpliceTree } from '@splicetree/adapter-vue'
import dnd from '@splicetree/plugin-dnd'
import keyboard from '@splicetree/plugin-keyboard'
import pointer from '@splicetree/plugin-pointer'
import selectable from '@splicetree/plugin-selectable'
import { ChevronRight } from 'lucide-vue-next'
import { treeData } from '@/utils/data'
import { cn } from '@/utils/shadcn'

const api = useSpliceTree(treeData, {
  plugins: [dnd, pointer, keyboard, selectable],
  configuration: {
    defaultExpanded: ['berries', 'citrus'],
    keyboard: {
      autoListen: true,
      target: '.keyboard-wrap',
    },
    selectable: {
      multiple: true,
    },
    dnd: {
      autoExpandOnDrop: true,
      autoUpdateParent: true,
    },
  },
})
const { items, dragProps } = api
</script>

<template>
  <section class="keyboard-wrap flex flex-col gap-1 items-stretch overflow-auto p-2 outline-0 ring-0">
    <div
      v-for="item in items" :key="item.id"
      :style="{ 'margin-left': `calc(var(--spacing) * 3 * ${item.level})` }"
      v-bind="dragProps(item.id)"
      :data-id="item.id"
      :class="cn('min-h-8 flex text-sm items-center gap-1 rounded relative dark:hover:bg-zinc-800 hover:bg-zinc-100', { 'bg-zinc-100 dark:bg-zinc-800': item.isSelected?.() })"
      :drop-position="item.getDropPosition?.() ?? '-2'"
      @click="api.inputNodeClick(item.id, $event)"
    >
      <button
        :class="cn('ml-1 transition-all rounded-full size-5 flex items-center justify-center hover:bg-zinc-200', { 'opacity-0': !item.hasChildren() })"
        @click="item.toggleExpand()"
      >
        <ChevronRight :class="cn('size-3.5 transition-transform duration-200', { 'rotate-90': item.isExpanded() })" />
      </button>
      <label>
        {{ item.original.title }}
      </label>
    </div>
  </section>
</template>

<style scoped>
div[drop-position] {
  position: relative;
}
div[drop-position]::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  pointer-events: none;
  display: none;
  z-index: 1;
}
div[drop-position='-1']::before {
  top: -1px;
  height: 2px;
  display: block;
  background: var(--vp-code-color);
  border-radius: 2px;
}
div[drop-position='1']::before {
  bottom: -1px;
  height: 2px;
  background: var(--vp-code-color);
  display: block;
  border-radius: 2px;
}
div[drop-position='0']::before {
  top: 0;
  bottom: 0;
  background: var(--vp-code-color);
  opacity: 0.15;
  display: block;
  border-radius: 4px;
}
</style>
