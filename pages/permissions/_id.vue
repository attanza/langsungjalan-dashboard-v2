<template>
  <div>
    <h2
      v-if="currentEdit"
      class="primary--text mb-2">Permission {{ currentEdit.name }}</h2>
    <v-tabs
      align-with-title
      color="primary"
      class="white elevation-1"
      dark>
      <v-tabs-slider color="white"/>
      <v-tab href="#detail">
        Detail
      </v-tab>
      <v-tab-item :value="'detail'">
        <detail/>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import { PERMISSION_URL } from '~/utils/apis'
import { detail } from '~/components/permissions'
import { global } from '~/mixins'
import catchError from '~/utils/catchError'

export default {
  async fetch({ store, params, app }) {
    try {
      let resp = await app.$axios.$get(PERMISSION_URL + '/' + params.id)
      if (resp) store.commit('currentEdit', resp.data)
    } catch (e) {
      catchError(e)
    }
  },
  components: { detail },
  mixins: [global]
}
</script>

<style scoped>
</style>
