<template>
 <v-sheet color="transparent" class="overflow-x-auto" >
   <div id="map" style="width:100%;height: 850px">

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
import {fromLonLat} from 'ol/proj';
import Feature from 'ol/Feature';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import {XYZ,Vector,ImageWMS} from "ol/source";
import LayerSwitcher from "ol-layerswitcher/src/ol-layerswitcher";
export default {
name: "myMapFirst",
  data() {
    return {
      map:{}
    };
  },
  mounted() {
    this.initMap();
    this.addPoint();
  },
  methods: {
    initMap() {
      this.map = new Map({
        target: 'map',
        layers: [
          new Group({
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
                    opacity:0.7,
                    source: new ImageWMS({
                      url: "http://172.18.142.202:8880/geoserver/yzhGeoserver/wms",
                      // Layers需要指定要显示的图层名
                      params: { LAYERS: "yzhGeoserver:ChinaBj",TILED:false },
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
        view: new View({
          projection: "EPSG:4326",
          center: [111.70893300, 40.76124776],
          zoom: 12
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
        tipLabel:'全屏显示'
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

    },
    addPoint(){

      var rome = new Feature({
        geometry: new Point(fromLonLat([12.5, 41.9])),
      });

      var london = new Feature({
        geometry: new Point(fromLonLat([-0.12755, 51.507222])),
      });

      var madrid = new Feature({
        geometry: new Point(fromLonLat([-3.683333, 40.4])),
      });
      var paris = new Feature({
        geometry: new Point(fromLonLat([2.353, 48.8566])),
      });
      var berlin = new Feature({
        geometry: new Point(fromLonLat([13.3884, 52.5169])),
      });
      var myStyle=new Style({
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({color: '#666666'}),
          stroke: new Stroke({color: '#bada55', width: 1}),
        }),
      });
      london.setStyle(myStyle);
      madrid.setStyle(myStyle);
      paris.setStyle(myStyle);
      berlin.setStyle(myStyle);
      var vectorSource = new Vector({
        features: [rome, london, madrid, paris, berlin],
      });
      var vectorLayer = new VectorLayer({
        source: vectorSource,
        visible: true,
        title: '边界',
      });
      var mm= new Image({
            title: '边界',
            visible: true,
            opacity:0.7,
            source: new ImageWMS({
              url: "http://172.18.142.202:8880/geoserver/yzhGeoserver/wms",
              // Layers需要指定要显示的图层名
              params: { LAYERS: "yzhGeoserver:ChinaBj",TILED:false },
              // serverType明显为geoserver
              serverType: "geoserver",

              /* ratio:1*/
            }),
          })
      this.map.addLayer(vectorLayer);
      this.map.render();
    }
  },
}
</script>

<style  scoped>

</style>