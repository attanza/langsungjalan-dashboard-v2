const cookieparser = require('cookieparser')

export const state = () => ({
  sidebar: false,
  user: {},
  token: null,
  currentEdit: null,
  currentEdit2: null,
  comboData: null,
  comboData2: null,
  comboData3: null,
  permissions: null,
  dashboardData: null
})

export const mutations = {
  toggleSidebar(state) {
    state.sidebar = !state.sidebar
  },
  user(state, p) {
    state.user = p
  },
  token(state, p) {
    state.token = p
  },
  currentEdit(state, p) {
    state.currentEdit = p
  },
  currentEdit2(state, p) {
    state.currentEdit = p
  },
  comboData(state, p) {
    state.comboData = p
  },
  comboData2(state, p) {
    state.comboData2 = p
  },
  comboData3(state, p) {
    state.comboData3 = p
  },
  permissions(state, p) {
    state.permissions = p
  },
  dashboardData(state, p) {
    state.dashboardData = p
  }
}

export const actions = {
  nuxtServerInit({ commit }, { req }) {
    let token = null
    let user = null

    if (req.headers.cookie) {
      let parsed = cookieparser.parse(req.headers.cookie)
      if (parsed.lj_token) {
        let data = JSON.parse(parsed.lj_token)
        token = data.token
        user = data.user
      }
    }
    commit('token', token)
    commit('user', user)
    // this.$axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    this.$axios.setHeader('Authorization', `Bearer ${token}`)
  }
}

export const getters = {
  getPermissions: state => name => {
    return state.comboData.filter(
      item => item.name.toLowerCase().indexOf(name) > -1
    )
  },
  getRoles: state => name => {
    return state.comboData.filter(
      item => item.name.toLowerCase().indexOf(name) > -1
    )
  }
}
// var test = _.filter(items, function (item) {
//   return _.some(item.tags, function (tag) {
//     return _.startsWith(tag, input.val());
//   });
// });
