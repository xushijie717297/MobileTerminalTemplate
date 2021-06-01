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
        {"path":"/home","url":require("../../assets/img/iconfont/home.png"),"src":require("../../assets/img/iconfont/home-active.png"),"name":"首页"},
        {"path":"/programme","url":require("../../assets/img/iconfont/category.png"),"src":require("../../assets/img/iconfont/category_active.png"),"name":"方案"},
        {"path":"/shopcart","url":require("../../assets/img/iconfont/moxing.png"),"src":require("../../assets/img/iconfont/moxing.png"),"name":"模型"},
        {"path":"/category","url":require("../../assets/img/iconfont/shopcart.png"),"src":require("../../assets/img/iconfont/shopcart_active.png"),"name":"任务"},
        {"path":"/profile","url":require("../../assets/img/iconfont/profile.png"),"src":require("../../assets/img/iconfont/profile_active.png"),"name":"我的"},
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
        background: #242838;
    }
}
</style>
