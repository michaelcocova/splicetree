<script setup lang="ts">
import type { SpliceTreeData } from '@splicetree/adapter-vue'
import { useSpliceTree } from '@splicetree/adapter-vue'
import checkable from '@splicetree/plugin-checkable'
import dnd from '@splicetree/plugin-dnd'
import keyboard from '@splicetree/plugin-keyboard'
import pointer from '@splicetree/plugin-pointer'
import selectable from '@splicetree/plugin-selectable'
import { CheckSquare, ChevronRight, MinusSquare, Square } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
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

const api = useSpliceTree(treeData, {
  plugins: [dnd, pointer, keyboard, selectable, checkable],
  configuration: {
    keyboard: {
      autoListen: true,
      target: '.keyboard-wrap',
    },
    selectable: {
      multiple: false,
    },
    checkable: {
      defaultChecked: [],
      triggerByClick: false,
    },
    dnd: {
      autoExpandOnDrop: true,
      autoUpdateParent: true,
    },
  },
  defaultExpanded: ['berries', 'citrus'],
})
const { items, dragProps, onClick } = api
const keyboardRoot = ref<HTMLElement | null>(null)
onMounted(() => {
  keyboardRoot.value?.focus()
  const first = items.value?.[0]?.id
  if (first) {
    api.activeId = first
  }
})
</script>

<template>
  <main data-example="tree" class="flex-1 min-h-full flex flex-col w-full rounded-lg divide-y border text-sm">
    <header class="p-3 font-semibold">
      交互式树 · 拖拽排序 · 勾选多选 · 键盘导航
    </header>
    <section ref="keyboardRoot" class="keyboard-wrap flex-1 flex flex-col gap-1 items-stretch overflow-auto p-2 outline-0 ring-0">
      <div
        v-for="item in items" :key="item.id"
        :style="{ 'padding-left': `calc(var(--spacing) * 3 * ${item.level})` }"
        v-bind="dragProps"
        :data-id="item.id"
        :class="cn('min-h-8 flex items-center gap-1 rounded relative dark:hover:bg-zinc-800 hover:bg-zinc-100', {
          'ring-[1px] ring-primary': item.isSelected(),
        })"
        :drop-position="item.getDropPosition() ?? '-2'"
        @click="onClick(item.id, $event)"
      >
        <button
          :class="cn('transition-all rounded-full size-5 flex items-center justify-center hover:bg-zinc-200', { 'opacity-0': !item.hasChildren() })"
          @click="item.toggleExpand()"
        >
          <ChevronRight :class="cn('size-3.5 transition-transform duration-200', { 'rotate-90': item.isExpanded() })" />
        </button>
        <button
          :class="cn('transition-all rounded size-5 flex items-center justify-center hover:bg-zinc-200')"
          @click.stop="item.toggleCheck()"
        >
          <CheckSquare v-if="item.isChecked?.()" class="size-4 text-primary" />
          <MinusSquare v-else-if="item.isIndeterminate?.()" class="size-4 text-primary" />
          <Square v-else class="size-4" />
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
        <Kbd>← 收起/聚焦父级</Kbd>
        <div class="size-0.5 bg-zinc-500 rounded-lg" />
        <Kbd>→ 展开/聚焦子级</Kbd>
      </KbdGroup>
      <div>拖拽排序：顶部线=前插；底部线=后插；中间高亮=成为子节点</div>
      <div>选择：点击选中；⌘/Ctrl+点击 多选；Shift+点击 范围选择</div>
      <div>勾选：点击左侧方块 勾选/取消；半选随子节点状态自动计算</div>
    </div>
  </main>
</template>

<style lang="css">
[data-example='tree'] {
  /* background: linear-gradient(to right, #22c1c3, #fdbb2d); */
  background: linear-gradient(oklch(0.62 0.2 276.966) 30%, oklch(0.8 0.1 276.966));
  padding: 2px;
}
[data-example='tree'] > header {
  background: oklch(0.62 0.2 276.966);
  color: #fff;
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
