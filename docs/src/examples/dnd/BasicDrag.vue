<script setup lang="ts">
import { useSpliceTree } from '@splicetree/adapter-vue'
import dnd from '@splicetree/plugin-dnd'
import { ChevronRight } from 'lucide-vue-next'
import { ref } from 'vue'
import { treeData } from '@/utils/data'
import { cn } from '@/utils/shadcn'

const data = ref(treeData)
const { items, dragProps } = useSpliceTree(data, {
  plugins: [dnd],
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
        class="min-h-8 flex items-center gap-1 rounded relative dark:hover:bg-zinc-800 hover:bg-zinc-100"
        :drop-position="item.getDropPosition()"
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

<style scoped>
div[drop-position][draggable='true'] {
  position: relative;
}
div[drop-position][draggable='true']::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  pointer-events: none;
  display: none;
}
div[draggable='true'][drop-position='-1']::before {
  top: 0;
  height: 2px;
  display: block;
  background: var(--vp-code-color);
}
div[draggable='true'][drop-position='1']::before {
  bottom: 0;
  height: 2px;
  background: var(--vp-code-color);
  display: block;
}
div[draggable='true'][drop-position='0']::before {
  top: 0;
  bottom: 0;
  background: var(--vp-code-color);
  opacity: 0.15;
  display: block;
  border-radius: 4px;
}
</style>
