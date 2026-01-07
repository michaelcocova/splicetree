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
    autoExpandParent: true,
    defaultExpanded: ['strawberry-cream'],
    keyboard: {
      autoListen: true,
      target: '.keyboard-wrap',
    },
    selectable: {
      multiple: true, // Allow multiple selection
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
})
const { items, dragProps, onClick, ghostStyle } = api

const keyboardRoot = ref<HTMLElement | null>(null)

onMounted(() => {
  keyboardRoot.value?.focus()
})
</script>

<template>
  <div class="max-w-xl mx-auto py-3">
    <main data-example="tree" class="flex-1 min-h-full flex flex-col max-w-xl text-sm">
      <header class="py-3 font-semibold">
        交互式树 · 拖拽排序 · 勾选多选 · 键盘导航
      </header>
      <section
        ref="keyboardRoot"
        tabindex="0"
        class="keyboard-wrap bg-white dark:bg-zinc-800 border rounded-md relative flex-1 flex flex-col gap-1 items-stretch overflow-auto p-2 outline-0 ring-0 focus-visible:ring-1 focus-visible:ring-primary"
      >
        <!-- 拖拽占位元素：自动计算位置与尺寸 -->
        <!-- 使用 ghostStyle({ padding: true, margin: true }) 确保占位符宽度自动减去容器内边距 -->
        <div v-bind="ghostStyle({ padding: true, margin: true })" class="z-50 bg-primary/20 border-primary border-2 rounded" />

        <div
          v-for="item in items"
          :key="item.id"
          :style="{ 'margin-left': `calc(var(--spacing) * 3 * ${item.level})` }"
          v-bind="dragProps(item.id)"
          :data-id="item.id"
          :class="cn(
            'min-h-8 px-1 flex items-center gap-1 rounded relative cursor-pointer select-none transition-colors',
            'hover:bg-zinc-100 dark:hover:bg-zinc-700/50',
            {
              'bg-primary/10 hover:bg-primary/15': item.isSelected(),
              'ring-1 ring-primary/50': item.isSelected(),
            },
          )"
          @click="onClick(item.id, $event)"
        >
          <!-- 展开/收起按钮 -->
          <button
            :class="cn(
              'rounded-full size-5 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 transition-colors',
              { 'opacity-0 pointer-events-none': !item.hasChildren() },
            )"
            @click.stop="item.toggleExpand()"
          >
            <ChevronRight
              :class="cn('size-3.5 transition-transform duration-200', { 'rotate-90': item.isExpanded() })"
            />
          </button>

          <!-- 勾选框 -->
          <button
            :class="cn(
              'rounded size-5 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 transition-colors mr-1',
            )"
            @click.stop="item.toggleCheck()"
          >
            <CheckSquare v-if="item.isChecked?.()" class="size-4 text-primary" />
            <MinusSquare v-else-if="item.isIndeterminate?.()" class="size-4 text-primary" />
            <Square v-else class="size-4 text-zinc-400" />
          </button>

          <!-- 节点内容 -->
          <span class="truncate">
            {{ item.original.title }}
          </span>
        </div>
      </section>

      <div class="text-zinc-500 flex flex-col items-start gap-1.5 text-xs py-3 mt-2 border-t">
        <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span class="flex items-center gap-1"><kbd class="bg-zinc-100 dark:bg-zinc-800 px-1 rounded border">↑</kbd> 上一个</span>
          <span class="flex items-center gap-1"><kbd class="bg-zinc-100 dark:bg-zinc-800 px-1 rounded border">↓</kbd> 下一个</span>
          <span class="flex items-center gap-1"><kbd class="bg-zinc-100 dark:bg-zinc-800 px-1 rounded border">←</kbd> 收起/父级</span>
          <span class="flex items-center gap-1"><kbd class="bg-zinc-100 dark:bg-zinc-800 px-1 rounded border">→</kbd> 展开/子级</span>
        </div>
        <div>
          <span class="font-medium">拖拽排序：</span>顶部线=前插；底部线=后插；中间高亮=成为子节点
        </div>
        <div>
          <span class="font-medium">选择：</span>点击选中；<kbd>⌘/Ctrl</kbd>+点击 多选；<kbd>Shift</kbd>+点击 范围选择
        </div>
        <div>
          <span class="font-medium">勾选：</span>点击方块勾选；父子状态自动关联
        </div>
      </div>
    </main>
  </div>
</template>

<style lang="css" scoped>
/* 键盘导航容器样式优化 */
.keyboard-wrap {
  scrollbar-width: thin;
}

/* 简单的键盘按键样式 */
kbd {
  font-family: monospace;
  font-size: 10px;
}
</style>
