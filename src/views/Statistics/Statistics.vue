<template>
  <div class="category">
    <p id="statusBar"></p>
    <div class="box">
              <!-- 下拉菜单 -->
        <div class="DropdownMenu">
          <van-dropdown-menu>
            <!-- 类型 -->
            <van-dropdown-item
              title="报警类型"
              ref="itemType"
              @opened="openType"
              @closed="closeType"
            >
              <ul class="warnType">
                <li v-for="(item,index) in WarningTypeList" :key="index" :class="{activeWarn:item.className == true}" @click="warnItemClick(item)">{{item.label}}</li>
              </ul>
              <div class="warnBtn">
                <van-button plain type="primary" @click="warnCancel">取消</van-button>
                <van-button plain type="info" @click="warnDetermine">确定</van-button>
              </div>
            </van-dropdown-item>
            <!-- 级别 -->
            <van-dropdown-item
              title="数据类型"
              ref="itemsGrade"
              @opened="openType"
              @closed="closeType"
            >
              <ul class="GradeType">
                <li v-for="(item,index) in DataType" :key="index" :class="{activeGrade:item.className == true}" @click="GradeItemClick(item)">{{item.DataType}}</li>
              </ul>
              <div class="GradeBtn">
                <van-button plain type="primary" @click="GradeCancel">取消</van-button>
                <van-button plain type="info" @click="GradeDetermine">确定</van-button>
              </div>
            </van-dropdown-item>
            <!-- 地区 -->
            <van-dropdown-item
              title="地区"
              ref="itemsCity"
              @opened="openType"
              @closed="closeType"
            >
              <van-tree-select
                :items="items"
                :active-id.sync="activeIds"
                :main-active-index.sync="activeIndex"
                @click-nav="onNavClick"
              >
                <template slot="content" >
                  <ul class="right-content">
                    <li v-for="(item,index) in policeList" :key="index" :class="{active:item.classNames == true}" @click="onItemClick(item)"> {{item.Label}}<van-icon name="success" /> </li>
                  </ul>
                </template>
              </van-tree-select>
              <div class="CityBtn">
                <van-button plain type="primary" @click="CityCancel">取消</van-button>
                <van-button plain type="info" @click="CityDetermine">确定</van-button>
              </div>
            </van-dropdown-item>
            <!-- 时间选择 -->
            <van-dropdown-item :title="date" ref="item" @open="openDropdown">
              <van-calendar
                v-model="show"
                type="range"
                @confirm="onConfirm"
                get-container="#app"
                :min-date="minDate"
              />
            </van-dropdown-item>
          </van-dropdown-menu>
          <div class="icon">
            <van-icon name="sort" color="#000" />
          </div>
        </div>
        <div class="paddings"></div>
        <policeEcharts></policeEcharts>
        <div class="paddings"></div>
        <ificatioEcharts></ificatioEcharts>
        <div class="paddings"></div>
        <div class="paddings"></div>
        <typeEcharts></typeEcharts>
        <div class="paddings"></div>
        <partitionEcharts></partitionEcharts>
        <div class="paddings"></div>
        <qualityEcharts></qualityEcharts>
        <div class="paddings"></div>
        <handleEcharts></handleEcharts>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { DropdownMenu, DropdownItem, Icon } from "vant";

Vue.use(Icon);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
import urlClass from "../../components/js/UrlClass"
import Bus from "../../utils/bus"
import policeEcharts from "./chat/policeEcharts.vue"
import ificatioEcharts from "./chat/ificatioEcharts.vue"
import typeEcharts from "./chat/typeEcharts.vue"
import partitionEcharts from "./chat/partitionEcharts.vue"
import qualityEcharts from "./chat/qualityEcharts.vue"
import handleEcharts from "./chat/handleEcharts.vue"
export default {
  name: "Category",
  components: {
    policeEcharts,
    ificatioEcharts,
    typeEcharts,
    partitionEcharts,
    qualityEcharts,
    handleEcharts
  },
  data() {
    return {
      show: false,
      minDate:new Date(2010, 0, 1),
      activeIndex: 0,
      items:[],
      activeIds: [],
      date: "报警时间",
      WarningTypeList:[],
      policeList:[],
      DataType:[],
      CountByDay: [],
      params: {
        WarningTypes: [],
        Regions: [],
        DataTypes: [],
        BeginTime: this.$moment().subtract("days", 29).format("YYYY-MM-DD 00:00:00"),
        EndTime: this.$moment().endOf("day").format("YYYY-MM-DD 23:59:00"),
      },

    };
  },
  methods: {
    openType(){
      console.log(1111)
      this.touch = false
    },
    closeType(){
      this.touch = true
    },
    warnCancel(){//报警类型确定
      this.$refs.itemType.toggle();
    },
    warnDetermine(){
      this.$refs.itemType.toggle();
      this.params.WarningTypes = []
      this.WarningTypeList.forEach((item)=>{
       if (item.className) {
         this.params.WarningTypes.push(item.label)
       }
      })
      this.GetWarningStatisticsByDataType();
      this.GetWarningStatisticsByDate();
      this.GetWarningStatisticsByWarningType();
      this.GetWarningStatisticsByPartition();
      this.GetEquipmentStatistics();
      this.GetOrderStatistics();
    },
    GradeCancel(){//等级
      this.$refs.itemsGrade.toggle();
    },
    GradeDetermine(){
      this.$refs.itemsGrade.toggle();
      this.params.DataTypes = [];
      this.DataType.forEach((item)=>{
       if (item.className) {
         this.params.DataTypes.push(item.DataType)
       }
      })
      this.GetWarningStatisticsByDataType();
      this.GetWarningStatisticsByDate();
      this.GetWarningStatisticsByWarningType();
      this.GetWarningStatisticsByPartition();
      this.GetEquipmentStatistics();
      this.GetOrderStatistics();
    },
    CityDetermine(){
      var cityList = [];
      this.params.Regions = []
      this.items.forEach((value,index) => {
      value.Children.filter(item=>{
        if(item.classNames == true){
          cityList.push(item.Label)
        }
      })
      })
      this.$refs.itemsCity.toggle();
      this.params.Regions = cityList;
      this.GetWarningStatisticsByDataType();
      this.GetWarningStatisticsByDate();
      this.GetWarningStatisticsByWarningType();
      this.GetWarningStatisticsByPartition();
      this.GetEquipmentStatistics();
      this.GetOrderStatistics();
    },
    CityCancel(){
      this.$refs.itemsCity.toggle();
    },
    onItemClick(item){
      item.classNames = !item.classNames
    },
    warnItemClick(item){
      item.className = !item.className
    },
    GradeItemClick(item){
      item.className = !item.className
    },
    onNavClick(index){
      this.policeList = this.items[index].Children
    },
    itemTF(data){
      data.class = !data.class
    },
    cellClick(left, right, cell, outside) {
      // console.log(left, right, cell, outside);
    },
    openDropdown() {
      this.show = true;
    },
    dropdownT(value) {
      console.log(value);
    },
    dropdownC(value) {
      console.log(value);
    },
    dropdownB(value) {
      console.log(value);
    },
    touchStart(e) {
      this.startY = e.touches[0].clientY;
    },
    formatDate(date) {
      return `${date.getMonth() + 1}/${date.getDate()}`;
    },
    onConfirm(date) {
      const [start, end] = date;
      this.show = false;
      this.date = `${this.formatDate(start)} - ${this.formatDate(end)}`;
      console.log(start,end)//2021-06-17 23:59:00  2021-6-1 0:0:0
      var dateS = this.parseTime(start)
      var dateE = this.parseTime(end)
      console.log(dateS,dateE)
      this.params.BeginTime = dateS;
      this.params.EndTime = dateE;
      this.GetWarningStatisticsByDataType();
      this.GetWarningStatisticsByDate();
      this.GetWarningStatisticsByWarningType();
      this.GetWarningStatisticsByPartition();
      this.GetEquipmentStatistics();
      this.GetOrderStatistics();
    },
    GetWarningTypeListToSelect(){//获取报警类型条件
      this.$axios
        .post(urlClass.SystemSetting + "GetWarningTypeListToSelect")
        .then((res) => {
          this.WarningTypeList = res.data.Result.options.map((item,index)=>{
            return Object.assign(item,{className:false})
          })
        }).catch(err => {
          console.log(err)
        });
    },
    GetDropDownMenuItem(type){//获取分区列表筛选用
      let res = {
        MenuType: type,
        TenantId: "string",
        UserId: "string",
      };
      this.$axios
      .post(urlClass.DetectWise + "GetDropDownMenuItem",JSON.stringify(res))
      .then((res)=>{
        res.data.Result.map((item,index)=>{
            Object.assign(item,{text:item.Label})
          item.Children.map((items,index)=>{
            return Object.assign(items,{classNames:false})
          })
        })
        this.items = res.data.Result
        this.policeList = this.items[0].Children
      })
    },   
    GetWarningStatisticsByDate(){//获取报警数统计(日期)
      this.$axios
        .post(urlClass.DetectWise + "GetWarningStatisticsByDate", this.params)
        .then((Response) => {
          let StatisticData = Response.data.Result;
          Bus.$emit("StatisticData", StatisticData);
        });
    },
        //获取报警数统计(报警类型)
    GetWarningStatisticsByWarningType() {
      this.$axios
        .post(
          urlClass.DetectWise + "GetWarningStatisticsByWarningType",
          this.params
        )
        .then((Response) => {
          let WarningTypeData = Response.data.Result;
          Bus.$emit("WarningTypeData", WarningTypeData);
        });
    },  
    GetWarningStatisticsByDataType() {//获取报警数统计(数据类型)
      this.$axios
        .post(
          urlClass.DetectWise + "GetWarningStatisticsByDataType",
          this.params
        )
        .then((Response) => {
          this.DataType = Response.data.Result.map((item,index)=>{
            return Object.assign(item,{className:false})
          })
          let DataTyp = Response.data.Result;
          Bus.$emit("DataType", DataTyp);
        });
    },
    GetWarningStatisticsByPartition() {//获取报警数统计(分区)
      this.$axios
        .post(
          urlClass.DetectWise + "GetWarningStatisticsByPartition",
          this.params
        )
        .then((Response) => {
          let PartitionData = Response.data.Result;
          Bus.$emit("PartitionData", PartitionData);
        });
    },   
    GetEquipmentStatistics() {//获取设备统计
      this.$axios
        .post(urlClass.DetectWise + "GetEquipmentStatistics", this.params)
        .then((Response) => {
          let EquipmentData = Response.data.Result;
          Bus.$emit("EquipmentData", EquipmentData);
        });
    },   
    GetOrderStatistics() {//获取工单统计
      this.$axios
        .post(urlClass.DetectWise + "GetOrderStatistics", this.params)
        .then((Response) => {
          let OrderData = Response.data.Result;
          Bus.$emit("OrderData", OrderData);
        });
    },
    parseTime(d) {
      const newDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' '
                      + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
      return newDate;
    },
  },
  mounted() {
   this.GetWarningTypeListToSelect()
   this.GetDropDownMenuItem("Region");
   this.GetWarningStatisticsByDataType();
   this.GetWarningStatisticsByDate();
   this.GetWarningStatisticsByWarningType();
   this.GetWarningStatisticsByPartition();
   this.GetEquipmentStatistics();
   this.GetOrderStatistics();
  },
  beforeDestroy() {},
};
</script>
<style scoped lang="less">
@import "./Statistics.less";
.category{
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  &::after{
    display: block;
    content: "";
    height: 50px;/*no*/
  }
}
.box{
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-y: scroll;
}
.paddings{
  width: 100%;
  height: 10px;
  background: #F0F0F0;
}
</style>
