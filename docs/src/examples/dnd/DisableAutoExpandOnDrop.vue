<script setup lang="ts">
import { useSpliceTree } from '@splicetree/adapter-vue'
import dnd from '@splicetree/plugin-dnd'
import { ChevronRight } from 'lucide-vue-next'
import { treeData } from '@/utils/data'
import { cn } from '@/utils/shadcn'

const { items, dragProps } = useSpliceTree(treeData, {
  plugins: [dnd],
  autoExpandOnDrop: false,
})
</script>

<template>
  <div class="w-full flex flex-col gap-2">
    <div class="flex flex-col gap-1 items-stretch max-h-80 overflow-auto border w-full rounded p-1">
      <div
        v-for="item in items" :key="item.id"
        :style="{ 'padding-left': `calc(var(--spacing) * 3 * ${item.level})` }"
        v-bind="dragProps"
        :data-id="item.id"
        :class="cn('min-h-8 flex items-center gap-1 rounded relative dark:hover:bg-zinc-800 hover:bg-zinc-100', {
          '[&>[data-drop=position]]:h-full [&>[data-drop=position]]:w-full [&>[data-drop=position]]:rounded': item.getDropPosition?.() === 0,
          '[&>[data-drop=position]]:h-0.5 [&>[data-drop=position]]:w-full [&>[data-drop=position]]:top-0': item.getDropPosition?.() === -1,
          '[&>[data-drop=position]]:h-0.5 [&>[data-drop=position]]:w-full [&>[data-drop=position]]:bottom-0': item.getDropPosition?.() === 1,
        })"
        :drop-position="item.getDropPosition() ?? '-2'"
      >
        <div data-drop="position" class="pointer-events-none absolute top-0 left-0 transition-[width] duration-300 ease-in-out w-full h-0 bg-primary" />
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
