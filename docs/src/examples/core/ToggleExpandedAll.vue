<script setup lang="ts">
import { useSpliceTree } from '@splicetree/adapter-vue'
import { ChevronRight, ListChevronsDownUp, ListChevronsUpDown, RefreshCw } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { treeData } from '@/utils/data'
import { cn } from '@/utils/shadcn'

const { items, collapseAll, expandAll, toggleExpandAll } = useSpliceTree(treeData, {
  configuration: {
    defaultExpanded: true,
  },
})
</script>

<template>
  <div class="w-full flex flex-col gap-2">
    <div class="flex gap-2 items-center">
      <Button variant="secondary" class="text-xs" size="sm" @click="toggleExpandAll">
        <RefreshCw class="size-4" />
        切换
      </Button>

      <Button variant="secondary" class="text-xs" size="sm" @click="expandAll">
        <ListChevronsUpDown class="size-4" />
        展开所有
      </Button>
      <Button variant="secondary" class="text-xs" size="sm" @click="collapseAll">
        <ListChevronsDownUp class="size-4" />
        收起所有
      </Button>
    </div>
    <div class="flex flex-col items-stretch max-h-80 overflow-auto border w-full rounded p-1">
      <div
        v-for="item in items" :key="item.id"
        :style="{ 'margin-left': `calc(var(--spacing) * 3 * ${item.level})` }"
        :data-id="item.id"
        :class="cn('min-h-8 px-1 flex items-center gap-1 rounded relative dark:hover:bg-zinc-800 hover:bg-zinc-100')"
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
