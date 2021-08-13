<template>
  <div class="monitor">
    <div class="screen">
      <div class="icon"  :class="[show == true ? 'mei' : 'you']" @click="dropDownHide">
        <van-icon name="search" />
      </div>
      <div class="dropDownS" v-if="show">
        <van-dropdown-menu>
          <!-- 类型 -->
          <van-dropdown-item :title="title2" v-model="value3" :options="StatusWarn" @change = "getWarnValue" />
          <van-dropdown-item :title="title1" v-model="value2" :options="StatusList" @change = "getFlowValue" />
          <van-dropdown-item :title="title" v-model="value1" :options="dataType" @change = "getValue" />
        </van-dropdown-menu>
      </div>
      <div class="inputS" v-else>
        <form action="/">
          <van-search
            v-model="value"
            shape="round"
            show-action
            placeholder="请输入搜索关键词"
            @search="onSearch"
          >
            <template #action>
              <van-icon name="cross" size="18" @click="onCancel" />
            </template>
          </van-search>
        </form>
      </div>
    </div>
    <div class="content">
      <div class="title">
        <p>分区名称</p>
        <p>水量(m³)</p>
        <p>通讯状态</p>
      </div>
      <div class="dataNull" v-if="MonitoringPointData.length == 0">
        <p class="iconfont iconzanwushuju"></p>
        <span>暂无数据</span>
      </div>
      <ul v-else>
        <li v-for="(item,index) in MonitoringPointData" :key="index" @click="MonitoringPoint(item)">
          <p v-if="PartitionFlowShow">{{item.MonitoringPointName}}</p>
          <p v-else>{{item.PartitionName}}</p>
          <p>{{item.Val | million}}</p>
          <p>
            <span :class="[{perfect : item.EquipmentState == 3},{commonly : item.EquipmentState == 2},{difference : item.EquipmentState == 1}]" v-for="(ite,i) in item.EquipmentState" :key="i"></span>
          </p>
        </li>
      </ul>
    </div>
    <van-popup v-model="popupShow" get-container="#app">
      <van-loading type="spinner" color="#1989fa" size="24" />
    </van-popup>
  </div>
</template>

<script>
import Vue from "vue";
import { DropdownMenu, DropdownItem, Icon, Search, Popup} from "vant";

Vue.use(Popup);
Vue.use(Search);
Vue.use(Icon);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
import urlClass from "../../../components/js/UrlClass";
export default {
  data() {
    return {
      show: true,
      value:"",
      dataType: [],
      StatusList: [],
      value1:0,
      title:"数据类型",
      value2:0,
      title1:"分区",
      value3:0,
      title2:"报警状态",
      radioTypeId:"1",
      PartitionId:"",
      MonitoringPointData:[],
      PartitionFlow:[],
      PartitionFlowShow:true,
      popupShow:false,
      StatusWarn:[
        {text:"全部数据",value:0},
        {text:"报警",value:1},
        {text:"未报警",value:2},
      ],
      PartitionName:"",
      MonitoringPointName:""
    };
  },
  mounted() {
    this.GetWarningDataTypeListToSelect();
    this.GetPartitionStatusList();
    this.GetMonitoringPointStatusList();
  },
  methods: {
    dropDownHide(){
      this.show = false
    },
    onSearch(val) {
     this.MonitoringPointName = val;
     this.GetMonitoringPointStatusList()
    },
    onCancel() {
      console.log('取消');
      this.show = true
      this.MonitoringPointName = "";
     this.GetMonitoringPointStatusList()
    },
    getValue(value){
        this.radioTypeId = (value + 1).toString();
        console.log(this.radioTypeId)
        this.title = this.dataType[value].text
        if(value != "9"){
          this.PartitionFlowShow = true
          this.GetMonitoringPointStatusList()
        }else{
          this.PartitionFlowShow = false;
          this.PartitionFlow.forEach((item)=>{
            item.EquipmentState = Number(item.EquipmentState)
          })
          this.MonitoringPointData = this.PartitionFlow
        }
    },
    getFlowValue(value){
        this.popupShow = true;
        this.PartitionId = (value + 1).toString();
        this.title1 = this.StatusList[value].text;
        this.GetMonitoringPointStatusList();
    },
    getWarnValue(value){
      console.log(this.StatusWarn[value].text)
      this.title2 = this.StatusWarn[value].text
    },
    GradeCancel() {
      this.$refs.itemsGrade.toggle();
    },
    MonitoringPoint(item){
      console.log(item)
        this.$router.push({
        path:"/eventItem",
        query:{item:item}
      })
      
    },
    GetWarningDataTypeListToSelect() {
      this.$axios
        .post(urlClass.SystemSetting + "GetWarningDataTypeListToSelect")
        .then((Response) => {
          Response.data.Result.options.splice(10, 1);
          console.log(Response.data.Result.options)
          Response.data.Result.options.forEach((item,index)=>{
            this.dataType.push(
              {
                value: index,
                text: item.label,
              }
            )
          })
        });
    },
    GetPartitionStatusList() {
      let params = {
        // Date: this.$moment()
        //   .subtract(45, "minutes")
        //   .format("YYYY-MM-DD HH:mm:ss"),
        Date:"2021-06-14 10:30:00",
        PartitionId: "",
        Status: "",
        // PartitionName: this.PartitionName
      };
      this.$axios
        .post(urlClass.DetectWise + "GetPartitionStatusList", params)
        .then((Response) => {
          // console.log(Response);
          this.PartitionFlow = Response.data.Result
          Response.data.Result.forEach((item, index) => {
            this.StatusList.push(
              {
                value: index,
                text: item.PartitionName,
              }
            )
          });
          // console.log(this.StatusList)
        });
    },
    GetMonitoringPointStatusList() {
      let date = this.$moment().subtract(2, "hour").format("YYYY-MM-DD HH:mm:ss")
      var minute = Number(date.substring(14,16));
      console.log(minute > 45)
      var LastMinute = "";
      if (minute > 45) {
        LastMinute = minute - 45
      }else if (minute > 30) {
         LastMinute = minute - 30
      }else if (minute > 15) {
        LastMinute = minute - 15
      }
      console.log(LastMinute)
      console.log(this.$moment(date).subtract(LastMinute, "minutes").format("YYYY-MM-DD HH:mm:ss"))
      let params = {
        DataTypeId: this.radioTypeId,
        Date: this.$moment(date).subtract(LastMinute, "minutes").format("YYYY-MM-DD HH:mm:ss"),
        PartitionId: this.PartitionId,
        Status: "",
        MonitoringPointName:this.MonitoringPointName
      };
      this.$axios
        .post(urlClass.DetectWise + "GetMonitoringPointStatusList", params)
        .then((Response) => {
          Response.data.Result.forEach((item)=>{
            item.EquipmentState = Number(item.EquipmentState)
          })
          this.popupShow = false;
          this.MonitoringPointData = Response.data.Result;
        });
    },
  },
};
</script>

<style lang="less" scoped>
.monitor {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.screen{
  display: flex;
}
.icon {
  width: 42px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px; /*no*/
  box-sizing: border-box;
  border-right: 1px solid #d8d8d8;
}
.dropDownS {
  flex: 1;
  height: 42px;
  display: flex;
  & /deep/ .van-dropdown-menu {
    width: calc(100% - 0px);
  }
  & /deep/ .van-dropdown-menu__bar{
    height: 42px;
    box-shadow: none;
  }
  & /deep/ .van-dropdown-menu__title{
    font-size: 12px;/*no*/
  }
  & /deep/ .van-cell__title{
    text-align: center;
  }
  & /deep/ .van-cell__value{
    display: none;
  }
  & /deep/ .van-dropdown-item__option--active{
    color: #2b699d;
  }
  & /deep/ .van-cell{
    font-size: 12px;/*no*/
    &::after{
      right: 0;
      left: 0;
    }
  }
  & /deep/ .van-dropdown-item__content{
    max-height: 220px;/*no*/
  }
  & /deep/ .van-dropdown-menu__title--active{
    color: #2F96EC;
  }
  .GradeType {
    height: 220px;
    overflow-y: scroll;
    background-color: #fff;
    li {
      height: 44px;
      background-color: #fff;
      color: #646464;
      box-shadow: 0px 1px 0px 0px #e9e9e9; /*no*/
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px; /*no*/
      position: relative;
      &::after {
          position: absolute;
          box-sizing: border-box;
          content: ' ';
          pointer-events: none;
          right: 0px;
          bottom: 0;
          left: 0px;
          border-bottom: 1px solid #ebedf0;
          -webkit-transform: scaleY(.5);
          transform: scaleY(.5);
      }
    }
  }
}
.you{
  background: #2F96EC;
}
.inputS{
  flex: 1;
  & /deep/ .van-search .van-cell{
    padding:2px 8px 2px 0px;/*no*/
  }
  & /deep/ .van-search{
    padding:4px 12px;/*no*/
  }
  & /deep/ .van-search__action{
    line-height: 42px;/*no*/
    height: 34px;/*no*/
  }
}
.title{
  height: 40px;
  padding: 0 12px;/*no*/
  box-sizing: border-box;
  display: flex;
  background: #F5F5F5;
  p{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    line-height: 40px;
    width: 178px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    &:nth-child(1){
      display: block;
    }
    &:nth-child(2){
      width: 116px;
    }
    &:nth-child(3){
      flex: 1;
    }
  }
}
.content{
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
ul{
  flex: 1;
  overflow-y: scroll;
  li{
    .title();
    padding: 0;
    &:nth-child(odd){
      background: #fff;
    }
    p{//#D7494E  #E9B035
      border: 1px solid #F1F1F1;/*no*/
      text-indent: 1em;
      border-bottom: none;
      border-right: none;
    &:nth-child(3){
      justify-content: center;
    }
      span{
        height: 6px;
        width: 6px;
        border-radius: 50%;
        margin: 0 2px;
        box-sizing: border-box;
      }
    }
  }
}
.perfect{
  background: #22BA6A;
}
.commonly{
  background: #E9B035;
}
.difference{
  background: #D7494E;
}
</style>