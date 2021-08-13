<template>
    <div class="box1">
    <div class="fold">
      <p>数据类型报警数量统计</p>
      <p class="iconfont iconxia" @click="itemTF()" :class="className == true ? 'open' : 'close'"></p>
    </div>
    <transition name="fade">
      <div id="typeEcharts" class="wrap" v-show="className" ></div>
    </transition>
  </div>
</template>

<script>
import Bus from "../../../utils/bus";
import * as echarts from 'echarts';

export default {
  data() {
    return {
      WarningType: [],
      WarningData: [],
      className:true,
      myChart:null
    };
  },
  mounted() {
    Bus.$on("DataType", (res) => {
      this.WarningType = [];
      this.WarningData = [];
      res.forEach((item) => {
        if (item.Number && item.Number != 0) {
          this.WarningType.push(item.DataType);
          this.WarningData.push({
            value: item.Number,
            name: item.DataType,
          });
        }
      });
      this.draw();
    });
  },
  methods: {
    itemTF(){
      this.$nextTick(()=>{
        this.className = !this.className
      })
    },
    draw() {
      if (this.myChart != null && this.myChart!= "" && this.myChart!= undefined) {
        this.myChart.dispose();
      }
      this.myChart = echarts.init(document.getElementById("typeEcharts"));
      this.myChart.setOption({
        /* tooltip: {
          trigger: "item",
          formatter: "{b} : {c}",
        }, */
        legend: {
          top: "4%",
          data: this.WarningType,
        },
        series: [
          {
            name: "类型",
            type: "funnel",
            left: "20%",
            width: "50%",
            labelLine: {
              show: false,
            },
            itemStyle: {
              opacity: 0.7,
            },
            label: {
              formatter: "{b}: {c}",
            },
            data: this.WarningData,
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
.box1{
  width: 100%;
}
.wrap {
  width: 100%;
  height: 280px;/*no*/
}
.fold{
  width: 100%;
  height: 44px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 0 25px;
  box-shadow: 0px 0px 2px 0px #D8D8D8 inset;
}
.open{
    transform: rotate(-180deg);
    transition: transform .3s,-webkit-transform .3s;
}
.close{
    transform: rotate(0deg);
    transition: transform .3s,-webkit-transform .3s;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>