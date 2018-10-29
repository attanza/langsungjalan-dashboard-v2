<template>
  <v-layout 
    row 
    justify-center>
    <v-dialog 
      v-model="dialog" 
      persistent 
      max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline primary--text">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <form>
              <v-layout 
                row 
                wrap>
                <v-flex 
                  v-for="(f, index) in fillable" 
                  v-if="f.key != 'marketing_target_id' && f.show" 
                  :key="index" 
                  sm6 
                  xs12>
                  <label>{{ f.caption }}</label>
                  <v-text-field
                    v-validate="f.rules"
                    v-model="formData[f.key]"
                    :error-messages="errors.collect(f.key)"
                    :name="f.key"
                    :data-vv-name="f.key"
                    :data-vv-as="f.caption"
                    type="number"

                  />
                </v-flex>
                <v-flex 
                  v-for="(f, index) in fillable" 
                  v-if="targetId == 0 && f.key == 'marketing_target_id'" 
                  :key="index" 
                  sm6 
                  xs12>
                  <label>Kode Jadwal</label>
                  <v-autocomplete
                    v-validate="'required|integer'"
                    v-model="formData['marketing_target_id']"
                    :items="targetItems"
                    :loading="targetComboLoading"
                    :search-input.sync="searchTarget"
                    :error-messages="errors.collect('marketing_target_id')"
                    item-text="code"
                    item-value="id"
                    placeholder="Ketik untuk mencari kode target"
                    name="marketing_target_id"
                    data-vv-name="marketing_target_id"
                    data-vv-as="Kode Target"
                    hide-no-data
                    hide-selected
                  />
                </v-flex>
              </v-layout>     
            </form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn 
            color="primary" 
            @click.native="onClose">Tutup</v-btn>
          <v-btn 
            color="primary" 
            @click.native="submit">Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import { global } from '~/mixins'
import { TARGET_YEARS, COMBO_DATA_URL } from '~/utils/apis'
import axios from 'axios'
import catchError, { showNoty } from '~/utils/catchError'
import _ from 'lodash'

export default {
  $_veeValidate: {
    validator: 'new'
  },
  mixins: [global],
  props: {
    show: {
      type: Boolean,
      required: true
    },
    targetId: {
      type: Number,
      required: false,
      default: 0
    }
  },
  data() {
    return {
      dialog: false,
      formTitle: 'Tambah Angkatan',
      fillable: [
        {
          key: 'marketing_target_id',
          caption: 'Kode Target',
          value: '',
          rules: 'required|integer',
          show: false
        },
        {
          key: 'year',
          caption: 'Angkatan',
          value: '',
          rules: 'required|max:4',
          show: false
        },
        {
          key: 'class',
          caption: 'Jumlah Kelas',
          value: '',
          rules: 'required|integer',
          show: false
        },
        {
          key: 'students',
          caption: 'Rata-rata Mahasiswa',
          value: '',
          rules: 'required|integer',
          show: false
        },
        {
          key: 'count_attendence',
          caption: 'Jumlah Hadir',
          value: '',
          rules: 'integer',
          show: false
        },
        {
          key: 'people_dp',
          caption: 'Jumlah Orang DP',
          value: '',
          rules: 'integer',
          show: false
        },
        {
          key: 'count_dp',
          caption: 'Total DP Diterima',
          value: '',
          rules: 'integer',
          show: false
        },
        {
          key: 'count_add',
          caption: 'Jumlah Tambah',
          value: '',
          rules: 'integer',
          show: false
        },
        {
          key: 'count_cancel',
          caption: 'Jumlah Batal',
          value: '',
          rules: 'integer',
          show: false
        },
        {
          key: 'count_packages',
          caption: 'Jumlah Bagi Paket',
          value: '',
          rules: 'integer',
          show: false
        }
      ],
      formData: {},
      targetEntries: [],
      targetComboLoading: false,
      searchTarget: null
    }
  },

  computed: {
    targetItems() {
      let items = []
      if (this.targetEntries.length > 0) {
        this.targetEntries.map(target => items.push(target))
      }
      return items
    },
    actionId() {
      return this.currentEdit.schedulle.marketing_action_id || 0
    }
  },
  watch: {
    show() {
      this.dialog = this.show
    },
    searchTarget() {
      if (this.searchTarget && this.searchTarget.length > 2) {
        this.getTarget()
      }
    }
  },
  created() {
    this.setFields()
  },
  methods: {
    getTarget: _.debounce(async function() {
      try {
        this.targetComboLoading = true
        this.targetEntries = await axios
          .get(COMBO_DATA_URL + 'MarketingTarget&search=' + this.searchTarget)
          .then(res => res.data)
        this.targetComboLoading = false
      } catch (e) {
        this.targetComboLoading = false
        catchError(e)
      }
    }, 500),
    onClose() {
      this.$emit('onClose')
    },
    setFields() {
      this.fillable.forEach(data => (this.formData[data.key] = data.value))
      this.errors.clear()
      if (this.targetId && this.targetId != 0) {
        this.formData['marketing_target_id'] = this.targetId
      }
      this.showFormField()
    },
    showFormField() {
      if (this.actionId === 1) {
        let shouldShow = ['year', 'class', 'students']
        shouldShow.map(f => {
          let fill = _.find(this.fillable, ['key', f])
          fill.show = true
        })
      }
    },
    submit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.saveData()
          return
        }
      })
    },
    async saveData() {
      try {
        this.activateLoader()
        const resp = await axios
          .post(TARGET_YEARS, this.formData)
          .then(res => res.data)
        if (resp.meta.status === 201) {
          showNoty('Data disimpan', 'success')
          this.$emit('onAdd', resp.data)
          this.setFields()
        }
        this.deactivateLoader()
      } catch (e) {
        this.deactivateLoader()
        catchError(e)
      }
    }
  }
}
</script>
