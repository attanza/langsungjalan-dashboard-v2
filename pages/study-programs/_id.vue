<template>
  <div>
    <h2 class="primary--text mb-2"> Detail Program Studi</h2>
    <v-tabs 
      align-with-title 
      color="primary" 
      class="white elevation-1" 
      dark>
      <v-tabs-slider color="white"/>
      <v-tab href="#detail">
        Detail
      </v-tab>
      <v-tab href="#years">
        Angkatan
      </v-tab>
      <v-tab href="#maps">
        Peta
      </v-tab>
      <v-tab-item :value="'detail'">
        <detail/>
      </v-tab-item>
      <!-- <v-tab-item :value="'years'">
        <list/>
      </v-tab-item>
      <v-tab-item :value="'maps'">
        <maps/>
      </v-tab-item> -->
    </v-tabs>
  </div>
</template>

<script>
import { STUDIES_URL, COMBO_DATA_URL } from '~/utils/apis'
import { detail, maps } from '~/components/studies'
import { list } from '~/components/studies/years'
import catchError from '~/utils/catchError'

export default {
  async fetch({ store, params, app }) {
    try {
      // Current Edit
      let currentEdit = await app.$axios.$get(STUDIES_URL + '/' + params.id)
      if (currentEdit) store.commit('currentEdit', currentEdit.data)

      let resp = await app.$axios.$get(COMBO_DATA_URL + 'University')
      if (resp) store.commit('comboData', resp)
      let resp2 = await app.$axios.$get(COMBO_DATA_URL + 'StudyName')
      if (resp2) store.commit('comboData2', resp2)
    } catch (e) {
      catchError(e)
    }
  },
  components: { detail, maps, list }
}
</script>

<style scoped>
</style>
