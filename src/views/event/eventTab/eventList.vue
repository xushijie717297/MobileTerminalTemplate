<template>
  <div class="eventList">
    <!-- 下拉菜单 -->
    <div class="DropdownMenu">
      <van-dropdown-menu>
        <!-- 类型 -->
        <!-- <van-dropdown-item
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
        </van-dropdown-item> -->
        <!-- 数据类型 -->
        <!-- <van-dropdown-item
          title="数据类型"
          ref="itemsData"
          @opened="openType"
          @closed="closeType"
        >
          <ul class="DataType">
            <li
              v-for="(item, index) in DataType"
              :key="index"
              :class="{ activeGrade: item.className == true }"
              @click="TypeItemClick(item)"
            >
              {{ item.label }}
            </li>
          </ul>
          <div class="GradeBtn">
            <van-button plain type="primary" @click="Cancel">取消</van-button>
            <van-button plain type="info" @click="Determine">确定</van-button>
          </div>
        </van-dropdown-item> -->
        <!-- 等级 -->
        <!-- <van-dropdown-item
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
        </van-dropdown-item> -->
        <!-- 事件状态 -->
        <van-dropdown-item
          title="事件状态"
          v-model="eValue"
          :options="eventOptions"
          @change="EventItemClick"
        />
        <!-- 处置状态 -->
        <van-dropdown-item
          title="处置状态"
          v-model="HValue"
          :options="handleOptions"
          @change="handleItemClick"
        />
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
            :formatter="formatter"
          />
        </van-dropdown-item>
      </van-dropdown-menu>
      <div class="icon" @click="showSF">
        <van-icon name="filter-o" size="18px" color="#000" />
      </div>
    </div>
    <div class="gap"></div>
    <!-- 报警列表 -->
    <div class="warningList" 
        v-infinite-scroll="GetEventList"
        infinite-scroll-disabled="dataLoadStop"
        infinite-scroll-distance="50" v-if="datalistTF">
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
                <span>持续{{ item.ContinueTime | timeFilter }}/<span :style="{ color: item.iconcolor }">{{item.eventTypeImgText}}</span></span>
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
      <p class="noMore" v-show="dataLoadNomore">没有更多数据了</p>
    </div>
    <div v-else class="dataNull">
      <p class="iconfont iconzanwushuju"></p>
      <span>暂无数据</span>
    </div>
    <van-popup v-model="popupShow" get-container="#app">
      <van-loading type="spinner" color="#1989fa" size="24" />
    </van-popup>
    <van-popup v-model="showScreen" position="right" :style="{ width: '80%',height: '100%',background:'#fff'  }" >
      <div class="Screen">
        <h3>
          <p>报警类型</p>
          <p
            class="iconfont iconxia"
            @click.stop="ScreenTF()"
            :class="ScreenTab == true ? 'open' : 'close'"
          ></p>
        </h3>
        <div class="WarningTypeList" :class="ScreenTab == true ? 'ScreenOpen' : 'ScreenClose'">
          <p v-for="(item,index) in WarningTypeList" :key="index" :class="item.className == true ? 'redType' : 'redType1'" @click="WarningTypeInfo(item)">{{item.label}}</p>
        </div>
        <h3>
          <p>数据类型</p>
          <p
            class="iconfont iconxia"
            @click.stop="ScreenData()"
            :class="ScreenDT == true ? 'open' : 'close'"
          ></p>
        </h3>
        <div class="DataType" :class="ScreenDT == true ? 'ScreenOpenData' : 'ScreenClose'">
          <p v-for="(item,index) in DataType" :key="index" :class="item.className == true ? 'redType' : 'redType1'" @click="WarningTypeInfo(item)">{{item.label}}</p>
        </div>
        <h3>
          <p>等级</p>
        </h3>
        <div class="GradeType">
          <p v-for="(item,index) in GradeTypeList" :key="index"  :class="item.className == true ? 'redType' : 'redType1'" @click="WarningTypeInfo(item)">{{item.label}}</p>
        </div>
        <h4 style="height:100px">
        </h4>
        <div class="btn">
          <div class="btnInfo">
            <p @click="ScreenClicks">取消</p>
            <p @click="ScreenClick">确定</p>
          </div>
        </div>
      </div>
    </van-popup>
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
  Switch,
  Dialog 
} from "vant";
import { List } from "vant";

Vue.use(List);
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
import urlClass from "../../../components/js/UrlClass";
import configjsdata from "../../../components/json/configjson";
import * as timeStamp from "../../../utils/index";
import moment from "moment";
import infiniteScroll from "vue-infinite-scroll"
// import InfiniteLoading from 'vue-infinite-loading';
// import Bus from "../../../utils/bus"
export default {
  components: {
    // InfiniteLoading
  },
  directives: {infiniteScroll},
  data() {
    return {
      list: [],
      activeName: "",
      WarningTypeList: [],
      GradeTypeList: [
        { label: "轻微", num: "1", className: false },
        { label: "一般", num: "2", className: false },
        { label: "严重", num: "3", className: false },
      ],
      items: [],
      activeIds: [],
      policeList: [],
      DataType: [],
      dataLoadStop: false,  //列表数据加载停止状态
      dataLoadNomore: false,    //列表数据加载是否完成
      popupShow:true,
      showScreen:false,
      ScreenTab:false,
      ScreenDT:false,
      eventOptions: [
        {
          value: "全部",
          text: "全部",
        },
        {
          value: "持续中",
          text: "持续中",
        },
        {
          value: "已结束",
          text: "已结束",
        },
      ],
      handleOptions: [
        {
          value: "全部",
          text: "全部",
          className: false,
        },
        {
          value: "事件发生",
          text: "事件发生",
          className: false,
        },
        {
          value: "处理中",
          text: "处理中",
          className: false,
        },
        {
          value: "已完成",
          text: "已完成",
          className: false,
        },
      ],
      date: "报警时间",
      show: false,
      activeIndex: 0,
      minDate: new Date(2010, 0, 1),
      event: [],
      rangeDate: [],
      CountByDay: [],
      RegionCode: [],
      EventTypeCode: [],
      DataTypeCode: [],
      eValue: "全部",
      eventValue: "全部",
      LevelCode: [],
      HValue: "全部",
      handleCode: [],
      eventList: [],
      datalistTF:true,
      Page: 1,
      infiniteId: +new Date(),
      StartTime:null,
      EndTime:null
    };
  },
  methods: {
    openType() {
      this.touch = false;
    },
    closeType() {
      this.touch = true;
    },
    showSF(){
      this.showScreen = true
    },
    formatter(day){
      const date = (moment(day.date).format("YYYY-MM-DD"))
          if (this.CountByDay.includes(date)) {
            day.className = "dateRed"
          }
      return day
    },
    ScreenTF(){
      this.ScreenTab = !this.ScreenTab
    },
    ScreenData(){
      this.ScreenDT = !this.ScreenDT
    },
    WarningTypeInfo(item){
      item.className = !item.className
    },
    warnItemClick(item) {
      // this.$set(this.lister, 0, "newValue")
      item.className = !item.className;
    },
    warnCancel() {
      //报警类型确定
      this.$refs.itemType.toggle();
    },
    ScreenClicks(){
      this.showScreen = false
    },
    ScreenClick(){
      var cityList = [];
      this.WarningTypeList.forEach((value, index) => {
        if (value.className == true) {
          cityList.push(value.label);
        }
      });
      this.EventTypeCode = cityList;
      var Determine = [];
      this.DataType.forEach((item) => {
        if (item.className) {
          Determine.push(item.label);
        }
      });
      this.DataTypeCode = Determine
      var cityLists = [];
      this.GradeTypeList.forEach((value, index) => {
        if (value.className == true) {
          cityLists.push(value.num);
        }
      });
      this.LevelCode = cityLists;
      this.showScreen = false;
      this.popupShow = true;
      this.eventList = []
      this.Page = 1;
      this.GetEventList();
    },
    warnDetermine() {
      var cityList = [];
      this.WarningTypeList.forEach((value, index) => {
        if (value.className == true) {
          cityList.push(value.label);
        }
      });
      // console.log(cityList);
      this.EventTypeCode = cityList;
      this.$refs.itemType.toggle();
      this.popupShow = true;
      this.GetEventList();
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
      this.GradeTypeList.forEach((value, index) => {
        if (value.className == true) {
          cityList.push(value.num);
        }
      });
      this.LevelCode = cityList;
      this.$refs.itemsGrade.toggle();
      this.popupShow = true;
      this.GetEventList();
    },
    EventItemClick(value) {
      this.eventList = []
      this.Page = 1;
      this.popupShow = true;
      this.eventValue = value;
      this.GetEventList();
      // console.log(value);
    },
    handleItemClick(item) {
      if (item == "全部") {
        this.handleCode = []
      }else{
        this.handleCode = [];
        this.handleCode.push(item)
      }
      this.popupShow = true;
      this.eventList = []
      this.Page = 1;
      this.GetEventList();
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
      this.$refs.itemsCity.toggle();
      this.RegionCode = cityList
      this.popupShow = true;
      this.eventList = []
      this.Page = 1;
      this.GetEventList();
    },
    TypeItemClick(item) {
      item.className = !item.className;
    },
    Cancel() {
      //数据类型
      this.$refs.itemsData.toggle();
    },
    Determine() {
      var Determine = [];
      this.DataType.forEach((item) => {
        if (item.className) {
          Determine.push(item.label);
        }
      });
      this.DataTypeCode = Determine
      this.$refs.itemsData.toggle();
      this.popupShow = true;
      this.GetEventList();
    },
    onNavClick(index) {
      this.policeList = this.items[index].Children;
    },
    itemTF(data) {
      data.class = !data.class;
    },
    cellClick(left, right, cell, outside) {
      // console.log(left, right, cell, outside);
    },
    onItemClick(item) {
      item.classNames = !item.classNames;
    },
    openDropdown() {
      this.show = true;
    },
    onConfirm(date) {
      const [start, end] = date;
      this.show = false;
      var CreateTime = ((new Date(start)).getTime()/1000).toFixed(0)
      var CompleteTime = ((new Date(end)).getTime()/1000).toFixed(0)
      this.date = `${timeStamp.parseTime(CreateTime,"{y}-{m}-{d} {h}:{i}:{s}")} - ${timeStamp.parseTime(CompleteTime,"{y}-{m}-{d} {h}:{i}:{s}")}`;
      this.StartTime = timeStamp.parseTime(CreateTime,"{y}-{m}-{d} {h}:{i}:{s}")
      this.EndTime = timeStamp.parseTime(CompleteTime,"{y}-{m}-{d} {h}:{i}:{s}")
      this.popupShow = true;
      this.eventList = []
      this.Page = 1;
      this.GetEventList();
    },
    formatDate(date) {
      return `${date.getMonth() + 1}/${date.getDate()}`;
    },
    listItemClick(item) {
      localStorage.setItem('item', JSON.stringify(item));
      // console.log(item);
      this.$router.push({
        path: "/eventDetail",
        query: { item: item },
      });
    },
    GetWarningDataTypeListToSelect() {
      //获取报警数统计(数据类型)
      this.$axios
        .post(urlClass.SystemSetting + "GetWarningDataTypeListToSelect")
        .then((Response) => {
          this.DataType = Response.data.Result.options.map((item, index) => {
            return Object.assign(item, { className: false });
          });
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
      return new Promise((resolve, reject) => {
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
            resolve(this.rangeDate);
          });
      });
    },
    async GetEventList() {
      const time2 = await this.GetMonthEventCountByDay();
      // console.log(time2);
      // console.log("GetEventList");
      this.PageIndexStatus = true;
      this.PageIndex = 1;
      this.event = [];
      this.loading = true;
      // console.log(this.StartTime)
      if (this.StartTime) {
        time2[0] = this.StartTime
        time2[1] = this.EndTime
      }
      console.log(this.Page)
      let res = {
        StartTime: time2[0],
        EndTime: time2[1],
        // StartTime:  "2021-07-03 00:00:00",
        // EndTime:  "2021-07-03 23:59:00",
        Region: this.RegionCode,
        warningType: this.EventTypeCode,
        DataType: this.DataTypeCode,
        EventState: this.eventValue,
        Level: this.LevelCode,
        ProcessingStatus: this.handleCode,
        Page: this.Page,
      };
      this.Page++;
      this.$axios
        .post(urlClass.DetectWise + "GetEventList", JSON.stringify(res))
        .then((e) => {
          // console.log(e); 
          if (e.data.Ok) {
            let resData = [...e.data.Result];
            this.popupShow = false;
            if (resData.length) {
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
              this.eventList =this.eventList.concat(resData);
              if (this.eventList.length > 1) {
                this.eventList[0].class = true;
                this.eventList[1].class = true;
              }
              if (this.eventList.length == 1) {
                this.eventList[0].class = true;
              }
              // console.log("有数据",resData)
              this.datalistTF = true
            }else if(resData.length == 0 && this.Page == 1){
              this.datalistTF = false
              console.log("暂无数据")
            }else if(resData.length == 0 && this.Page != 1){
              // console.log("没有更多数据来")
              this.dataLoadNomore = true
            }
          }else{
            Dialog.alert({
              title: '标题',
              message: '请求超时',
            }).then(() => {
              this.popupShow = false;
            });
          }

          
        });
    },
  },
  mounted() {
    // this.GetEventList();
    this.GetDropDownMenuItem("Region");
    this.GetWarningTypeListToSelect();
    this.GetWarningDataTypeListToSelect();
  },
};
</script>
<style lang="less">
.dateRed::before{
  content: "";
  display: block;
  height: 4px;
  width: 4px;
  background: orange;
  border-radius: 50%;
  position: absolute;
  bottom: 15px;
}
.van-calendar__day--end,.van-calendar__day--start{
  background: #000;
}
.van-calendar__day--middle{
  color: #000;
}
.van-calendar__day--end::before{
  display: none;
}
.van-calendar__day--start::before{
  display: none;
}
.van-button--danger{
  background: #000;
  border-color: #f0f0f0;
  box-sizing: border-box;

}
</style>
<style lang="less" scoped>
@import "../event.less";
.eventList {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f0f0f0;
  & /deep/ .van-cell {
    font-size: 12px; /*no*/
    &::after {
      right: 0;
      left: 0;
    }
  }
  & /deep/ .van-cell__title {
    font-size: 12px;
  }
  & /deep/ .van-dropdown-menu__title--active {
    color: #2b699d !important;
  }
  & /deep/ .van-dropdown-menu__title {
    padding-left: 0;
  }
  & /deep/ .van-dropdown-item__option--active {
    color: #2b699d !important;
  }
  & /deep/ .van-dropdown-menu__title {
    font-size: 12px; /*no*/
    &::after {
      border-color: transparent transparent #000 #000;
    }
  }
  & /deep/ .van-dropdown-menu__bar {
    background-color: transparent;
    box-shadow: none;
  }
}
.Screen{
  height: 100%;
  width: 100%;
  position: relative;
  h3{
    padding: 0 25px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .WarningTypeList{
    padding: 0 25px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    overflow: hidden;
    p{
      padding: 3px 12px;
      display: inherit;
      background: #fafafa;
      border: 1px solid transparent;
      border-radius: 20px;
      // margin-top: 10px;
      height: 30px;
      box-sizing: border-box;
      line-height: 20px;
    }
  }
  .DataType{
    .WarningTypeList();
    padding: 3px 15px;
  }
  .GradeType{
    .WarningTypeList();
    height: 40px;
  }
  .handleOptions{
    .GradeType();
  }
}
.open{
  transform: rotate(-180deg);
  transition: transform .3s,-webkit-transform .3s;
}
.close{
  transform: rotate(0deg);
  transition: transform .3s,-webkit-transform .3s;
}
.ScreenOpen{
    height: 300px !important;
    transition: height 1s;
}
.ScreenOpenData{
    height: 150px !important;
    transition: height 1s;
}
.ScreenClose{
    height: 30px !important;
    transition: height 1s;
}
.redType{
  background: rgba(255, 255, 255, .5) !important;
  color: red;
  border-color: red !important;
}
.btn{
  position: absolute;
  width: 100%;
  height: 50px;
  bottom: 0;
  .btnInfo{
    display: flex;
    justify-content: space-around;
  }
  p{
    height: 32px;
    width: 60px;
    border-radius: 16px;
    text-align: center;
    line-height: 32px;
      background: #000;
      color: #fff;
  }
}
.gap{
  height: 10px;
  background: #f0f0f0;
}
</style>