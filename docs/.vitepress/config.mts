import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitepress'
import { vitepressDemoPlugin } from 'vitepress-demo-plugin'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/',
  lang: 'zh-CN',
  lastUpdated: true,
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
    outline: {
      label: '本页导航',
      level: [2, 3],
    },
    sidebar: [
      {
        items: [
          { text: '快速开始', link: '/getting-started' },
          { text: '核心（Core）', link: '/core' },
          {
            text: '插件',
            items: [
              { text: '总览', link: '/plugins' },
              { text: 'Checkable', link: '/plugins/checkable' },
              { text: 'DnD', link: '/plugins/dnd' },
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
    config(md) {
      md.use(vitepressDemoPlugin)
    },
  },
  vite: {
    plugins: [tailwindcss() as any],
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
