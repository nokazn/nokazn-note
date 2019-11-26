<template>
  <ul>
    <li
      v-for="page in pages">
      <router-link :to="page.path">{{ page.title }}</router-link>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'PageList',
  props: {
    parent: {
      type: String,
      required: true
    }
  },
  mounted () {
    console.log(this.$site)
  },
  computed: {
    pages () {
      return this.$site.pages
        .filter(page => new RegExp(`^${this.parent}`).test(page.path))
    }
  }
}
</script>
