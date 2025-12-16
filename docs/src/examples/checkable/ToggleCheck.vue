<script setup lang="ts">
import { useSpliceTree } from '@splicetree/adapter-vue'
import checkable from '@splicetree/plugin-checkable'
import { CheckSquare, ChevronRight, MinusSquare, Square } from 'lucide-vue-next'
import { treeData } from '@/utils/data'
import { cn } from '@/utils/shadcn'

const { items } = useSpliceTree(treeData, {
  plugins: [checkable],
})
</script>

<template>
  <div class="w-full py-2">
    <div class="flex flex-col items-stretch gap-1 border rounded p-1">
      <div
        v-for="item in items"
        :key="item.id"
        :style="{ 'padding-left': `calc(var(--spacing) * 3 * ${item.level})` }"
        :class="cn('min-h-8 flex items-center gap-2 rounded relative dark:hover:bg-zinc-800 hover:bg-zinc-100')"
      >
        <button
          :class="cn('ml-1 transition-all rounded-full size-5 flex items-center justify-center hover:bg-zinc-200', { 'opacity-0': !item.hasChildren() })"
          @click="item.toggleExpand()"
        >
          <ChevronRight :class="cn('size-3.5 transition-transform duration-200', { 'rotate-90': item.isExpanded() })" />
        </button>
        <button
          :class="cn('ml-1 transition-all rounded size-5 flex items-center justify-center hover:bg-zinc-200')"
          @click="item.toggleCheck()"
        >
          <CheckSquare v-if="item.isChecked()" class="size-4 text-primary" />
          <MinusSquare v-else-if="item.isIndeterminate()" class="size-4 text-primary" />
          <Square v-else class="size-4" />
        </button>
        <label :class="cn('px-1 rounded')" @click="item.toggleCheck()">
          {{ item.original.title }}
        </label>
        <div class="ml-auto flex items-center gap-2">
          <button class="text-xs px-2 py-1 border rounded" @click="item.toggleCheck(true)">勾选</button>
          <button class="text-xs px-2 py-1 border rounded" @click="item.toggleCheck(false)">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>
