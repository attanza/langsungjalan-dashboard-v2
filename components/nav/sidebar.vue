<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant.sync="mini"
      fixed
      app
    >
      <v-toolbar flat>
        <v-list class="pa-0">
          <v-list-tile>
            <v-list-tile-content v-if="!mini">
              <img 
                src="/images/logo2.png" 
                width="50%" 
                style="margin-left: -10px;">
            </v-list-tile-content>
            <v-list-tile-avatar v-if="mini">
              <img src="/images/logo.png" >
            </v-list-tile-avatar>
            <v-list-tile-action>
              <v-btn 
                icon 
                @click.native.stop="mini = !mini">
                <v-icon>chevron_left</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-list>
        <div 
          v-for="(item, i) in items" 
          :key="i" >
          <v-list-tile
            v-if="!item.hasChild"
            :to="item.to"
            router
            exact
          >
            <v-list-tile-action>
              <v-icon v-html="item.icon"/>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="item.title"/>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-group
            v-if="item.hasChild"
            :prepend-icon="item.icon"
            no-action
          >
            <v-list-tile slot="activator">
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile>
            <v-list-tile
              v-for="(item, i) in item.children"
              :key="i"
              :to="item.to"
              router
            >

              <v-list-tile-content>
                <v-list-tile-title v-text="item.title"/>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon v-html="item.icon"/>
              </v-list-tile-action>
            </v-list-tile>
        </v-list-group></div>
        
      </v-list>
    </v-navigation-drawer>
    <v-toolbar 
      fixed 
      app>
      <v-toolbar-side-icon @click="drawer = !drawer"/>
      <v-spacer/>
      <v-toolbar-items>
        <v-menu
          origin="center center"
          transition="scale-transition"
          bottom
        >
          <v-btn 
            slot="activator" 
            icon 
            large>
            <v-avatar>
              <img
                :src="avatar"
                :alt="user.name"
              >
            </v-avatar>
          </v-btn>
          <v-list>
            <v-list-tile 
              avatar 
              color="primary">
              <v-list-tile-avatar>
                <v-img
                  :src="avatar"
                  aspect-ratio="1"
                />
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-html="user.name"/>
                <v-list-tile-sub-title v-html="user.email"/>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider/>
            <v-list-tile 
              v-for="(item, index) in righItems" 
              :key="index" 
              @click="itemActions(item.title)">
              <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
import Cookie from 'js-cookie'

export default {
  data() {
    return {
      clipped: false,
      drawer: true,
      items: [
        { title: 'Dashboard', icon: 'dashboard', to: '/' },
        {
          title: 'Role dan Permission',
          icon: 'pan_tool',
          to: '/roles',
          hasChild: true,
          children: [
            { title: 'Role', icon: 'format_line_spacing', to: '/roles' },
            {
              title: 'Permission',
              icon: 'format_list_bulleted',
              to: '/permissions'
            }
          ]
        },
        {
          title: 'User',
          icon: 'account_circle',
          to: '/users',
          hasChild: true,
          children: [
            { title: 'User', icon: 'perm_identity', to: '/users' },
            { title: 'Supervisor', icon: 'perm_identity', to: '/supervisors' }
          ]
        },
        {
          title: 'Kampus',
          icon: 'account_balance',
          to: '/universities',
          hasChild: true,
          children: [
            {
              title: 'Universitas',
              icon: 'account_balance',
              to: '/universities'
            },
            {
              title: 'Nama Studi',
              icon: 'description',
              to: '/study-names'
            },
            {
              title: 'Program Studi',
              icon: 'library_books',
              to: '/study-programs'
            }
          ]
        },
        {
          title: 'Marketing',
          icon: 'supervised_user_circle',
          to: '/marketings',
          hasChild: true,
          children: [
            {
              title: 'List',
              icon: 'supervised_user_circle',
              to: '/marketings'
            },
            {
              title: 'Aksi',
              icon: 'list',
              to: '/marketing-actions'
            },
            {
              title: 'Target',
              icon: 'launch',
              to: '/targets'
            },
            {
              title: 'Jadwal',
              icon: 'date_range',
              to: '/schedulles'
            },
            {
              title: 'Laporan',
              icon: 'find_in_page',
              to: '/marketing-reports'
            }
          ]
        },
        {
          title: 'Produk',
          icon: 'donut_small',
          to: '/products'
        },
        {
          title: 'Kontak',
          icon: 'contact_phone',
          to: '/contacts'
        },
        {
          title: 'Lampiran',
          icon: 'attach_file',
          to: '/attachments'
        }
      ],
      mini: false,
      right: true,
      rightDrawer: false,
      title: 'Langsung Jalan',
      righItems: [
        { title: 'Profile', icon: 'account_box' },
        { title: 'Logout', icon: 'exit_to_app' }
      ]
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    avatar() {
      if (this.user && this.user.photo != '') {
        return this.user.photo
      }
      return '/images/user.png'
    }
  },
  methods: {
    logout() {
      Cookie.remove('lj_token')
      this.$store.commit('token', null)
      this.$store.commit('user', {})
      this.$router.push('/login')
    },
    toProfile() {
      this.$router.push('/profile')
    },
    itemActions(title) {
      switch (title) {
        case 'Logout':
          this.logout()
          break
        case 'Profile':
          this.toProfile()
          break

        default:
          break
      }
    }
  }
}
</script>

<style scoped>
</style>
