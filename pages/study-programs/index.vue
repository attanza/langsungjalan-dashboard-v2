<template>
  <div>
    <h2 class="primary--text mb-3">{{ title }}</h2>
    <study-list/>
  </div>
</template>

<script>
import { studyList } from '~/components/studies'
export default {
  components: { studyList },
  data() {
    return {
      title: 'Studi Program'
    }
  }
}
</script>

<style scoped>
</style>
