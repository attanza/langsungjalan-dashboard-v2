import moment from 'moment'
import 'moment/locale/id' // without this line it didn't work
moment.locale('id')

Vue.use(moment)

export default ({ app }, inject) => {
  app.moment = moment
  inject('moment', moment)
}
