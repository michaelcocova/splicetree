import type { EnhanceAppContext, Theme } from 'vitepress'
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
// https://vitepress.dev/guide/custom-theme
import FullTree from './components/FullTree.vue'
import IndexLayout from './components/IndexLayout.vue'
import { Button } from './components/ui/button'
import { Kbd, KbdGroup } from './components/ui/kbd'
import './style.css'
import './tailwind.css'
import '@shikijs/vitepress-twoslash/style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      'home-hero-image': () => h(FullTree),
    })
  },
  // Layout,
  enhanceApp({ router, app }: EnhanceAppContext) {
    app.use(TwoslashFloatingVue)
    app.component('Button', Button)
    app.component('Kbd', Kbd)
    app.component('KbdGroup', KbdGroup)
    app.component('IndexLayout', IndexLayout)
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
