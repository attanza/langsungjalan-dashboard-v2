<template>
  <div>
    <h2 class="primary--text mb-2">{{ title }} Detail</h2>
    <v-tabs
      align-with-title
      color="primary"
      class="white elevation-1"
      dark>
      <v-tabs-slider color="white"/>
      <v-tab href="#detail">
        Detail
      </v-tab>
      <v-tab href="#roles">
        Role
      </v-tab>
      <v-tab href="#activities">
        Aktifitas
      </v-tab>
      <v-tab-item :value="'detail'">
        <detail/>
      </v-tab-item>
      <v-tab-item :value="'roles'">
        <roles/>
      </v-tab-item>
      <v-tab-item :value="'activities'">
        <activities/>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import { USER_URL, COMBO_DATA_URL } from '~/utils/apis'
import axios from 'axios'
import { detail, dform, roles, activities } from '~/components/users'
import catchError from '~/utils/catchError'

export default {
  async fetch({ store, params, app }) {
    try {
      let resp = await app.$axios.$get(USER_URL + '/' + params.id)
      if (resp) store.commit('currentEdit', resp.data)
      // Combo / Select Data
      let combo = await app.$axios.$get(COMBO_DATA_URL + 'Role')
      if (combo) store.commit('comboData', combo)
    } catch (e) {
      catchError(e)
    }
  },
  components: { detail, dform, roles, activities },
  data() {
    return {
      title: 'User'
    }
  }
}
</script>

<style scoped>
</style>
