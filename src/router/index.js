import Vue from "vue";
import Router from "vue-router";
import Home from "../components/Home";
import 单站多要素 from "../components/数值预报查询/单站多要素";
import 多站单要素 from "../components/数值预报查询/多站单要素";
import 数值预报图表查询 from "../components/数值预报查询/数值预报图表查询";
import 主页 from "../components/home/主页";
import Login from '../components/Login';
import myMapFirst from '../components/地图/myMapFirst';

Vue.use(Router);

export default new Router({
    mode: "history",
    routes: [
        {path: '/', redirect: '/Home'},
        {
            path: '/login',
            name: 'Login',
            component: Login,
            meta: {
                // 页面标题title
                title: '登录界面'
            }
        },
        {
            path: "/Home",
            component: Home,
            meta: {
                requireAuth: true
            }
            , children: [
                {path: '/', redirect: '/数值预报查询/数值预报图表查询/地图查询'},
                {
                    path: "/主页",
                    name: "主页",
                    component: 主页,
                    meta: {
                        requireAuth: true
                    }
                }
                , {
                    path: "/数值预报查询/数值预报图表查询",
                    name: "数值预报图表查询",
                    component: 数值预报图表查询,
                    meta: {
                        requireAuth: true
                    },children: [
                        {
                            path: "/数值预报查询/数值预报图表查询/单站多要素",
                            name: "单站多要素",
                            component: 单站多要素,
                            meta: {
                                requireAuth: true
                            }
                        },
                        {
                            path: "/数值预报查询/数值预报图表查询/多站单要素",
                            name: "多站单要素",
                            component: 多站单要素,
                            meta: {
                                requireAuth: true
                            }
                        },
                        {
                            path: "/数值预报查询/数值预报图表查询/地图查询",
                            name: "地图查询",
                            component: myMapFirst,
                            meta: {
                                requireAuth: true
                            }
                        },
                        ]
                }


            ]
        }

    ]
})
;
