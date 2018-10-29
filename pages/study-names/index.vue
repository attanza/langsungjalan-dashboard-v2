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
          <td>{{ props.item.description }}</td>
          <td class="justify-center layout px-0">
            <v-btn
              icon
              class="mx-0"
              @click="toDetail(props.item)">
              <Tbtn
                :tooltip-text="'Detail '+title"
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
      model="StudyName"
      @onClose="showDownloadDialog = false"/>

  </div>
</template>
<script>
import debounce from 'lodash/debounce'
import { STUDY_NAME_URL } from '~/utils/apis'
import { global } from '~/mixins'
import { dform } from '~/components/study-names'
import catchError from '~/utils/catchError'
import DownloadDialog from '~/components/DownloadDialog'

export default {
  middleware: 'auth',
  components: { dform, DownloadDialog },
  mixins: [global],
  data: () => ({
    title: 'Nama Studi',
    headers: [
      { text: 'Nama', align: 'left', value: 'name' },
      { text: 'Deskripsi', align: 'left', value: 'description' },
      { text: 'Aksi', value: '', align: 'center', sortable: false }
    ],
    items: [],
    confirmMessage: 'Yakin mau menghapus ?',
    showConfirm: false,
    dataToExport: [],
    fillable: ['id', 'name', 'description'],
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
        const endPoint = `${STUDY_NAME_URL}?${this.getQueryParams()}`

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
      this.$router.push(`/study-names/${data.id}`)
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
