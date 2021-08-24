<template>
  <div class="box1">
    <div class="fold">
      <p>数据有效率统计</p>
      <p
        class="iconfont iconxia"
        @click="itemTF()"
        :class="className == true ? 'open' : 'close'"
      ></p>
    </div>
    <transition name="fade">
      <div id="qualityEcharts" class="wrap" v-show="className"></div>
    </transition>
  </div>
</template>

<script>
import Bus from "../../../utils/bus";
import * as echarts from "echarts";

export default {
  data() {
    return {
      timeData: [],
      EquipmentData: [],
      className: true,
      myChart: null,
      VirtulData: [],
    };
  },
  mounted() {
    Bus.$on("EquipmentData", (res) => {
      // console.log(res);
      var VirtulData = [];
      var EquipmentData = [];
      res.forEach((item, index) => {
        // console.log();
        this.EquipmentData.push(item.Date);
        this.VirtulData.push(item.Val);
      });
      this.draw();
    });
  },
  methods: {
    itemTF() {
      this.$nextTick(() => {
        this.className = !this.className;
      });
    },
    draw() {
      var EquipmentData = JSON.parse(JSON.stringify(this.EquipmentData));
      var VirtulData = JSON.parse(JSON.stringify(this.VirtulData));
      // console.log(EquipmentData);
      // console.log(VirtulData);
      // if (this.myChart != null && this.myChart!= "" && this.myChart!= undefined) {
      //   this.myChart.dispose();
      // }
      this.myChart = echarts.init(document.getElementById("qualityEcharts"));
      this.myChart.setOption({
        tooltip: {
          trigger: "axis",
          // formatter: function (val) {
          //   console.log(val.data);
          //   return "表数据有效率为" +  "{c}" + "%";
          // },
          formatter: "表数据有效率为 : {c}",
        },
        grid: {
          top: "26px",
          left: "14%",
          bottom: "30px",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: EquipmentData,
          axisLabel: {
            // showMaxLabel: true,
            color: "#999999",
          },
          axisLine: {
            lineStyle: {
              color: "#D8D8D8",
              width: 0.5,
            },
          },
        },
        yAxis: {
          max: 100,
          axisLabel: {
            // showMaxLabel: true,
            color: "#999999",
          },
          splitLine: {
            //去除网格线
            lineStyle: {
              color: "#D8D8D8",
              width: 0.5,
              type:"dashed"
            },
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#D8D8D8",
              width: 0.5
            },
          },
        },
        series: [
          {
            itemStyle: {
              color: "rgba(142, 146, 169, 1)",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(142, 146, 169, 0.6)",
                },
                {
                  offset: 1,
                  color: "rgba(142, 146, 169, 0)",
                },
              ]),
            },
            data: VirtulData,
            type: "line",
            symbol: "none",
          },
        ],
      });
      window.addEventListener("resize", function () {
        this.myChart.resize();
      });
    },
  },
};
</script>
<style lang="less" scoped>
.box1 {
  width: 100%;
}
.wrap {
  width: 100%;
  height: 250px; /*no*/
}
.fold {
  width: 100%;
  height: 44px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 0 25px;
  box-shadow: 0px 0px 2px 0px #d8d8d8 inset;
}
.open {
  transform: rotate(-180deg);
  transition: transform 0.3s, -webkit-transform 0.3s;
}
.close {
  transform: rotate(0deg);
  transition: transform 0.3s, -webkit-transform 0.3s;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>