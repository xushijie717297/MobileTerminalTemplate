<template>
  <div class="tab-bar-item" @click="itemClick">
    <div v-if="!isActive"><slot name="item-icon"></slot></div>
    <div v-else><slot name="item-icon-active"></slot></div>
    <div :style="activeStyle" class="bright">
      <slot name="item-text"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "TabBarItem",
  props: {
    path: String,
    activeColor: {
      type: String,
      default: "#4664E3"
    }
  },
  data() {
    return {
      //   isActive: true
    };
  },
  computed: {
    isActive() {
      return this.$route.path.indexOf(this.path) !== -1;
    },
    activeStyle() {
      return this.isActive ? { color: this.activeColor } : {};
    }
  },
  methods: {
    itemClick() {
      if (!this.isActive) {
        this.$router.replace(this.path);
      }
    }
  }
};
</script>
<style lang='less'>
@import "../../assets/css/base.css";
#tab-bar {
  display: flex;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  // box-shadow: 0 -1px 1px rgba(100, 100, 100, 0.1);
}
.tab-bar-item {
  flex: 1;
  height: 50px;
  font-size: 12px;
  text-align: center;
  color: #8E92A9;
  &:nth-child(3){
    div{
      position: relative;
      // background: red;
      margin-top: 26px;
      img{
      height: 40px;
      width: 40px;
      position: absolute;
      top: -42px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 200;
    }
    }
  }
}
.tab-bar-item img {
  width: 20px;
  height: 20px;
  margin-top: 6px;
  vertical-align: middle;
}
.bright{
  div{
    transform: scale(.8,.8);
  }
}
</style>
