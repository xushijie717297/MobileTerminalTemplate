<template>
    <div class="box1">
    <div class="fold">
      <p>报警数统计</p>
      <p class="iconfont iconxia" @click="itemTF()" :class="className == true ? 'open' : 'close'"></p>
    </div>
    <transition name="fade">
    <div class="chat" v-show="className">
      <div id="handleEcharts" class="wrap"  ></div>
      <div class="chatRight" >
        <div class="font">已下单</div>
        <div class="font_one">{{Order.CreateNum}}</div>
        <div class="font">处理中</div>
        <div class="font_one">{{Order.ProcessingNum}}</div>
        <div class="font">已完成</div>
        <div class="font_one">{{Order.CompleteNum}}</div>
      </div>
    </div>
    </transition>
  </div>
</template>

<script>
import Bus from "../../../utils/bus";
import * as echarts from 'echarts';

export default {
  data() {
    return {
      OrderData: [],
      Order: [],
      count: 0,
      className:true,
      myChart:null
    };
  },
  mounted() {
    Bus.$on("OrderData", (res) => {
      this.Order = res;
      this.OrderData = [];
      this.count = 0;
      this.count = res.Total;
      res.OrderTypeStatisticsList.forEach((item) => {
        this.OrderData.push({
          value: item.Number,
          name: item.DataType,
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
    draw() {
      if (this.myChart != null && this.myChart!= "" && this.myChart!= undefined) {
      this.myChart.dispose();
      }
      this.myChart = echarts.init(
        document.getElementById("handleEcharts")
      );
      this.myChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c}",
        },
        legend: {
          top: "5%",
          left: "center",
        },
        graphic: {
          elements: [
            {
              type: "text",
              // left: "center",
              top: "40%",
              left: "45%",
              z: 2,
              zlevel: 100,
              style: {
                text: this.count,
                fill: "#506779",
                x: 100,
                y: 100,
                font: 'bolder 48px "Microsoft YaHei"',
                width: 30,
                height: 30,
              },
            },
            {
              type: "text",
              // left: "center",
              top: "60%",
              left: "45%",
              z: 2,
              zlevel: 100,
              style: {
                text: "工单总数",
                x: 100,
                y: 100,
                textAlign: "center",
                fill: "#9FAAB4",
                width: 30,
                height: 30,
              },
            },
          ],
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["60%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                fontSize: "40",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: this.OrderData,
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
  height: 220px;/*no*/
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
.chat{
  display: flex;
  height: calc(100% - 44px);
  .chatRight{
    width: 100px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}
.font{
  color: #9faab4;
  line-height: 30px;
  transform: scale(.8)
}
.font_one{
  height: 42px;
  width: 100%;
  font-size: 24px;
  font-weight: bold;
  color: #506779;
  padding-left: 4px;

}
</style>