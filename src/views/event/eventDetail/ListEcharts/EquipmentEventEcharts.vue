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
      averages: [],
      listData:[],
      regionData: [],
      HistoryData: [],
      MinValue: 0,
      MaxValue: 0,
      chart: null,
      EquipmentData: {},
    };
  },
  props: ["id", "itemInfo"],
  mounted() {
    console.log(this.itemInfo);
    let params = {
      EventId: this.itemInfo.EventId,
      Date: this.itemInfo.BeginTime,
    };
    this.$axios
      .post(UrlClass.DetectWise + "GetEquipmentEventInfo", params)
      .then((Response) => {
        this.EquipmentData = Response.data.Result;
        Bus.$emit("MonitoringPointName",this.EquipmentData.MonitoringPointName)
        this.EquipmentData.HistoryWindowInList.forEach((element, idx) => {
          this.averages.push({
            time: this.$moment(element.Time).format("HH:mm"),
            temperature: element.Value,
          });
          this.listData.push(element.Value)
        });
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
          min: Math.min(...this.listData),
          max: Math.max(...this.listData) + 10,
        },
        time: {
          mask: "HH:mm",
        },
      });
      this.chart.tooltip({
        shared: true,
        showMarkers: false,
        showCrosshairs: true,
      });
      const v2 = this.chart.createView({
        padding: [25, 45, 20, 70],
      });
      v2.data(this.averages);
      v2.axis(true);
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