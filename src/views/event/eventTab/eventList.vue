<template>
  <div class="eventList">
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
            <li
              v-for="(item, index) in WarningTypeList"
              :key="index"
              :class="{ activeWarn: item.className == true }"
              @click="warnItemClick(item)"
            >
              {{ item.label }}
            </li>
          </ul>
          <div class="warnBtn">
            <van-button plain type="primary" @click="warnCancel"
              >取消</van-button
            >
            <van-button plain type="info" @click="warnDetermine"
              >确定</van-button
            >
          </div>
        </van-dropdown-item>
        <!-- 数据类型 -->
        <van-dropdown-item
            title="数据类型"
            ref="itemsData"
            @opened="openType"
            @closed="closeType"
        >
            <ul class="DataType">
            <li v-for="(item,index) in DataType" :key="index" :class="{activeGrade:item.className == true}" @click="TypeItemClick(item)">{{item.label}}</li>
            </ul>
            <div class="GradeBtn">
            <van-button plain type="primary" @click="Cancel">取消</van-button>
            <van-button plain type="info" @click="Determine">确定</van-button>
            </div>
        </van-dropdown-item>
        <!-- 等级 -->
        <van-dropdown-item
          title="级别"
          ref="itemsGrade"
          @opened="openType"
          @closed="closeType"
        >
          <ul class="GradeType">
            <li
              v-for="(item, index) in GradeTypeList"
              :key="index"
              :class="{ activeGrade: item.className == true }"
              @click="GradeItemClick(item)"
            >
              {{ item.label }}
            </li>
          </ul>
          <div class="GradeBtn">
            <van-button plain type="primary" @click="GradeCancel"
              >取消</van-button
            >
            <van-button plain type="info" @click="GradeDetermine"
              >确定</van-button
            >
          </div>
        </van-dropdown-item>
        <!-- 事件状态 -->
        <van-dropdown-item
          title="事件状态"
          ref="itemsEvent"
          @opened="openType"
          @closed="closeType"
        >
          <ul class="EventType">
            <li
              v-for="(item, index) in eventOptions"
              :key="index"
              :class="{ activeGrade: item.className == true }"
              @click="EventItemClick(item)"
            >
              {{ item.label }}
            </li>
          </ul>
          <div class="GradeBtn">
            <van-button plain type="primary" @click="EventCancel"
              >取消</van-button
            >
            <van-button plain type="info" @click="EventDetermine"
              >确定</van-button
            >
          </div>
        </van-dropdown-item>
        <!-- 处置状态 -->
        <van-dropdown-item
          title="处置状态"
          ref="handleEvent"
          @opened="openType"
          @closed="closeType"
        >
          <ul class="handleType">
            <li
              v-for="(item, index) in handleOptions"
              :key="index"
              :class="{ activeGrade: item.className == true }"
              @click="handleItemClick(item)"
            >
              {{ item.label }}
            </li>
          </ul>
          <div class="GradeBtn">
            <van-button plain type="primary" @click="handleCancel"
              >取消</van-button
            >
            <van-button plain type="info" @click="handleDetermine"
              >确定</van-button
            >
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
            <template slot="content">
              <ul class="right-content">
                <li
                  v-for="(item, index) in policeList"
                  :key="index"
                  :class="{ active: item.classNames == true }"
                  @click="onItemClick(item)"
                >
                  {{ item.Label }}<van-icon name="success" />
                </li>
              </ul>
            </template>
          </van-tree-select>
          <div class="CityBtn">
            <van-button plain type="primary" @click="CityCancel"
              >取消</van-button
            >
            <van-button plain type="info" @click="CityDetermine"
              >确定</van-button
            >
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
            <!-- 报警列表 -->
        <div class="warningList">
          <div
            class="warningItem"
            v-for="(item, index) in eventList"
            :key="index"
            :class="[
              activeName == item.EventId ? 'tablealignactive' : 'tablealign',
            ]"
            @click="listItemClick(item)"
          >
            <van-swipe-cell @click="cellClick">
              <div
                class="cellItem"
                :style="{ borderColor: item.iconcolor }"
                :class="item.class == true ? 'openItem' : 'closeItem'"
              >
                <div class="itemTop">
                  <p :style="{ background: item.warningTypebgcolor }">
                    <span
                      :class="'iconfont icon' + item.eventIcon"
                      :style="{ color: item.iconcolor }"
                    ></span>
                  </p>
                  <p>
                    <span
                      ><em>{{ item.EventType | typeMillion }}</em
                      >{{ item.EventName }}</span
                    >
                    <span>持续{{ item.ContinueTime | timeFilter }}</span>
                  </p>
                  <p
                    class="iconfont iconxia"
                    @click.stop="itemTF(item)"
                    :class="item.class == true ? 'open' : 'close'"
                  ></p>
                </div>
                <div class="itemBottom">
                  <p>
                    <span>{{ item.Value | million }}</span>
                    <span>m³/h</span>
                  </p>
                  <p>
                    <span
                      v-for="(items, index) in 3"
                      :key="index"
                      :style="{ background: item.iconcolor }"
                    ></span>
                  </p>
                  <p>
                    <span>{{ item.BeginTime }}</span>
                    <span>{{ item.EndTime }}</span>
                  </p>
                </div>
              </div>
              <template #right>
                <van-button
                  square
                  text="删除"
                  type="danger"
                  class="delete-button"
                />
              </template>
            </van-swipe-cell>
          </div>
        </div>
  </div>
</template>

<script>
import Vue from "vue";
import {
  Cell,
  CellGroup,
  DropdownMenu,
  DropdownItem,
  Calendar,
  SwipeCell,
  Button,
  TreeSelect,
  Icon,
  NoticeBar,
  Swipe,
  SwipeItem,
  Popup,
  Loading,
  Switch
} from "vant";

Vue.use(Switch);
Vue.use(Loading);
Vue.use(Popup);
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(NoticeBar);
Vue.use(Icon);
Vue.use(TreeSelect);
Vue.use(Button);
Vue.use(SwipeCell);
Vue.use(Calendar);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Cell);
Vue.use(CellGroup);
import urlClass from "../../../components/js/UrlClass"
import configjsdata from "../../../components/json/configjson";
export default {
  data() {
    return {
        activeName: "",
        WarningTypeList:[],
        GradeTypeList: [
            { label: "一级", className: false },
            { label: "二级", className: false },
            { label: "三级", className: false },
        ],
        items: [],
        activeIds: [],
        policeList: [],
        DataType:[],
        eventOptions: [
            {
            value: "选项1",
            label: "全部",
            className: false
            },
            {
            value: "选项2",
            label: "持续中",
            className: false
            },
            {
            value: "选项3",
            label: "已结束",
            className: false
            },
        ],
        handleOptions: [
            {
            value: "选项1",
            label: "全部",
            className: false
            },
            {
            value: "选项2",
            label: "事件发生",
            className: false
            },
            {
            value: "选项3",
            label: "处理中",
            className: false
            },
            {
            value: "选项4",
            label: "已完成",
            className: false
            },
        ],
        date: "报警时间",
        show: false,
        activeIndex: 0,
        minDate: new Date(2010, 0, 1),
        event:[],
        rangeDate: [],
        CountByDay: [],
        RegionCode:[],
        EventTypeCode:[],
        DataTypeCode:[],
        eventValue:"全部",
        LevelCode:[],
        handleCode:[],
        eventList:[]
    };
  },
  methods: {
    openType() {
      console.log(1111);
      this.touch = false;
    },
    closeType() {
      this.touch = true;
    },
    warnItemClick(item) {
      // this.$set(this.lister, 0, "newValue")
      item.className = !item.className;
    },
    warnCancel() {
      //报警类型确定
      this.$refs.itemType.toggle();
    },
    warnDetermine() {
      var cityList = [];
      console.log(this.WarningTypeList)
      this.WarningTypeList.forEach((value, index) => {
          console.log(value)
        if (value.className == true) {
         cityList.push(value.label)
       }
      });
      console.log(cityList);
      this.$refs.itemType.toggle();
    },
    GradeItemClick(item) {
      item.className = !item.className;
    },
    GradeCancel() {
      //等级
      this.$refs.itemsGrade.toggle();
    },
    GradeDetermine() {
      var cityList = [];
      console.log(this.GradeTypeList)
      this.GradeTypeList.forEach((value, index) => {
          console.log(value)
        if (value.className == true) {
         cityList.push(value.label)
       }
      });
      console.log(cityList);
      this.$refs.itemsGrade.toggle();

    },
    EventItemClick(item){
        item.className = !item.className
    },
    EventCancel() {
      this.$refs.itemsEvent.toggle();
    },
    EventDetermine() {
      var cityList = [];
      this.eventOptions.forEach((value, index) => {
          if (value.className == true) {
            cityList.push(value.label);
          }
      });
      console.log(cityList);
      this.$refs.itemsEvent.toggle();
    },
    handleItemClick(item){
        item.className = !item.className
    },
    handleCancel() {
      this.$refs.handleEvent.toggle();
    },
    handleDetermine() {
      var cityList = [];
      this.handleOptions.forEach((value, index) => {
          if (value.className == true) {
            cityList.push(value.label);
          }
      });
      console.log(cityList);
      this.$refs.handleEvent.toggle();
    },
    CityCancel() {
      this.$refs.itemsCity.toggle();
    },
    CityDetermine() {
      var cityList = [];
      this.items.forEach((value, index) => {
        value.Children.filter((item) => {
          if (item.classNames == true) {
            cityList.push(item.Label);
          }
        });
      });
      console.log(cityList);
      this.$refs.itemsCity.toggle();
    },
    TypeItemClick(item){
        item.className = !item.className
    },
    Cancel(){//数据类型
      this.$refs.itemsData.toggle();
    },
    Determine(){
      var Determine = []
      this.DataType.forEach((item)=>{
       if (item.className) {
         Determine.push(item.label)
       }
      })
      this.$refs.itemsData.toggle();
    },
    onNavClick(index) {
      console.log(index);
      this.policeList = this.items[index].Children;
      console.log(this.policeList);
    },
    itemTF(data) {
      data.class = !data.class;
      console.log(data);
    },
    cellClick(left, right, cell, outside) {
      // console.log(left, right, cell, outside);
    },
    onItemClick(item) {
      item.classNames = !item.classNames;
      console.log(item);
    },
    openDropdown() {
      console.log(1);
      this.show = true;
    },
    onConfirm(date) {
      const [start, end] = date;
      this.show = false;
      this.date = `${this.formatDate(start)} - ${this.formatDate(end)}`;
    },
    formatDate(date) {
      return `${date.getMonth() + 1}/${date.getDate()}`;
    },
    listItemClick(item) {
      console.log(item)
    },
    GetWarningDataTypeListToSelect() {//获取报警数统计(数据类型)
      this.$axios
        .post(urlClass.SystemSetting + "GetWarningDataTypeListToSelect")
        .then((Response) => {
          console.log(Response)
          this.DataType = Response.data.Result.options.map((item,index)=>{
            return Object.assign(item,{className:false})
          })
          console.log(this.DataType)
        });
    },
     GetWarningTypeListToSelect() {
      //获取报警类型条件
      this.$axios
        .post(urlClass.SystemSetting + "GetWarningTypeListToSelect")
        .then((res) => {
          this.WarningTypeList = res.data.Result.options.map((item, index) => {
            return Object.assign(item, { className: false });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    GetDropDownMenuItem(type) {
      //获取分区列表筛选用
      let res = {
        MenuType: type,
        TenantId: "string",
        UserId: "string",
      };
      this.$axios
        .post(urlClass.DetectWise + "GetDropDownMenuItem", JSON.stringify(res))
        .then((res) => {
          console.log(res.data.Result);
          res.data.Result.map((item, index) => {
            Object.assign(item, { text: item.Label });
            item.Children.map((items, index) => {
              return Object.assign(items, { classNames: false });
            });
          });
          this.items = res.data.Result;
          this.policeList = this.items[0].Children;
        });
    },
    GetMonthEventCountByDay() {
      let params = {
        YearMonth: this.$moment().format("YYYY-MM"),
      };
      this.$axios
        .post(urlClass.DetectWise + "GetMonthEventCountByDay", params)
        .then((Response) => {
          Response.data.Result.forEach((res) => {
            this.CountByDay.push(res.Date);
          });
          this.rangeDate = [
            this.$moment(this.CountByDay[this.CountByDay.length - 1]).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
            this.$moment(this.CountByDay[this.CountByDay.length - 1]).format(
              "YYYY-MM-DD 23:59:00"
            ),
          ];
          console.log( this.rangeDate )
          this.GetEventListinformation();
        });
    },    
    GetEventListinformation() {//获取事件列表信息
      this.PageIndexStatus = true;
      this.PageIndex = 1;
      this.event = [];
      this.loading = true;
      let res = {
        StartTime: this.rangeDate[0],
        EndTime: this.rangeDate[1],
        Region: this.RegionCode,
        warningType: this.EventTypeCode,
        DataType: this.DataTypeCode,
        EventState: this.eventValue,
        Level: this.LevelCode,
        ProcessingStatus: this.handleCode,
        Page: 1,
      };
      this.$axios
        .post(urlClass.DetectWise + "GetEventList", JSON.stringify(res))
        .then((e) => {
          let resData = [...e.data.Result];
          console.log(resData)
          resData.forEach((item) => {
            item.class = false;
            configjsdata.WarningTypeData.forEach((value, index) => {
              if (value.Type === item.EventType) {
                item.eventTypeImg = value.HomeImgUrl;
                item.eventIcon = value.Icon;
                item.eventTypeImgText = value.ImgText;
              }
            });
            configjsdata.LevelData.forEach((value, index) => {
              if (Number(value.Level) === Number(item.Level)) {
                item.warningTypebgcolor = value.bgcolor;
                item.iconcolor = value.iconcolor;
              }
            });
          });
          if (resData.length > 1) {
            resData[0].class = true;
            resData[1].class = true;
          }
          if (resData.length == 1) {
            resData[0].class = true;
          }
          this.eventList = resData;
          console.log(this.eventList);
        });
    },
  },
  mounted () {
    this.GetDropDownMenuItem("Region");
    this.GetWarningTypeListToSelect();
    this.GetWarningDataTypeListToSelect();
    this.GetMonthEventCountByDay();
  }
};
</script>

<style lang="less" scoped>
@import "../event.less";
.eventList {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #F0F0F0;
}
</style>