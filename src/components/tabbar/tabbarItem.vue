<template>
  <div class="tab-bar-item" @click="itemClick" :class="{Select : isActive}">
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
      default: "#fff"
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
  background: #fff;
  box-shadow:inset 0px 1px 1px -1px #000,inset 0px -1px 1px -1px #000;/*no*/
}
.tab-bar-item {
  flex: 1;
  height: 50px;
  font-size: 12px;
  color: #000;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.tab-bar-item img {
  width: 20px;
  height: 20px;
  vertical-align: middle;
}
.bright{
  div{
    box-sizing: border-box;
    padding: 2px 0 6px 0;/*no*/
  }
}
.Select{
  background: #000;
}
</style>
