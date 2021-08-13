<template>
  <div :id="id" class="wrap"></div>
</template>

<script>
import * as G2 from "@antv/g2";
// import Bus from "../../../utils/bus";
import UrlClass from "../../../components/js/UrlClass";

export default {
  data() {
    return {
      sectionData: [],
      averages: [],
      regionData: [],
      HistoryData: [],
      MinValue: 0,
      MaxValue: 0,
      chart: null,
      PipeBurstData: {},
    };
  },
  props: ["id", "PartitionId", "echartstype"],
  watch: {
    // 使用监听的方式，监听数据的变化
    echartstype(val) {
      console.log(val);
      console.log(this.echartstype);
      var params = {};
      if (this.echartstype) {
        params = {
          PartitionId: this.PartitionId,
          Date: "2021-06-14 12:00:00",
        };
      } else {
        params = {
          MonitoringPointId: this.PartitionId,
          Date: "2021-06-14 12:00:00",
          DataTypeId: "1",
        };
      }
      console.log(
        this.echartstype,
        this.echartstype ? "GetPartitionDataInfo" : "GetMonitoringPointDataInfo"
      );
      this.$axios
        .post(
          UrlClass.DetectWise +
            (this.echartstype
              ? "GetPartitionDataInfo"
              : "GetMonitoringPointDataInfo"),
          params
        )
        .then((Response) => {
          this.PipeBurstData = Response.data.Result;
          // console.log(Response.data.Result);
          this.sectionData = [];
          this.averages = [];
          var bardtime = [];
          this.PipeBurstData.LimitUpDownList.forEach((element, idx) => {
            bardtime.push(element.Time);
            this.sectionData.push({
              time: element.Time,
              temperature: [
                Number(element.Temperature[0]),
                Number(element.Temperature[1]),
              ],
            });
          });
          this.PipeBurstData.DataInList.forEach((element, idx) => {
            this.averages.push({
              time: element.Time,
              temperature: element.Value,
            });
          });
          // console.log(this.PipeBurstData)
          // this.PipeBurstData.HistoryWindowList.forEach((element, idx) => {
          //   var format = [];
          //   element.forEach((item) => {
          //     format.push({
          //       time: item.Time,
          //       temperature: item.Value,
          //     });
          //   });
          //   this.HistoryData.push(format);
          // });
          // console.log(this.sectionData)
          setTimeout(() => {
            this.draw();
          }, 1000);
        });
    },
  },
  mounted() {},
  beforeDestroy() {
    // console.log(this.chart);
  },
  methods: {
    draw() {
      console.log(this.PipeBurstData.DataInList)
      this.chart = new G2.Chart({
        container: this.id,
        autoFit: true,
      });

      this.chart.scale({
        temperature: {
          // min: this.MinValue,
          //   max: Number(e.ChartData.MaxValue),
          sync: true,
          nice: true,
        },
        time: {
          //   type: "time",
          mask: "YYYY-MM-DD HH:mm",
          //   nice: true,
        },
      });
      this.chart.tooltip({
        shared: true,
        showMarkers: false,
        showCrosshairs: true,
      });
      this.HistoryData.forEach((element) => {
        const v3 = this.chart.createView({
          padding: [25, 15, 20, 45],
        });
        v3.axis(false);
        v3.data(element);
        v3.tooltip(false);
        v3.line()
          .position("time*temperature")
          .color("rgb(128, 128, 128)")
          .style({
            lineWidth: 1,
            // fillOpacity: 1,
          });
      });
      const v1 = this.chart.createView({
        padding: [25, 15, 20, 45],
      });
      v1.data(this.sectionData);
      v1.scale("temperature", {
        alias: "上下限",
      });
      // v1.axis(false);
      v1.area().position("time*temperature").color("rgba(242, 178, 169,1)");
      if (this.EventType == "minflowatnight") {
        v1.annotation().line({
          start: ["min", this.MinValue],
          end: ["max", this.MinValue],
          style: {
            stroke: "#ff4d4f",
            lineWidth: 1,
            lineDash: [3, 3],
          },
        });
      }

      const v2 = this.chart.createView({
        padding: [25, 15, 20, 45],
      });
      v2.data(this.averages);
      v2.axis(false);
      v2.scale("temperature", {
        alias: "当前值",
      });
      v2.line().position("time*temperature").color("#0000FF");
      /* v2.point().position("time*temperature").size(4).shape("circle").style({
        stroke: "#fff",
        lineWidth: 1,
        fillOpacity: 1,
      }); */

      this.chart.render();
    },
  },
};
</script>

<style lang="less" scoped>
.wrap {
  height: 200px;
}
</style>