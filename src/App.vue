<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {};
  },
  created() {
    let count = 0;
    let imgs = [
      //用require的方式添加图片地址，直接添加图片地址的话，在build打包之后会查找不到图片，因为打包之后的图片名称会有一个加密的字符串
      require("./views/404/404.gif"),
    ];
    for (let img of imgs) {
      let image = new Image();
      image.src = img;
      image.onload = () => {
        count++;
        console.log(count)
      };
    }
  },
  mounted() {
    window.addEventListener("offline", () => {
      // 网络由正常常到异常时触发
      sessionStorage.locationUrl = window.location.href;
      this.$router.replace("/error");
    });
    window.addEventListener("online", () => {
      window.location.href = sessionStorage.locationUrl;
    });
  },
};
</script>

<style>
/* @import "./assets/css/popup.less"; */
* {
  -webkit-touch-callout: none; /*系统默认菜单被禁用*/
  -webkit-user-select: none; /*webkit浏览器*/
  -khtml-user-select: none; /*早期浏览器*/
  -moz-user-select: none; /*火狐*/
  -ms-user-select: none; /*IE10*/
  user-select: none;
}
* {
  margin: 0;
  padding: 0;
}
html,
body,
#app {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  background: #000;
}
::-webkit-scrollbar {
  /* background: transparent; */
  display: none;
}
</style>
