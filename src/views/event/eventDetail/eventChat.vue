<template>
  <div class="eventChat">
    <div class="chatTop">
      <h3>水量曲线</h3>
      <p class="iconfont iconhengping1" @click="Hscreen"></p>
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
      <SingleInterEchart
      v-else
        :id="'FlowEcharts'"
      />
      <div
        class="activeSwiperzoomEchartbox"
        v-if="activeSwiperzoomEchartIsshow"
      >
        <img
          src=""
          alt
          @click="closeactiveSwiperzoomEchartfun"
        />
        <activeSwiperzoomEchart />
    </div>
    <div class="chatFoot">
      <relationChat></relationChat>
    </div>
  </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Popup } from "vant";

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
      popupShow:false,
      show: false,
      itemInfo: {},
      activeSwiperzoomEchartIsshow: false,
    };
  },
  mounted() {
    this.itemInfo = JSON.parse(localStorage.getItem("item"));
    console.log(this.itemInfo.EventType);
  },
  methods: {
    Hscreen() {
      let item = this.$route.query.item
      this.$router.push({path:"/Hscreen",query:{item:item}})
      this.show = !this.show;
      // if (this.show) {
      //   plus.screen.lockOrientation("landscape-primary");
      // }else{
      //   plus.screen.lockOrientation("portrait-primary");
      // }
    },
    judgeEquipment(type) {
      if (type == "offline" || type == "stop" || type == "overrun") {
        return true;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.eventChat {
  height: 100%;
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
  }
  .chatFoot {
    height: 140px;
  }
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