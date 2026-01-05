<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { useData } from 'vitepress'
import { cn } from '@/utils/shadcn'
import darkToolbar from './chrome-toolbar-dark.png'
import lightToolbar from './chrome-toolbar-light.png'

const props = defineProps<{
  class: HTMLAttributes['class']
}>()
const { isDark } = useData()
</script>

<template>
  <div
    class="w-full relative flex flex-col items-stretch rounded-[14px] overflow-hidden border border-zinc-300 dark:border-zinc-800"
  >
    <img :src="isDark ? darkToolbar : lightToolbar" :alt="`Chrome Toolbar ${isDark ? 'Dark' : 'Light'}`" class="pointer-events-none">
    <div class="flex-1 aspect-video" :class="cn('flex-1 aspect-video', props?.class)">
      <slot />
    </div>
  </div>
</template>
