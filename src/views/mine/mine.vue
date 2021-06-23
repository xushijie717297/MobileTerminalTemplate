<template>
  <div class="profile">
    <ul class="theme_ul">
      <li @click="themeDefault">默认(蓝色)</li>
      <li @click="themeGreen">青绿色</li>
      <li @click="themLink">暖色</li>
    </ul>
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
</style>
