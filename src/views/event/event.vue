<template>
  <div class="programme">
    <p id="statusBar"></p>
    <div class="box">
      <div class="navList">
        <van-tabs v-model="active" @click="onClick" ref="vanTab">
          <van-tab
            v-for="(item, index) in eventList"
            :key="index"
            :title="item.name"
          ></van-tab>
        </van-tabs>
      </div>
      <div class="content">
        <dataList v-show="tabValue == 0"></dataList>
        <eventMonitor  v-show="tabValue == 1"></eventMonitor>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { SwipeCell, Button, Collapse, CollapseItem, Tab, Tabs } from "vant";

Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Button);
Vue.use(SwipeCell);
import dataList from "./eventTab/eventList.vue"
import eventMonitor from "./eventTab/enentMonitor.vue"
export default {
  name: "programme",
  components: {
    dataList,
    eventMonitor
  },
  data() {
    return {
      eventList:[
        {name:"事件列表",value:0},
        {name:"数据监测",value:1}
      ],
      active:0,
      tabValue:0
    };
  },
  methods: {
    onClick(name, title) {
      this.tabValue = name
      localStorage.setItem("active",name)
    }
  },
  mounted() {
      let tab = localStorage.getItem("active")
      if (tab != null) {
        this.active = Number(tab)
        this.tabValue = Number(tab)
      }
      this.$refs.vanTab.resize();
  },
  created() {

  },
};
</script>
<style scoped lang="less">
@import "./event.less";
.programme {//.van-swipe-cell
  height: 100%;
  background: #262f49;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &::after {
    display: block;
    content: "";
    width: 100%;
    height: 50px;
    background-color: black;
  }
  .box {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #fff;
    overflow: auto;
  }
}
.content{
  flex: 1;
  overflow: hidden;
}
</style>
