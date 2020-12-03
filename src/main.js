import 'roboto-fontface/css/roboto/roboto-fontface.css'
import Vuetify from 'vuetify'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
//import '@/assets/js/fontawesome-pro-5.14.0/js/all.css' fontawesome图标，需要再用
import Vue from 'vue'
//import '@progress/kendo-ui/js/cultures/kendo.culture.zh-CN.js'
import store from './store'
import echarts from 'echarts'
Vue.prototype.$echarts = echarts;
import App from './App.vue'
import router from "./router"
Vue.use(Vuetify)
//kendo.culture("zh-CN")
// 设置反向代理，前端请求默认发送到http://localhost:3691/api  http://172.18.142.203:3691/api
var axios = require('axios')
axios.defaults.baseURL = 'http://172.18.142.203:3691/api'
// 全局注册，之后可在其他组件中通过 this.$axios 发送数据
Vue.prototype.$axios = axios

//Vue.config.productionTip = false ,作用是阻止vue 在启动时生成生产提示。
Vue.config.productionTip = false
router.beforeEach((to, from, next) => {
        if (to.meta.requireAuth) {
            if (store.state.user.username && store.state.user.expiresTime - new Date().getTime() >= 0) {
                next()
            } else {
               store.state.user.username = ''
               store.state.user.expiresTime = 0
                next({
                    path: 'login',
                    query: {redirect: to.fullPath}
                })
            }
        } else {
            next()
        }
    }
)

new Vue({
    render: h => h(App),
    store,

    //
    vuetify:new Vuetify({
        theme: {
            dark: true,
        },
    }),

    router
}).$mount('#app')
