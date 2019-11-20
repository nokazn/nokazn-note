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
    ['@vuepress/back-to-top', true],
    ['@vuepress/last-updated']
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
      '/tips/javascript/undefined'
    ],
    smoothScroll: true
  }
}
