import { resolve } from 'node:path'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import tailwindcss from '@tailwindcss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vitepress'
import { vitepressDemoPlugin } from 'vitepress-demo-plugin'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/',
  lang: 'zh-CN',
  lastUpdated: true,
  sitemap: {
    hostname: 'https://www.splicetree.dev',
  },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    [
      'script',
      {},
      `var _hmt = _hmt || [];
        (function() {
          var hm = document.createElement("script");
          hm.src = "https://hm.baidu.com/hm.js?0ea0f1a307c6cc50f989863c439fbe95";
          var s = document.getElementsByTagName("script")[0];
          s.parentNode.insertBefore(hm, s);
        })();
        `,
    ],
  ],
  srcDir: 'src',
  cacheDir: 'node_modules/.cache/vitepress',
  title: 'SpliceTree',
  description: '框架无关、高性能的 Tree 运行时，支持文件树、级联选择等复杂场景。提供丰富插件能力：搜索、拖拽、勾选、键盘导航与懒加载等。  在 Vue 3 中可以使用官方提供的适配器快速绑定组件，但核心 API 可直接在任何环境中使用。',

  themeConfig: {
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    outline: {
      label: '页面导航',
      level: [2, 3],
    },
    lastUpdated: {
      text: '最后更新于',
    },
    notFound: {
      title: '页面未找到',
      quote:
        '但如果你不改变方向，并且继续寻找，你可能最终会到达你所前往的地方。',
      linkLabel: '前往首页',
      linkText: '带我回首页',
    },

    langMenuLabel: '多语言',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    skipToContentLabel: '跳转到内容',
    footer: {
      message: `
            Released under the
            <a href="https://opensource.org/licenses/MIT">MIT</a>
            <a href="https://github.com/michaelcocova/splicetree/blob/main/LICENSE" target="_blank">License</a>.`,
      copyright: `
            Copyright © 2025-present
            <a target="_blank" href="https://www.splicetree.dev/">SpliceTree</a>`,
    },
    logo: {
      src: '/logo.svg',
      alt: 'SpliceTree Logo',
    },
    nav: [
      { text: '指南', link: '/getting-started' },
      { text: '插件', link: '/plugins' },
      { text: '适配器', link: '/adapters' },
      // { text: 'GitHub', link: 'https://github.com/michaelcocova/splicetree' },
    ],
    sidebar: [

      {
        text: '指南',
        items: [
          { text: '快速开始', link: '/getting-started' },
          { text: '核心（Core）', link: '/core' },
        ],
      },
      {
        text: '插件',
        items: [
          { text: '总览', link: '/plugins' },
          { text: 'Checkable', link: '/plugins/checkable' },
          {
            text: 'DnD',
            link: '/plugins/dnd',
          },
          { text: 'Keyboard', link: '/plugins/keyboard' },
          { text: 'Pointer', link: '/plugins/pointer' },
          { text: 'Selectable', link: '/plugins/selectable' },
          { text: 'Lazy Load', link: '/plugins/lazy-load' },
          { text: 'Search', link: '/plugins/search' },
          { text: '开发示例', link: '/plugins/example' },
        ],
      },
      {
        text: '适配器',
        items: [
          { text: '总览', link: '/adapters' },
          { text: 'Vue 3 适配', link: '/adapters/vue' },
        ],
      },
    ],
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/michaelcocova/splicetree',
      },
    ],
  },
  markdown: {
    codeTransformers: [
      transformerTwoslash(),
    ],
    config(md) {
      md.use(vitepressDemoPlugin)
    },
  },
  vite: {
    plugins: [
      tailwindcss() as any,
      Components({
        dirs: [resolve(__dirname, './theme/components')],
        dts: resolve(__dirname, '../typings/components.d.ts'),
        resolvers: [],
      }),
      AutoImport({
        dirs: [],
        imports: ['vue', 'vitepress'],
        dts: resolve(__dirname, '../typings/auto-imports.d.ts'),
      }),
    ],
    server: {
      port: 4200,
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './theme'),
      },
    },
  },
})
