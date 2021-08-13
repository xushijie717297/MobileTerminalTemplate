<template>
  <div class="chart"></div>
</template>
<script>
import * as timeStamp from "../../../../utils/index";
import Bus from "../../../../utils/bus";

export default {
  name: "activeSwiperzoomEchart",
  data() {
    return {
      autoResize: {
        type: Boolean,
        default: true,
      },
      chart: null,
      sidebarElm: null,
      chartData: {},
    };
  },
  watch: {
    styleDefault(val) {
      this.chart.setOption({
        series: [
          {
            areaStyle: {
              color: val ? "rgb(24, 24, 24)" : "#f1f3f5",
            },
          },
          {
            areaStyle: {
              color: val ? "#292934" : "#E2C1C1",
            },
          },
        ],
      });
    },
  },
  mounted() {
    Bus.$on("ActiveGetEventBaseChartDataTo", (e) => {
      console.log("GetEventBaseChartDataTo---------e", e);
      let colorList = [
        "#40c0cf",
        "#D575C2",
        "#c05451",
        "#61568a",
        "#b27b50",
        "#6bec35",
        "#40c0cf",
        "#D575C2",
        "#c05451",
        "#61568a",
        "#b27b50",
        "#6bec35",
      ];
      var colorLineData = colorList[e.index];
      let MaxValue = e.MaxValue;
      let MinValue = e.MinValue;
      var limit_up = e.limit_up;
      var limit_down = e.limit_down;
      var current = e.today_data;
      var time = e.time;

      this.chartData = {
        limit_up,
        limit_down,
        current,
        time,
        MaxValue,
        MinValue,
        colorLineData,
      };
      console.log("this.chartData", this.chartData);
      setTimeout(() => {
        this.initChart();
      }, 300);
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    if (this.autoResize) {
      window.removeEventListener("resize", this.__resizeHandler);
    }

    this.sidebarElm &&
      this.sidebarElm.removeEventListener(
        "transitionend",
        this.sidebarResizeHandler
      );

    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = this.$echarts.init(this.$el, "macarons");
      this.chart.clear();
      this.setOptions(this.chartData);
      // this.chart.on("mouseover", function(a) {
      //   console.log("this.chart.mouseover");
      // });
      // this.chart.on("mouseout", function() {
      //   emphasis();
      // });
    },

    setOptions(chartData) {
      this.chart.setOption({
        grid: {
          bottom: "4%",
          top: "5%",
          right: "2%",
          left: "7%",
          show: false,
          borderColor: "#cfd6db",
          borderWidth: 1,
        },

        tooltip: {
          trigger: "axis",
          padding: [0, 10],
          confine: true,
          textStyle: {
            align: "left",
          },
          formatter: function (params) {
            let newvalueArray = params[0].name.split(":");
            let newvalue = newvalueArray[0] + ":" + newvalueArray[1];
            var res = "<div> <p> 时间：" + newvalue + " </p> </div>";
            for (var i = 0; i < params.length; i++) {
              if (params[i].seriesName == "当前值") {
                res += "<p>" + "当前值" + ":" + params[i].data + "</p>";
              } else if (params[i].seriesName == "上下限" && params[i].data != "") {
                res += "<p>" + "上限" + ":" + params[i].data + "</p>";
              } else if (params[i].seriesName == "下限" && params[i].data != "") {
                res += "<p>" + "下限" + ":" + params[i].data + "</p>";
              }
            }
            return res;
          },
        },
        xAxis: [
          {
            data: chartData.time,
            axisLine: {
              lineStyle: {
                // 设置y轴颜色
                color: "#D9E5EF",
              },
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: "#9FAAB4", //更改坐标轴文字颜色
                fontSize: 12, //更改坐标轴文字大小
              },
              formatter: function (value, index) {
                // 格式化成月/日，只在第一个刻度显示年份
                let newvalueArray = value.split(":");
                let newvalue = newvalueArray[0] + ":" + newvalueArray[1];
                return newvalue;
              },
            },
            //网格样式
            splitLine: {
              show: false,
              lineStyle: {
                color: "#D9E5EF",
                width: 1,
                type: "solid",
              },
            },
            axisTick: {
              show: false,
            },

            z: 10,
          },
        ],
        yAxis: {
          max: chartData.MaxValue,
          min: chartData.MinValue,
          // splitLine: {
          //   show: true,
          //   lineStyle: {
          //     color: "#D9E5EF",
          //     width: 1,
          //     type: "dashed",
          //   },
          // },
          axisLine: {
            lineStyle: {
              // 设置y轴颜色
              color: "#D9E5EF",
            },
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#9FAAB4", //更改坐标轴文字颜色
              fontSize: 12, //更改坐标轴文字大小
            },
          },
          //网格样式
          splitLine: {
            show: true,
            lineStyle: {
              color: "#D9E5EF",
              width: 1,
              type: "solid",
            },
          },
          axisTick: {
            show: false,
          },
        },
        // dataZoom: [
        //   {
        //     type: "inside",
        //     start: 0,
        //     end: 100,
        //   },
        //   {
        //     type: "slider",
        //     start: 0,
        //     end: 10,
        //     handleIcon:
        //       "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
        //     handleSize: "80%",
        //     // fillerColor: "rgba(176,196,222,.4)",
        //     // backgroundColor: "#1b1b1b",
        //     // borderColor: "#2f2f2e",
        //     // dataBackground: {
        //     //   // lineStyle: {color: "#24242c"},
        //     //   areaStyle: {
        //     //     color: "#4a4a4a"
        //     //   }
        //     // },
        //     // handleStyle: {
        //     //   color: "#fff",
        //     //   shadowBlur: 3,
        //     //   shadowColor: "rgba(0, 0, 0, 0.6)",
        //     //   shadowOffsetX: 2,
        //     //   shadowOffsetY: 2
        //     // },
        //     textStyle: {
        //       color: "rgba(0, 0, 0, 0)",
        //     },
        //   },
        // ],
        series: [
          {
            name: "上下限" /* "上限" */,
            type: "line",
            data: chartData.limit_up,
            connectNulls: true,

            itemStyle: {
              normal: {
                color: "#7CA1C0",
              },
            },
            lineStyle: {
              normal: {
                width: 0,
                color: "#7CA1C0",
              },
            },
            areaStyle: {
              normal: {
                color: "#7CA1C0",
              },
            },
            // lineStyle: {
            //   opacity: 0
            // },
            // areaStyle: {
            //   color: "#7CA1C0"
            // },
            // stack: "confidence-band",
            symbol: "none",
          },
          {
            name: "下限",
            type: "line",
            data: chartData.limit_down,
            connectNulls: true,

            itemStyle: {
              normal: {
                color: "#fff",
              },
            },
            lineStyle: {
              normal: {
                width: 0,
                color: "#fff",
              },
            },
            areaStyle: {
              normal: {
                color: "#fff",
                opacity: 1,
              },
            },

            // lineStyle: {
            //   opacity: 0
            // },
            // stack: "confidence-band",
            symbol: "none",
          },
          {
            symbolSize: 2,
            data: chartData.current,
            type: "scatter",
            itemStyle: {
              normal: {
                color: chartData.colorLineData,
              },
            },
          },
          {
            name: "当前值",
            type: "line",
            symbol: "none",
            data: chartData.current,
            connectNulls: false,

            lineStyle: {
              normal: {
                width: 2,
                color: chartData.colorLineData,
              },
            },
          },
        ],
      });
    },
    sidebarResizeHandler(e) {
      if (e.propertyName === "width") {
        this.__resizeHandler();
      }
    },
    //窗口改变执行方法
    resetSizefun() {
      if (this.autoResize) {
        this.__resizeHandler = timeStamp.debounce(() => {
          if (this.chart) {
            this.chart.resize();
          }
        }, 100);
        window.addEventListener("resize", this.__resizeHandler);
      }

      // 监听侧边栏的变化
      this.sidebarElm = document.getElementsByClassName("sidebar-container")[0];
      this.sidebarElm &&
        this.sidebarElm.addEventListener(
          "transitionend",
          this.sidebarResizeHandler
        );
    },
  },
};
</script>

<style lang="less" scoped>
.chart {
  width: 100%;
  height: vh(560);
  background: #fff;
}
.className {
  background: rgb(24, 24, 24);
  height: vh(560);
}

.className_white {
  width: 100%;
  height: vh(560);
  background: #f1f3f5;
}
</style>

