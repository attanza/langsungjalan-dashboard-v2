<template>
  <div class="mt-4">
    <h3 class="subheading ml-3">Angkatan</h3>

    <v-toolbar 
      flat 
      color="transparent">
      <Tbtn 
        :bottom="true" 
        tooltip-text="Tambah angkatan" 
        icon-mode 
        color="primary" 
        icon="add" 
        @onClick="showForm = true"/>
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
        <td>{{ props.item.year }}</td>
        <td>{{ props.item.class }}</td>
        <td>{{ props.item.students }}</td>
        <td class="justify-center layout px-0">
          <Tbtn 
            :tooltip-text="'Hapus'" 
            icon-mode 
            flat 
            color="primary" 
            icon="delete" 
            @onClick="showConfirm(props.item)"/>
        </td>
      </template>
    </v-data-table>
    <Dialog 
      :showDialog="showDialog" 
      text="Yakin mau menghapus ?" 
      @onClose="showDialog = false" 
      @onConfirmed="removeData"/>
    <year-form 
      :show="showForm" 
      :target-id="targetId" 
      @onClose="showForm = false" 
      @onAdd="addData"/>
  </div>
</template>

<script>
import { TARGET_YEARS } from '~/utils/apis'
import catchError, { showNoty } from '~/utils/catchError'
import axios from 'axios'
import { global } from '~/mixins'
import _ from 'lodash'
import Dialog from '~/components/Dialog'
import yearForm from './yearForm'

export default {
  components: { Dialog, yearForm },
  mixins: [global],
  data() {
    return {
      headers: [
        { text: 'Angkatan', align: 'left', value: 'name' },
        { text: 'Jumlah Kelas', align: 'left', value: 'title' },
        { text: 'Rata-rata Siswa per Kelas', align: 'left', value: 'phone' },
        { text: 'Aksi', value: 'name', align: 'center', sortable: false }
      ],
      items: [],
      showDialog: false,
      dataToDelete: null,
      showForm: false
    }
  },
  computed: {
    targetId() {
      return this.currentEdit.schedulle.target.id || null
    }
  },
  watch: {
    pagination: {
      handler: _.debounce(function() {
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
        const endPoint = `${TARGET_YEARS}?${this.getQueryParams()}&marketing_target_id=${this.getTargetId(
          this.currentEdit
        )}`

        const res = await axios.get(endPoint).then(res => res.data)
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
        console.log(e)

        this.loading = false
        this.showForm = false
        this.deactivateLoader()
        catchError(e)
      }
    },
    getTargetId(data) {
      return data.schedulle && data.schedulle.target
        ? data.schedulle.target.id
        : null
    },
    showConfirm(data) {
      this.showDialog = true
      this.dataToDelete = data
    },
    addData(data) {
      this.items.unshift(data)
      this.showForm = false
    },
    removeData() {
      try {
        this.activateLoader()
        axios.delete(TARGET_YEARS + '/' + this.dataToDelete.id).then(resp => {
          if (resp.status === 200) {
            let index = _.findIndex(
              this.items,
              item => item.id == this.dataToDelete.id
            )
            this.items.splice(index, 1)
            showNoty('Data dihapus', 'success')
            this.showDialog = false
            this.dataToDelete = null
          }
        })
        this.deactivateLoader()
      } catch (e) {
        this.deactivateLoader()
        catchError(e)
      }
    }
  }
}
</script>

<style scoped>
</style>
