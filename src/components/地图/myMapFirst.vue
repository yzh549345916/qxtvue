<template>
  <v-sheet style="height: 100%;" color="transparent" class="overflow-x-auto">

    <div class="maps" id="map" style="width:100%;height:98%;z-index:5;">
      <maptool style="transform: scale(0.85,0.85)" @tctoolbox-change='tcToolboxControlChange' v-drag></maptool>
      <mapQbTimeControl style="transform: scale(0.85,0.85)" v-drag @datetime-change='mapQbTimeControlChange'
                        :lx-type="lxType" v-if="stationybTimeBs" :yb-type="stationYbDataType" :data-type="stationYbType"></mapQbTimeControl>
      <mapStationTool style="transform: scale(0.85,0.85)" @stationType-change=stationTypeChange
                      @stationDQ-change=stationDQChange v-drag v-if="stationBs"></mapStationTool>
      <mapShaChenQbTimeControl style="transform: scale(0.85,0.85)" v-drag @datetime-change='mapShaChenQbTimeControlChange' :highBs="heighBs"
                        :lx-type="lxType" v-if="shaChenStationBs" :dataTypeStr="dataTypeStr" :data-type="stationYbType"></mapShaChenQbTimeControl>

    </div>
    <!-- 弹窗元素 -->
    <div
        class="popup1"
        ref="popup1"
        v-show="currentCoordinate !==null"

    >
      <v-chip
          @click:close="closePopup"
      >
<!--        close-->
        <v-avatar left>
          <v-icon color="primary">mdi-artstation</v-icon>
        </v-avatar>
        <div v-html="currentCoordinate"></div>
      </v-chip>
    </div>
    <!-- 点击弹窗元素 -->
    <div
        class="popupClick"
        ref="popupClick"
        v-show="currentCoordinateClick !==null"
    >
      <StationDetails style="transform: scale(0.85,0.85)" :stationYbQbTimespan="stationYbQbTimespan"
                      :StationID="SelectStationID" :stationlevel="stationlevel" :stationlevelType="stationlevelType" :displayBs="currentCoordinateClick !==null"
                      :yb-type="stationYbType" :data-type="stationYbDataType"></StationDetails>
    </div>
    <!-- 点击弹窗元素 -->
    <div
        class="shaChenClick"
        ref="shaChenClick"
        v-show="shachenCoordinateClick !==null"
    >
      <shachenStationDetails style="transform: scale(0.85,0.85)" :stationYbQbTimespan="stationYbQbTimespan" :displayBs="shachenCoordinateClick !==null"
                      :StationID="SelectStationID" :stationlevel="stationlevel" :heighBs="heighBs" :units="SelectUnits"
                      :yb-type="stationYbType" :data-type="dataTypeStr"></shachenStationDetails>
    </div>
  </v-sheet>
</template>
<script>
import "@/assets/styles/ol.css";
import "@/assets/styles/ol-layerswitcher.css";
import {Map, View} from "ol";
import {unByKey} from "ol/Observable"
import Tile from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import {format} from 'ol/coordinate';
import MousePosition from "ol/control/MousePosition.js";
import FullScreen from "ol/control/FullScreen.js";
import ScaleLine from "ol/control/ScaleLine.js";
import Image from "ol/layer/Image";
import Point from 'ol/geom/Point';
import Group from "ol/layer/Group";
import Overlay from 'ol/Overlay'
import GeoJSON from "ol/format/GeoJSON";
import {fromLonLat, Projection, addProjection, addCoordinateTransforms} from 'ol/proj';
import Feature from 'ol/Feature';
import {Circle as CircleStyle, Fill, Stroke, Icon, Style, Text} from 'ol/style';
import {XYZ, Vector, ImageWMS, Cluster} from "ol/source";
import maptool from "@/components/地图/地图工具组件"
import mapQbTimeControl from '@/components/基础组件/地图起报时间组件'
import mapShaChenQbTimeControl from '@/components/基础组件/地图沙尘起报时间组件'
import mapStationTool from "@/components/地图/地图站点选择"
import StationDetails from "@/components/地图/StationDetails"
import shachenStationDetails from "@/components/地图/shachenStationDetails";
import LayerSwitcher from "ol-layerswitcher";
import projzh from "@/assets/js/mypro";
import {
  ecStrToInt,
  qtShaChenDataTypeConvert,
  cuaceDataTypeConvert,
  JingjinjiDataTypeConvert
} from "@/assets/js/yaoSuDuiZhao";
import { WindLayer } from 'ol-wind'
/*import myjson from '../../assets/json/2.json'*/
export default {
  name: "myMapFirst",
  data() {
    return {
      map: {},
      currentCoordinate: null, // 弹窗坐标数据
      currentCoordinateClick: null, // 弹窗坐标数据
      shachenCoordinateClick: null, // 沙尘弹窗坐标数据
      overlay: null,
      overlayClick: null,
      overlayShachenClick: null,
      stationYbQbTimespan: 1599220800000,
      stationYbSc: 9,
      clickKey:null,
      showinfoKey:null,
      stationYbType: "RMAPS",
      lxType: "站点预报",
      stationYbDataType: 0,
      dataTypeStr:"",
      stationlevelType: 0,
      stationlevel: 0,
      stationYbStationTye: "国家站,区域站",
      stationYbDq: 1501,
      stationBs: true,
      stationybTimeBs:true,
      shaChenStationBs: false,
      SelectStationID: "",
      SelectUnits:"",
      mapZoom:0,
      heighBs:false,
      rmapsWindOpt:{
        zIndex:1,
        name:'风流场',
        wrapX: true,
        minZoom:4,
        forceRender: false,
        windOptions: {
          // colorScale: scale,
          velocityScale: 1/3300,
          paths: 600,
          // eslint-disable-next-line no-unused-vars
          colorScale: [
            "rgb(8,67,248)",
            "rgb(36,104, 180)",
            "rgb(57,187,236)",
            "rgb(8,167,3)",
            "rgb(44,180,43)",
            "rgb(93,238,111)",
            /* "rgb(255,238,159)",
            "rgb(252,217,125)",
            "rgb(255,182,100)",
            "rgb(252,150,75)",*/
            "rgb(250,112,52)",
            "rgb(245,64,32)",
            "rgb(237,45,28)",
            "rgb(220,24,32)",
            "rgb(180,0,35)"
          ],
          lineWidth: 3,
          // colorScale: scale,
          //generateParticleOption: false
        },
      },
      zoomLs:0,
    };
  },
  mounted() {
    this.initMap();
  },
  directives: {
    drag(el) {
      el.onmousedown = function (e) {
        let disx = e.pageX - el.offsetLeft
        let disy = e.pageY - el.offsetTop
        document.onmousemove = function (e) {
          el.style.left = e.pageX - disx + 'px'
          el.style.top = e.pageY - disy + 'px'
        }
        document.onmouseup = function () {
          document.onmouseup = document.onmousemove = null
        }
        e.preventDefault()
      }
    }
  },
  methods: {
    initMap() {
      const gcj02Extent = [-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244];
      const gcjMecator = new Projection({
        code: "GCJ-02",
        extent: gcj02Extent,
        units: "m"
      });
      addProjection(gcjMecator);
      addCoordinateTransforms("EPSG:4326", gcjMecator, projzh.ll2gmerc, projzh.gmerc2ll);
      this.map = new Map({
        layers: [new Group({
          // A layer must have a title to appear in the layerswitcher
          'title': '图层管理',
          'fold': 'open',
          layers: [
            new Group({
              title: '底图选择',
              'fold': 'open',
              layers: [
                new Group({
                  // A layer must have a title to appear in the layerswitcher
                  title: 'arcgis',
                  'fold': 'close',
                  layers: [
                    new Group({
                      // A layer must have a title to appear in the layerswitcher
                      title: 'arcgis矢量',
                      // Setting the layers type to 'base' results
                      // in it having a radio button and only one
                      // base layer being visibile at a time
                      type: 'base',
                      // Setting combine to true causes sub-layers to be hidden
                      // in the layerswitcher, only the parent is shown
                      combine: true,
                      visible: false,
                      layers: [
                        new Tile({
                          source: new XYZ({
                            attributions: '概述：彩色中文含兴趣点版中国基础地图//投影:WGS 1984 Web-Mercator//切片格式:PNG//服务类型:基础地图服务//数据提供商:易图通科技（北京）有限公司//数据获取时间:2020年春季//地图最后更新时间:2020年12月16日//版权所有:北京捷泰天域信息技术有限公司',
                            projection: 'EPSG:3857',
                            url:
                                'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer' +
                                '/tile/{z}/{y}/{x}',
                          }),
                        })
                      ]
                    }),
                    new Group({
                      // A layer must have a title to appear in the layerswitcher
                      title: 'arcgis夜间矢量',
                      // Setting the layers type to 'base' results
                      // in it having a radio button and only one
                      // base layer being visibile at a time
                      type: 'base',
                      // Setting combine to true causes sub-layers to be hidden
                      // in the layerswitcher, only the parent is shown
                      combine: true,
                      visible: false,
                      layers: [
                        new Tile({
                          source: new XYZ({
                            attributions: '概述：蓝黑色中文不含兴趣点版中国基础地图//投影:WGS 1984 Web-Mercator//切片格式:PNG//服务类型:基础地图服务//数据提供商:易图通科技（北京）有限公司//数据获取时间:2019年秋季//地图最后更新时间:2020年5月30日//版权所有:北京捷泰天域信息技术有限公司',
                            projection: 'EPSG:3857',
                            url:
                                'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer' +
                                '/tile/{z}/{y}/{x}',
                          }),
                        })
                      ]
                    }),
                    new Group({
                      // A layer must have a title to appear in the layerswitcher
                      title: 'arcgis地形（无标注）',
                      // Setting the layers type to 'base' results
                      // in it having a radio button and only one
                      // base layer being visibile at a time
                      type: 'base',
                      // Setting combine to true causes sub-layers to be hidden
                      // in the layerswitcher, only the parent is shown
                      combine: true,
                      visible: false,
                      layers: [
                        new Tile({
                          source: new XYZ({
                            attributions: 'Source: US National Park Servic',
                            projection: 'EPSG:3857',
                            url:
                                'http://server.arcgisonline.com/arcgis/rest/services/World_Physical_Map/MapServer' +
                                '/tile/{z}/{y}/{x}',
                          }),
                        })
                      ]
                    }),
                    new Group({
                      // A layer must have a title to appear in the layerswitcher
                      title: 'arcgis卫星',
                      // Setting the layers type to 'base' results
                      // in it having a radio button and only one
                      // base layer being visibile at a time
                      type: 'base',
                      // Setting combine to true causes sub-layers to be hidden
                      // in the layerswitcher, only the parent is shown
                      combine: true,
                      visible: false,
                      layers: [
                        new Tile({
                          source: new XYZ({
                            attributions: 'Source: US National Park Servic',
                            projection: 'EPSG:3857',
                            url:
                                'http://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer' +
                                '/tile/{z}/{y}/{x}',
                          }),
                        })
                      ]
                    }),
                    new Group({
                      // A layer must have a title to appear in the layerswitcher
                      title: 'arcgis地形（英文标注）',
                      // Setting the layers type to 'base' results
                      // in it having a radio button and only one
                      // base layer being visibile at a time
                      type: 'base',
                      // Setting combine to true causes sub-layers to be hidden
                      // in the layerswitcher, only the parent is shown
                      combine: true,
                      visible: false,
                      layers: [
                        new Tile({
                          source: new XYZ({
                            attributions: 'Sources: Esri, HERE, Garmin, Intermap, increment P Corp., GEBCO, USGS, FAO, NPS, NRCAN, GeoBase, IGN, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), (c) OpenStreetMap contributors, and the GIS User Community',
                            projection: 'EPSG:3857',
                            url:
                                'http://server.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer' +
                                '/tile/{z}/{y}/{x}',
                          }),
                        })
                      ]
                    }),
                  ]
                }),
                new Group({
                  // A layer must have a title to appear in the layerswitcher
                  title: '天地图',
                  'fold': 'close',
                  layers: [
                    new Group({
                      // A layer must have a title to appear in the layerswitcher
                      title: '天地图矢量图',
                      // Setting the layers type to 'base' results
                      // in it having a radio button and only one
                      // base layer being visibile at a time
                      type: 'base',
                      // Setting combine to true causes sub-layers to be hidden
                      // in the layerswitcher, only the parent is shown
                      combine: true,
                      visible: false,
                      layers: [
                        new Tile({
                          source: new XYZ({
                            url:
                                "https://t{0-7}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=ba066bf5232f046de98233ce68ce3eec",
                          }),
                        }),
                        new Tile({
                          source: new XYZ({
                            url:
                                "https://t{0-7}.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=ba066bf5232f046de98233ce68ce3eec",
                          }),
                        }),
                      ]
                    }),
                    new Group({
                      // A layer must have a title to appear in the layerswitcher
                      title: '天地图地形图',
                      // Setting the layers type to 'base' results
                      // in it having a radio button and only one
                      // base layer being visibile at a time
                      type: 'base',
                      // Setting combine to true causes sub-layers to be hidden
                      // in the layerswitcher, only the parent is shown
                      combine: true,
                      visible: false,
                      layers: [
                        new Tile({
                          source: new XYZ({
                            url:
                                "https://t{0-7}.tianditu.gov.cn/DataServer?T=ter_w&x={x}&y={y}&l={z}&tk=ba066bf5232f046de98233ce68ce3eec",
                          }),
                        }),
                        new Tile({
                          source: new XYZ({
                            url:
                                "https://t{0-7}.tianditu.gov.cn/DataServer?T=cta_w&x={x}&y={y}&l={z}&tk=ba066bf5232f046de98233ce68ce3eec",
                          }),
                        }),
                      ]
                    }),
                    new Group({
                      // A layer must have a title to appear in the layerswitcher
                      title: '天地图卫星图带标注',
                      // Setting the layers type to 'base' results
                      // in it having a radio button and only one
                      // base layer being visibile at a time
                      type: 'base',
                      // Setting combine to true causes sub-layers to be hidden
                      // in the layerswitcher, only the parent is shown
                      combine: true,
                      visible: false,
                      layers: [
                        new Tile({
                          source: new XYZ({
                            url:
                                "https://t{0-7}.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=ba066bf5232f046de98233ce68ce3eec",
                          }),
                        }),
                        new Tile({
                          title: '天地图标注',
                          source: new XYZ({
                            url:
                                "https://t{0-7}.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=ba066bf5232f046de98233ce68ce3eec",
                          }),
                        }),
                      ]
                    }),
                  ]
                }),
                new Group({
                  // A layer must have a title to appear in the layerswitcher
                  title: '高德',
                  'fold': 'open',
                  layers: [
                    new Group({
                      // A layer must have a title to appear in the layerswitcher
                      title: '高德卫星图',
                      // Setting the layers type to 'base' results
                      // in it having a radio button and only one
                      // base layer being visibile at a time
                      type: 'base',
                      // Setting combine to true causes sub-layers to be hidden
                      // in the layerswitcher, only the parent is shown
                      combine: true,
                      visible: true,
                      layers: [
                        new Tile({
                          source: new XYZ({
                            projection: gcjMecator,
                            url:
                                "http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=2&style=6 ",
                          }),
                        }),
                      ]
                    }),
                    new Group({
                      // A layer must have a title to appear in the layerswitcher
                      title: '高德矢量图',
                      // Setting the layers type to 'base' results
                      // in it having a radio button and only one
                      // base layer being visibile at a time
                      type: 'base',
                      // Setting combine to true causes sub-layers to be hidden
                      // in the layerswitcher, only the parent is shown
                      combine: true,
                      visible: false,
                      layers: [
                        new Tile({
                          source: new XYZ({
                            projection: gcjMecator,
                            url:
                                "http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=2&style=7 ",

                          }),
                        }),
                      ]
                    }),
                  ]
                }),
                new Group({
                  // A layer must have a title to appear in the layerswitcher
                  title: '矢量底图',
                  type: 'base',
                  combine: true,
                  visible: false,
                  layers: [
                    new Image({
                      title: '边界',
                      opacity: 0.9,
                      source: new ImageWMS({
                        url: "http://172.18.142.202:8880/geoserver/yzhGeoserver/wms",
                        // Layers需要指定要显示的图层名
                        params: {LAYERS: "yzhGeoserver:ChinaBj", TILED: false},
                        // serverType明显为geoserver
                        serverType: "geoserver",

                        /* ratio:1*/
                      }),
                    }),
                    /*ew Vector({
                      visible: false,
                      source: new Stamen({
                        projection: 'EPSG:4326',
                        url: "../json/旗县界.json",
                        format:GeoJSON(),
                      }),
                    })*/

                  ]
                }),
                new Group({
                  // A layer must have a title to appear in the layerswitcher
                  title: '腾讯矢量图',
                  // Setting the layers type to 'base' results
                  // in it having a radio button and only one
                  // base layer being visibile at a time
                  type: 'base',
                  // Setting combine to true causes sub-layers to be hidden
                  // in the layerswitcher, only the parent is shown
                  combine: true,
                  visible: false,
                  layers: [
                    new Tile({
                      source: new XYZ({
                        projection: gcjMecator,
                        url:
                            "http://rt{0-3}.map.gtimg.com/realtimerender?z={z}&x={x}&y={-y}&type=vector&style=0",

                      }),
                    }),
                  ]
                }),


              ]
            }),
            new Group({
              title: '标注 ',
              'fold': 'open',
              visible: false,
              layers: [

                new Tile({
                  title: '天地图标注',
                  visible: false,
                  source: new XYZ({
                    url:
                        "https://t1.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=ba066bf5232f046de98233ce68ce3eec",
                  }),
                }),
                new Tile({
                  title: '高德标注',
                  visible: false,
                  source: new XYZ({
                    projection: gcjMecator,
                    url:
                        "http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=8",
                  }),
                }),
              ]
            }),
            new Group({
              // A layer must have a title to appear in the layerswitcher
              title: '边界',
              visible: false,
              'fold': 'open',
              layers: [
                new Image({
                  title: '边界',
                  visible: true,
                  opacity: 0.5,
                  source: new ImageWMS({
                    url: "http://172.18.142.202:8880/geoserver/yzhGeoserver/wms",
                    // Layers需要指定要显示的图层名
                    params: {LAYERS: "yzhGeoserver:ChinaBj", TILED: false},
                    // serverType明显为geoserver
                    serverType: "geoserver",

                    /* ratio:1*/
                  }),
                }),
                /*ew Vector({
                  visible: false,
                  source: new Stamen({
                    projection: 'EPSG:4326',
                    url: "../json/旗县界.json",
                    format:GeoJSON(),
                  }),
                })*/

              ]
            }),
          ]
        })
        ],
        target: 'map',
        view: new View({
          projection: "EPSG:4326",
          center: [111.70893300, 40.76124776],
          zoom: 8.5
        })
      });
      //鼠标获取坐标控件
      const mousePositionControl = new MousePosition({
        coordinateFormat: function (coordinate) {
          return format(coordinate, '经度:{x} 纬度:{y}'+3, 4);
        },
        projection: 'EPSG:4326',
        /* ol-mouse-position*/
        undefinedHTML: '&nbsp;'
      });
//添加控件到地图
      this.map.addControl(mousePositionControl);
      this.map.addControl(new FullScreen({
        tipLabel: '全屏显示'
      }));
      this.map.addControl(new ScaleLine());
      var layerSwitcher = new LayerSwitcher({
        tipLabel: 'Légende', // Optional label for button
        groupSelectStyle: 'children' // Can be 'children' [default], 'group' or 'none'
      });
      this.map.addControl(layerSwitcher);
      this.overlay = new Overlay({
        element: this.$refs.popup1, // 弹窗标签，在html里
        autoPan: false, // true如果弹窗在底图边缘时，底图会移动
        stopEvent: false,//特别重要！！！！！默认值为true，如果为true，则触发移动鼠标事件时候无法触发点击事件
        autoPanAnimation: { // 底图移动动画
          duration: 250,

        }
      })
      this.overlayClick = new Overlay({
        element: this.$refs.popupClick, // 弹窗标签，在html里
        autoPan: false, // true如果弹窗在底图边缘时，底图会移动
        stopEvent: true,
        autoPanMargin: 100
      })
      this.overlayShachenClick=new Overlay({
        element: this.$refs.shaChenClick, // 弹窗标签，在html里
        autoPan: false, // true如果弹窗在底图边缘时，底图会移动
        stopEvent: true,
        autoPanMargin: 100
      })
      this.map.addOverlay(this.overlayClick)
      this.map.addOverlay(this.overlayShachenClick)
      this.map.addOverlay(this.overlay)
      this.clickKey=this.map.on('singleclick', this.showClickInfo);
      this.showinfoKey=this.map.on('pointermove', this.showInfo);
    },

    addPoint() {
      var myStyle = new Style({
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({color: '#fafafa00'}),
          stroke: new Stroke({color: '#00d8fa', width: 4}),
        }),
      });
      var paris = new Feature({
        geometry: new Point(fromLonLat([111.70893300, 40.76124776], 'EPSG:4326')),

      });
      var paris3 = new Feature({
        geometry: new Point(fromLonLat([111.80893300, 41.76124776], 'EPSG:4326')),

      });
      var paris2 = new Feature({
        geometry: new Point(fromLonLat([3.353, 41.8566], 'EPSG:4326')),
      });
      paris.setStyle(myStyle);
      paris2.setStyle(myStyle);
      paris3.setStyle(myStyle);

      var vlayer = new Vector({
        features: [paris],
      });
      vlayer.addFeature(paris2);
      vlayer.addFeature(paris3);
      var vectorSource = vlayer;
      var vectorLayer = new VectorLayer({
        source: vectorSource,
      });
      this.map.addLayer(vectorLayer);
    },
    //远程调用服务端静态资源geojson文件
    getGeoJson() {
      this.$axios
          .get('/file/countries.geojson')
          .then(res => {
            var myJson = (new GeoJSON()).readFeatures(res.data);
            var layer = new VectorLayer({
              source: new Vector({
                features: myJson
              })
            });
            this.map.addLayer(layer);
          })
          .catch(err => {
            console.log(err);

          });
    },
    displayStationYb: function () {
      var mylayers = this.map.getLayers().getArray();
      var removeArry = [];
      for (let i = 0; i < mylayers.length; i++) {
        let name = mylayers[i].get("name");
        if (name !== undefined && (name.indexOf("站点预报") !== -1 || name.indexOf("格点预报") !== -1 || name.indexOf("沙尘模式") !== -1 || name === "风流场")) {
          removeArry.push(mylayers[i])
          //this.map.removeLayer(mylayers[i]); //删除图层
        }
      }
      if (removeArry.length > 0) {
        for (let i = 0; i < removeArry.length; i++) {
          let name = removeArry[i].get("name");
          if (name === "风流场") {
            this.clearWindCav(this.map.removeLayer(removeArry[i]))
          } else {
            this.map.removeLayer(removeArry[i]); //删除图层
          }
        }
      }
      var myurl = "";
      if (this.lxType === "站点预报") {
        if(this.showinfoKey!==null){
          unByKey(this.showinfoKey);
        }
        if(this.clickKey!==null){
          unByKey(this.clickKey);
        }
        this.clickKey = this.map.on('singleclick', this.showClickInfo);
        this.showinfoKey=this.map.on('pointermove', this.showInfo);
        if (this.stationYbType === "区台新方法" || this.stationYbType === "RMAPS" || this.stationYbType === "EC") {
          if (this.stationYbType === "RMAPS" || this.stationYbType === "EC") {
            this.stationlevelType = 103;
            this.stationlevel = 0;
          } else if (this.stationYbType === "区台新方法") {
            this.stationlevelType = 0;
            this.stationlevel = 0;
          }
          myurl = '/getzdybByTypeStationsTimeSx?YBType=' + this.stationYbType + '&DataTypeID=' + this.stationYbDataType + '&StationTye=' + this.stationYbStationTye + '&DQID=' + this.stationYbDq + '&times=' + this.stationYbQbTimespan + '&YbSx=' + this.stationYbSc + '&stationlevelType=' + this.stationlevelType + '&stationlevel=' + this.stationlevel;
        }
        if (myurl !== "") {
          this.$axios
              .get(myurl)
              .then(res => {
                if (this.stationYbType === 'EC') {
                  if (this.stationYbDataType === 4 || this.stationYbDataType === 4100) {
                    this.showWindFeatures(res);
                  } else if (this.stationYbDataType > 0) {
                    this.showCommonFeatures(res);
                  }

                } else {
                  if (this.stationYbDataType === 0 || this.stationYbDataType === 1 || this.stationYbDataType === 2 || this.stationYbDataType === 1900) {
                    this.showCommonFeatures(res);
                    //this.map.on('pointermove', this.showInfo);
                  } else if (this.stationYbDataType === 4) {
                    this.showWindFeatures(res);
                  }
                }

              })
              .catch(err => {
                console.log(err);
              });
        }
      } else if (this.lxType === "格点预报") {
        if(this.showinfoKey!==null){
          unByKey(this.showinfoKey);
        }
        if(this.clickKey!==null){
          unByKey(this.clickKey);
        }
        if (this.stationYbType === "区台新方法" || this.stationYbType === "RMAPS" || this.stationYbType === "EC") {
          if (this.stationYbType === "RMAPS" || this.stationYbType === "EC") {
            this.stationlevelType = 103;
            this.stationlevel = 0;
          } else if (this.stationYbType === "区台新方法") {
            this.stationlevelType = 0;
            this.stationlevel = 0;
          }
          //myurl = '/getzdybByTypeStationsTimeSx?YBType=' + this.stationYbType + '&DataTypeID=' + this.stationYbDataType + '&StationTye=' + this.stationYbStationTye + '&DQID=' + this.stationYbDq + '&times=' + this.stationYbQbTimespan + '&YbSx=' + this.stationYbSc + '&stationlevelType=' + this.stationlevelType + '&stationlevel=' + this.stationlevel;
        }
        /*if (myurl !== "") {
          this.$axios
              .get(myurl)
              .then(res => {
                if(this.stationYbType==='EC'){
                  if(this.stationYbDataType === 4||this.stationYbDataType === 4100){
                    this.showWindFeatures(res);
                  }else if(this.stationYbDataType >0){
                    this.showCommonFeatures(res);
                  }

                }
                else{
                  if (this.stationYbDataType === 0 || this.stationYbDataType === 1 || this.stationYbDataType === 2 || this.stationYbDataType === 1900) {
                    this.showCommonFeatures(res);
                    //this.map.on('pointermove', this.showInfo);
                  } else if (this.stationYbDataType === 4) {
                    this.showWindFeatures(res);
                  }
                }

              })
              .catch(err => {
                console.log(err);
              });
        }*/
        if (this.stationYbDataType === 4 && this.stationYbType === "RMAPS") {
          this.addWindLayer()
        }
      } else if (this.lxType === "沙尘模式") {
        if (!(this.dataTypeStr === "")) {
          if(this.clickKey!==null){
            unByKey(this.clickKey);
          }
          if(this.showinfoKey!==null){
            unByKey(this.showinfoKey);
          }
          this.clickKey= this.map.on('singleclick', this.showShaChenClickInfo);
          this.showinfoKey=this.map.on('pointermove', this.showShaChenInfo);
          myurl = "/getDustByDateTimeValidTimeIsHeighFcstlevel?times=" + this.stationYbQbTimespan + "&YbSx=" + this.stationYbSc + "&YBType=" + this.stationYbType + "&DataTypeStr=" + this.dataTypeStr + "&IsHeigh=" + this.heighBs + "&Fcstlevel=" + this.stationlevel;
          if (myurl !== "") {
            this.$axios
                .get(myurl)
                .then(res => {
                  this.showShaChenFeatures(res);

                })
                .catch(err => {
                  console.log(err);
                });
          }
        }
      }
    },
    addWindLayer(){
      fetch('http://172.18.142.203:3691/api/getWindJsonByTypeTimeSx?YBType=' + this.stationYbType + '&times=' + this.stationYbQbTimespan + '&YbSx=' + this.stationYbSc + '&stationlevelType=' + this.stationlevelType + '&stationlevel=' + this.stationlevel+'&dlat=0.03')
          //
          .then(res => res.json())
          .then(res => {
            // var myss=myjson;
            var myZoom=this.map.getView().getZoom()
            this.updateWindStyle(myZoom)
            const windLayer = new WindLayer(res,this.rmapsWindOpt);
            // @ts-ignore
            this.map.addLayer(windLayer);

          });
      this.map.getView().on('change:resolution',  this.zoomChange)
    },
    showCommonFeatures(res){
      var styleFunction2 = function (feature) {
        var myfetures = feature.get('features');
        var myfeture = myfetures[0];
        let minlevl = myfeture.get('stationLevel');
        for (let i = 0; i < myfetures.length; i++) {
          if (myfetures[i].get('stationLevel') < minlevl) {
            myfeture = myfetures[i];
            minlevl = myfeture.get('stationLevel');
          }
        }
        var slevel = myfeture.get('stationLevel');
        var style1 = new Style({
          image: new CircleStyle({
            radius: 5,
            fill: new Fill({color: '#0096fa', width: 4}),
          }),
          text: new Text({
            text: myfeture.get('ybvalue') + "",
            font: '15px Calibri,sans-serif',
            fill: new Fill({
              color: '#fff',
            }),
            stroke: new Stroke({color: '#000', width: 3}),
            offsetY: 15
          }),
        });
        var style2 = new Style({
          image: new CircleStyle({
            radius: 3,
            fill: new Fill({color: '#fafafa00'}),
            stroke: new Stroke({color: '#00d8fa', width: 2}),
          }),
          text: new Text({
            text: myfeture.get('ybvalue') + "",
            font: '13px Calibri,sans-serif',
            fill: new Fill({
              color: '#fff',
            }),
            stroke: new Stroke({color: '#000', width: 3}),
            offsetY: 15
          }),
        });
        if (slevel <= 13) {
          return style1;
        }
        return style2;
      };
      var myJson = (new GeoJSON()).readFeatures(res.data);
      var vecSource = new Vector({
        features: myJson,
      });
      var clusterSource = new Cluster({
        distance: 30,
        source: vecSource,
      });

      var layer = new VectorLayer({
        source: clusterSource,
        style: styleFunction2,
        name: this.lxType + '-' + this.stationYbType + '-' + this.stationYbDataType + '-' + "图层"
      });
      this.map.addLayer(layer);
    },
    showShaChenFeatures(res){
      var styleFunction2 = function (feature) {
        var myfetures = feature.get('features');
        var myfeture = myfetures[0];
        var style2 = new Style({
          image: new CircleStyle({
            radius: 3,
            fill: new Fill({color: '#fafafa00'}),
            stroke: new Stroke({color: '#0387ea', width: 2}),
          }),
          text: new Text({
            text: myfeture.get('ybvalue').toFixed(2) + "",
            font: '13px Calibri,sans-serif',
            fill: new Fill({
              color: '#fff',
            }),
            stroke: new Stroke({color: '#000', width: 3}),
            offsetY: 15
          }),
        });
        return style2;
      };
      var myJson = (new GeoJSON()).readFeatures(res.data);
      var vecSource = new Vector({
        features: myJson,
      });
      var clusterSource = new Cluster({
        distance: 30,
        source: vecSource,
      });

      var layer = new VectorLayer({
        source: clusterSource,
        style: styleFunction2,
        name: this.lxType + '-' + this.stationYbType + '-' + this.dataTypeStr + '-' + "图层"
      });
      this.map.addLayer(layer);
    },
    showWindFeatures(res){
      var styleFunction2 = function (feature) {
        var myfetures = feature.get('features');
        var myfeture = myfetures[0];
        let minlevl = myfeture.get('stationLevel');
        for (let i = 0; i < myfetures.length; i++) {
          if (myfetures[i].get('stationLevel') < minlevl) {
            myfeture = myfetures[i];
            minlevl = myfeture.get('stationLevel');
          }
        }
        var fs = Math.round(myfeture.get('ybvalue') / 2);
        var slevel = myfeture.get('stationLevel');
        var style1 = new Style({
          image: new Icon({
            src: '/images/wind/wind' + fs + '.png',
            color: '#0079fa',
            scale: 1.5,
            rotation: myfeture.get('ybvalue2')
          }),
          text: new Text({
            text: myfeture.get('ybvalue') + "",
            font: '15px Calibri,sans-serif',
            fill: new Fill({
              color: '#fff',
            }),
            stroke: new Stroke({color: '#000', width: 3}),
            offsetY: 20
          }),
        });
        var style2 = new Style({
          image: new Icon({
            src: '/images/wind/wind' + fs + '.png',
            color: '#2f02f8',
            scale: 1.2,
            rotation: myfeture.get('ybvalue2')
          }),
          text: new Text({
            text: myfeture.get('ybvalue') + "",
            font: '13px Calibri,sans-serif',
            fill: new Fill({
              color: '#fff',
            }),
            stroke: new Stroke({color: '#000', width: 3}),
            offsetY: 20
          }),
        });
        if (slevel <= 13) {
          return style1;
        }
        return style2;
      };
      var  myJson = (new GeoJSON()).readFeatures(res.data);
      var vecSource = new Vector({
        features: myJson,
      });
      var clusterSource = new Cluster({
        distance: 30,
        source: vecSource,
      });

      var layer = new VectorLayer({
        source: clusterSource,
        style: styleFunction2,
        name: this.lxType + '-' + this.stationYbType + '-' + this.stationYbDataType + '-' + "图层"
      });
      this.map.addLayer(layer);
    },
    showInfo(event) {
      var features = this.map.getFeaturesAtPixel(event.pixel, {hitTolerance: 1});

      if (features.length == 0) {
        this.closePopup();
        return;
      }
      var myfetures = features[0].getProperties().features;
      var myfeture = myfetures[0];
      let minlevl = myfeture.get('stationLevel');
      for (let i = 0; i < myfetures.length; i++) {
        if (myfetures[i].get('stationLevel') < minlevl) {
          myfeture = myfetures[i];
          minlevl = myfeture.get('stationLevel');
        }
      }
      const coordinate = event.coordinate // 获取坐标
      if (this.stationYbDataType !== 4) {
        this.currentCoordinate = myfeture.get('id') + "&nbsp;&nbsp;" + myfeture.get('name') + "&nbsp;&nbsp;" + myfeture.get('ybvalue').toFixed(2) + myfeture.get('ybUnit')// 保存坐标点
      } else {
        var fxNum = Math.round(myfeture.get('ybvalue2') * 180 / Math.PI / 45);
        var fxStr = "";
        switch (fxNum) {
          case 0:
            fxStr = "北风";
            break;
          case 1:
            fxStr = "东北风";
            break;
          case 2:
            fxStr = "东风";
            break;
          case 3:
            fxStr = "东南风";
            break;
          case 4:
            fxStr = "南风";
            break;
          case 5:
            fxStr = "西南风";
            break;
          case 6:
            fxStr = "西风";
            break;
          case 7:
            fxStr = "西北风";
            break;
          case 999017:
            fxStr = "静风";
            break;
          default:
            fxStr = "北风";
            break;
        }
        this.currentCoordinate = myfeture.get('id') + "&nbsp;&nbsp;" + myfeture.get('name') + "&nbsp;&nbsp;" + myfeture.get('ybvalue') + myfeture.get('ybUnit') + "&nbsp;&nbsp;" + fxStr// 保存坐标点
      }

      this.overlay.setPosition(coordinate)
    },
    showShaChenInfo(event) {
     try{
       var features = this.map.getFeaturesAtPixel(event.pixel, {hitTolerance: 1});

       if (features.length == 0) {
         this.closePopup();
         return;
       }
       var myfetures = features[0].getProperties().features;
       var myfeture = myfetures[0];
       const coordinate = event.coordinate // 获取坐标
       if(this.heighBs){
         this.currentCoordinate = myfeture.get('id') + "&nbsp;&nbsp;" + myfeture.get('name') + "&nbsp;&nbsp;"+this.stationlevel+ "hPa&nbsp;&nbsp;"+ myfeture.get('ybName') +  "&nbsp;&nbsp;" + myfeture.get('ybvalue').toFixed(2) + myfeture.get('ybUnit')// 保存坐标点
       }else{
         this.currentCoordinate = myfeture.get('id') + "&nbsp;&nbsp;" + myfeture.get('name') + "&nbsp;&nbsp;"+ myfeture.get('ybName') + "&nbsp;&nbsp;" + myfeture.get('ybvalue').toFixed(2) + myfeture.get('ybUnit')// 保存坐标点
       }

       this.overlay.setPosition(coordinate)
     }
     catch (error){}
    },
    showClickInfo(event) {
      var features = this.map.getFeaturesAtPixel(event.pixel, {hitTolerance: 1});
      if (features.length === 0) {
        this.closeClickPopup();
        return;
      }
      var myfetures = features[0].getProperties().features;
      var myfeture = myfetures[0];
      let minlevl = myfeture.get('stationLevel');
      for (let i = 0; i < myfetures.length; i++) {
        if (myfetures[i].get('stationLevel') < minlevl) {
          myfeture = myfetures[i];
          minlevl = myfeture.get('stationLevel');
        }
      }
      const coordinate = event.coordinate // 获取坐标
      this.SelectStationID = myfeture.get('id');
      if (this.stationYbDataType !== 4) {
        this.currentCoordinateClick = myfeture.get('id') + "&nbsp;&nbsp;" + myfeture.get('name') + "&nbsp;&nbsp;" + myfeture.get('ybvalue') + myfeture.get('ybUnit')// 保存坐标点
      } else {
        var fxNum = Math.round(myfeture.get('ybvalue2') * 180 / Math.PI / 45);
        var fxStr = "";
        switch (fxNum) {
          case 0:
            fxStr = "北风";
            break;
          case 1:
            fxStr = "东北风";
            break;
          case 2:
            fxStr = "东风";
            break;
          case 3:
            fxStr = "东南风";
            break;
          case 4:
            fxStr = "南风";
            break;
          case 5:
            fxStr = "西南风";
            break;
          case 6:
            fxStr = "西风";
            break;
          case 7:
            fxStr = "西北风";
            break;
          case 999017:
            fxStr = "静风";
            break;
          default:
            fxStr = "北风";
            break;
        }
        this.currentCoordinateClick = myfeture.get('id') + "&nbsp;&nbsp;" + myfeture.get('name') + "&nbsp;&nbsp;" + myfeture.get('ybvalue') + myfeture.get('ybUnit') + "&nbsp;&nbsp;" + fxStr// 保存坐标点
      }

      this.overlayClick.setPosition(coordinate)
    },
    showShaChenClickInfo(event) {
      try{
        var features = this.map.getFeaturesAtPixel(event.pixel, {hitTolerance: 1});
        if (features.length === 0) {
          this.closeSchaChenClickPopup();
          return;
        }
        var myfetures = features[0].getProperties().features;
        var myfeture = myfetures[0];
        const coordinate = event.coordinate // 获取坐标
        this.SelectStationID = myfeture.get('id');
        this.SelectUnits=myfeture.get('ybUnit')
         this.shachenCoordinateClick = myfeture.get('id') + "&nbsp;&nbsp;" + myfeture.get('name') + "&nbsp;&nbsp;" + myfeture.get('ybvalue') + myfeture.get('ybUnit')// 保存坐标点*/
        this.overlayShachenClick.setPosition(coordinate)
      }catch (error){}
    },
    // 关闭弹窗
    closePopup() {
      // 把弹窗位置设置为undefined，并清空坐标数据
      this.overlay.setPosition(undefined)
      this.currentCoordinate = null
    },
    // 关闭弹窗
    closeClickPopup() {
      // 把弹窗位置设置为undefined，并清空坐标数据
      this.overlayClick.setPosition(undefined)
      this.currentCoordinateClick = null
      this.shachenCoordinateClick = null
    },
    closeSchaChenClickPopup() {
      // 把弹窗位置设置为undefined，并清空坐标数据
      this.overlayShachenClick.setPosition(undefined)
      this.shachenCoordinateClick = null
      this.currentCoordinateClick = null
    },

    mapQbTimeControlChange: function (qbTimeSpan, ScSelectValue) {
      this.stationYbQbTimespan = qbTimeSpan;
      this.stationYbSc = ScSelectValue;
      this.displayStationYb();
    },
    mapShaChenQbTimeControlChange: function (qbTimeSpan, ScSelectValue,heighBs,heightSelectValue) {
      this.stationYbQbTimespan = qbTimeSpan;
      this.stationYbSc = ScSelectValue;
      this.heighBs=heighBs;
      this.stationlevel=heightSelectValue;
      this.displayStationYb();
    },
    stationTypeChange: function (stationTypeString) {
      this.stationYbStationTye = stationTypeString;
      this.displayStationYb();
    },
    stationDQChange: function (stationDQString) {
      this.stationYbDq = stationDQString;
      this.displayStationYb();
    },
    tcToolboxControlChange: function (tabSelect, ybType, dataType) {
      if (tabSelect === 1) {
        this.shaChenStationBs=false;
        this.stationBs = true;
        this.stationybTimeBs=true;
        this.lxType = "站点预报";
        if (ybType === "EC") {
          this.stationYbDataType =  ecStrToInt(dataType);
        } else {
          switch (dataType) {
            case "气温":
              this.stationYbDataType = 0;
              break;
            case "相对湿度":
              this.stationYbDataType = 1;
              break;
            case "10米风":
              this.stationYbDataType = 4;
              break;
            case "降水量":
              this.stationYbDataType = 2;
              break;
            case "能见度":
              this.stationYbDataType = 1900;
              break;
            default:
              this.stationYbDataType = -1;
              break;
          }
        }
        this.stationYbType = ybType;
      } else if (tabSelect === 0) {
        this.lxType = "格点预报";
        this.shaChenStationBs=false;
        this.stationBs = false;
        this.stationybTimeBs=true;
        if (ybType === "EC") {
          this.stationYbDataType =  ecStrToInt(dataType);
        } else {
          switch (dataType) {
            case "气温":
              this.stationYbDataType = 0;
              break;
            case "相对湿度":
              this.stationYbDataType = 1;
              break;
            case "10米风":
              this.stationYbDataType = 4;
              break;
            case "降水量":
              this.stationYbDataType = 2;
              break;
            case "能见度":
              this.stationYbDataType = 1900;
              break;
            default:
              this.stationYbDataType = -1;
              break;
          }
        }
        this.stationYbType = ybType;
      }else if(tabSelect===2){
        this.stationybTimeBs=false;
        this.stationBs = false;
        this.shaChenStationBs=true;
        this.station
        this.lxType = "沙尘模式";
        if((ybType==="区台沙尘模式"&&(dataType==="PM2.5"||dataType==="PM10"))||(ybType==="亚洲沙尘模式"&&(dataType==="高空沙尘浓度CONC_DUST"))){
          this.heighBs=true;
        }else{
          this.heighBs=false;
        }
        if(ybType==="区台沙尘模式"){
          this.dataTypeStr=qtShaChenDataTypeConvert(dataType);
          this.stationYbType = ybType;
        }else if(ybType==="亚洲沙尘模式"){
          this.dataTypeStr=cuaceDataTypeConvert(dataType);
          this.stationYbType = ybType;
        }
        else if(ybType==="京津冀华北区域模式"){
          this.dataTypeStr=JingjinjiDataTypeConvert(dataType);
          this.stationYbType = "京津冀";
        }
      }
      this.displayStationYb();
    },

    clearWindCav(windLayer){
      const renderer = windLayer.getRenderer();
      if (renderer && renderer.oRender) {
        const executors = renderer.oRender.executors;
        Object.keys(executors).forEach((key) => {
          const wind = executors[key];
          if (wind) {
            wind.clearCanvas();
          }
        });
      }
    },
    zoomChange(){
      let _this=this
      setTimeout(function()  {

        var myZoom=_this.map.getView().getZoom()
        _this.zoomLs=myZoom
        if(Math.abs(myZoom-_this.mapZoom)>0.1){
          //alert(myZoom)
          _this.updateWindStyle(myZoom)
          if((myZoom>7&&_this.mapZoom<=7)){
            _this.setWindData(0.03)
          }else if(myZoom<=7&&_this.mapZoom>7){
            _this.setWindData(0.1)
          }else{
            _this.updateWindStyleOnly()
          }
          _this.mapZoom=myZoom
        }

      }, 1500);
    },
    updateWindStyle(myZoom){
      if(myZoom>=0&&myZoom<4){
        this.rmapsWindOpt.windOptions.velocityScale= 1/300
        this.rmapsWindOpt.windOptions.paths= 3000
      }else if(myZoom>=4&&myZoom<6){
        this.rmapsWindOpt.windOptions.velocityScale= 1/(20*myZoom)
        this.rmapsWindOpt.windOptions.paths= 80*myZoom
      }else if(myZoom>=6&&myZoom<7){
        this.rmapsWindOpt.windOptions.velocityScale= 1/(40*myZoom)
        this.rmapsWindOpt.windOptions.paths= 300*10/myZoom
      }else if(myZoom>=7&&myZoom<8){
        this.rmapsWindOpt.windOptions.velocityScale= 1/(100*myZoom)
        this.rmapsWindOpt.windOptions.paths= 280*10/myZoom
      }else if(myZoom>=8&&myZoom<9){
        this.rmapsWindOpt.windOptions.velocityScale= 1/(80*myZoom)
        this.rmapsWindOpt.windOptions.paths= 80*myZoom
      }
      else if(myZoom>=9&&myZoom<10){
        this.rmapsWindOpt.windOptions.velocityScale= 1/(250*myZoom)
        this.rmapsWindOpt.windOptions.paths= 80*myZoom
      }else if(myZoom>=10&&myZoom<11){
        this.rmapsWindOpt.windOptions.velocityScale= 1/(350*myZoom)
        this.rmapsWindOpt.windOptions.paths= 60*myZoom
      }else if(myZoom>=11&&myZoom<13){
        this.rmapsWindOpt.windOptions.velocityScale= 1/(100*myZoom*(myZoom-4))
        this.rmapsWindOpt.windOptions.paths= 300*10/myZoom
      }else if(myZoom>=13&&myZoom<16.5){
        this.rmapsWindOpt.windOptions.velocityScale=  1/(1000*myZoom*(myZoom-11.5))
        this.rmapsWindOpt.windOptions.paths= 300*10/myZoom
      }else if(myZoom>=16.5&&myZoom<19){
        this.rmapsWindOpt.windOptions.velocityScale=  1/(1000*myZoom*myZoom)
        this.rmapsWindOpt.windOptions.paths= 300*10/myZoom
      }else{
        this.rmapsWindOpt.windOptions.velocityScale=  1/(1000*myZoom*myZoom)
        this.rmapsWindOpt.windOptions.paths= 300*10/myZoom
      }
      },
    updateWindStyleOnly(){
      var windLayer=undefined;
      for(var i=0;i<this.map.getLayers().getLength();i++){
        if(this.map.getLayers().item(i).get("name")==="风流场"){
          windLayer=this.map.getLayers().item(i)
          break
        }
      }
      if(windLayer!==undefined){

        windLayer.setWindOptions({
          lineWidth: 3,
          velocityScale: this.rmapsWindOpt.windOptions.velocityScale,
          paths: this.rmapsWindOpt.windOptions.paths,
        })
      }
    },
    setWindData(dLat){
      fetch('http://172.18.142.203:3691/api/getWindJsonByTypeTimeSx?YBType=' + this.stationYbType + '&times=' + this.stationYbQbTimespan + '&YbSx=' + this.stationYbSc + '&stationlevelType=' + this.stationlevelType + '&stationlevel=' + this.stationlevel+'&dlat='+dLat)
          //
          .then(res => res.json())
          .then(res => {
            for(var i=0;i<this.map.getLayers().getLength();i++){
              if(this.map.getLayers().item(i).get("name")==="风流场"){
                this.clearWindCav(this.map.getLayers().removeAt (i))
                this.map.addLayer(new WindLayer(res, this.rmapsWindOpt));
                break
              }
            }
          });
    }

  },
  components: {
    maptool,
    mapQbTimeControl,
    mapStationTool,
    StationDetails,
    mapShaChenQbTimeControl,
    shachenStationDetails,
  }
}
</script>

<style lang="scss" scoped>
/* 弹窗样式 */
.popup1 {
  position: absolute;
  bottom: 12px;
  left: -50px;

}

.popupClick {
  position: absolute;
  bottom: 12px;

}
.shaChenClick {
  position: absolute;
  bottom: 12px;

}


</style>