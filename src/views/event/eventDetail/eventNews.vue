<template>
  <div class="eventNews">
    <ul>
      <li>
        <p>事件名称</p>
        <p>{{listData.EventName}}</p>
      </li>
      <li>
        <p>报警大类</p>
        <p>{{listData.BigType}}</p>
      </li>
      <li>
        <p>开始时间</p>
        <p>{{listData.BeginTime}}</p>
      </li>
      <li>
        <p>结束时间</p>
        <p>{{listData.EndTime}}</p>
      </li>
      <li>
        <p>持续时间</p>
        <p>{{listData.ContinueTime | timeFilter}}</p>
      </li>
      <li>
        <p>报警值</p>
        <p>{{listData.EventDetailType}} &nbsp;m³/h</p>
      </li>
      <li>
        <p>报警级别</p>
        <p  :class="[{san : listData.Level == 3},{er : listData.Level == 2},{yi : listData.Level == 1}]">{{listData.Level | degree}}</p>
      </li>
      <li>
        <p>报警类型</p>
        <p>{{listData.EventType | warnType}}</p>
      </li>
      <li>
        <p>区域</p>
        <p>{{listData.Region}}</p>
      </li>
      <li>
        <p>处置状态</p>
        <p>{{listData.EventState}}</p>
      </li>
      <li>
        <p>可能原因</p>
        <p>{{listData.Reason}}</p>
      </li>
      <li>
        <p>报警描述</p>
        <p>{{listData.Description}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
// import Bus from "../../../utils/bus"
export default {
  data() {
    return {
      listData: {},
    };
  },
  mounted() {
    // Bus.$on("eventData",(res)=>{
    //   this.listData = res
    //   console.log(res)
    // })
    // console.log(1)
    // console.log(this.listData)
    this.listData = this.$route.query.item
  },
};
</script>

<style lang="less" scoped>
.eventNews {
  height: 100%;
  background: #fff;
}
ul{
  height: 100%;
  overflow-y: scroll;
  li{
    height: 48px;/*no*/
    box-sizing: border-box;
    padding: 0 15px;/*no*/
    color: #9A9A9A;
    display: flex;
    align-items: center;
    box-shadow: 0px 1px 0px 0px #F1F1F1;
    display: flex;
    justify-content: space-between;
    p{
      &:nth-child(2){
        color: #000;
      }
    }
  }
}
.san{
  color: #C3303F !important;
}
.er{
  color: #DD8A4F !important;
}
.yi{
  color: #23A2F2 !important;
}
</style>