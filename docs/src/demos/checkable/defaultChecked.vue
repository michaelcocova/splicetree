<script setup>
import { useSpliceTree } from '@splicetree/adapter-vue'
import checkable from '@splicetree/checkable'
import { CheckSquare, ChevronRight, Square } from 'lucide-vue-next'
import { cn } from '@/utils/shadcn'
import { treeData } from '@/utils/tree'

const { items } = useSpliceTree(treeData, {
  plugins: [checkable],
  defaultExpanded: ['a'],
  configuration: { checkable: { defaultChecked: ['a'] } },
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
          <ChevronRight
            :class="cn('size-3.5 transition-transform duration-200', { 'rotate-90': item.isExpanded() })"
          />
        </button>
        <button
          :class="cn('ml-1 transition-all rounded size-5 flex items-center justify-center hover:bg-zinc-200', {})"
          @click="item.toggleCheck()"
        >
          <CheckSquare v-if="item.isChecked()" class="size-4 text-primary" />
          <Square v-else class="size-4" />
        </button>
        <label :class="cn('px-1 rounded')" @click="item.toggleCheck()">
          {{ item.original.title }}
        </label>
      </div>
    </div>
  </div>
</template>
