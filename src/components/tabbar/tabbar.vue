<template>
  <div id="tab-bar">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "TabBar"
};
</script>
<style>
@import "../../assets/css/base.css";
#tab-bar {
  display: flex;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  /* box-shadow: 0 -1px 1px rgba(100, 100, 100, 0.1); */
  /* background: #242838 !important; */
  background: #242838 !important;
}
.tab-bar-item {
  flex: 1;
  text-align: center;
  height: 50px;
  background: #242838 !important;

}
</style>
