<template>
  <div id="EffectiveEcharts" class="wrap"></div>
</template>

<script>
import Bus from "../../../utils/bus";
import * as echarts from 'echarts';
export default {
  data() {
    return {
      Time: [],
      Num: [],
      myChart:null,
      MaxNum:0
    };
  },
  mounted() {
    Bus.$on("EquipmentList", (res) => {
      console.log(res)
      this.MaxNum = res[1].MaxNum
      console.log(this.MaxNum)
      this.Time = [];
      this.Num = [];
      res.forEach((element) => {
        this.Time.push(element.Date);
        this.Num.push(element.Num);
      });
      if (this.myChart != null && this.myChart != "" && this.myChart != undefined) {
        this.myChart.dispose();//销毁
      }else{
        console.log(this.Num)
        this.draw();
      }
    });
  },
  methods: {
    draw() {
      this.myChart = echarts.init(document.getElementById("EffectiveEcharts"));

      this.myChart.setOption({
        tooltip: {},
        grid: {
          top: "10%",
          bottom: "15%",
          left: "12%",
          right: "5%",
        },
        xAxis: {
          type: "category",
          data: this.Time,
        },
        yAxis: {
          type: "value",
          show: true,
          max:this.MaxNum,
          splitLine: {
            show: true
          },
          lineStyle:{
            color:"#D8D8D8"
          }
        },
        series: [
          {
            data: this.Num,
            type: "bar",
            showBackground: true,
            backgroundStyle: {
              color: "rgba(180, 180, 180, 0.2)",
            },
            itemStyle: {
              color: "#3C5E78",
            },
            // barWidth: 15,
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

.wrap {
  width: 100%;
  height: 150px;
}
</style>