<template>
    <div class="box1">
    <div class="fold">
      <p>报警数统计</p>
      <p class="iconfont iconxia" @click="itemTF()" :class="className == true ? 'open' : 'close'"></p>
    </div>
    <transition name="fade">
      <div id="qualityEcharts" class="wrap" v-show="className" ></div>
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
      EquipmentData: [],
      className:true,
      myChart:null
    };
  },
  mounted() {
    Bus.$on("EquipmentData", (res) => {
      this.timeData = [];
      this.EquipmentData = [];
      res.forEach((item) => {
        this.timeData.push(item.Date);
        item.TotalList.forEach((val, idx) => {
          this.EquipmentData.push([item.Date, idx, this.gears(val), val]);
        });
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
    gears(val) {
      var size = 0;
      if (0 < val && val < 100) {
        size = 1;
      } else if (100 < val && val < 200) {
        size = 2;
      } else if (200 < val && val < 300) {
        size = 3;
      } else if (200 < val && val < 300) {
        size = 4;
      } else if (300 < val && val < 400) {
        size = 5;
      } else if (400 < val && val < 500) {
        size = 6;
      } else if (500 < val && val < 600) {
        size = 7;
      } else if (600 < val && val < 700) {
        size = 8;
      } else if (700 < val && val < 800) {
        size = 9;
      } else if (800 < val && val < 900) {
        size = 10;
      } else if (900 < val && val < 1000) {
        size = 11;
      }
      return size;
    },
    draw() {
      if (this.myChart != null && this.myChart!= "" && this.myChart!= undefined) {
        this.myChart.dispose();
      }
      this.myChart = echarts.init(
        document.getElementById("qualityEcharts")
      );
      this.myChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: function (val) {
            return (
              val.data[0] +
              "</br>" +
              val.data[3] +
              "块表数据有效率为" +
              (val.data[1] == 0 ? "" : val.data[1]) +
              "0%"
            );
          },
        },
        grid: {
          left: "6%",
          right: "6%",
          top: "10%",
          bottom:"10%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.timeData,
            axisLabel: {
              // showMaxLabel: true,
            },
          },
        ],
        yAxis: {
          axisLabel: {
            formatter: function (value, index) {
              switch (value) {
                case 0:
                  return "很差";
                case 2:
                  return "差";
                case 4:
                  return "一般";
                case 6:
                  return "好";
                case 8:
                  return "较好";
                case 10:
                  return "很好";
              }
            },
          },
        },
        series: [
          {
            symbolSize: function (val) {
              return val[2] * 4;
            },
            data: this.EquipmentData,
            type: "scatter",
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
  height: 250px;/*no*/
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