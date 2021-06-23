<template>
  <div class="waring">
    <p id="statusBar"></p>
    <search></search>
    <div class="dataNull" v-if="show">
      <p class="iconfont iconzanwushuju"></p>
      <span>暂无数据</span>
    </div>
    <div class="box" v-else>
      <van-collapse v-model="activeNames">
        <van-collapse-item v-for="(item,index) in WorkList" :key="index" :title="item.EventName" :name="item.OrderNum">
          <template #value>
            <div :style="{color:item.color}">{{item.OrderState}}</div>
          </template>
          <div class="coolTtem">
            <p>
              <span>工单编号</span>
              <span>{{item.EventId}}</span>
            </p>
            <p>
              <span>工单状态</span>
              <span :style="{color:item.color}">{{item.OrderState}}</span>
            </p>
            <p>
              <span>报警类别</span>
              <span>{{item.WarningType}}</span>
            </p>
            <p>
              <span>开始时间</span>
              <span>{{item.CreateTime}}</span>
            </p>
            <p>
              <span>结束时间</span>
              <span>{{item.CompleteTime}}</span>
            </p>
            <p>
              <span>创建人员</span>
              <span>{{item.Creater}}</span>
            </p>
            <p>
              <span>任务名称</span>
              <span>{{item.EventName}}</span>
            </p>
            <p>
              <span>处理人员</span>
              <span>{{item.Handler}}</span>
            </p>
            <p>
              <span>总耗时</span>
              <span>{{item.ContinueTime}}</span>
            </p>
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { Collapse, CollapseItem, Icon, DropdownMenu, DropdownItem} from "vant";

Vue.use(Icon);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
import workJson from "../../components/json/work"
import search from "./search.vue"
import urlClass from "../../components/js/UrlClass"
export default {
  name: "Waring",
  components: {
    search
  },
  data() {
    return {
      activeNames: ['0'],
      WorkList:[
        {
          Id: "GD267627",
          OrderState: "0",
          OrderNum: "0",
          WarningType: "夜间最小流量",
          CreateTime: "2021-02-21 12:56:33",
          CompleteTime: "2021-02-21 12:56:33",
          Creater: "许世杰",
          EventName: "东5（东圃）分区水量报警",
          Handler: "许世杰",
          ContinueTime: "3.5h",
          EventId: "GD267627",
          OrderLogList: [
            {
              OrderState: "string",
              Description: "string",
              ProcessingTime: "string"
            }
          ]
        },
        {
          Id: "GD267627",
          OrderState: "1",
          OrderNum: "1",
          WarningType: "夜间最小流量",
          CreateTime: "2021-02-21 12:56:33",
          CompleteTime: "2021-02-21 12:56:33",
          Creater: "许世杰",
          EventName: "东5（东圃）分区水量报警",
          Handler: "许世杰",
          ContinueTime: "3.5h",
          EventId: "GD267627",
          OrderLogList: [
            {
              OrderState: "string",
              Description: "string",
              ProcessingTime: "string"
            }
          ]
        },
        {
          Id: "GD267627",
          OrderState: "2",
          OrderNum: "2",
          WarningType: "夜间最小流量",
          CreateTime: "2021-02-21 12:56:33",
          CompleteTime: "2021-02-21 12:56:33",
          Creater: "许世杰",
          EventName: "东5（东圃）分区水量报警",
          Handler: "许世杰",
          ContinueTime: "3.5h",
          EventId: "GD267627",
          OrderLogList: [
            {
              OrderState: "string",
              Description: "string",
              ProcessingTime: "string"
            }
          ]
        },
        {
          Id: "GD267627",
          OrderState: "3",
          OrderNum: "3",
          WarningType: "夜间最小流量",
          CreateTime: "2021-02-21 12:56:33",
          CompleteTime: "2021-02-21 12:56:33",
          Creater: "许世杰",
          EventName: "东5（东圃）分区水量报警",
          Handler: "许世杰",
          ContinueTime: "3.5h",
          EventId: "GD267627",
          OrderLogList: [
            {
              OrderState: "string",
              Description: "string",
              ProcessingTime: "string"
            }
          ]
        }
      ],
      show:true,
      params: {
        BeginTime: this.$moment().subtract("days", 29).format("YYYY-MM-DD"),
        EndTime: this.$moment().endOf("day").format("YYYY-MM-DD"),
        OrderState: 0,
        PageNo: 1,
        PageSize: 10,
      },
    };
  },
  methods: {
    GetOrderList() {
      console.log(this.params)

    },
  },
  mounted() {
    
  },
  created () {
      this.$axios
        .post(urlClass.DetectWise + "GetOrderList", this.params)
        .then((Response) => {
          console.log(Response.data.Result.OrderList)
          if (Response.data.Result.OrderList.length > 0) {
              this.show = false
              Response.data.Result.OrderList.forEach((item)=>{
                for ( let i in item) {
                  if (item[i] == "") {
                      item[i] = "--"
                  }
                }
              workJson.workjson.forEach((value,index)=>{
                if (value.type === item.OrderState) {
                  console.log(1)
                    item.color = value.color
                }
              })
            })
            console.log(Response.data.Result.OrderList)
            this.WorkList = Response.data.Result.OrderList
          }else{
            this.show = true
          }

        });
    // if (this.WorkList.length != 0) {
    //   this.show = false
    //   this.WorkList.forEach((item)=>{
    //     workJson.workjson.forEach((value,index)=>{
    //       if (Number(value.typeNum) === Number(item.OrderState)) {
    //           item.color = value.color
    //           item.type = value.type
    //       }
    //     })
    //   })
    // }else{
    //   this.show = true
    // }

  }
};
</script>
<style scoped lang="less">
@import "./workOrder.less";
.waring {
  height: 100%;
  background: #f0f0f0;
  display: flex;
  flex-direction: column;
  &::after {
    display: block;
    content: "";
    height: 50px; /*no*/
  }
}
.dataNull{
    flex: 1;
    color: #9A9A9A;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    p{
      font-size: 50px;
    }
    span{
      padding: 16px 0;
    }
}
.box {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-y: scroll;
  & /deep/ .van-cell{
    font-size: 12px;/*no*/
  }
  & /deep/ .van-cell__title{
    flex: 2;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    color: #000;
    font-weight: bold;
  }
  & /deep/ .van-cell__right-icon::before{
    transform: rotate(0deg);
  }
  & /deep/ .van-collapse-item__title--expanded .van-cell__right-icon::before{
    transform: rotate(-90deg);
  }
}
</style>
