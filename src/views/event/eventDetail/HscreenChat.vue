<template>
  <div class="eventChat">
    <p id="statusBar"></p>
    <van-nav-bar
      title="事件详情"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="chartScroll">
      <!-- <div v-for="(item,index) in 8" :key="index" style="height:100px;border:1px solid red"></div> -->
      <div class="chatTop">
        <h3>水量曲线</h3>
      </div>
      <div class="chatCnter">
        <MinFlowAlarmEcharts
          v-if="itemInfo.EventType == 'minflowatnight'"
          :id="'DataEcharts'"
          :itemInfo="itemInfo"
        />
        <pipeburstEcharts
          v-else-if="itemInfo.EventType == 'pipeburst'"
          :id="'pipebursOne'"
          :itemInfo="itemInfo"
        />
        <EquipmentEventEcharts
          v-else-if="judgeEquipment(itemInfo.EventType)"
          :id="'EquipmentEcharts'"
          :itemInfo="itemInfo"
        />
        <SingleInterEchart v-else :id="'FlowEcharts'" :itemInfo="itemInfo" />
        <div
          class="activeSwiperzoomEchartbox"
          v-if="activeSwiperzoomEchartIsshow"
        >
          <img src="" alt @click="closeactiveSwiperzoomEchartfun" />
          <activeSwiperzoomEchart />
        </div>
      </div>
      <div class="chatFoot">
        <relationChat></relationChat>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Popup, NavBar } from "vant";

Vue.use(NavBar);
Vue.use(Popup);
import relationChat from "./relationChat.vue";
import MinFlowAlarmEcharts from "./ListEcharts/MinFlowAlarmEcharts";
import SingleInterEchart from "./ListEcharts/SingleInterEchart";
import EquipmentEventEcharts from "./ListEcharts/EquipmentEventEcharts";
import pipeburstEcharts from "./ListEcharts/pipeburstEcharts";
import activeSwiperzoomEchart from "./ListEcharts/activeSwiperzoomEchart";
export default {
  components: {
    relationChat,
    MinFlowAlarmEcharts,
    SingleInterEchart,
    EquipmentEventEcharts,
    pipeburstEcharts,
    activeSwiperzoomEchart,
  },
  data() {
    return {
      popupShow: false,
      show: false,
      itemInfo: {},
      activeSwiperzoomEchartIsshow: false,
    };
  },
  mounted() {
    this.itemInfo = JSON.parse(localStorage.getItem("item"));
    console.log(this.itemInfo.EventType);
    // plus.screen.lockOrientation("landscape-primary");
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    judgeEquipment(type) {
      if (type == "offline" || type == "stop" || type == "overrun") {
        return true;
      }
    },
  },
  beforeDestroy() {
    // plus.screen.lockOrientation("portrait-primary");
  },
};
</script>

<style lang="less" scoped>
.eventChat {
  height: 100%;
  background: #fff;
  // overflow: hidden;
  display: flex;
  flex-direction: column;
  & /deep/ .van-nav-bar__left {
    color: #fff;
    .van-nav-bar__text {
      color: #fff;
    }
  }
  & /deep/ .van-nav-bar__title {
    color: #fff;
  }
  & /deep/ .van-nav-bar {
    background-color: #000;
  }
  /deep/ .van-icon {
    color: #fff;
  }
  .chatTop {
    height: 32px;
    box-sizing: border-box;
    padding: 0 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    h3 {
      font-size: 12px; /*no*/
    }
    p {
      padding: 6px 0px 6px 10px;
    }
  }
  .chatCnter {
    height: 152px;
    width: 100%;
  }
  @media screen and (orientation: landscape) {
    .chatCnter {
      width: 100%;
      height: 260px;
    }
  }
  .chatFoot {
    height: 140px;
  }
}
.chartScroll {
  // display: flex;
  flex: 1;
  // flex-direction: column;
  overflow: auto;
}
.van-popup {
  height: 100%;
  width: 100%;
}
.HscreenChat {
  height: 100%;
  background: #cecece;
}
</style>