import Vue from "vue";
import Router from "vue-router";
import Home from "../components/Home";
import 单站多要素 from "../components/数值预报查询/单站多要素";
import 多站单要素 from "../components/数值预报查询/多站单要素";
import 数值预报图表查询 from "../components/数值预报查询/数值预报图表查询";
import 环保局 from "../components/预报服务/环保局";
import 主页 from "../components/home/主页";
import Login from '../components/Login';
import myMapFirst from '../components/地图/myMapFirst';
import DYRH from "../components/MSJY/DYRH";
import StationJianYan from "../components/MSJY/DYRH/StationJianYan";
import StationJianYanStatistics from "../components/MSJY/DYRH/StationJianYanStatistics";
import DYRHPreMicaps from "../components/MSJY/DYRH/DYRHPreMicaps";
import StationJianYanChart from "../components/MSJY/DYRH/StationJianYanChart";
import SingleStationJianYanChart from "../components/MSJY/DYRH/SingleStationJianYanChart";
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
                requireAuth: false//如果为true则需要登录
            }
            , children: [
                {path: '/', meta: {requireAuth: false}, redirect: encodeURI('/数值预报查询/数值预报图表查询/地图查询')},
                {
                    path: encodeURI("/主页"),
                    name: "主页",
                    component: 主页,
                    meta: {
                        requireAuth: false
                    }
                }
                , {
                    path: encodeURI("/数值预报查询/数值预报图表查询"),
                    name: "数值预报图表查询",
                    component: 数值预报图表查询,
                    meta: {
                        requireAuth: false
                    },children: [
                        {path: '/', redirect: encodeURI('/数值预报查询/数值预报图表查询/地图查询')},
                        {
                            path: encodeURI("/数值预报查询/数值预报图表查询/单站多要素"),
                            name: "单站多要素",
                            component: 单站多要素,
                            meta: {
                                requireAuth: false
                            }
                        },
                        {
                            path: encodeURI("/数值预报查询/数值预报图表查询/多站单要素"),
                            name: "多站单要素",
                            component: 多站单要素,
                            meta: {
                                requireAuth: false
                            }
                        },
                        {
                            path: encodeURI("/数值预报查询/数值预报图表查询/地图查询"),
                            name: "地图查询",
                            component: myMapFirst,
                            meta: {
                                requireAuth: false
                            }
                        },
                        ]
                }
                , {
                    path: encodeURI("/预报服务/环保局"),
                    name: "环保局",
                    component: 环保局,
                    meta: {
                        requireAuth: false
                    }
                },
                {
                    path: encodeURI("/MSJY/DYRH"),
                    name: "DYRH",
                    component: DYRH,
                    meta: {
                        requireAuth: false
                    },
                    children: [
                        {path: '/', redirect: encodeURI("/MSJY/DYRH/StationJianYanChart")},
                        {
                            path: encodeURI("/MSJY/DYRH/StationJianYan"),
                            name: "StationJianYan",
                            component: StationJianYan,
                            meta: {
                                requireAuth: false
                            }
                        },
                        {
                            path: encodeURI("/MSJY/DYRH/StationJianYanChart"),
                            name: "StationJianYanChart",
                            component: StationJianYanChart,
                            meta: {
                                requireAuth: false
                            }
                        },
                        {
                            path: encodeURI("/MSJY/DYRH/SingleStationJianYanChart"),
                            name: "SingleStationJianYanChart",
                            component: SingleStationJianYanChart,
                            meta: {
                                requireAuth: false
                            }
                        },
                        {
                            path: encodeURI("/MSJY/DYRH/StationJianYanStatistics"),
                            name: "StationJianYanStatistics",
                            component: StationJianYanStatistics,
                            meta: {
                                requireAuth: false
                            }
                        },
                        {
                            path: encodeURI("/MSJY/DYRH/DYRHPreMicaps"),
                            name: "DYRHPreMicaps",
                            component: DYRHPreMicaps,
                            meta: {
                                requireAuth: false
                            }
                        },
                    ]
                }

            ]
        }

    ]
})
;
