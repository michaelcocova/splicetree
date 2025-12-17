<script setup>
import { useSpliceTree } from '@splicetree/adapter-vue'
import { lazyLoad } from '@splicetree/lazy-load'
import { ChevronRight } from 'lucide-vue-next'
import { cn } from '@/utils/shadcn'
import { treeData } from '@/utils/tree'

const { items } = useSpliceTree(treeData, {
  plugins: [lazyLoad],
  configuration: {
    lazyLoad: {
      loadChildren: async (node) => {
        return [
          { id: `${node.id}-x`, parent: node.id, title: `子节点 X of ${node.id}` },
          { id: `${node.id}-y`, parent: node.id, title: `子节点 Y of ${node.id}` },
        ]
      },
    },
  },
})
</script>

<template>
  <div tabindex="0" class="w-full py-6 keyboard-wrapper">
    <div class="flex flex-col items-stretch gap-1 border rounded p-1">
      <div
        v-for="item in items"
        :key="item.id"
        :style="{ 'padding-left': `calc(var(--spacing) * 3 * ${item.level})` }"
        :class="cn('min-min-h-8 flex items-center gap-1 rounded relative dark:hover:bg-zinc-800 hover:bg-zinc-100', {})"
      >
        <button
          :class="cn('ml-1 transition-all rounded-full size-5 flex items-center justify-center hover:bg-zinc-200', { 'opacity-0': !item.hasChildren() })"
          @click="item.toggleExpand()"
        >
          <ChevronRight :class="cn('size-3.5 transition-transform duration-200', { 'rotate-90': item.isExpanded() })" />
        </button>
        <label :class="cn('px-1 rounded')">
          {{ item.original.title }}
        </label>
      </div>
    </div>
    <div class="text-xs text-zinc-500 text-center">
      首次展开时将动态加载子节点
    </div>
  </div>
</template>
