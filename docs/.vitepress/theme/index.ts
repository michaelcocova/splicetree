import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import FullTree from './components/FullTree.vue'
import './style.css'
import './tailwind.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      'home-hero-image': () => h(FullTree),
    })
  },
  enhanceApp({ router }) {
    // ...
    // 单页面应用路由更新时触发百度统计事件

    router.onBeforeRouteChange = (to) => {
      // @ts-ignore
      if (typeof _hmt !== 'undefined') {
        // @ts-ignore
        _hmt.push(['_trackPageview', to])
      }
    }
  },
} satisfies Theme
