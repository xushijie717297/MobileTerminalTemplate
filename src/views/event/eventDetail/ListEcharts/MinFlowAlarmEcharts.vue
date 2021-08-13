<template>
  <div :id="id" class="wrap"></div>
</template>

<script>
import Bus from "../../../../utils/bus";
import UrlClass from "../../../../components/js/UrlClass";
import * as echarts from 'echarts';
export default {
  data() {
    return {};
  },
  props: ["itemInfo", "id"],
  mounted() {
    console.log(this.itemInfo)
    let params = {
      EventId: this.itemInfo.EventId,
      Date: this.$moment(this.itemInfo.EndTime)
        .add(1, "days")
        .format("YYYY-MM-DD"),
    };
    this.$axios
      .post(
        UrlClass.DetectWise + "GetMinFlowAlarmAtNightEventInfo",
        JSON.stringify(params)
      )
      .then((Response) => {
        let res = Response.data.Result;
        if (res) {
          let HistoryWindowListResult = res.HistoryWindowList;
          let NightMinListResult = res.NightMinList;
          let HistoryWindowList = [];
          let HistoryTime = [];
          let NightMinList = [];
          let NightMinTime = [];
          HistoryWindowListResult.forEach((element) => {
            HistoryWindowList.push(element.Value);
            HistoryTime.push(
              this.$moment(element.Time).format("YYYY-MM-DD HH:mm:ss")
            );
          });
          NightMinListResult.forEach((element) => {
            NightMinList.push(element.Value);
            NightMinTime.push(element.Time);
          });
          let chartData = {
            HistoryWindowList: HistoryWindowList,
            HistoryTime: HistoryTime,
            NightMinList: NightMinList,
            NightMinTime: NightMinTime,
            NightLim: res.NightLim,
          };
          this.drawLine(chartData);
        }
      });
  },
  methods: {
    drawLine(chartData) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById(this.id));

      // 绘制图表
      myChart.setOption({
        grid: {
          top: 10,
          bottom: 20,
          left: 60,
          right: 20,
        },
        tooltip: {
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
            axisLabel: {
              showMaxLabel: true,
              color: "#6C6C6C",
            },
          },
        ],

        yAxis: {
          type: "value",
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
              color: "Gray",
            },
            markLine: {
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
                  yAxis: chartData.NightLim.Val_Up, // 警戒线的标注值，可以有多个yAxis,多条警示线   或者采用   {type : 'average', name: '平均值'}，type值有  max  min  average，分为最大，最小，平均值
                },
              ],
            },
            markArea: {
              itemStyle: {
                color: "rgba(204,204,204,0.4)",
              },
              data: [
                [
                  {
                    name: "",
                    xAxis: this.itemInfo.BeginTime,
                  },
                  {
                    xAxis: this.$moment(this.itemInfo.EndTime).format(
                      "YYYY-MM-DD 12:00:00"
                    ),
                  },
                ],
              ],
            },
          },
          {
            data: chartData.NightMinList,
            xAxisIndex: 1,
            type: "line",
            itemStyle: {
              color: "blue",
            },
            symbol: "circle",
            symbolSize: 6,
            markLine: {
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
                  yAxis: chartData.NightLim.Val_Down, // 警戒线的标注值，可以有多个yAxis,多条警示线   或者采用   {type : 'average', name: '平均值'}，type值有  max  min  average，分为最大，最小，平均值
                },
              ],
            },
          },
          /* {
            type: "bar",
            // barWidth: "60%",
            data: ['2021-01-01 00:00:00','2021-01-15 00:00:00'],

            barCategoryGap: 0,
            itemStyle: {
              color: "#e0a7a6",
              borderColor: "#e0a7a6",
              borderWidth: 0,
              barBorderRadius: 0,
              opacity: 0.4,
            },
            tooltip: {
              show: false,
            },
            z: 13,
          }, */
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
}
</style>
