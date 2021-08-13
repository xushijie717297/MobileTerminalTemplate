<template>
  <div :id="id" class="wrap"></div>
</template>

<script>
import * as G2 from "@antv/g2";
import Bus from "../../../../utils/bus";
import UrlClass from "../../../../components/js/UrlClass";

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
  props: ["id", "itemInfo"],
  mounted() {
    let params = {
      EventId: this.itemInfo.EventId,
      Date: this.itemInfo.BeginTime,
    };
    this.$axios
      .post(UrlClass.DetectWise + "GetPipeBurstEventInfo", params)
      .then((Response) => {
        this.PipeBurstData = Response.data.Result;
        this.sectionData = [];
        this.averages = [];
        var bardtime = [];
        let bardata = [];
        var BeginTimeIndex;
        var EndTimeIndex;
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
        this.PipeBurstData.HistoryWindowList.forEach((element, idx) => {
          var format = [];
          element.forEach((item) => {
            format.push({
              time: item.Time,
              temperature: item.Value,
            });
          });
          this.HistoryData.push(format);
        });
        /* var EndTime =
          e.EndTime === "" ? bardtime[bardtime.length - 1] : e.EndTime;
        var BeginTime = e.BeginTime;
        bardtime.map((ele, index) => {
          if (ele === BeginTime) {
            BeginTimeIndex = index;
          }
          if (ele === EndTime) {
            EndTimeIndex = index;
          }
        });
        this.regionData = [];
        var endTime = "";
        bardata.forEach((res) => {
          if (res.prebardata != "") {
            this.regionData.push(res);
          }
        }); */
        setTimeout(() => {
          this.draw();
        }, 1000);
      });
  },
  beforeDestroy() {
    // console.log(this.chart);
  },
  methods: {
    draw() {
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
          padding: [25, 45, 20, 70],
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
        padding: [25, 45, 20, 70],
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
        padding: [25, 45, 20, 70],
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
      if (this.EventType == "minflowatnight") {
        v2.annotation().line({
          start: ["min", this.MaxValue],
          end: ["max", this.MaxValue],
          style: {
            stroke: "#ff4d4f",
            lineWidth: 1,
            lineDash: [3, 3],
          },
        });
      }
      if (this.itemInfo.EndTime) {
        v2.annotation().region({
          start: [this.$moment(this.itemInfo.BeginTime).format("HH:mm"), "min"],
          end: [
            this.$moment(this.itemInfo.EndTime).format("DD") -
              this.$moment(this.itemInfo.BeginTime).format("DD") ==
            0
              ? this.$moment(this.itemInfo.EndTime).format("HH:mm")
              : "23:45",
            "max",
          ],
          style: {
            background: "red",
          },
        });
      }

      this.chart.render();
    },
  },
};
</script>

<style lang="less" scoped>

.wrap {
  height: 100%;
}
</style>