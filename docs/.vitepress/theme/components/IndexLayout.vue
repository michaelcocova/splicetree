<script setup lang="ts">
import {
  ArrowRight,
  Blocks,
  Dot,
  LayoutGrid,
  Leaf,
  Plug,
  Puzzle,
  Wrench,
  Zap,
} from 'lucide-vue-next'
import { onMounted } from 'vue'
import { ChromeFrame } from './chrome-frame'
import FullTree from './FullTree.vue'

onMounted(() => {
  window.scrollTo(0, 0) // 强制滚动到页面顶部
})
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans selection:bg-primary/10 selection:text-primary relative overflow-hidden">
    <!-- Background Grid -->
    <div class="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-zinc-950 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
      <div class="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]" />
    </div>

    <main class="container mx-auto py-16 md:py-24 max-w-7xl flex flex-col items-center gap-16">
      <!-- Hero Section -->
      <section class="flex flex-col items-center text-center gap-8 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div class="inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1 text-sm text-zinc-600 dark:text-zinc-400 backdrop-blur-sm">
          <span class="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse" />
          v0.2.0 已发布
        </div>

        <h1 class="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400">
          Build Better Trees, <br class="hidden md:block">
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">Faster.</span>
        </h1>

        <p class="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
          SpliceTree 是一个无头、框架无关的树组件核心。
          <br>
          为高性能而生，提供虚拟滚动、拖拽排序、多选等开箱即用的能力，同时保持极致的灵活性。
        </p>

        <div class="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <div class="flex items-center gap-2 px-4 py-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 font-mono text-sm">
            <span class="select-none">$</span>
            <span class="text-zinc-900 dark:text-zinc-200">npm install @splicetree/core</span>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-4">
          <a href="/getting-started">
            <Button>
              快速开始
              <ArrowRight class="h-4 w-4" />
            </Button>
          </a>
          <a href="/plugins/">
            <Button variant="secondary">
              浏览插件
              <Blocks />
            </Button>
          </a>
        </div>

        <div class="pt-4 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-zinc-500 dark:text-zinc-400">
          <div class="flex items-center">
            <Dot class="text-primary" />
            框架无关
          </div>
          <div class="flex items-center">
            <Dot class="text-primary" />
            TypeScript 完备
          </div>
          <div class="flex items-center">
            <Dot class="text-primary" />
            无头组件
          </div>
          <div class="flex items-center">
            <Dot class="text-primary" />
            零依赖
          </div>
        </div>
      </section>

      <!-- Interactive Demo -->
      <section class="w-full animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
        <ChromeFrame class="bg-white/50 dark:bg-zinc-900/50 shadow-2xl">
          <FullTree />
        </ChromeFrame>
        <p class="text-center text-sm text-zinc-400 mt-4">
          👆 这是一个完全交互式的示例：尝试拖拽、多选、键盘操作
        </p>
      </section>

      <!-- Features Grid -->
      <section class="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300 pb-16">
        <div class="group relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div class="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
            <Puzzle class="h-6 w-6" />
          </div>
          <h3 class="text-lg font-semibold mb-2">
            插件体系
          </h3>
          <p class="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
            可自由组合的能力：DnD、Checkable、Keyboard、LazyLoad、Search 等，按需引入，体积轻量。
          </p>
        </div>

        <div class="group relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div class="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
            <Plug class="h-6 w-6" />
          </div>
          <h3 class="text-lg font-semibold mb-2">
            框架无关
          </h3>
          <p class="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
            核心由纯 TypeScript 构建，无任何框架依赖。可在浏览器、Node、Web Worker 中稳定运行。
          </p>
        </div>

        <div class="group relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div class="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400">
            <Zap class="h-6 w-6" />
          </div>
          <h3 class="text-lg font-semibold mb-2">
            为性能而生
          </h3>
          <p class="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
            分片计算与增量更新，面向大规模数据的可见性与增删改查，轻松处理万级节点。
          </p>
        </div>

        <div class="group relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div class="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
            <LayoutGrid class="h-6 w-6" />
          </div>
          <h3 class="text-lg font-semibold mb-2">
            结构灵活
          </h3>
          <p class="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
            面向扁平数据设计，支持任意字段映射、动态插入、懒加载与状态持久化。
          </p>
        </div>

        <div class="group relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div class="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
            <Leaf class="h-6 w-6" />
          </div>
          <h3 class="text-lg font-semibold mb-2">
            Vue 3 适配器
          </h3>
          <p class="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
            提供官方 Vue 3 适配器，轻量绑定层，可直接连接现有组件或自定义渲染逻辑。
          </p>
        </div>

        <div class="group relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div class="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
            <Wrench class="h-6 w-6" />
          </div>
          <h3 class="text-lg font-semibold mb-2">
            开发者友好
          </h3>
          <p class="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
            简洁的 API 设计、完整的 TypeScript 类型推断、插件化扩展，让复杂交互开发更轻松。
          </p>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
/*
  If needed, we can add custom keyframes here, but Tailwind's animate-in utilities are sufficient.
*/
</style>
