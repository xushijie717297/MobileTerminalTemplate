<template>
  <div class="menu">
    <!-- <p id="statusBar"></p> -->
    <router-view></router-view>
	<!-- <div class="box" style="height: 10px;width: 100%"></div> -->
    <tab-bar>
      <tab-bar-item v-for="(item,index) in data" :key="index" :path="item.path">
        <img slot="item-icon" :src="item.url" alt="" />
        <img
          slot="item-icon-active"
          :src="item.src"
          alt=""
        />
        <div slot="item-text">{{item.name}}</div>
      </tab-bar-item>
    </tab-bar>
  </div>    
</template>
<script>
import TabBar from "../../components/tabbar/tabbar";
import TabBarItem from "../../components/tabbar/tabbarItem";
export default {
  name: "app",
  components: {
    TabBar,
    TabBarItem
  },
  data () {
    return {
      data:[
        {"path":"/control","url":require("../../assets/img/iconfont/control-active.png"),"src":require("../../assets/img/iconfont/control.png"),"name":"监控"},
        {"path":"/event","url":require("../../assets/img/iconfont/event_active.png"),"src":require("../../assets/img/iconfont/event.png"),"name":"事件"},
        {"path":"/workOrder","url":require("../../assets/img/iconfont/workOrder_active.png"),"src":require("../../assets/img/iconfont/workOrder.png"),"name":"工单"},
        {"path":"/Statistics","url":require("../../assets/img/iconfont/Statistics_active.png"),"src":require("../../assets/img/iconfont/Statistics.png"),"name":"统计"},
        {"path":"/mine","url":require("../../assets/img/iconfont/mine_active.png"),"src":require("../../assets/img/iconfont/mine.png"),"name":"我的"},
      ]
    }
  },
    mounted() {

    }
};
</script>
<style lang="less">
/* @import "../assets/css/base.css"; */
.menu{
    height: 100%;
    width: 100%;
    #statusBar{
        height: 24px;
        background: #000;
    }
}
</style>
