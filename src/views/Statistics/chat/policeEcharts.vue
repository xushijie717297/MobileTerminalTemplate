<template>
  <div class="box1">
    <div class="fold">
      <p>日报警数量统计</p>
      <p class="iconfont iconxia" @click="itemTF()" :class="className == true ? 'open' : 'close'"></p>
    </div>
    <transition name="fade">
      <div id="policeEcharts" class="wrap" v-show="className" ></div>
    </transition>
  </div>
</template>

<script>
import Bus from "../../../utils/bus";
import * as echarts from 'echarts';
export default {
  data() {
    return {
      timeData: [],
      Level1: [],
      Level2: [],
      Level3: [],
      className:true,
      myChart:null
    };
  },
  mounted() {
    Bus.$on("StatisticData", (res) => {
      this.timeData= [];
      this.Level1 = [];
      this.Level2 = [];
      this.Level3 = [];
      res.forEach((item) => {
        this.timeData.push(item.Date);
        this.Level1.push(item.Level1);
        this.Level2.push(item.Level2);
        this.Level3.push(item.Level3);
      });
      this.draw();
    });
  },
  methods: {
    itemTF(){
      this.$nextTick(()=>{
        this.className = !this.className
        // this.draw()
      })
    },
    draw() {
      if (this.myChart != null && this.myChart!= "" && this.myChart!= undefined) {
        this.myChart.dispose();
      }
      this.myChart = echarts.init(
        document.getElementById("policeEcharts")
      );
      this.myChart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        legend: {
          data: ["轻微", "一般", "严重"],
          top: "8%",
          itemGap: 20,
          itemWidth: 12,
          itemHeight: 12,
        },
        grid: {
          top: "20%",
          left: "7%",
          right: "7%",
          bottom: "10%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.timeData,
            axisLabel: {
              // showMaxLabel: true,
              color:"#999999"
            },
            axisTick: {
              show: false
            },
            axisLine:{
              lineStyle:{
                color:"#D8D8D8",
                width:0.5
              }
            }
          },
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              // showMaxLabel: true,
              color:"#999999"
            },
            axisLine: {
              show: true,
              lineStyle:{
                color:"#D8D8D8",
                width:0.5
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                width: 1,
                color:"#D8D8D8"
              }
            }
          },
        ],
        series: [
          {
            name: "轻微",
            type: "bar",
            barWidth: 10,
            stack: "total",
            emphasis: {
              focus: "series",
            },
            itemStyle:{
              color:"rgba(35, 162, 242, 1)"
            },
            data: this.Level1,
          },
          {
            name: "一般",
            type: "bar",
            stack: "total",
            emphasis: {
              focus: "series",
            },
             itemStyle:{
              color:"rgba(221, 138, 79, 1)"
            },
            data: this.Level2,
          },
          {
            name: "严重",
            type: "bar",
            stack: "total",
            emphasis: {
              focus: "series",
            },
             itemStyle:{
              color:"rgba(195, 48, 63, 1)"
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
// @import "@/styles/global.scss";
.box1{
  width: 100%;
}
.wrap {
  width: 100%;
  height: 180px;/*no*/
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