<script setup lang="ts">
import { useSpliceTree } from '@splicetree/adapter-vue'
import lazyLoad from '@splicetree/plugin-lazy-load'
import { ChevronRight, Loader2 } from 'lucide-vue-next'
import { ref } from 'vue'
import { cn } from '@/utils/shadcn'

const data = ref([
  { id: 'a', label: '根 A' },
  { id: 'b', label: '根 B' },
])

const tree = useSpliceTree(data, {
  plugins: [lazyLoad],
  configuration: {
    lazyLoad: {
      loadChildren: async (node) => {
        await new Promise(r => setTimeout(r, 800))
        return [
          { id: `${node.id}-1`, label: `${node.id} 子 1`, parent: node.id },
          { id: `${node.id}-2`, label: `${node.id} 子 2`, parent: node.id },
        ]
      },
    },
  },
})

function getItems() {
  return tree.items?.value ?? []
}
</script>

<template>
  <div class="w-full py-2">
    <div class="flex flex-col items-stretch gap-1 border rounded p-1">
      <div
        v-for="item in getItems()"
        :key="item.id"
        :style="{ 'margin-left': `calc(0.25rem * 3 * ${item.level})` }"
        :class="cn('min-h-8 px-1 flex items-center gap-1 rounded relative dark:hover:bg-zinc-800 hover:bg-zinc-100')"
      >
        <button
          :disabled="item.isLoading?.()"
          :class="cn('ml-1 transition-all rounded-full size-5 flex items-center justify-center hover:bg-zinc-200', { 'opacity-0': !item.hasChildren(), 'pointer-events-none opacity-60': item.isLoading?.() })"
          @click="!item.isLoading?.() && item.toggleExpand()"
        >
          <ChevronRight v-if="!item.isLoading?.()" :class="cn('size-3.5 transition-transform duration-200', { 'rotate-90': item.isExpanded() })" />
          <Loader2 v-else class="size-3.5 animate-spin" />
        </button>
        <label :class="cn('px-1 rounded')">
          {{ item.original.label }}
        </label>
        <span v-if="item.isLoading?.()" class="absolute right-2 text-xs text-blue-600">Loading...</span>
      </div>
    </div>
  </div>
</template>
