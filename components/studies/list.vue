<template>
  <div>
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
          <td v-if="props.item.studyName">{{ props.item.studyName.name }}</td>
          <td v-if="props.item.university">{{ props.item.university.name }}</td>
          <!-- <td>{{ props.item.address }}</td> -->
          <td>{{ props.item.contact_person }}</td>
          <td>{{ props.item.phone }}</td>
          <td>{{ props.item.email }}</td>
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
      model="StudyProgram"
      @onClose="showDownloadDialog = false"/>

  </div>
</template>
<script>
import debounce from 'lodash/debounce'
import { STUDIES_URL } from '~/utils/apis'
import { global } from '~/mixins'
import { dform } from '~/components/studies'
import catchError from '~/utils/catchError'
import DownloadDialog from '~/components/DownloadDialog'

export default {
  middleware: 'auth',
  components: { dform, DownloadDialog },
  mixins: [global],
  data: () => ({
    title: 'Program Studi',

    headers: [
      { text: 'Nama', align: 'left', value: 'study_name_id' },
      { text: 'Universitas', align: 'left', value: 'university_id' },
      // { text: "Address", value: "address", align: "left" },
      { text: 'Nama kontak', value: 'contact_person', align: 'left' },
      { text: 'Telepon', value: 'phone', align: 'left' },
      { text: 'Email', value: 'email', align: 'left' },
      { text: 'Aksi', align: 'center', value: '', sortable: false }
    ],
    items: [],
    confirmMessage: 'Yakin mau menghapus ?',
    showConfirm: false,
    dataToExport: [],
    fillable: [
      'id',
      'university_id',
      'study_name_id',
      'address',
      'email',
      'phone',
      'description',
      'address',
      'contact_person'
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
        const endPoint = `${STUDIES_URL}?${this.getQueryParams()}`

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
      this.$router.push(`/study-programs/${data.id}`)
    },
    addData(data) {
      this.items.unshift(data)
      this.showForm = false
    },
    downloadData() {
      this.dataToExport = []
      this.items.map(data => {
        let d = Object.assign({}, data)
        if (d.university) delete d.university
        if (data.university) d.university = data.university.name

        if (d.studyName) delete d.studyName
        if (data.studyName) d.studyName = data.studyName.name

        if (d.years) delete d.years
        let years = ''
        if (data.years) {
          data.years.map(y => {
            let year = ''
            year += `[year: ${y.year}, class_per_year: ${
              y.class_per_year
            }, students_per_class: ${y.students_per_class}], `
            years += year
          })
        }
        d.years = years

        this.dataToExport.push(d)
      })
      if (this.dataToExport.length) {
        this.showDownloadDialog = true
      }
    }
  }
}
</script>
