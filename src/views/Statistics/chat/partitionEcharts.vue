<template>
    <div class="box1">
    <div class="fold">
      <p>报警数统计</p>
      <p class="iconfont iconxia" @click="itemTF()" :class="className == true ? 'open' : 'close'"></p>
    </div>
    <transition name="fade">
      <div id="partitionEcharts" class="wrap" v-show="className" ></div>
    </transition>
  </div>
</template>

<script>
import Bus from "../../../utils/bus";
import * as echarts from 'echarts';

export default {
  data() {
    return {
      PartitionData: [],
      colorData: [
        "#FFB6C1",
        "#DC143C",
        "#FFF0F5",
        "#FF1493",
        "#DA70D6",
        "#DDA0DD",
        "#800080",
        "#4B0082",
        "#E6E6FA",
        "#4169E1",
        "#778899",
        "#00BFFF",
        "#00CED1",
        "#00FA9A",
        "#FAFAD2",
        "#FFFF00",
        "#BDB76B",
        "#FFD700",
        "#FFA500",
        "#DEB887",
        "#FF8C00",
        "#D2691E",
        "#FFA07A",
        "#FF4500",
        "#FA8072",
        "#A52A2A",
        "#C0C0C0",
        "#696969",
        "#D3D3D3",
        "#FFB6C1",
        "#DC143C",
        "#FFF0F5",
        "#FF1493",
        "#DA70D6",
        "#DDA0DD",
        "#800080",
        "#4B0082",
      ],
      className:true,
      myChart:null
    };
  },
  mounted() {
    Bus.$on("PartitionData", (res) => {
      res.forEach((item, idx) => {
        // item.itemStyle.color = this.colorData[idx];
        item.children.forEach((val, i) => {
          // val.itemStyle.color = this.colorData[4 + i];
        });
      });
      /* this.PartitionData = [];
      res.forEach((item) => {
        this.PartitionData.push({
          value: item.Total,
          name: item.PartitionName,
        });
      }); */
      this.draw(res);
    });
  },
  methods: {
        itemTF(){
      this.$nextTick(()=>{
        this.className = !this.className
        // this.draw()
      })
    },
    draw(data) {
      if (this.myChart != null && this.myChart!= "" && this.myChart!= undefined) {
        this.myChart.dispose();
      }
      this.myChart = echarts.init(
        document.getElementById("partitionEcharts")
      );
      this.myChart.setOption({
        tooltip: {
          trigger: "item",
        },
        // series: [
        //   {
        //     name: "分区",
        //     type: "pie",
        //     radius: [70, 175],
        //     center: ["54%", "50%"],
        //     roseType: "area",
        //     itemStyle: {
        //       borderRadius: 8,
        //     },
        //     data: this.PartitionData,
        //   },
        // ],

        series: {
          type: "sunburst",

          data: data,
          radius: [0, "95%"],
          sort: null,

          emphasis: {
            focus: "ancestor",
          },

          levels: [
            {},
            {
              r0: "15%",
              r: "35%",
              itemStyle: {
                borderWidth: 2,
              },
              label: {
                rotate: "tangential",
              },
            },
            {
              r0: "35%",
              r: "90%",
              label: {
                align: "right",
              },
            },
            {
              r0: "70%",
              r: "92%",
              label: {
                position: "outside",
                padding: 3,
                silent: false,
              },
              itemStyle: {
                borderWidth: 3,
              },
            },
          ],
        },
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
  height: 320px;/*no*/
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