<template>
  <div class="eventChat">
    <p id="statusBar"></p>
    <van-nav-bar
      title="事件详情"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="chartScroll" v-if="show">
        <EventTagNum
          v-if="
            itemInfo.EventType == 'pipeburst' ||
            itemInfo.EventType == 'minflowatnight'
          "
          :itemInfo="itemInfo"
          :item="item"
        />
        <RelativeSingleEchartsP
          v-else
          :item="item"
          :itemInfo="itemInfo"
        />
      <div class="slidename">
        {{
          itemInfo.EventType == "minflowatnight" || "pipeburst"
            ? item.MonitoringPointName
            : item.StationName
        }}
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Popup, NavBar } from "vant";

Vue.use(NavBar);
Vue.use(Popup);
import RelativeSingleEchartsP from "./ListEcharts/RelativeSing.vue";
import EventTagNum from "./ListEcharts/EventTagNum.vue";
export default {
  components: {
    RelativeSingleEchartsP,
    EventTagNum,
  },
  data() {
    return {
      show: false,
      itemInfo: {},
      item:null,
      activeSwiperzoomEchartIsshow: false,
    };
  },
  mounted() {
    this.item = JSON.parse(localStorage.getItem("popupData"));
    this.itemInfo = JSON.parse(localStorage.getItem("item"));
    console.log(this.item,this.itemInfo)
    this.show = true
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