
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['exports', 'echarts'], factory);
  } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
    // CommonJS
    factory(exports, require('echarts'));
  } else {
    // Browser globals
    factory({}, root.echarts);
  }
}(this, function (exports, echarts) {
  var log = function (msg) {
    if (typeof console !== 'undefined') {
      console && console.error && console.error(msg);
    }
  };
  if (!echarts) {
    log('ECharts is not Loaded');
    return;
  }
  echarts.registerTheme('yzhBlack', {
    "color": [
      "#fcae34",
      "#01c2f9",
      "#12e78c",
      "#f4cb29",
      "#4b7cf3",
      "#d325dc",
      "#213de8",
      "#f64b4b",
      "#d46d01",
      "#0bce01",
      "#fa4660",
    ],
    "backgroundColor": {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [{
        offset: 0, color: 'rgba(7,116,114,0.3)' // 0% 处的颜色
      }, {
        offset: 0.4, color: 'rgba(2,16,16,0.3)' // 100% 处的颜色
      }, {
        offset: 1, color: 'rgba(9,39,49,0.1)' // 100% 处的颜色
      }]
    },
    "textStyle": {},
    "title": {
      "textStyle": {
        "color": "#ffffff"
      },
      "subtextStyle": {
        "color": "#ffffff"
      }
    },
    "line": {
      "itemStyle": {
        "normal": {
          "borderWidth": "4"
        }
      },
      "lineStyle": {
        "normal": {
          "width": "3"
        }
      },
      "symbolSize": "7",
      "symbol": "emptyPin",
      "smooth": true
    },
    "radar": {
      "itemStyle": {
        "normal": {
          "borderWidth": "4"
        }
      },
      "lineStyle": {
        "normal": {
          "width": "3"
        }
      },
      "symbolSize": "7",
      "symbol": "emptyPin",
      "smooth": true
    },
    "bar": {
      "itemStyle": {
        "normal": {
          "barBorderWidth": 0,
          "barBorderColor": "#cccccc"
        },
        "emphasis": {
          "barBorderWidth": 0,
          "barBorderColor": "#cccccc"
        }
      }
    },
    "pie": {
      "itemStyle": {
        "normal": {
          "borderWidth": 0,
          "borderColor": "#cccccc"
        },
        "emphasis": {
          "borderWidth": 0,
          "borderColor": "#cccccc"
        }
      }
    },
    "scatter": {
      "itemStyle": {
        "normal": {
          "borderWidth": 0,
          "borderColor": "#cccccc"
        },
        "emphasis": {
          "borderWidth": 0,
          "borderColor": "#cccccc"
        }
      }
    },
    "boxplot": {
      "itemStyle": {
        "normal": {
          "borderWidth": 0,
          "borderColor": "#cccccc"
        },
        "emphasis": {
          "borderWidth": 0,
          "borderColor": "#cccccc"
        }
      }
    },
    "parallel": {
      "itemStyle": {
        "normal": {
          "borderWidth": 0,
          "borderColor": "#cccccc"
        },
        "emphasis": {
          "borderWidth": 0,
          "borderColor": "#cccccc"
        }
      }
    },
    "sankey": {
      "itemStyle": {
        "normal": {
          "borderWidth": 0,
          "borderColor": "#cccccc"
        },
        "emphasis": {
          "borderWidth": 0,
          "borderColor": "#cccccc"
        }
      }
    },
    "funnel": {
      "itemStyle": {
        "normal": {
          "borderWidth": 0,
          "borderColor": "#cccccc"
        },
        "emphasis": {
          "borderWidth": 0,
          "borderColor": "#cccccc"
        }
      }
    },
    "gauge": {
      "itemStyle": {
        "normal": {
          "borderWidth": 0,
          "borderColor": "#cccccc"
        },
        "emphasis": {
          "borderWidth": 0,
          "borderColor": "#cccccc"
        }
      }
    },
    "candlestick": {
      "itemStyle": {
        "normal": {
          "color": "#fc97af",
          "color0": "transparent",
          "borderColor": "#fc97af",
          "borderColor0": "#87f7cf",
          "borderWidth": "2"
        }
      }
    },
    "graph": {
      "itemStyle": {
        "normal": {
          "borderWidth": 0,
          "borderColor": "#cccccc"
        }
      },
      "lineStyle": {
        "normal": {
          "width": "1",
          "color": "#ffffff"
        }
      },
      "symbolSize": "7",
      "symbol": "emptyPin",
      "smooth": true,
      "color": [
        "#fcae34",
        "#01c2f9",
        "#12e78c",
        "#f4cb29",
        "#4b7cf3",
        "#d325dc",
        "#213de8",
        "#d46d01",
        "#d46d01",
        "#0bce01",
        "#fa4660",
        "#02eaf1",
      ],
      "label": {
        "normal": {
          "textStyle": {
            "color": "#293441"
          }
        }
      }
    },
    "map": {
      "itemStyle": {
        "normal": {
          "areaColor": "#f3f3f3",
          "borderColor": "#999999",
          "borderWidth": 0.5
        },
        "emphasis": {
          "areaColor": "rgba(255,178,72,1)",
          "borderColor": "#eb8146",
          "borderWidth": 1
        }
      },
      "label": {
        "normal": {
          "textStyle": {
            "color": "#893448"
          }
        },
        "emphasis": {
          "textStyle": {
            "color": "rgb(137,52,72)"
          }
        }
      }
    },
    "geo": {
      "itemStyle": {
        "normal": {
          "areaColor": "#f3f3f3",
          "borderColor": "#999999",
          "borderWidth": 0.5
        },
        "emphasis": {
          "areaColor": "rgba(255,178,72,1)",
          "borderColor": "#eb8146",
          "borderWidth": 1
        }
      },
      "label": {
        "normal": {
          "textStyle": {
            "color": "#893448"
          }
        },
        "emphasis": {
          "textStyle": {
            "color": "rgb(137,52,72)"
          }
        }
      }
    },
    "categoryAxis": {
      "axisLine": {
        "show": true,
        "lineStyle": {
          "color": "#c9c9c9"
        }
      },
      "axisTick": {
        "show": false,
        "lineStyle": {
          "color": "#333"
        }
      },
      "axisLabel": {
        "show": true,
        "textStyle": {
          "color": "#c9c9c9"
        }
      },
      "splitLine": {
        "show": false,
        "lineStyle": {
          "color": [
            "#e6e6e6"
          ]
        }
      },
      "splitArea": {
        "show": false,
        "areaStyle": {
          "color": [
            "rgba(250,250,250,0.05)",
            "rgba(200,200,200,0.02)"
          ]
        }
      }
    },
    "valueAxis": {
      "axisLine": {
        "show": true,
        "lineStyle": {
          "color": "#c9c9c9"
        }
      },
      "axisTick": {
        "show": false,
        "lineStyle": {
          "color": "#333"
        }
      },
      "axisLabel": {
        "show": true,
        "textStyle": {
          "color": "#c9c9c9"
        }
      },
      "splitLine": {
        "show": false,
        "lineStyle": {
          "color": [
            "#e6e6e6"
          ]
        }
      },
      "splitArea": {
        "show": false,
        "areaStyle": {
          "color": [
            "rgba(250,250,250,0.05)",
            "rgba(200,200,200,0.02)"
          ]
        }
      }
    },
    "logAxis": {
      "axisLine": {
        "show": true,
        "lineStyle": {
          "color": "#c9c9c9"
        }
      },
      "axisTick": {
        "show": false,
        "lineStyle": {
          "color": "#333"
        }
      },
      "axisLabel": {
        "show": true,
        "textStyle": {
          "color": "#c9c9c9"
        }
      },
      "splitLine": {
        "show": false,
        "lineStyle": {
          "color": [
            "#e6e6e6"
          ]
        }
      },
      "splitArea": {
        "show": false,
        "areaStyle": {
          "color": [
            "rgba(250,250,250,0.05)",
            "rgba(200,200,200,0.02)"
          ]
        }
      }
    },
    "timeAxis": {
      "axisLine": {
        "show": true,
        "lineStyle": {
          "color": "#c9c9c9"
        }
      },
      "axisTick": {
        "show": false,
        "lineStyle": {
          "color": "#333"
        }
      },
      "axisLabel": {
        "show": true,
        "textStyle": {
          "color": "#c9c9c9"
        }
      },
      "splitLine": {
        "show": false,
        "lineStyle": {
          "color": [
            "#e6e6e6"
          ]
        }
      },
      "splitArea": {
        "show": false,
        "areaStyle": {
          "color": [
            "rgba(250,250,250,0.05)",
            "rgba(200,200,200,0.02)"
          ]
        }
      }
    },
    "toolbox": {
      "iconStyle": {
        "normal": {
          "borderColor": "#999999"
        },
        "emphasis": {
          "borderColor": "#666666"
        }
      }
    },
    "legend": {
      "textStyle": {
        "color": "#eaeaea"
      }
    },
    "tooltip": {
      "axisPointer": {
        "lineStyle": {
          "color": "#cccccc",
          "width": 1
        },
        "crossStyle": {
          "color": "#cccccc",
          "width": 1
        }
      }
    },
    "timeline": {
      "lineStyle": {
        "color": "#87f7cf",
        "width": 1
      },
      "itemStyle": {
        "normal": {
          "color": "#87f7cf",
          "borderWidth": 1
        },
        "emphasis": {
          "color": "#f7f494"
        }
      },
      "controlStyle": {
        "normal": {
          "color": "#87f7cf",
          "borderColor": "#87f7cf",
          "borderWidth": 0.5
        },
        "emphasis": {
          "color": "#87f7cf",
          "borderColor": "#87f7cf",
          "borderWidth": 0.5
        }
      },
      "checkpointStyle": {
        "color": "#fc97af",
        "borderColor": "rgba(252,151,175,0.3)"
      },
      "label": {
        "normal": {
          "textStyle": {
            "color": "#87f7cf"
          }
        },
        "emphasis": {
          "textStyle": {
            "color": "#87f7cf"
          }
        }
      }
    },
    "visualMap": {
      "color": [
        "#fc97af",
        "#87f7cf"
      ]
    },
    "dataZoom": {
      "backgroundColor": "rgba(255,255,255,0)",
      "dataBackgroundColor": "rgba(14,156,236,1)",
      "fillerColor": "rgba(114,204,255,0.2)",
      "handleColor": "#299bef",
      "handleSize": "100%",
      "textStyle": {
        "color": "#333333"
      }
    },
    "markPoint": {
      "label": {
        "normal": {
          "textStyle": {
            "color": "#293441"
          }
        },
        "emphasis": {
          "textStyle": {
            "color": "#293441"
          }
        }
      }
    }
  });
}));
