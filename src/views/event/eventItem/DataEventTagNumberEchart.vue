<template>
  <div :id="itemInfo.MonitoringPointName" class="wrap"></div>
</template>

<script>
// import Bus from "../../../utils/bus";
// import UrlClass from "../../../components/js/UrlClass";
import * as echarts from 'echarts';
export default {
  data() {
    return {};
  },
  props: ["itemInfo"],
  mounted() {
    let HistoryWindowInList = [];
    let HistoryWindowOutList = this.itemInfo.HistoryWindowOutList;
    let HistoryWindowList = [];
    let HistoryTime = [];
    let NightMinList = [];
    let NightMinTime = [];
    HistoryWindowInList.forEach((element) => {
      HistoryWindowList.push(element.Value);
      HistoryTime.push(element.Time);
    });
    HistoryWindowOutList.forEach((element) => {
      NightMinList.push(element.Value);
      NightMinTime.push(element.Time);
    });
    let chartData = {
      HistoryWindowList: HistoryWindowList,
      HistoryTime: HistoryTime,
      NightMinList: NightMinList,
      NightMinTime: NightMinTime,
    };
    this.drawLine(chartData);
  },
  methods: {
    drawLine(chartData) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(
        document.getElementById(this.itemInfo.MonitoringPointName)
      );

      // 绘制图表
      myChart.setOption({
        grid: {
          top: 10,
          bottom: 10,
          left: 0,
          right: 5,
        },
        tooltip: {
          show: false,
          trigger: "axis",
          padding: [0, 10],
          confine: true,
          textStyle: {
            align: "left",
          },
          /* formatter: function (params) {
            let newvalueArray = params[0].name.split(":");
            let newvalue = newvalueArray[0] + ":" + newvalueArray[1];
            var res = "<div> <p> 时间：" + params + " </p> </div>";
            for (var i = 0; i < params.length; i++) {
              if (params[i].seriesName == "当前值") {
                res += "<p>" + "当前值" + ":" + params[i].HistoryWindowList + "</p>";
              } else if (params[i].seriesName == "上下限" && params[i].data != "") {
                res += "<p>" + "上限" + ":" + params[i].data + "</p>";
              } else if (params[i].seriesName == "下限" && params[i].data != "") {
                res += "<p>" + "下限" + ":" + params[i].data + "</p>";
              }
            }
            return res;
          }, */
        },
        xAxis: [
          {
            type: "category",
            data: chartData.HistoryTime,
            show: false,
          },
          {
            type: "category",
            data: chartData.NightMinTime,
            position: "bottom",
            show: false,
            axisLabel: {
              showMaxLabel: true,
              color: "#6C6C6C",
            },
          },
        ],

        yAxis: {
          type: "value",
          show: false,
          axisLabel: {
            color: "#6C6C6C",
          },
          splitLine: {
            lineStyle: {
              color: "#1F1F1F",
              width: 1,
              type: "solid",
            },
          },
        },
        series: [
          {
            data: chartData.HistoryWindowList,
            xAxisIndex: 0,
            type: "line",
            itemStyle: {
              color: "#6F9CF8",
            },
            /* markLine: {
              symbol: "none",
              data: [
                {
                  silent: false, //鼠标悬停事件  true没有，false有
                  lineStyle: {
                    //警戒线的样式  ，虚实  颜色
                    type: "solid",
                    color: "#FA3934",
                    width: 2,
                  },
                  label: {
                    show: false,
                  },
                },
              ],
            }, */
          },
          {
            data: chartData.NightMinList,
            xAxisIndex: 1,
            type: "line",
            itemStyle: {
              color: "#6F9CF8",
            },
            symbol: "circle",
            symbolSize: 0,
            markArea: {
              itemStyle: {
                color: "rgba(204,204,204,0.4)",
              },
            },
            /* markLine: {
              symbol: "none",
              data: [
                {
                  silent: false, //鼠标悬停事件  true没有，false有
                  lineStyle: {
                    //警戒线的样式  ，虚实  颜色
                    type: "solid",
                    color: "#FA3934",
                    width: 2,
                  },
                  label: {
                    show: false,
                  },
                },
              ],
            }, */
          },
        ],
      });
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
  },
};
</script>

<style lang="less" scoped>
.wrap {
  height: 100%;
  width: 100%;
  background: #fff;
  border: 1px #b4c5d4 solid;
}
</style>
