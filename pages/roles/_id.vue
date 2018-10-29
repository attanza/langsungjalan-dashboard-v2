<template>
  <div>
    <h2
      v-if="currentEdit"
      class="primary--text mb-2">Role {{ currentEdit.name }}</h2>
    <v-tabs
      align-with-title
      color="primary"
      class="white elevation-1"
      dark>
      <v-tabs-slider color="white"/>
      <v-tab href="#detail">
        Detail
      </v-tab>
      <v-tab href="#permissions">
        Permission
      </v-tab>
      <v-tab-item :value="'detail'">
        <detail/>
      </v-tab-item>
      <v-tab-item :value="'permissions'">
        <permission/>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import { ROLE_URL, COMBO_DATA_URL } from '~/utils/apis'
import { detail, dform, permission } from '~/components/roles'
import { global } from '~/mixins'
import catchError from '~/utils/catchError'

const API_URL = process.env.API_URL

export default {
  async fetch({ store, params, app }) {
    try {
      let resp = await app.$axios.$get(ROLE_URL + '/' + params.id)
      if (resp) store.commit('currentEdit', resp.data)

      let permissions = await app.$axios.$get(COMBO_DATA_URL + 'Permission')
      if (permissions) store.commit('comboData', permissions)

      let rolePermissions = await app.$axios.$get(
        API_URL + '/role/' + params.id + '/permissions'
      )
      if (rolePermissions) store.commit('permissions', rolePermissions.data)
    } catch (e) {
      console.log('e', e)
      catchError(e)
    }
  },
  components: { detail, dform, permission },
  mixins: [global]
}
</script>

<style scoped>
</style>
