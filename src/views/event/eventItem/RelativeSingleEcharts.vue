<template>
  <div :id="id" class="wrap"></div>
</template>

<script>
import * as G2 from "@antv/g2";
// import Bus from "../../../utils/bus";

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
  props: ["id", "itemInfo"],
  mounted() {
    this.EventType = this.itemInfo.EventType;
    this.sectionData = [];
    this.averages = [];
    var bardtime = [];
    // let bardata = [];
    // var BeginTimeIndex;
    // var EndTimeIndex;
    this.itemInfo.ChartData.forEach((element, idx) => {
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
    // var EndTime = e.EndTime === "" ? bardtime[bardtime.length - 1] : e.EndTime;
    /* var BeginTime = e.BeginTime;
    bardtime.map((ele, index) => {
      if (ele === BeginTime) {
        BeginTimeIndex = index;
      }
      if (ele === EndTime) {
        EndTimeIndex = index;
      }
    });
    bardtime.map((ele, index) => {
      let prebardata;
      if (index > BeginTimeIndex && index < EndTimeIndex) {
        prebardata = this.MaxValue;
      } else if (index === BeginTimeIndex || index === EndTimeIndex) {
        prebardata = this.MaxValue;
      } else {
        prebardata = "";
      }
      bardata.push({
        time: ele,
        prebardata: prebardata,
      });
    }); */
    // this.regionData = [];
    // var endTime = "";
    // bardata.forEach((res) => {
    //   if (res.prebardata != "") {
    //     this.regionData.push(res);
    //   }
    // });
    setTimeout(() => {
      this.draw();
    }, 1000);
  },
  beforeDestroy() {
    // console.log(this.chart);
  },
  methods: {
    draw() {
      this.chart = new G2.Chart({
        container: this.id.toString(),
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
        padding: [5, 0, 5, 0],
      });
      v1.data(this.sectionData);
      v1.scale("temperature", {
        alias: "上下限",
      });
      v1.axis(false);
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
        padding: [5, 0, 5, 0],
      });
      v2.data(this.averages);
      v2.axis(false);
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


      this.chart.render();
    },
  },
};
</script>

<style lang="less" scoped>

.wrap {
  height: 100%;
  width: 100%;
  border: 1px #b4c5d4 solid;
  background: #fff;
}
</style>