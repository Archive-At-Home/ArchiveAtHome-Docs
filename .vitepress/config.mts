import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Archive-at-Home Docs',
  description: 'Archive-at-Home documentation site',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '平台概览', link: '/docs/guide/overview' },
      { text: 'API 文档', link: '/docs/api/server' }
    ],

    sidebar: [
      {
        text: '文档目录',
        items: [
          {
            text: '指南',
            collapsed: false,
            items: [
              { text: '平台概览', link: '/docs/guide/overview' },
              { text: '节点部署', link: '/docs/guide/node' }
            ]
          },
          {
            text: 'API',
            items: [
              { text: 'Server API', link: '/docs/api/server' }
            ]
          }
        ]
      }
    ],

    socialLinks: [
      { icon: 'telegram', link: 'https://t.me/ArchiveAtHome' },
      { icon: 'github', link: 'https://github.com/Archive-At-Home/ArchiveAtHome-Web' }
    ]
  }
})
