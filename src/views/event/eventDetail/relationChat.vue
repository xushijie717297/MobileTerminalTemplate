<template>
  <div class="relationChat">
    <div class="chatTop">
      <h3>关联曲线</h3>
    </div>
    <div class="echartsline_body" v-if="chartsData.length > 0">
      <div class="swiper-container">
        <swiper ref="mySwiper" class="swiper-wrapper" :options="swiperOption">
          <swiper-slide v-for="(item, index) in chartsData" :key="index">
            <!-- @click.native="handleclickSlide(item, index)" -->
            <div
              v-if="itemInfo.EventType"
              class="swiper_div"
              @click="onslideClick(item)"
            >
              <EventTagNumberEchart
                v-if="
                  itemInfo.EventType == 'pipeburst' ||
                  itemInfo.EventType == 'minflowatnight'
                "
                :itemInfo="itemInfo"
                :item="item"
              />
              <RelativeSingleEcharts
                v-else
                :id="item.MonitoringPointName"
                :item="item"
                :itemInfo="itemInfo"
              />
            </div>
            <div class="slidename">
              {{
                itemInfo.EventType == "minflowatnight" || "pipeburst"
                  ? item.MonitoringPointName
                  : item.StationName
              }}
            </div>
          </swiper-slide>
        </swiper>
        <!-- <div class="swiper-button-prev" v-show="chartsData.length > 4"></div>
          <div class="swiper-button-next" v-show="chartsData.length > 4"></div> -->
      </div>
    </div>
    <div
      class="echartsline_body"
      style="display: flex; justify-content: center; align-items: center"
      v-else
    >
      暂 无 相 关 曲 线
    </div>
    
    <van-popup v-model="popupShow" get-container="#app" @click-overlay="clickLay" >
      <div class="box" v-if="popupI">
        <EventTagNum
          v-if="
            itemInfo.EventType == 'pipeburst' ||
            itemInfo.EventType == 'minflowatnight'
          "
          :itemInfo="itemInfo"
          :item="items"
        />
        <RelativeSing
          v-else
          :item="items"
          :itemInfo="itemInfo"
        />
      </div>
    </van-popup>
  </div>
</template>

<script>
import Vue from "vue";
import { Popup } from "vant";
import { Overlay } from 'vant';

Vue.use(Overlay);
Vue.use(Popup);
import Bus from "../../../utils/bus";
import * as G2 from "@antv/g2";
import RelativeSing from "./ListEcharts/RelativeSing.vue";
import RelativeSingleEcharts from "./ListEcharts/RelativeSingleEcharts.vue";
import EventTagNumberEchart from "./ListEcharts/EventTagNumberEchart.vue";
import EventTagNum from "./ListEcharts/EventTagNum.vue";
export default {
  components: {
    RelativeSingleEcharts,
    EventTagNumberEchart,
    EventTagNum,
    RelativeSing
  },
  data() {
    return {
      popupShow: false,
      popupItemInfo: {},
      id:"",
      chartsData: [],
      itemInfo: null,
      items:null,
      item:null,
      popupI:false,
      activebgClickswiperIndex: null,
      swiperOption: {
        // effect: "fadeOut",
        slidesPerView: 3,
        spaceBetween: 10,
        loopAdditionalSlides: 0,
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        loop: false,
        //  speed: 20000,
        autoplay: false,
        preventClicks: false,
        simulateTouch: true, //鼠标拖到swiper无效
      },
      sectionData: [],
      averages: [],
      regionData: [],
      EventType: "",
      MinValue: 0,
      MaxValue: 0,
      chart: null,
    };
  },
  created() {
    this.itemInfo = JSON.parse(localStorage.getItem("item"));
    console.log(this.chartsData);
    setTimeout(() => {
      this.chartsData = JSON.parse(localStorage.getItem("chartsData"));
      console.log(this.chartsData);
    }, 5000);
  },
  methods: {
    clickLay(){
      this.popupI = false
    },
    onslideClick(item) {
      console.log(item)
      this.items = item
      setTimeout(()=>{
        this.popupI = true
      })
      this.popupShow = true
      // localStorage.setItem("popupData",data)
      // this.$router.push("/popupChat")
    },
  },
};
</script>

<style lang="less" scoped>
.relationChat {
  height: 100%;
  display: flex;
  flex-direction: column;
  .chatTop {
    height: 26px;
    box-sizing: border-box;
    padding: 0 12px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    h3 {
      font-size: 12px; /*no*/
    }
  }
  .echartsline_body {
    width: 100%;
    display: flex;
    height: calc(100% - 32px);
    padding: 0 12px; /*no*/
    box-sizing: border-box;
    .swiper-container {
      width: 100%;
      height: 100%;
    }
    .swiper-slide {
      height: 100%;
      width: 120px;
      text-align: center;
      font-size: 18px;
      background: #fff;
      display: flex;
      flex-direction: column;
      .swiper_div {
        flex: 1;
        width: 100%;
      }
      .slidename {
        width: 100%;
        height: 20px;
        background: red;
        margin-right: 10px;
        background: #fff;
        line-height: 20px;
        font-size: 12px;
        font-weight: normal;
        color: #506779;
        // margin-top: 5px;
        white-space: nowrap;
        word-wrap: normal;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
}
@media screen and (orientation: landscape) {
  .relationChat {
    height: 130%;
    .chatTop {
      height: 32px;
    }
    .slidename {
      height: 30px !important;
      line-height: 30px !important;
    }
  }
  .swiper-slide {
    width: 200px !important;
    // height: 10px !important;
  }
}
.popupCharts{
  width: 100vw;
  // height: 300px;
}
.box{
  height: 300px;
  width: 100vw;
  background: #fff;
}
</style>