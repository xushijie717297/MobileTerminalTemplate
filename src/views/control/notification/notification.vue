<template>
  <div class="notification">

  </div>
</template>

<script>
import urlClass from "../../../components/js/UrlClass";
export default {
  data() {
    return {};
  },
  methods: {
    //获取新报警数据
    GetNewEvent() {
      let res = {
        Date: this.$moment()
          .subtract(15, "minutes")
          .format("YYYY-MM-DD HH:mm:ss"),
        // Date: "2021-04-02 09:15:00",
      };
      this.$axios
        .post(urlClass.DetectWise + "GetNewEvent", JSON.stringify(res))
        .then((e) => {
          console.log(e);
          e.data.Result.forEach((item, idx) => {
            console.log(item);
          });
        });
    },
  },
  mounted() {
      this.GetNewEvent();
    // setTimeout(() => {
    //   setInterval(() => {
    //     this.GetNewEvent();
    //   }, 900000);
    // }, 900000);
  },
};
</script>

<style lang="less" scoped>
.notification{
    width: 100%;
    height: 36px;
    background: rgba(212, 64, 80, 0.9);
    box-shadow: 0px 1px 0px 0px #C52839;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
}
</style>>