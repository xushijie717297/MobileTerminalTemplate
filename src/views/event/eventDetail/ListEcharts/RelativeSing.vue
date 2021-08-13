<template>
<div class="box">
  <div :id="item.MonitoringPointName + 1" class="wraps"></div>
  <div class="slidename">{{item.MonitoringPointName}}</div>
</div>
  
</template>

<script>
import * as G2 from "@antv/g2";
import Bus from "../../../../utils/bus";

export default {
  data() {
    return {
      sectionData: [],
      averages: [],
      regionData: [],
      EventType: "",
      MinValue: 0,
      MaxValue: 0,
      chart: null,
    };
  },
  props: ["item", "itemInfo"],
  mounted() {
    console.log(this.item,this.itemInfo)
    this.EventType = this.item.EventType;
    this.sectionData = [];
    this.averages = [];
    var bardtime = [];
    let bardata = [];
    var BeginTimeIndex;
    var EndTimeIndex;
    this.item.ChartData.forEach((element, idx) => {
      bardtime.push(element.Time);
      this.sectionData.push({
        time: element.Time,
        temperature: [Number(element.Xx), Number(element.Sx)],
      });
      this.averages.push({
        time: element.Time,
        temperature: element.Vlaue == "" ? null : (element.Vlaue == null ? null : Number(element.Vlaue)),
      });
    });
    setTimeout(() => {
      this.draw();
    }, 2000);
  },
  beforeDestroy() {
    // console.log(this.chart);
  },
  methods: {
    draw() {
      var itemItem =( this.item.MonitoringPointName + 1).toString()
      this.chart = new G2.Chart({
        container: itemItem,
        autoFit: true,
      });

      this.chart.scale({
        temperature: {
          sync: true,
          nice: true,
        },
        time: {
          //   type: "time",
          mask: "YYYY-MM-DD HH:mm",
          //   nice: true,
        },
      });
      this.chart.tooltip(false);
      const v1 = this.chart.createView({
        padding: [5, 0, 0, 0],
      });
      v1.data(this.sectionData);
      v1.scale("temperature", {
        alias: "上下限",
      });
      // v1.axis(false);
      v1.area().position("time*temperature").color("rgb(242, 178, 169)");
      if (this.EventType == "minflowatnight") {
        v1.annotation().line({
          start: ["min", this.MinValue],
          end: ["max", this.MinValue],
          style: {
            stroke: "#ff4d4f",
            lineWidth: 1,
          },
        });
      }

      const v2 = this.chart.createView({
        padding: [5, 0, 0, 0],
      });
      v2.data(this.averages);
      // v2.axis(false);
      v2.scale("temperature", {
        alias: "当前值",
      });
      v2.line().position("time*temperature");
      if (this.EventType == "minflowatnight") {
        v2.annotation().line({
          start: ["min", this.MaxValue],
          end: ["max", this.MaxValue],
          style: {
            stroke: "#ff4d4f",
            lineWidth: 1,
          },
        });
      }
      if (this.EventType == "minflowatnight") {
        v2.point()
          .position("time*temperature")
          .color("blue")
          .size(2)
          .shape("circle");
      } else {
        v2.line().position("time*temperature");
      }

      v2.annotation().region({
        start: [
          this.$moment(this.itemInfo.BeginTime).format("YYYY-MM-DD HH:mm"),
          "min",
        ],
        end: [
          this.$moment(this.itemInfo.EndTime).format("DD") -
            this.$moment(this.itemInfo.BeginTime).format("DD") ==
          0
            ? this.$moment(this.itemInfo.EndTime).format("YYYY-MM-DD HH:mm")
            : this.itemInfo.ContinueTime
            ? this.$moment(this.itemInfo.BeginTime).format("YYYY-MM-DD 23:45")
            : "",
          "max",
        ],
      });

      this.chart.render();
    },
  },
};
</script>

<style lang="less" scoped>

.box{
  height: 220px;
  width: 100%;
}
.wraps {
  height: calc(100% - 20px);
  width: 100%;
  background: #fff;
}
.slidename{
  height: 20px;
  text-align: center;
}
</style>