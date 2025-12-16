<script setup lang="ts">
import type { SpliceTreeData } from '@splicetree/adapter-vue'
import { useSpliceTree } from '@splicetree/adapter-vue'
import dnd from '@splicetree/plugin-dnd'
import keyboard from '@splicetree/plugin-keyboard'
import { ChevronRight } from 'lucide-vue-next'
import { ref } from 'vue'
import { cn } from '@/utils/shadcn'
import { Kbd, KbdGroup } from './ui/kbd'

const treeData = ref<SpliceTreeData[]>([

  { id: 'tropical', title: 'Tropical Fruits' },

  { id: 'banana', title: 'Banana', parent: 'tropical' },
  { id: 'banana-small', title: 'Small Banana', parent: 'banana' },
  { id: 'banana-small-premium', title: 'Premium Small Banana', parent: 'banana-small' },

  { id: 'mango', title: 'Mango', parent: 'tropical' },
  { id: 'mango-tainong', title: 'Tainong Mango', parent: 'mango' },
  { id: 'mango-green', title: 'Green Mango', parent: 'mango' },
  { id: 'mango-green-sweet', title: 'Sweet Green Mango', parent: 'mango-green' },

  { id: 'pineapple', title: 'Pineapple', parent: 'tropical' },
  { id: 'pineapple-honey', title: 'Honey Pineapple', parent: 'pineapple' },
  { id: 'pineapple-honey-premium', title: 'Premium Honey Pineapple', parent: 'pineapple-honey' },

  { id: 'dragonfruit', title: 'Dragon Fruit', parent: 'tropical' },
  { id: 'dragonfruit-red', title: 'Red Dragon Fruit', parent: 'dragonfruit' },
  { id: 'dragonfruit-white', title: 'White Dragon Fruit', parent: 'dragonfruit' },
  { id: 'dragonfruit-red-premium', title: 'Premium Red Dragon Fruit', parent: 'dragonfruit-red' },

  { id: 'berries', title: 'Berries' },

  { id: 'strawberry', title: 'Strawberry', parent: 'berries' },
  { id: 'strawberry-cream', title: 'Cream Strawberry', parent: 'strawberry' },
  { id: 'strawberry-cream-supreme', title: 'Supreme Cream Strawberry', parent: 'strawberry-cream' },

  { id: 'blueberry', title: 'Blueberry', parent: 'berries' },
  { id: 'blueberry-wild', title: 'Wild Blueberry', parent: 'blueberry' },
  { id: 'blueberry-wild-premium', title: 'Premium Wild Blueberry', parent: 'blueberry-wild' },

  { id: 'raspberry', title: 'Raspberry', parent: 'berries' },
  { id: 'raspberry-red', title: 'Red Raspberry', parent: 'raspberry' },
  { id: 'raspberry-gold', title: 'Gold Raspberry', parent: 'raspberry' },

  { id: 'blackberry', title: 'Blackberry', parent: 'berries' },
  { id: 'blackberry-wild', title: 'Wild Blackberry', parent: 'blackberry' },

  { id: 'citrus', title: 'Citrus Fruits' },

  { id: 'orange', title: 'Orange', parent: 'citrus' },
  { id: 'orange-navel', title: 'Navel Orange', parent: 'orange' },
  { id: 'orange-blood', title: 'Blood Orange', parent: 'orange' },
  { id: 'orange-blood-premium', title: 'Premium Blood Orange', parent: 'orange-blood' },

  { id: 'lemon', title: 'Lemon', parent: 'citrus' },
  { id: 'lemon-meyer', title: 'Meyer Lemon', parent: 'lemon' },
  { id: 'lemon-meyer-sweet', title: 'Sweet Meyer Lemon', parent: 'lemon-meyer' },

  { id: 'lime', title: 'Lime', parent: 'citrus' },
  { id: 'lime-key', title: 'Key Lime', parent: 'lime' },
  { id: 'lime-key-premium', title: 'Premium Key Lime', parent: 'lime-key' },

  { id: 'stone-fruits', title: 'Stone Fruits' },

  { id: 'peach', title: 'Peach', parent: 'stone-fruits' },
  { id: 'peach-white', title: 'White Peach', parent: 'peach' },
  { id: 'peach-yellow', title: 'Yellow Peach', parent: 'peach' },
  { id: 'peach-white-premium', title: 'Premium White Peach', parent: 'peach-white' },

  { id: 'plum', title: 'Plum', parent: 'stone-fruits' },
  { id: 'plum-red', title: 'Red Plum', parent: 'plum' },
  { id: 'plum-black', title: 'Black Plum', parent: 'plum' },

  { id: 'cherry', title: 'Cherry', parent: 'stone-fruits' },
  { id: 'cherry-rainier', title: 'Rainier Cherry', parent: 'cherry' },
  { id: 'cherry-rainier-premium', title: 'Premium Rainier Cherry', parent: 'cherry-rainier' },

  { id: 'melon', title: 'Melons' },

  { id: 'watermelon', title: 'Watermelon', parent: 'melon' },
  { id: 'watermelon-mini', title: 'Mini Watermelon', parent: 'watermelon' },
  { id: 'watermelon-mini-sweet', title: 'Sweet Mini Watermelon', parent: 'watermelon-mini' },

  { id: 'cantaloupe', title: 'Cantaloupe', parent: 'melon' },
  { id: 'cantaloupe-honey', title: 'Honey Cantaloupe', parent: 'cantaloupe' },
])
const { items, dragProps } = useSpliceTree(treeData, {
  plugins: [dnd, keyboard],
  defaultExpanded: ['citrus', 'berries', 'blackberry'],
  keyboardTarget: '.keyboard-wrap',
})
</script>

<template>
  <main data-example="tree" class="flex-1 min-h-full flex flex-col w-full rounded-lg divide-y border">
    <header class="p-3 font-medium">
      示例
    </header>
    <section class="keyboard-wrap flex-1 flex flex-col gap-1 items-stretch overflow-auto p-2 outline-0 ring-0">
      <div
        v-for="item in items" :key="item.id"
        :style="{ 'padding-left': `calc(var(--spacing) * 3 * ${item.level})` }"
        v-bind="dragProps"
        :data-id="item.id"
        :class="cn('min-h-8 flex text-sm items-center gap-1 rounded relative dark:hover:bg-zinc-800 hover:bg-zinc-100', {
          'ring-[1px] ring-primary': item.isActive(),
          '[&>[data-drop=position]]:h-full [&>[data-drop=position]]:w-full [&>[data-drop=position]]:rounded': item.getDropPosition?.() === 0,
          '[&>[data-drop=position]]:h-0.5 [&>[data-drop=position]]:w-full [&>[data-drop=position]]:top-0': item.getDropPosition?.() === -1,
          '[&>[data-drop=position]]:h-0.5 [&>[data-drop=position]]:w-full [&>[data-drop=position]]:bottom-0': item.getDropPosition?.() === 1,
        })"
        :drop-position="item.getDropPosition() ?? '-2'"
        @click="item.toggleActive(true)"
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
    </section>
    <div class="text-zinc-600 flex flex-col items-start gap-1 text-xs p-2">
      <KbdGroup class="flex items-center text-xs gap-2">
        <Kbd>↑ 上一个</Kbd>
        <div class="size-0.5 bg-zinc-500 rounded-lg" />
        <Kbd>↓ 下一个</Kbd>
        <div class="size-0.5 bg-zinc-500 rounded-lg" />
        <Kbd>← 收起</Kbd>
        <div class="size-0.5 bg-zinc-500 rounded-lg" />
        <Kbd>→ 展开</Kbd>
      </KbdGroup>
      <div>拖动节点可以排序，移动</div>
    </div>
  </main>
</template>

<style lang="css">
  [data-example='tree'] {
  /* background: linear-gradient(to right, #22c1c3, #fdbb2d); */
  /* padding: 2px; */
}
[data-example='tree'] > * {
  background: #fff;
}
[data-example='tree'] > *:first-child {
  border-radius: 8px 8px 0 0;
}
[data-example='tree'] > *:last-child {
  border-radius: 0 0 8px 8px;
}
[data-example='tree'] > section {
  min-height: 320px;
  max-height: 320px;
  overflow: hidden;
  outline: 0;
}
[data-example='tree'] > [data-reka-scroll-area-viewport]:focus-visible {
  outline: none !important;
}
.keyboard-wrap {
  scrollbar-width: none;
}
</style>
