<template>
  <div class="mine">
    <ul class="theme_ul">
      <li @click="themeDefault">默认(蓝色)</li>
      <li @click="themeGreen">青绿色</li>
      <li @click="themLink">暖色</li>
    </ul>
    <p id="statusBar"></p>
    <h3>我的</h3>
    <div class="main">
      <!-- <div id="map" style="width: 100%; height: 100%"></div> -->
      <p class="iconfont icongongnengnengzanweikaifang"></p>
      <span>暂未开放</span>
    </div>
  </div>
</template>
<script>
export default {
  name: "Profile",
  data() {
    return {};
  },
  methods: {
    themeDefault() {
      document.body.className = "theme_default";
      localStorage.setItem("themeColor", "theme_default");
    },
    // 青绿色
    themeGreen() {
      document.body.className = "theme_darkgreen";
      localStorage.setItem("themeColor", "theme_darkgreen");
    },
    // 暖色
    themLink() {
      document.body.className = "thenm_warm";
      localStorage.setItem("themeColor", "thenm_warm");
    },
  },
  mounted() {},
};
</script>
<style scoped lang="less">
@import "./mine.less";
</style>
