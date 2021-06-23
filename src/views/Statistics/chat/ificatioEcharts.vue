<template>
    <div class="box1">
    <div class="fold">
      <p>报警数统计</p>
      <p class="iconfont iconxia" @click="itemTF()" :class="className == true ? 'open' : 'close'"></p>
    </div>
    <transition name="fade">
      <div id="ificatioEcharts" class="wrap" v-show="className" ></div>
    </transition>
  </div>
</template>

<script>
import Bus from "../../../utils/bus";
import * as echarts from 'echarts';
export default {
  data() {
    return {
      WarningType:[],
      Level1: [],
      Level2: [],
      Level3: [],
      className:true,
      myChart:null
    };
  },
  mounted() {
    Bus.$on("WarningTypeData",res=>{
      this.WarningType = [];
      this.Level1 = [];
      this.Level2 = [];
      this.Level3 = [];
      res.forEach(item => {
        this.WarningType.push(item.WarningType);
        this.Level1.push(item.Level1);
        this.Level2.push(item.Level2);
        this.Level3.push(item.Level3 ? item.Level3 : "");
      })
      this.draw();
    })
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
      this.myChart = echarts.init(document.getElementById("ificatioEcharts"));
      this.myChart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // Use axis to trigger tooltip
            type: "shadow", // 'shadow' as default; can also be 'line' or 'shadow'
          },
        },
        legend: {
          data: ["轻微", "一般", "严重"],
          top:"8%",
          itemGap:20,
          itemWidth:12,
          itemHeight:12,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
          data: this.WarningType,
        },
        series: [
          {
            name: "轻微",
            type: "bar",
            barWidth: 20,
            stack: "total",
            label: {
              show: true,
            },
            emphasis: {
              focus: "series",
            },
            itemStyle:{
              color:"rgba(27, 63, 194, 0.8)"
            },
            data: this.Level1,
          },
          {
            name: "一般",
            type: "bar",
            stack: "total",
            label: {
              show: true,
            },
            emphasis: {
              focus: "series",
            },
             itemStyle:{
              color:"rgba(206, 115, 8, 0.8)"
            },
            data: this.Level2,
          },
          {
            name: "严重",
            type: "bar",
            stack: "total",
            label: {
              show: true,
            },
            emphasis: {
              focus: "series",
            },
             itemStyle:{
              color:"rgba(177, 6, 6, 0.8)"
            },
            data: this.Level3,
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
  height: 240px;/*no*/
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