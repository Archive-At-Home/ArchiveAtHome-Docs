import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { h } from 'vue'
import ApiReferenceStandalone from './components/ApiReferenceStandalone.vue'
import UnifiedLocalNav from './components/UnifiedLocalNav.vue'
import './style.css'

const theme: Theme = {
    ...DefaultTheme,
    Layout() {
        return h(DefaultTheme.Layout, null, {
            'doc-top': () => h(UnifiedLocalNav),
            'page-top': () => h(UnifiedLocalNav),
        })
    },
    enhanceApp(ctx) {
        DefaultTheme.enhanceApp?.(ctx)
        ctx.app.component('ApiReferenceStandalone', ApiReferenceStandalone)
    },
}

export default theme
