<template>
  <div>
    <h2 class="primary--text mb-3">{{ title }}</h2>
    <v-card class="pt-3">
      <v-toolbar
        card
        color="transparent">
        <Tbtn
          :bottom="true"
          :tooltip-text="'Tambah ' + title "
          icon-mode
          color="primary"
          icon="add"
          @onClick="showForm = true"/>
        <Tbtn
          :bottom="true"
          :tooltip-text="'Download ' + title + ' data'"
          icon-mode
          color="primary"
          icon="cloud_download"
          @onClick="downloadData"/>
        <v-spacer/>
        <v-text-field
          v-model="pagination.search"
          append-icon="search"
          label="Cari"
          single-line
          hide-details
        />
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="items"
        :loading="loading"
        :pagination.sync="pagination"
        :total-items="totalItems"
        :rows-per-page-items="rowsPerPage"
        class="elevation-1"

      >
        <template
          slot="items"
          slot-scope="props">
          <td>{{ props.item.name }}</td>
          <!-- <td class="text-xs-left">{{ props.item.address }}</td> -->
          <td class="text-xs-left">{{ props.item.contact_person }}</td>
          <td class="text-xs-left">{{ props.item.phone }}</td>
          <td class="text-xs-left">{{ props.item.email }}</td>
          <td class="text-xs-left">{{ props.item.city }}</td>
          <td class="justify-center layout px-0">
            <v-btn
              icon
              class="mx-0"
              @click="toDetail(props.item)">
              <Tbtn
                :tooltip-text="'Show '+title"
                icon-mode
                flat
                color="primary"
                icon="remove_red_eye"
                @onClick="toDetail(props.item)"/>
            </v-btn>
          </td>
        </template>
      </v-data-table>
    </v-card>
    <dform
      :show="showForm"
      @onClose="showForm = false"
      @onAdd="addData"/>
    <DownloadDialog
      :show-dialog="showDownloadDialog"
      :data-to-export="dataToExport"
      :fillable="fillable"
      :type-dates="typeDates"
      model="University"
      @onClose="showDownloadDialog = false"/>

  </div>
</template>
<script>
import debounce from 'lodash/debounce'
import { UNIVERSITY_URL } from '~/utils/apis'
import { global } from '~/mixins'
import { dform } from '~/components/university'
import catchError from '~/utils/catchError'
import DownloadDialog from '~/components/DownloadDialog'

export default {
  middleware: 'auth',
  components: { dform, DownloadDialog },
  mixins: [global],
  data: () => ({
    title: 'Universitas',
    headers: [
      { text: 'Universitas', align: 'left', value: 'name' },
      // { text: "Address", value: "address", align: "left" },
      { text: 'Nama Kontak', value: 'contact_person', align: 'left' },
      { text: 'Telepon', value: 'phone', align: 'left' },
      { text: 'Email', value: 'email', align: 'left' },
      { text: 'Kota', value: 'city', align: 'left' },
      { text: 'Aksi', value: 'name', sortable: false }
    ],
    items: [],
    confirmMessage: 'Yakin mau menghapus ?',
    showConfirm: false,
    dataToExport: [],
    fillable: [
      'id',
      'name',
      'email',
      'phone',
      'description',
      'address',
      'contact_person',
      'province',
      'city'
    ],
    typeDates: ['created_at']
  }),

  watch: {
    pagination: {
      handler: debounce(function() {
        this.pupulateTable()
      }, 500),
      deep: true
    }
  },

  mounted() {
    this.pupulateTable()
  },

  methods: {
    async pupulateTable() {
      try {
        this.activateLoader()
        this.loading = true
        const { descending, sortBy } = this.pagination
        const endPoint = `${UNIVERSITY_URL}?${this.getQueryParams()}`

        const res = await this.$axios.$get(endPoint)
        this.items = res.data
        this.totalItems = res.meta.total
        if (this.pagination.sortBy) {
          this.items = this.items.sort((a, b) => {
            const sortA = a[sortBy]
            const sortB = b[sortBy]

            if (descending) {
              if (sortA < sortB) return 1
              if (sortA > sortB) return -1
              return 0
            } else {
              if (sortA < sortB) return -1
              if (sortA > sortB) return 1
              return 0
            }
          })
        }
        this.loading = false
        this.deactivateLoader()
      } catch (e) {
        this.deactivateLoader()

        catchError(e)
      }
    },
    toDetail(data) {
      this.$router.push(`/universities/${data.id}`)
    },
    addData(data) {
      this.items.unshift(data)
      this.showForm = false
    },
    downloadData() {
      this.dataToExport = []
      this.dataToExport = this.items
      if (this.dataToExport.length) {
        this.showDownloadDialog = true
      }
    }
  }
}
</script>
