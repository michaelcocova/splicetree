<script setup lang="ts">
import { useSpliceTree } from '@splicetree/adapter-vue'
import keyboard from '@splicetree/plugin-keyboard'
import pointer from '@splicetree/plugin-pointer'
import selectable from '@splicetree/plugin-selectable'
import { ChevronRight } from 'lucide-vue-next'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { treeData } from '@/utils/data'
import { cn } from '@/utils/shadcn'

const api = useSpliceTree(treeData, {
  plugins: [keyboard, pointer, selectable],
  configuration: {
    keyboard: {
      target: '.keyboard-navigation',
    },
    selectable: {
      multiple: true,
    },
  },
})
const { items } = api
</script>

<template>
  <div class="w-full flex flex-col gap-2 outline-0 keyboard-navigation">
    <KbdGroup class="flex items-center">
      <Kbd>↑ 上一个</Kbd>
      <div class="size-0.5 bg-zinc-500 rounded-lg" />
      <Kbd>↓ 下一个</Kbd>
      <div class="size-0.5 bg-zinc-500 rounded-lg" />
      <Kbd>← 收起</Kbd>
      <div class="size-0.5 bg-zinc-500 rounded-lg" />
      <Kbd>→ 展开</Kbd>
    </KbdGroup>
    <div class="flex flex-col items-stretch max-h-80 overflow-auto border w-full rounded p-1">
      <div
        v-for="item in items" :key="item.id"
        :style="{ 'margin-left': `calc(var(--spacing) * 3 * ${item.level})` }"
        :data-id="item.id"
        :class="cn('min-h-8 px-1 flex items-center gap-1 rounded relative dark:hover:bg-zinc-800 hover:bg-zinc-100', {
          'ring-[1px] ring-primary': item.isSelected(),
        })"
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
    </div>
  </div>
</template>
