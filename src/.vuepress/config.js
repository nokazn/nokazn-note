module.exports = {
  title: 'nokazn\'s Notes',
  description: 'nokazn のメモ',
  dest: 'docs/',
  base: '/nokazn-notes/',
  lang: 'ja-JP',
  markdown: {
    lineNumbers: true
  },
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
    nav: [
      {
        text: 'GitHub',
        link: 'https://github.com/nokazn',
        target: '_blank'
      }
    ],
    sidebar: [
      '/',
      '/tips/javascript/undefinedについて',
      '/tips/javascript/型の判定',
    ],
    smoothScroll: true
  }
}
