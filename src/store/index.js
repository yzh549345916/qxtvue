import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        MsgRight:[],
        user: {
            username: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).username,
            expiresTime:window.localStorage.getItem('user' || '[]') == null ? new Date(100, 0, 1).getTime() : JSON.parse(window.localStorage.getItem('user' || '[]')).expiresTime
        }
    },
    getters:{},
    mutations: {
        login (state, user) {
            state.user = user
            window.localStorage.setItem('user', JSON.stringify(user))
        },
        getMsgRight(state,pro){
            state.MsgRight = pro;
        },
    },
    actions:{
        axiostest(context,array){
            context.commit('getMsgRight',array);
        },
    }
})