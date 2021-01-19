<script src="../../assets/js/baidumap.js"></script>
<template>
  <v-sheet style="height: 100%;" color="transparent" class="overflow-x-auto">

    <div class="maps" id="map" style="width:100%;height:98%;z-index:5;">
      <maptool @tctoolbox-change='tcToolboxControlChange' v-drag></maptool>
      <mapQbTimeControl v-drag @datetime-change='mapQbTimeControlChange' :lx-type="lxType" :yb-type="stationYbDataType" :data-type="stationYbType"></mapQbTimeControl>
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
        <v-avatar left>
          <v-icon color="primary">mdi-artstation</v-icon>
        </v-avatar>
        <div v-html="currentCoordinate"></div>
      </v-chip>
    </div>

  </v-sheet>

</template>

<script>
import "@/assets/styles/ol.css";
import "@/assets/styles/ol-layerswitcher.css";
import {Map, View} from "ol";
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
import {fromLonLat,Projection,addProjection,addCoordinateTransforms} from 'ol/proj';
import Feature from 'ol/Feature';
import {Circle as CircleStyle, Fill, Stroke, Icon, Style, Text} from 'ol/style';
import {XYZ, Vector, ImageWMS, Cluster} from "ol/source";
import maptool from "@/components/地图/地图工具组件"
import mapQbTimeControl from '@/components/基础组件/地图起报时间组件'
import LayerSwitcher from "ol-layerswitcher/src/ol-layerswitcher";
import projzh from "@/assets/js/mypro";
import probaidu from "@/assets/js/baidupro";
import TileImage from "ol/source/TileImage";
import TileGrid from "ol/tilegrid/TileGrid";
import {applyTransform} from 'ol/extent'

export default {
  name: "myMapFirst",
  data() {
    return {
      map: {},
      currentCoordinate: null, // 弹窗坐标数据
      overlay: null,
      stationYbQbTimespan: 1599220800000,
      stationYbSc: 9,
      stationYbType: "区台新方法",
      lxType:"站点预报",
      stationYbDataType: 0,
      stationlevelType:0,
      stationlevel:0,
      stationYbStationTye: "国家站,区域站",
      stationYbDq: 1501
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
      var baiduSource=this.baiduproMethod();
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
                            projection:gcjMecator,
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
                            projection:gcjMecator,
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
                  title: '腾讯',
                  'fold': 'open',
                  layers: [
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
                            projection:gcjMecator,
                            url:
                                "http://rt{0-3}.map.gtimg.com/realtimerender?z={z}&x={x}&y={-y}&type=vector&style=0",

                          }),
                        }),
                      ]
                    }),
                    new Group({
                      // A layer must have a title to appear in the layerswitcher
                      title: '百度测试',
                      // Setting the layers type to 'base' results
                      // in it having a radio button and only one
                      // base layer being visibile at a time
                      type: 'base',
                      // Setting combine to true causes sub-layers to be hidden
                      // in the layerswitcher, only the parent is shown
                      combine: true,
                      visible: false,
                      layers: [
                        baiduSource
                      ]
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
                    projection:gcjMecator,
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
                  visible: false,
                  opacity: 0.4,
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
          zoom: 10
        })
      });
      //鼠标获取坐标控件
      const mousePositionControl = new MousePosition({
        coordinateFormat: function (coordinate) {
          return format(coordinate, '经度:{x} 纬度:{y}', 4);
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
      /* this.map.addControl(new OverviewMap({
         layers: [
           new Image({
             title: '边界',

             source: new ImageWMS({
               url: "http://172.18.142.202:8880/geoserver/yzhGeoserver/wms",
               // Layers需要指定要显示的图层名
               params: { LAYERS: "yzhGeoserver:ChinaBj",TILED:false },
               // serverType明显为geoserver
               serverType: "geoserver",

               ratio:1
             }),
           }),
           /!*ew Vector({
             visible: false,
             source: new Stamen({
               projection: 'EPSG:4326',
               url: "../json/旗县界.json",
               format:GeoJSON(),
             }),
           })*!/

         ]

       }));*/

      var layerSwitcher = new LayerSwitcher({
        tipLabel: 'Légende', // Optional label for button
        groupSelectStyle: 'children' // Can be 'children' [default], 'group' or 'none'
      });
      this.map.addControl(layerSwitcher);
      this.overlay = new Overlay({
        element: this.$refs.popup1, // 弹窗标签，在html里
        autoPan: false, // true如果弹窗在底图边缘时，底图会移动
        autoPanAnimation: { // 底图移动动画
          duration: 250
        }
      })
      this.map.addOverlay(this.overlay)
    },
    //百度坐标系偏移处理
    baiduproMethod() {
      var extent = [72.004, 0, 137.8347, 55.8271];
      var baiduMercatorProj = new Projection({
        code: 'baidu',
        extent: applyTransform(extent, probaidu.ll2bmerc),
        units: 'm'
      });
      addProjection(baiduMercatorProj);
      addCoordinateTransforms('EPSG:4326', baiduMercatorProj, probaidu.ll2bmerc, probaidu.bmerc2ll);
      addCoordinateTransforms('EPSG:3857', baiduMercatorProj, probaidu.smerc2bmerc, probaidu.bmerc2smerc);

      var bmercResolutions = new Array(19);
      for (var i = 0; i < 19; ++i) {
        bmercResolutions[i] = Math.pow(2, 18 - i);
      }
      var baidu = new Tile({
        source: new XYZ({
          projection: 'baidu',
          maxZoom: 18,
          tileUrlFunction: function (tileCoord) {
            var x = tileCoord[1];
            var z = tileCoord[0];
            var y = -tileCoord[2];

            // 百度瓦片服务url将负数使用M前缀来标识
            if (x < 0) {
              x = "M" + -x;
            }
            if (y < 0) {
              y = "M" + -y;
            }
            //街道图
            return "http://online3.map.bdimg.com/tile/?qt=vtile&x=" + x + "&y=" + y + "&z=" + z + "&styles=pl&udt=udt=20170908&scaler=1&p=1"

            //影像
            // return 'http://shangetu' + parseInt(Math.random() * 10) + '.map.bdimg.com/it/u=x=' + x +
            // ';y=' + y + ';z=' + z + ';v=009;type=sate&fm=46&udt=20170606';
            // return "http://online3.map.bdimg.com/onlinelabel/?qt=tile&x="+x+"&y="+y+"&z="+z+"&styles=pl&udt=udt=20170908&scaler=1&p=1"

            //影像标注
            // return 'http://online' + parseInt(Math.random() * 10) + '.map.bdimg.com/onlinelabel/?qt=tile&x=' +
            // x + '&y=' + y + '&z=' + z + '&styles=sl&udt=20170620&scaler=1&p=1';

            //黑色系列
            //    // return 'http://api1.map.bdimg.com/customimage/tile?&x=' +
            // x + '&y=' + y + '&z=' + z + '&udt=20170908&scale=1&ak=E4805d16520de693a3fe707cdc962045&customid=dark';

            //蓝色系列
            // return "http://api0.map.bdimg.com/customimage/tile?x=" + x
            //   + "&y=" + y + "&z=" + z
            //   + "&udt=20170908&scale=2&ak=ZUONbpqGBsYGXNIYHicvbAbM"
            //   + "&styles=t%3Awater%7Ce%3Aall%7Cc%3A%23044161%2Ct%3Aland%7Ce%3Aall%7Cc%3A%23004981%2Ct%3Aboundary%7Ce%3Ag%7Cc%3A%23064f85%2Ct%3Arailway%7Ce%3Aall%7Cv%3Aoff%2Ct%3Ahighway%7Ce%3Ag%7Cc%3A%23004981%2Ct%3Ahighway%7Ce%3Ag.f%7Cc%3A%23005b96%7Cl%3A1%2Ct%3Ahighway%7Ce%3Al%7Cv%3Aoff%2Ct%3Aarterial%7Ce%3Ag%7Cc%3A%23004981%2Ct%3Aarterial%7Ce%3Ag.f%7Cc%3A%2300508b%2Ct%3Apoi%7Ce%3Aall%7Cv%3Aoff%2Ct%3Agreen%7Ce%3Aall%7Cv%3Aoff%7Cc%3A%23056197%2Ct%3Asubway%7Ce%3Aall%7Cv%3Aoff%2Ct%3Amanmade%7Ce%3Aall%7Cv%3Aoff%2Ct%3Alocal%7Ce%3Aall%7Cv%3Aoff%2Ct%3Aarterial%7Ce%3Al%7Cv%3Aoff%2Ct%3Aboundary%7Ce%3Ag.f%7Cc%3A%23029fd4%2Ct%3Abuilding%7Ce%3Aall%7Cc%3A%231a5787%2Ct%3Alabel%7Ce%3Aall%7Cv%3Aoff&t = 1505487396397";
          },
          tileGrid: new TileGrid({
            resolutions: bmercResolutions,
            origin: [0, 0],
            extent: applyTransform(extent, probaidu.ll2bmerc),
            tileSize: [256, 256]
          })
        })
      });
      return baidu;
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
    displayStationYb() {
      var mylayers = this.map.getLayers().getArray();
      for (let i = 0; i < mylayers.length; i++) {
        var name = mylayers[i].get("name");
        if (name !== undefined && name.indexOf("站点预报") !== -1) {
          // mylayers[i].setVisible(true);//设置图层显隐
          this.map.removeLayer(mylayers[i]); //删除图层
        }
      }
      var myurl="";
      if(this.lxType==="站点预报"){
        if(this.stationYbType==="区台新方法"||this.stationYbType==="RMAPS"){
          if(this.stationYbType==="RMAPS"){
            this.stationlevelType=103;
            this.stationlevel=0;
          }else if(this.stationYbType==="区台新方法"){
            this.stationlevelType=0;
            this.stationlevel=0;
          }
          myurl='/getzdybByTypeStationsTimeSx?YBType=' + this.stationYbType + '&DataTypeID=' + this.stationYbDataType + '&StationTye=' + this.stationYbStationTye + '&DQID=' + this.stationYbDq + '&times=' + this.stationYbQbTimespan + '&YbSx=' + this.stationYbSc+ '&stationlevelType=' + this.stationlevelType+ '&stationlevel=' + this.stationlevel;
        }
        if(myurl!==""){
          this.$axios
              .get(myurl)
              .then(res => {
                if (this.stationYbDataType === 0 || this.stationYbDataType === 1|| this.stationYbDataType === 2|| this.stationYbDataType === 1900) {
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
                    name: this.lxType+'-'+this.stationYbType+'-'+this.stationYbDataType+'-'+"图层"
                  });
                  this.map.addLayer(layer);
                  this.map.on('pointermove', this.showInfo);
                } else if (this.stationYbDataType === 4) {
                  styleFunction2 = function (feature) {
                    var myfetures = feature.get('features');
                    var myfeture = myfetures[0];
                    let minlevl = myfeture.get('stationLevel');
                    for (let i = 0; i < myfetures.length; i++) {
                      if (myfetures[i].get('stationLevel') < minlevl) {
                        myfeture = myfetures[i];
                        minlevl = myfeture.get('stationLevel');
                      }
                    }
                    var fs=Math.round(myfeture.get('ybvalue')/2);
                    var slevel = myfeture.get('stationLevel');
                    var style1 = new Style({
                      image: new Icon({
                        src: '/images/wind/wind'+fs+'.png',
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
                        src: '/images/wind/wind'+fs+'.png',
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
                  myJson = (new GeoJSON()).readFeatures(res.data);
                  vecSource = new Vector({
                    features: myJson,
                  });
                  clusterSource = new Cluster({
                    distance: 30,
                    source: vecSource,
                  });

                  layer = new VectorLayer({
                    source: clusterSource,
                    style: styleFunction2,
                    name: this.lxType+'-'+this.stationYbType+'-'+this.stationYbDataType+'-'+"图层"
                  });
                  this.map.addLayer(layer);
                  this.map.on('pointermove', this.showInfo);
                }
              })
              .catch(err => {
                console.log(err);
              });
        }

      }


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

      if(this.stationYbDataType !== 4){
        this.currentCoordinate = myfeture.get('id') + "&nbsp;&nbsp;" + myfeture.get('name') + "&nbsp;&nbsp;" + myfeture.get('ybvalue') + myfeture.get('ybUnit')// 保存坐标点
      }else{
        var fxNum=Math.round(myfeture.get('ybvalue2')*180/Math.PI/45);
        var fxStr="";
        switch (fxNum){
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
        this.currentCoordinate = myfeture.get('id') + "&nbsp;&nbsp;" + myfeture.get('name') + "&nbsp;&nbsp;" + myfeture.get('ybvalue') + myfeture.get('ybUnit')+ "&nbsp;&nbsp;" +fxStr// 保存坐标点
      }

      this.overlay.setPosition(coordinate)
    },
    // 关闭弹窗
    closePopup() {
      // 把弹窗位置设置为undefined，并清空坐标数据
      this.overlay.setPosition(undefined)
      this.currentCoordinate = null
    },

    mapQbTimeControlChange: function (qbTimeSpan, ScSelectValue) {
      this.stationYbQbTimespan = qbTimeSpan;
      this.stationYbSc = ScSelectValue;
      this.displayStationYb();
    },
    tcToolboxControlChange: function (tabSelect, ybType, dataType) {
      if (tabSelect === 1) {
        this.lxType="站点预报";
        if (dataType === "气温") {
          this.stationYbDataType = 0;
        } else if (dataType === "相对湿度") {
          this.stationYbDataType = 1;
        } else if (dataType === "10米风") {
          this.stationYbDataType = 4;
        } else if (dataType === "降水量") {
          this.stationYbDataType = 2;
        }else if (dataType === "能见度") {
          this.stationYbDataType = 1900;
        }else {
          this.stationYbDataType = -1;
        }
        this.stationYbType = ybType;
      }
      else if(tabSelect===0){
        this.lxType="格点预报";

      }
      this.displayStationYb();
    },
  },
  components: {
    maptool,
    mapQbTimeControl
  }
}
</script>

<style lang="scss" scoped>
/* 弹窗样式 */
.popup1 {
  position: relative;
  display: flex;
  flex-direction: column;
  transform: translate(-50%, calc(-100% - 12px));
}

</style>