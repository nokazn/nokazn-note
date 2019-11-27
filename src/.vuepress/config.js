module.exports = {
  title: '@nokazn/notes',
  description: 'nokazn のメモ',
  dest: 'docs/',
  base: '/notes/',
  lang: 'ja-JP',
  plugins: [
    '@vuepress/back-to-top',
    [
      '@vuepress/last-updated',
      {
        transformer (time) {
          const moment = require('moment-timezone').tz.setDefault('Asia/Tokyo');
          return moment(time).format('YYYY-M-D H:mm');
        }
      }
    ]
  ],
  themeConfig: {
    lastUpdated: 'Last Updated',
    repo: 'nokazn/notes',
    repoLabel: 'GitHub',
    sidebar: [
      '/',
      {
        title: 'JavaScript',
        children: [
          '/javascript/undefined/',
          '/javascript/checking-type/'
        ]
      },
      {
        title: 'Vue.js',
        children: [
          '/vuejs/boilerplate/'
        ]
      // },
      // {
      //   title: 'Web',
      //   children: [
      //     '/web/service-worker-pwa/'    
      //   ]
      }
    ],
    sidebarDepth: 2,
    smoothScroll: true
  }
}
