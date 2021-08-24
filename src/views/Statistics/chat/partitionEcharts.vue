<template>
    <div class="box1">
    <div class="fold">
      <p>分区报警数量统计</p>
      <p class="iconfont iconxia" @click="itemTF()" :class="className == true ? 'open' : 'close'"></p>
    </div>
    <transition name="fade">
      <div v-show="className" >
        <div id="partitionEcharts" class="wrap" ></div>
        <h3>分区报警排行TOP10</h3>
        <div id="partitionEchart" class="wraps" ></div>
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
      PartitionData: [],
      colorData: [
        "#23A2F2",
        "#52CCA3",
        "#DD8A4F",
        "#C3303F",
      ],
      className:true,
      myChart:null,
      myCharts:null,
      count:0,
      colorDatas:[],
      yAxisData:[],
      seriesData:[]
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
      this.PartitionData = [];
      var cityData = []
      res.forEach((item) => {
        // console.log(item.children)
        cityData = [...cityData,...item.children]
        this.count = 0;
        this.count += item.value;
        this.PartitionData.push({
          value: item.value,
          name: item.name,
        });
      });
      this.sortUpKey(cityData,'value')
      var data = cityData.splice(-10)
      data.forEach((item)=>{
        this.yAxisData.push(item.name)
        this.seriesData.push(item.value)
       let num = item.name.slice(0,1)
       switch (num) {
         case "东":
           this.colorDatas.push("#23A2F2")
           break;
           case "南":
           this.colorDatas.push("#52CCA3")
           break;
           case "西":
           this.colorDatas.push("#DDA0DD")
           break;
           case "北":
           this.colorDatas.push("#DD8A4F")
           break;
           case "中":
           this.colorDatas.push("#C3303F")
           break;
       }
      })
      // console.log(this.yAxisData,this.seriesData)
      // console.log(this.colorDatas)
      this.draw(this.PartitionData);
      this.draws();
    });
  },
  methods: {
    itemTF(){
      this.$nextTick(()=>{
        this.className = !this.className
      })
    },
    sortUpKey(array,key){
      return array.sort(function(a,b){
          var x = a[key];
          var y = b[key];
          return ((x<y)?-1:(x>y)?1:0)
      })
    },
    draw(data) {
      if (this.myChart != null && this.myChart!= "" && this.myChart!= undefined) {
        this.myChart.dispose();
      }
      this.myChart = echarts.init(
        document.getElementById("partitionEcharts")
      );
      var self = this;
      this.myChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c}",
        },
        legend: {
          top: "20%",
          right: "10%",
          orient: "vertical",
          icon: "circle",
          itemGap: 17.5
        },
        graphic: {
          elements: [
            {
              type: "text",
              left: "25%",
              top: "40%",
              z: 2,
              zlevel: 100,
              style: {
                text: this.count,
                fill: "#506779",
                x: 100,
                y: 100,
                font: 'bolder 32px "Microsoft YaHei"',
                width: 30,
                height: 30,
              },
            },
            {
              type: "text",
              left: "24%",
              top: "60%",
              z: 2,
              zlevel: 100,
              style: {
                text: "报警总数",
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
            radius: ["45%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              normal: {
                  color: function(params) {
                      return self.colorData[params.dataIndex]
                  },
              }
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                fontSize: "32",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: data,
            center: ["30%", "50%"],
          },
        ],
      });
      this.myChart.on('click', function (param) {
          console.log('点击了我！',param);
          self.count = param.value
      });
      window.addEventListener("resize", function () {
        this.myChart.resize();
      });
    },
    draws(data) {
            if (this.myCharts != null && this.myCharts!= "" && this.myCharts!= undefined) {
        this.myCharts.dispose();
      }
      this.myCharts = echarts.init(
        document.getElementById("partitionEchart")
      );
      var self = this;
      this.myCharts.setOption({
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '37%',
            right: '10%',
            bottom: '13%',
            top:"3%",
            // containLabel: true
        },
        xAxis: {
            type: 'value',
            show:false,
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            splitLine: {show: false},
        },
        yAxis: {
            type: 'category',
            splitLine: {show: false},
            data: this.yAxisData,
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            offset: 10,
            nameTextStyle: {
                fontSize: 12
            },
            axisLabel: {
              show: true,
              width: 100,
              overflow: "breakAll",
              lineHeight: 18,
              align:"left",
              margin: 100
            } 
        },
        series: [
            {
                name: '数量',
                type: 'bar',
                data: this.seriesData,
                barWidth: 20,
                barGap: 10,
                smooth: true,
                label: {
                    normal: {
                        show: true,
                        position: 'right',
                        offset: [5, -2],
                        textStyle: {
                            color: '#000000',
                            fontSize: 12
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        color: function(params) {
                            return self.colorDatas[params.dataIndex]
                        },
                    }
                },
            }
        ]
      });
    }
  },
};
</script>
<style lang="less" scoped>
.box1{
  width: 100%;
}
.wraps {
  width: 96%;
  height: 340px;/*no*/
  overflow-x: hidden;
}
.wrap {
  width: 100%;
  height: 220px;/*no*/
}
h3{
  height: 50px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 0 25px;
  font-size: 12px;
  font-weight: normal;
  position: relative;
  &::after {
      position: absolute;
      box-sizing: border-box;
      content: ' ';
      pointer-events: none;
      right: 0px;
      top: 0;
      left: 0px;
      border-bottom: 1px solid #d8d8d8;
      -webkit-transform: scaleY(.5);
      transform: scaleY(.5);
  }
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