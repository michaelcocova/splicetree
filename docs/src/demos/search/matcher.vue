<script setup>
import { useSpliceTree } from '@splicetree/adapter-vue'
import { search } from '@splicetree/search'
import { ChevronRight } from 'lucide-vue-next'
import { ref } from 'vue'
import { cn } from '@/utils/shadcn'
import { treeData } from '@/utils/tree'

const query = ref('')
const { items, search: runSearch, isMatched } = useSpliceTree(treeData, {
  plugins: [search],
  configuration: {
    search: {
      matcher: (node, q) => String(node.original.title ?? '').toLowerCase().includes(q.toLowerCase()),
    },
  },
})

function onInput(e) {
  query.value = e.target.value
  runSearch(query.value)
}
</script>

<template>
  <div tabindex="0" class="w-full py-2">
    <input
      class="w-full border rounded px-2 py-1 mb-2"
      type="text"
      :value="query"
      placeholder="输入关键词进行搜索"
      @input="onInput"
    >
  </div>
  <div tabindex="0" class="w-full py-4 keyboard-wrapper">
    <div class="flex flex-col items-stretch gap-1 border rounded p-1">
      <div
        v-for="item in items"
        :key="item.id"
        :style="{ 'padding-left': `calc(var(--spacing) * 3 * ${item.level})` }"
        :class="cn('min-min-h-8 flex items-center gap-1 rounded relative dark:hover:bg-zinc-800 hover:bg-zinc-100', { 'ring-[1px] ring-primary': isMatched(item.id) })"
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
  </div>
</template>
