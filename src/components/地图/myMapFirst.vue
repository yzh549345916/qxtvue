<template>
  <v-sheet style="height: 100%;" color="transparent" class="overflow-x-auto" >

    <div class="maps" id="map" style="width:100%;height:98%;z-index:5;">
      <maptool @tctoolbox-change='tcToolboxControlChange'  v-drag></maptool>
      <mapQbTimeControl v-drag @datetime-change='mapQbTimeControlChange' :data-type="stationYbType"></mapQbTimeControl>
    </div>
    <!-- 弹窗元素 -->
    <div
        class="popup1"
        ref="popup1"
        v-show="currentCoordinate !==null"
    >
      <v-chip
          close
          @click:close="closePopup"
      >
        <v-avatar left>
          <v-icon  color="primary">mdi-artstation</v-icon>
        </v-avatar>
        <div v-html="currentCoordinate"></div>
      </v-chip>
    </div>

  </v-sheet>

</template>

<script>
import "@/assets/styles/ol.css";
import "@/assets/styles/ol-layerswitcher.css";
import { Map, View } from "ol";
import Tile from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { format } from 'ol/coordinate';
import MousePosition from "ol/control/MousePosition.js";
import FullScreen from "ol/control/FullScreen.js";
import ScaleLine from "ol/control/ScaleLine.js";
import Image from "ol/layer/Image";
import Point from 'ol/geom/Point';
import Group from "ol/layer/Group";
import Overlay from 'ol/Overlay'
import GeoJSON from "ol/format/GeoJSON";
import {fromLonLat} from 'ol/proj';
import Feature from 'ol/Feature';
import {Circle as CircleStyle, Fill, Stroke, Style,Text} from 'ol/style';
import {XYZ,Vector,ImageWMS,Cluster} from "ol/source";
import maptool from "@/components/地图/地图工具组件"
import mapQbTimeControl from '@/components/基础组件/地图起报时间组件'
import LayerSwitcher from "ol-layerswitcher/src/ol-layerswitcher";
export default {
  name: "myMapFirst",
  data() {
    return {
      map:{},
      currentCoordinate: null, // 弹窗坐标数据
      overlay: null,
      stationYbQbTimespan:1599220800000,
      stationYbSc:9,
      stationYbType:"区台新方法",
      stationYbDataType:0,
      stationYbStationTye:"国家站,区域站",
      stationYbDq:1501
    };
  },
  mounted() {
    this.initMap();


  },
  directives: {
    drag (el) {
      el.onmousedown = function (e) {
        let disx = e.pageX - el.offsetLeft
        let disy = e.pageY - el.offsetTop
        document.onmousemove = function (e) {
          el.style.left = e.pageX - disx + 'px'
          el.style.top = e.pageY - disy + 'px'
        }
        document.onmouseup = function (e) {
          document.onmouseup = document.onmousemove = null
        }
        e.preventDefault()
      }
    }
  },
  methods: {
    initMap() {
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
                  visible: true,
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
                      opacity: 0.7,
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
            }),
            new Group({
              title: '站点选择',
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
                  opacity: 0.7,
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
          zoom: 2
        })
      });
      //鼠标获取坐标控件
      const mousePositionControl = new MousePosition({
        coordinateFormat: function (coordinate) {
          return format(coordinate, '经度:{x} 纬度:{y}', 2);
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
            var myJson=(new GeoJSON()).readFeatures(res.data);
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
      var mylayers=this.map.getLayers().getArray() ;
      for(let i=0;i<mylayers.length;i++){
        var name=mylayers[i].get("name");
        if(name!==undefined&&name.indexOf("站点层")!==-1){
         // mylayers[i].setVisible(true);//设置图层显隐
          this.map.removeLayer(mylayers[i]); //删除图层
        }
      }
      this.$axios
          .get('/getzdybByTypeStationsTimeSx?YBType='+this.stationYbType+'&DataTypeID='+this.stationYbDataType+'&StationTye='+this.stationYbStationTye+'&DQID='+this.stationYbDq+'&times='+this.stationYbQbTimespan+'&YbSx='+this.stationYbSc)
          .then(res => {
            if(this.stationYbDataType===0){
              var styleFunction2 = function (feature) {
                var myfetures=feature.get('features');
                var myfeture=myfetures[0];
                let minlevl=myfeture.get('stationLevel');
                for(let i=0;i<myfetures.length;i++){
                  if(myfetures[i].get('stationLevel')<minlevl){
                    myfeture=myfetures[i];
                    minlevl=myfeture.get('stationLevel');
                  }
                }
                var slevel=myfeture.get('stationLevel');
                var style1 = new Style({
                  image: new CircleStyle({
                    radius: 5,
                    fill: new Fill({color: '#0096fa', width: 4}),
                  }),
                  text: new Text({
                    text: myfeture.get('ybvalue')+ "",
                    font: '15px Calibri,sans-serif',
                    fill: new Fill({
                      color: '#fff',
                    }),
                    stroke: new Stroke({color: '#000', width: 3}),
                    offsetY:15
                  }),
                });
                var style2 = new Style({
                  image: new CircleStyle({
                    radius: 3,
                    fill: new Fill({color: '#fafafa00'}),
                    stroke: new Stroke({color: '#00d8fa', width: 2}),
                  }),
                  text: new Text({
                    text: myfeture.get('ybvalue')+ "",
                    font: '13px Calibri,sans-serif',
                    fill: new Fill({
                      color: '#fff',
                    }),
                    stroke: new Stroke({color: '#000', width: 3}),
                    offsetY:15
                  }),
                });
                if(slevel<=13){
                  return style1;
                }
                return style2;
              };
              var myJson=(new GeoJSON()).readFeatures(res.data);
              var vecSource=new Vector({
                features: myJson,
              });
              var clusterSource = new Cluster({
                distance: 30,
                source: vecSource,
              });

              var layer = new VectorLayer({
                source: clusterSource,
                style: styleFunction2,
                name:"站点层"
              });
              this.map.addLayer(layer);
              this.map.on('pointermove', this.showInfo);
            }
          })
          .catch(err => {
            console.log(err);
          });
    },
    showInfo(event) {
      var features=this.map.getFeaturesAtPixel(event.pixel,{hitTolerance:1});

      if (features.length == 0) {
        this.closePopup();
        return;
      }
      var myfetures=features[0].getProperties().features;
      var myfeture=myfetures[0];
      let minlevl=myfeture.get('stationLevel');
      for(let i=0;i<myfetures.length;i++){
        if(myfetures[i].get('stationLevel')<minlevl){
          myfeture=myfetures[i];
          minlevl=myfeture.get('stationLevel');
        }
      }
      const coordinate = event.coordinate // 获取坐标
      this.currentCoordinate = myfeture.get('id')+"&nbsp;&nbsp;"+myfeture.get('name')+"&nbsp;&nbsp;"+myfeture.get('ybvalue')+myfeture.get('ybUnit')// 保存坐标点
      this.overlay.setPosition(coordinate)
      //alert(properties);
    },
    // 关闭弹窗
    closePopup () {
      // 把弹窗位置设置为undefined，并清空坐标数据
      this.overlay.setPosition(undefined)
      this.currentCoordinate = null
    },
    mapQbTimeControlChange: function (qbTimeSpan,ScSelectValue) {
      this.stationYbQbTimespan=qbTimeSpan;
      this.stationYbSc=ScSelectValue;
      this.displayStationYb();
    },
    tcToolboxControlChange: function (tabSelect,ybType,dataType) {
      if(tabSelect===1){
        this.stationYbDataType=dataType;
        this.stationYbType=ybType;
      }
      this.displayStationYb();
    },
  },
  components:{
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