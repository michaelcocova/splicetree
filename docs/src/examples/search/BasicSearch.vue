<script setup lang="ts">
import { useSpliceTree } from '@splicetree/adapter-vue'
import search from '@splicetree/plugin-search'
import { ChevronRight } from 'lucide-vue-next'
import { ref } from 'vue'
import { cn } from '@/utils/shadcn'
import { treeData } from '../data'

const data = ref(treeData)

const api = useSpliceTree(data, {
  plugins: [search],
  configuration: {
    search: {
      method: (node: any, kw: string) => String(node.original.title ?? '').toLowerCase().includes(kw.toLowerCase()),
    },
  },
})

const keyword = ref('')
function doSearch() {
  api.search(keyword.value)
}
function getItems() {
  return api.items?.value ?? []
}
</script>

<template>
  <div class="w-full flex flex-col gap-2">
    <div class="flex items-center gap-2">
      <input v-model="keyword" class="border rounded px-2 py-1" placeholder="输入关键字">
      <button class="border rounded px-2 py-1" @click="doSearch">
        搜索
      </button>
    </div>
    <div class="flex flex-col items-stretch max-h-80 overflow-auto border w-full rounded p-1">
      <div
        v-for="item in getItems()" :key="item.id"
        :style="{ 'margin-left': `calc(var(--spacing) * 3 * ${item.level})` }"
        :data-id="item.id"
        :class="cn('min-h-8 px-1 flex items-center gap-1 rounded relative dark:hover:bg-zinc-800 hover:bg-zinc-100', {
          'ring-[1px] ring-primary': item.isSelected?.(),
        })"
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
