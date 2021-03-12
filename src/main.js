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
import VueI18n from 'vue-i18n'
Vue.use(Vuetify)
// 由Vuetify（javascript）提供的翻译
/*import zhHans from 'vuetify/es5/locale/zh-Hans'*/
Vue.use(router);
Vue.use(VueI18n);
const messages = {
    en: {
        $vuetify: {
            badge: 'Badge',
            close: 'Close',
            dataIterator: {
                noResultsText: 'No matching records found',
                loadingText: 'Loading items...',
            },
            dataTable: {
                itemsPerPageText: 'Rows per page:',
                ariaLabel: {
                    sortDescending: 'Sorted descending.',
                    sortAscending: 'Sorted ascending.',
                    sortNone: 'Not sorted.',
                    activateNone: 'Activate to remove sorting.',
                    activateDescending: 'Activate to sort descending.',
                    activateAscending: 'Activate to sort ascending.',
                },
                sortBy: 'Sort by',
            },
            dataFooter: {
                itemsPerPageText: 'Items per page:',
                itemsPerPageAll: 'All',
                nextPage: 'Next page',
                prevPage: 'Previous page',
                firstPage: 'First page',
                lastPage: 'Last page',
                pageText: '{0}-{1} of {2}',
            },
            datePicker: {
                itemsSelected: '{0} selected',
                nextMonthAriaLabel: 'Next month',
                nextYearAriaLabel: 'Next year',
                prevMonthAriaLabel: 'Previous month',
                prevYearAriaLabel: 'Previous year',
            },
            noDataText: 'No data available',
            carousel: {
                prev: 'Previous visual',
                next: 'Next visual',
                ariaLabel: {
                    delimiter: 'Carousel slide {0} of {1}',
                },
            },
            calendar: {
                moreEvents: '{0} more',
            },
            fileInput: {
                counter: '{0} files',
                counterSize: '{0} files ({1} in total)',
            },
            timePicker: {
                am: 'AM',
                pm: 'PM',
            },
            pagination: {
                ariaLabel: {
                    wrapper: 'Pagination Navigation',
                    next: 'Next page',
                    previous: 'Previous page',
                    page: 'Goto Page {0}',
                    currentPage: 'Current Page, Page {0}',
                },
            },
            rating: {
                ariaLabel: {
                    icon: 'Rating {0} of {1}',
                },
            }
        },
    },
    zhHans: {
        $vuetify: {
            badge: '徽章',
            close: '关闭',
            dataIterator: {
                noResultsText: '没有符合条件的结果',
                loadingText: '加载中……',
            },
            dataTable: {
                itemsPerPageText: '每页数目：',
                ariaLabel: {
                    sortDescending: '：降序排列。',
                    sortAscending: '：升序排列。',
                    sortNone: '：未排序。',
                    activateNone: '点击以移除排序。',
                    activateDescending: '点击以降序排列。',
                    activateAscending: '点击以升序排列。',
                },
                sortBy: '排序方式',
            },
            dataFooter: {
                itemsPerPageText: '每页数目：',
                itemsPerPageAll: '全部',
                nextPage: '下一页',
                prevPage: '上一页',
                firstPage: '首页',
                lastPage: '尾页',
                pageText: '{0}-{1} 共 {2}',
            },
            datePicker: {
                itemsSelected: '已选择 {0}',
                nextMonthAriaLabel: '下个月',
                nextYearAriaLabel: '明年',
                prevMonthAriaLabel: '前一个月',
                prevYearAriaLabel: '前一年',
            },
            noDataText: '没有数据',
            carousel: {
                prev: '上一张',
                next: '下一张',
                ariaLabel: {
                    delimiter: '轮播{0} 共 {1}',
                },
            },
            calendar: {
                moreEvents: '还有 {0} 项',
            },
            fileInput: {
                counter: '{0} 个文件',
                counterSize: '{0} 个文件（共 {1}）',
            },
            timePicker: {
                am: 'AM',
                pm: 'PM',
            },
            pagination: {
                ariaLabel: {
                    wrapper: '分页导航',
                    next: '下一页',
                    previous: '上一页',
                    page: '转到页面 {0}',
                    currentPage: '当前页 {0}',
                },
            },
            rating: {
                ariaLabel: {
                    icon: 'Rating {0} of {1}',
                },
            },
        },
    },
}
// Create VueI18n instance with options
const i18n = new VueI18n({
    locale: 'zhHans', // set locale
    messages, // set locale messages
})
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
        lang: {
            t: (key, ...params) => i18n.t(key, params),
            current: 'zhHans',
        },
    }),

    router
}).$mount('#app')
