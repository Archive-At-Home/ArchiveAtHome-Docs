import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import ApiReferenceStandalone from './components/ApiReferenceStandalone.vue'
import './style.css'

const theme: Theme = {
    ...DefaultTheme,
    enhanceApp(ctx) {
        DefaultTheme.enhanceApp?.(ctx)
        ctx.app.component('ApiReferenceStandalone', ApiReferenceStandalone)
    },
}

export default theme
