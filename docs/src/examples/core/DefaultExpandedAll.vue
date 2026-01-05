<script setup lang="ts">
import { useSpliceTree } from '@splicetree/adapter-vue'
import { ChevronRight } from 'lucide-vue-next'
import { treeData } from '@/utils/data'
import { cn } from '@/utils/shadcn'

const { items } = useSpliceTree(treeData, {
  configuration: {
    defaultExpanded: true,
  },
})
</script>

<template>
  <div class="w-full flex flex-col gap-2">
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
