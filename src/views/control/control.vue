<template>
  <div class="home">
    <p id="statusBar"></p>
    <p class="nav">监控</p>
    <div class="box">
      <!-- <notification></notification> -->
      <div class="legend">
        <p class="iconfont icontuli2" @click="legendClick()"></p>
        <p class="iconfont iconrefresh"  @click="Reset()"></p>
        <p class="iconfont iconmoxing1" @click="layerHide()"  :class="IsShowArea ? 'circleDiv_active' : 'circleDiv'"></p>
      </div>
      <div id="mapHome" class="mapHome"></div>
      <div class="operation" ref="operation">
        <div
          class="oper"
          @touchstart.capture="touchStart"
          @touchend.capture="touchEnd"
        >
          <div class="navTop" v-for="(item, index) in warnList" :key="index">
            <p>{{ item.number }}</p>
            <span>{{ item.name }}</span>
          </div>
        </div>
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
            <!-- 级别 -->
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
        </div>
        <!-- 报警列表 -->
        <div class="warningList" v-if="datalistTF">
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
        </div>
        <div class="dataNull" v-else>
          <p class="iconfont iconzanwushuju"></p>
          <span>暂无数据</span>
        </div>
      </div>
    </div>
    <van-popup v-model="legendShow" position="right" get-container="#app" :style="{ width: '50%',height: '100%',background:'#fff' }">
      <div class="legendPopup">
        <h3>图例</h3>
        <h4>监测点</h4>
        <div class="point">
          <p>
            <img src="../../assets/img/controlImg/dw1.png" alt="">
            <span>压力点</span>
          </p>
          <p>
            <img src="../../assets/img/controlImg/dw2.png" alt="">
            <span>流量点</span>
          </p>
        </div>
        <h4>热度值</h4>
        <div class="degree">
          <p>
            <img src="../../assets/img/controlImg/event_reddot.png" alt="">
            <span>高</span>
          </p>
          <p>
            <img src="../../assets/img/controlImg/event_orangedot.png" alt="">
            <span>中</span>
          </p>
          <p>
            <img src="../../assets/img/controlImg/event_yellowdot.png" alt="">
            <span>低</span>
          </p>
        </div>
        <div class="switch">
          <p>点位名称</p>
          <van-switch size="18" @change="PointsName()" v-model="checked" />
        </div>
      </div>
    </van-popup>
    <van-popup v-model="popupShow" get-container="#app">
      <van-loading type="spinner" color="#1989fa" size="24" />
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
import { loadModules } from "esri-loader";
// import global from "../../components/js/Global"
import urlClass from "../../components/js/UrlClass";
import configjsdata from "../../components/json/configjson";
import tileInfo from "../../components/js/tdt_data";
import apiClass from "../../components/js/apiClass";
import global from "../../components/js/Global";
import diffuseBubbles from "../../components/js/DiffuseBubbles";
import notification from "./notification/notification.vue";
import config from "../../components/json/config";
import popupAreaInformation from "../../components/js/popupAreaInformation";
import popupTableWater from "../../components/js/popupTableWater";
import dw1 from "../../assets/img/controlImg/dw1.png";
import dw2 from "../../assets/img/controlImg/dw2.png";
import yellowdot from "../../assets/img/controlImg/event_yellowdot.png";
import orangedot from "../../assets/img/controlImg/event_orangedot.png";
import reddot from "../../assets/img/controlImg/event_reddot.png";
import * as timeStamp from "../../utils/index";
import moment from "moment";
export default {
  name: "Home",
  components: {
    // notification,
  },
  data() {
    return {
      arcgisAPI: null,
      drwdPointLayer: null,
      gl: null,
      featurePolygonLayerview: null,
      highlightHover: null,
      popupShow: true,
      view: null,
      viewMap: null,
      date: "报警时间",
      show: false,
      startY: 0,
      endY: 0,
      minDate: new Date(2010, 0, 1),
      touch: true,
      datalistTF:true,
      warnList: [
        { name: "报警总数", number: 0 },
        { name: "一级警报", number: 0 },
        { name: "二级警报", number: 0 },
        { name: "三级警报", number: 0 },
      ],
      itemT: false,
      WarningTypeList: [],
      GradeTypeList: [
        { label: "轻微", className: false },
        { label: "一般", className: false },
        { label: "严重", className: false },
      ],
      activeIds: [],
      activeIndex: 0,
      items: [],
      policeList: [],
      policeCode: 0,
      eventList: [],
      RegionCode: [],
      EventTypeCode: [],
      EventStateCode: [],
      CountByDay:[],
      StartTime: this.$moment()
        .subtract("days")
        .format("YYYY-MM-DD 00:00:00"),
      EndTime: this.$moment().format("YYYY-MM-DD 23:59:00"),
      EventMessage: [],
      tempGra: null,
      activeName: "",
      isActive: false,
      graData: [],
      areaData:[],
      IsShowArea:true,//图例动态类名
      legendShow:false,
      checked:false,
      lableData:[]
    };
  },
  filters: {
    million: function (value) {
      if (value == "") {
        value = "--";
      }
      return value;
    },
    typeMillion: function (value) {
      let type = "";
      if (value == "pressure") {
        type = "P";
      } else if (value == "flow") {
        type = "F";
      } else if (value == "pipeburst") {
        type = "P";
      } else if (value == "minflowatnight") {
        type = "M";
      } else if (value == "offline") {
        type = "O";
      } else if (value == "stop") {
        type = "S";
      } else if (value == "chaoshangxian") {
        type = "C";
      } else if (value == "toohigh") {
        type = "T";
      } else if (value == "toolow") {
        type = "T";
      }

      return type;
    },
    timeFilter: function (value) {
      var day = parseInt(value / 60 / 24);
      var hour = parseInt((value / 60) % 24);
      var min = parseInt(value % 60);
      if (day > 0) {
        value = day + "天";
      }
      if (day == 0) {
        value = "中"
      }
      if (hour > 0) {
        value = hour + "小时";
      }
      if (min > 0) {
        value = min + "分钟";
      }
      return value;
    },
  },
  computed: {},
  created() {
    // this.items = global.area;
    // this.policeList = this.items[0].Children
    console.log(this.items);
  },
  methods: {
    openType() {
      console.log(1111);
      this.touch = false;
    },
    closeType() {
      this.touch = true;
    },
    warnCancel() {
      //报警类型确定
      this.$refs.itemType.toggle();
    },
    formatter(day){
      const date = (moment(day.date).format("YYYY-MM-DD"))
          if (this.CountByDay.includes(date)) {
            day.className = "dateRed"
          }
      return day
    },
    warnDetermine() {
      var List = [];
      console.log(this.WarningTypeList)
      this.WarningTypeList.forEach((value, index) => {
          if (value.className == true) {
            List.push(value.label);
          }
      });
      console.log(List);
      this.$refs.itemType.toggle();
      this.EventTypeCode = List;
      this.GetEventNumber()
      this.GetAreaCoordinatesInfo()
      this.GetEventListByHomePage()
    },
    GradeCancel() {
      //等级
      this.$refs.itemsGrade.toggle();
    },
    GradeDetermine() {
      this.$refs.itemsGrade.toggle();
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
      this.RegionCode = cityList
      this.GetEventNumber()
      this.GetAreaCoordinatesInfo()
      this.GetEventListByHomePage()
    },
    CityCancel() {
      this.$refs.itemsCity.toggle();
    },
    onItemClick(item) {
      item.classNames = !item.classNames;
      console.log(item);
    },
    warnItemClick(item) {
      // this.$set(this.lister, 0, "newValue")
      item.className = !item.className;
    },
    GradeItemClick(item) {
      item.className = !item.className;
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
    openDropdown() {
      console.log(1);
      this.show = true;
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
      var CreateTime = ((new Date(start)).getTime()/1000).toFixed(0)
      var CompleteTime = ((new Date(end)).getTime()/1000).toFixed(0)
      this.date = `${timeStamp.parseTime(CreateTime,"{y}-{m}-{d} {h}:{i}:{s}")} - ${timeStamp.parseTime(CompleteTime,"{y}-{m}-{d} {h}:{i}:{s}")}`;
      this.StartTime = timeStamp.parseTime(CreateTime,"{y}-{m}-{d} {h}:{i}:{s}")
      this.EndTime = timeStamp.parseTime(CompleteTime,"{y}-{m}-{d} {h}:{i}:{s}")
      this.$nextTick(()=>{
        this.GetEventNumber()
      })
      this.GetAreaCoordinatesInfo()
      this.GetEventListByHomePage()
      this.popupShow = true
    },
    touchEnd(e) {
      this.endY = e.changedTouches[0].clientY;
      var moveY = this.endY - this.startY;
      var positionB1 = 0;
      var positionB2 = -440;
      this.$refs.operation.style.transition = "bottom 0.6s";
      if (this.touch) {
        this.searchMove(moveY, positionB1, positionB2, this.$refs.operation);
      }
    },
    searchMove(moveY, positionB1, positionB2, box) {
      if (moveY > 20) {
        this.$refs.operation.style.bottom = positionB2 + "px";
      } else {
        this.$refs.operation.style.bottom = positionB1 + "px";
      }
    },
    listItemClick(item) {
      if (this.activeName === item.EventId) {
        this.activeName = "";
        this.initMapData();
      } else {
        this.activeName = item.EventId;
        this.listItemClickMap(item);
      }
      this.$refs.operation.style.bottom = -440 + "px";
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
      var CountByDay = []
      this.$axios
        .post(urlClass.DetectWise + "GetMonthEventCountByDay", params)
        .then((Response) => {
          Response.data.Result.forEach((res) => {
            CountByDay.push(res.Date);
            this.CountByDay = CountByDay;
          });
          this.StartTime = this.$moment(CountByDay[CountByDay.length - 1]).format("YYYY-MM-DD HH:mm:ss")
          this.EndTime = this.$moment(CountByDay[CountByDay.length - 1]).format("YYYY-MM-DD 23:59:00")
          console.log(this.StartTime)
          console.log(this.EndTime)
          this.GetEventListByHomePage();
          this.GetEventNumber();
        });
    },
    GetEventListByHomePage() {
      //获取事件列表信息
      this.eventList = [];
      let data = {
        TenantId: "",
        StartTime: this.StartTime,
        EndTime: this.EndTime,
        Region: this.RegionCode,
        WarningType: this.EventTypeCode,
        EventState: this.EventStateCode,
        page: 1,
      };
      this.$axios
        .post(
          urlClass.DetectWise + "GetEventListByHomePage",
          JSON.stringify(data)
        )
        .then((res) => {
          let resData = [...res.data.Result];
          this.popupShow = false
          console.log(resData)
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
            if (resData.length > 1) {
              resData[0].class = true;
              resData[1].class = true;
            }
            if (resData.length == 1) {
              resData[0].class = true;
            }
            this.eventList = resData;
            console.log(this.eventList);
            this.datalistTF = true
          }else{
            this.datalistTF = false
          }
        });
    },
    GetNewEvent() {
      //获取设备信息
      let data = {
        Date: this.$moment()
          .subtract(15, "minutes")
          .format("YYYY-MM-DD HH:mm:ss"),
      };
      this.$axios
        .post(urlClass.DetectWise + "GetNewEvent", JSON.stringify(data))
        .then((res) => {
          console.log(res.data.Result);
        });
    },
    GetEventNumber() {
      let params = {
        EndTime: this.EndTime,
        Region: this.RegionCode,
        StartTime: this.StartTime,
        WarningType: this.EventTypeCode,
      };
      this.$axios
        .post(urlClass.DetectWise + "GetEventNumber", params)
        .then((res) => {
          console.log(res.data.Result);
          this.warnList[0].number = 0
          this.warnList[1].number = 0
          this.warnList[2].number = 0
          this.warnList[3].number = 0
          if (res.data.Result) {
            res.data.Result.forEach((item, idx) => {
              this.warnList[0].number += item.Num;
              if (item.Level == 1) {
                this.warnList[1].number = item.Num;
              }
              if (item.Level == 2) {
                this.warnList[2].number = item.Num;
              }
              if (item.Level == 3) {
                this.warnList[3].number = item.Num;
              }
            });
          }else{
            this.warnList[0].number = 0;
            this.warnList[2].number = 0;
            this.warnList[1].number = 0;
          }
          console.log(this.warnList)
        });
    },
    listItemClickMap(item) {
      //点击事件列表
      this.drwdPoint(item);
      this.IsShowName()
    },
    drwdPoint(data) {
      console.log(data);
      let X, Y, label;
      let geoType = data.Geometry.GeoType;
      if (!geoType) {
        geoType = data.RegionGeo.GeoType;
      }
      console.log(geoType);
      var listData = [];
      this.drwdPointLayer.removeAll();
      this.gl.removeAll();
      popupTableWater.destroy();
      this.HighlightHoverByLabel("");
      switch (geoType) {
        case "Point":
          X = data.Geometry.Geo.X;
          Y = data.Geometry.Geo.Y;
          if (
            data.RegionGeo &&
            data.RegionGeo.Geo &&
            data.RegionGeo.Geo.length > 0 &&
            data.RegionGeo.Geo[0].Label
          ) {
            label = data.RegionGeo.Geo[0].Label;
          }
          if (label) {
            this.HighlightHoverByLabel(label);
          }
          var pt = new this.arcgisAPI.Point({
            x: X,
            y: Y,
            spatialReference: this.view.spatialReference,
          });
          this.view.center = pt;
          var symbol = {
            type: "picture-marker",
            url: dw1,
            width: "30px",
            height: "30px",
          };
          var type = data.EventType;
          switch (type) {
            case "flow":
              symbol = {
                type: "picture-marker",
                url: dw2,
                width: "30px",
                height: "30px",
              };
              break;
            case "pressure":
              symbol = {
                type: "picture-marker",
                url: dw1,
                width: "30px",
                height: "30px",
              };
              break;
          }
          var gra = new this.arcgisAPI.Graphic({
            geometry: pt,
            symbol: symbol,
          });
          this.gl.add(gra);
          break;
        case "Special":
          console.log(data.Geometry.Geo.Locations.length);
          label = data.RegionGeo.Geo[0].Label;
          if (label) {
            this.HighlightHoverByLabel(label);
          }
          console.log(data.Geometry.Geo);
          listData = [];
          this.drwdPointLayer.removeAll();
          var locations = data.Geometry.Geo.Locations;
          for (let i = 0; i < locations.length; i++) {
            var level = locations[i].Heat == 1 ? 3 : 2;
            listData.push({
              Level: level,
              X: locations[i].X,
              Y: locations[i].Y,
            });
          }
          this.drwdListPoints(listData);
          console.log(1);
          var tempData = [];
          this.gl.removeAll();
          popupTableWater.destroy();
          console.log(data.Geometry.Geo.WarnFlows);
          var warnFlows = data.Geometry.Geo.WarnFlows;
          for (let i = 0; i < warnFlows.length; i++) {
            const warnFlow = warnFlows[i];
            tempData.push({
              name: warnFlow.StationName,
              type: "flow",
              X: warnFlow.X,
              Y: warnFlow.Y,
            });
          }
          var warnPressures = data.Geometry.Geo.WarnPressures;
          for (let j = 0; j < warnPressures.length; j++) {
            const warnPressure = warnPressures[j];
            tempData.push({
              name: warnPressure.StationName,
              type: "pressure",
              X: warnPressure.X,
              Y: warnPressure.Y,
            });
          }
          if (tempData.length > 0) {
            console.log(tempData)
            this.lableData = tempData
            this.loadLablePoints(tempData);
          }
          break;
        case "Polygon":
          label = data.RegionGeo.Geo[0].Label;
          if (label) {
            this.HighlightHoverByLabel(label);
          }
          break;
        default:
          break;
      }
    },
    drwdListPoints(listData) {
      if (listData.length > 0) {
        console.log("drwdListPoints:", listData.length);
        var tempData = [];
        this.drwdPointLayer.removeAll();
        for (let i = 0; i < listData.length; i++) {
          const obj = listData[i];
          let type = obj.Level;
          var symbol = {
            type: "picture-marker",
            url: yellowdot,
            width: "24px",
            height: "24px",
          };
          switch (obj.Level) {
            case 1:
              type = "blue";
              symbol = {
                type: "picture-marker",
                url: yellowdot,
                width: "24px",
                height: "24px",
              };
              break;
            case 2:
              type = "yellow";
              symbol = {
                type: "picture-marker",
                url: orangedot,
                width: "24px",
                height: "24px",
              };
              break;
            case 3:
              type = "red";
              symbol = {
                type: "picture-marker",
                url: reddot,
                width: "24px",
                height: "24px",
              };
              break;
          }
          if (obj.X && obj.Y) {
            var tempObj = { id: i, type: type, x: obj.X, y: obj.Y };
            tempData.push(tempObj);
            //画点
            var pt = new this.arcgisAPI.Point({
              x: obj.X,
              y: obj.Y,
              spatialReference: this.view.spatialReference,
            });
            // var markerSymbol = { type: "simple-marker", color: type, size: 6, outline: { color: [153, 153, 153, 0.7], width: 0.75 } };
            // var gra = new esriApi.Graphic({ geometry: pt, symbol: markerSymbol });
            var gra = new this.arcgisAPI.Graphic({
              geometry: pt,
              symbol: symbol,
            });
            this.drwdPointLayer.add(gra);
          }
        }
      }
    },
    loadLablePoints(_lableData) {
      var lableData = _lableData;
      this.drwdLablePoints(lableData);
    },
    drwdLablePoints(lableData) {
      if (lableData.length > 0) {
        var tempData = [];
        this.gl.removeAll();
        var symbol = {
          type: "picture-marker",
          url: "/static/images/dw1.png",
          width: "30px",
          height: "30px",
        };
        for (let i = 0; i < lableData.length; i++) {
          const obj = lableData[i];
          switch (obj.type) {
            case "flow":
              symbol = {
                type: "picture-marker",
                url: dw2,
                width: "30px",
                height: "30px",
              };
              break;
            case "pressure":
              symbol = {
                type: "picture-marker",
                url: dw1,
                width: "30px",
                height: "30px",
              };
              break;
          }
          var tempObj = { Name: obj.name, Type: obj.type, X: obj.X, Y: obj.Y };
          tempData.push(tempObj);
          const point = {
            type: "point",
            x: obj.X,
            y: obj.Y,
            spatialReference: this.view.spatialReference,
          };
          var gra = new this.arcgisAPI.Graphic({
            geometry: point,
            symbol: symbol,
          });
          this.gl.add(gra);
        }

        if (this.isActive && tempData.length > 0) {
          popupTableWater.destroy();
          popupTableWater.loadPopup(tempData);
        }
      }
    },
    IsShowName() {
      console.log(this.checked)
      //貌似没用
      if (this.checked) {
        var tempData = [];
        for (let i = 0; i < this.lableData.length; i++) {
          const obj = this.lableData[i];
          var tempObj = { Name: obj.name, Type: obj.type, X: obj.X, Y: obj.Y };
          tempData.push(tempObj);
        }
        console.log(tempData)
        if (tempData.length > 0) {
          popupTableWater.destroy();
          popupTableWater.loadPopup(tempData);
        }
      } else {
        popupTableWater.destroy();
      }
    },
    initMapData(isBool = true) {
      //初始化地图
      if (isBool) {
        var initExtent = new this.arcgisAPI.Extent(
          global.initExtent.minX,
          global.initExtent.minY,
          global.initExtent.maxX,
          global.initExtent.maxY,
          new this.arcgisAPI.SpatialReference({ wkid: global.spatialReference })
        );
        this.view.extent = initExtent;
      }
      // listData = [];
      this.drwdPointLayer.removeAll();
      this.gl.removeAll();
      popupTableWater.destroy();
      this.HighlightHoverByLabel("");
    },
    HighlightHoverByLabel(label) {
      if (this.highlightHover) {
        this.highlightHover.remove();
        this.highlightHover = null;
        this.tempGra = null;
      }
      if (this.featurePolygonLayerview && label != "") {
        console.log(this.graData);
        for (let i = 0; i < this.graData.length; i++) {
          const gra = this.graData[i];
          const item = gra.attributes;
          if (item.OTITLE == label) {
            console.log("item:", item);
            this.highlightHover = this.featurePolygonLayerview.highlight(gra);
            self.tempGra = gra;
            // mapView.center = gra.geometry.extent.center;
            this.view.extent = gra.geometry.extent;
            this.view.zoom--;
            break;
          }
        }
      }
      console.log(1111);
    },
    createMap() {
      loadModules(
        [
          "esri/Map",
          "esri/views/MapView",
          "esri/layers/WebTileLayer",
          "esri/layers/support/TileInfo",
          "esri/layers/MapImageLayer",
          "esri/geometry/SpatialReference",
          "esri/geometry/Extent",
          "esri/Graphic",
          "esri/widgets/Home",
          "esri/config",
          "esri/geometry/Polygon",
          "esri/symbols/SimpleFillSymbol",
          "esri/tasks/QueryTask",
          "esri/tasks/support/IdentifyParameters",
          "esri/tasks/IdentifyTask",
          "esri/geometry/Point",
          "esri/layers/GraphicsLayer",
          "esri/geometry/Polyline",
          "esri/symbols/PictureMarkerSymbol",
          "esri/symbols/SimpleLineSymbol",
          "esri/Color",
          "esri/widgets/Sketch/SketchViewModel",
          "esri/tasks/support/query",
          "esri/symbols/SimpleMarkerSymbol",
          "esri/geometry/geometryEngine",
          "esri/layers/FeatureLayer",
          "esri/core/promiseUtils",
        ],
        {
          css: apiClass.arcgisUrlIp1,
          url: apiClass.arcgisUrl,
        }
      ).then(
        ([
          ArcGISMap,
          MapView,
          WebTileLayer,
          TileInfo,
          MapImageLayer,
          SpatialReference,
          Extent,
          Graphic,
          Home,
          esriConfig,
          Polygon,
          SimpleFillSymbol,
          QueryTask,
          IdentifyParameters,
          IdentifyTask,
          Point,
          GraphicsLayer,
          Polyline,
          PictureMarkerSymbol,
          SimpleLineSymbol,
          Color,
          SketchViewModel,
          Query,
          SimpleMarkerSymbol,
          geometryEngine,
          FeatureLayer,
          promiseUtils,
        ]) => {
          this.arcgisAPI = {
            SpatialReference: SpatialReference,
            Extent: Extent,
            Point: Point,
            GraphicsLayer: GraphicsLayer,
            Graphic: Graphic,
            Polyline: Polyline,
            Polygon: Polygon,
            PictureMarkerSymbol: PictureMarkerSymbol,
            SimpleLineSymbol: SimpleLineSymbol,
            SimpleFillSymbol: SimpleFillSymbol,
            Color: Color,
            SketchViewModel: SketchViewModel,
            Query: Query,
            SimpleMarkerSymbol: SimpleMarkerSymbol,
            geometryEngine: geometryEngine,
            IdentifyTask: IdentifyTask,
            IdentifyParameters: IdentifyParameters,
            FeatureLayer: FeatureLayer,
            promiseUtils: promiseUtils,
          };
          this.arcgisView = { MapView: MapView };
          this.arcgisExtent = { Extent: Extent };
          var data = tileInfo.tileInfo;
          var str = JSON.stringify(data);
          var tileInfoTemp = JSON.parse(str);
          for (var i = 0; i < tileInfoTemp.lods.length; i++) {
            tileInfoTemp.lods[i].resolution *= global.googleRatio;
          }
          var map = new ArcGISMap(); // 创建地图实例
          this.viewMap = map; //外部使用
          var wtl_tileInfo = new TileInfo(tileInfoTemp);
          let webTileMap = new WebTileLayer(apiClass.googleMapUrl1, {
            tileInfo: wtl_tileInfo,
          });
          map.add(webTileMap);
          var self = this;
          var initExtent = new Extent(
            global.initExtent.minX,
            global.initExtent.minY,
            global.initExtent.maxX,
            global.initExtent.maxY,
            new SpatialReference({ wkid: global.spatialReference })
          );
          var view = (this.view = new MapView({
            container: "mapHome",
            map: map,
            extent: initExtent,
            spatialReference: new SpatialReference({
              wkid: global.spatialReference,
            }),
          }));
          //初始化
          this.drwdPointLayer = new GraphicsLayer();
          map.add(this.drwdPointLayer);
          this.gl = new GraphicsLayer();
          map.add(this.gl);
          this.view.ui._removeComponents(["attribution", "zoom"]);
          this.view.popup.actions = null;
          view.on("click", function (e) {
            view.hitTest(e).then((res) => {
              console.log(res);
              if (res.results[0]) {
                var results = res.results.filter(function (result) {
                  return (
                    result.graphic.layer === self.featurePolygonLayerview.layer
                  );
                });
                if (!results.length) {
                  return null;
                } else {
                  var graphic = results[0].graphic;
                  // var listData = [];
                  self.drwdPointLayer.removeAll();
                  self.gl.removeAll();
                  popupTableWater.destroy();
                  self.HighlightHoverByLabel(graphic.attributes.OTITLE);
                  // self.clickGraphicByName(graphic.attributes.OTITLE);
                }
              }
            });
          });
          view.when(
            function (e) {
              console.log("map加载完成！");
              diffuseBubbles.initPopupEvent(view, "homeMap");
              popupTableWater.initPopupEvent(
                view,
                view.spatialReference,
                "jcdPopup"
              );
              popupAreaInformation.initPopupEvent(
                view,
                view.spatialReference,
                "areaPopup"
              );
              self.popupShow = false;
              self.GetAreaCoordinatesInfo();
            },
            function (error) {
              console.log("The view's resources failed to load: ", error);
            }
          );
        }
      );
    },
    GetAreaCoordinatesInfo() {
      let res = {
        StartTime: this.StartTime,
        EndTime: this.EndTime,
        Region: this.RegionCode,
        WarningType: this.EventTypeCode,
      };
      this.$axios
        .post(urlClass.DetectWise + "GetAreaGeometry", res)
        .then((e) => {
          var areaList = [];
          console.log(e.data);
          var result = e.data.Result.Geo;
          for (let i = 0; i < result.length; i++) {
            const item = result[i];
            var rings = [];
            for (let j = 0; j < item.Coordiantes.length; j++) {
              const element = item.Coordiantes[j];
              rings.push([element.X, element.Y]);
            }
            var obj = {
              OTITLE: item.Label,
              EventNumber: String(item.EventNumber),
              Level1Number: String(item.Level1Number),
              Level2Number: String(item.Level2Number),
              Level3Number: String(item.Level3Number),
              Level: String(item.Level),
              Color: item.Color ? item.Color : "rgba(66, 163, 239,0.1)",
              BorderColor: item.BorderColor
                ? item.BorderColor
                : "rgb(	220,220,220)",
              BorderWidth: 1 + "px",
              rings: config.mapDataReversal ? rings.reverse() : rings,
            };
            areaList.push(obj);
          }
          console.log(areaList);
          this.createFeatureLayer(areaList);
        });
    },
    createFeatureLayer(dataList) {
      console.log("dataList:", dataList);
      this.areaData = [];
      var tempLayer = this.viewMap.findLayerById("featurePolygon");
      if (tempLayer) {
        this.viewMap.remove(tempLayer);
      }
      this.gl.removeAll();
      this.graData = [];
      var rings = [];
      popupAreaInformation.destroy();
      // debugger
      let uniqueValueInfos = [];
      for (let i = 0; i < dataList.length; i++) {
        const element = dataList[i];
        rings.push(element.rings);
        const poly = new this.arcgisAPI.Polygon({
          rings: element.rings,
          spatialReference: this.view.spatialReference,
        });
        const gra = new this.arcgisAPI.Graphic({
          geometry: poly,
          attributes: element,
        });
        this.graData.push(gra);
        if (Number(element.EventNumber) > 0) {
          let values = [];
          values.push({ Label: "轻微:", Value: element.Level1Number });
          values.push({ Label: "一般:", Value: element.Level2Number });
          values.push({ Label: "严重:", Value: element.Level3Number });
          this.areaData.push({
            Type: element.Level,
            Name: element.OTITLE,
            Values: values,
            X: poly.extent.center.x,
            Y: poly.extent.center.y,
          });
        }
        //渲染分级随机颜色
        uniqueValueInfos.push({
          value: element.OTITLE,
          symbol: {
            type: "simple-fill",
            color: element.Color,
            outline: {
              color: element.BorderColor,
              width: element.BorderWidth,
            },
          },
        });
      }
      if (this.areaData.length > 0) {
        console.log(this.areaData);
        popupAreaInformation.loadPopup(this.areaData);
      }
      var featurePolygon = new this.arcgisAPI.FeatureLayer({
        id: "featurePolygon",
        source: this.graData,
        fields: [
          { name: "ObjectID", alias: "ObjectID", type: "oid" },
          { name: "OTITLE", alias: "OTITLE", type: "string" },
          { name: "Level1Number", alias: "Level1Number", type: "string" },
          { name: "Level2Number", alias: "Level2Number", type: "string" },
          { name: "Level3Number", alias: "Level3Number", type: "string" },
        ],
        objectIdField: "ObjectID",
        geometryType: "polygon",
        renderer: {
          type: "unique-value",
          field: "OTITLE",
          uniqueValueInfos: uniqueValueInfos,
        },
      });
      this.viewMap.addMany([featurePolygon], 1);
      this.view.whenLayerView(featurePolygon).then(this.setupHoverTooltip);
    },
    setupHoverTooltip(layerview) {
      this.featurePolygonLayerview = layerview;
      var highlight;
      // var tooltip = createTooltip();
      var hitTest = this.arcgisAPI.promiseUtils.debounce( (event)=> {
        return this.view.hitTest(event).then(function (hit) {
          var results = hit.results.filter(function (result) {
            return result.graphic.layer === layerview.layer;
          });
          if (!results.length) {
            return null;
          }
          return {
            graphic: results[0].graphic,
            screenPoint: hit.screenPoint,
          };
        });
      });
      this.view.on("pointer-move", function (event) {
        return hitTest(event).then(
          function (hit) {
            if (highlight) {
              highlight.remove();
              highlight = null;
              if (this.tempGra) {
                layerview.highlight(this.tempGra);
              }
            }
            if (hit) {
              var graphic = hit.graphic;
              // var screenPoint = hit.screenPoint;
              highlight = layerview.highlight(graphic);
              // tooltip.show(
              //   screenPoint, graphic.attributes
              // );
            } else {
              // tooltip.hide();
            }
          },
          function () {}
        );
      });
    },
    Reset() {
      //图例重置
      this.isActive = true;
      this.initMapData();
      this.RegionCode = [];
      this.GetEventListByHomePage();
      this.GetAreaCoordinatesInfo({
        StartTime: this.StartTime,
        EndTime: this.EndTime,
        Region: [],
        WarningType: [],
      });
    },
    layerHide(){
      this.IsShowArea = !this.IsShowArea;
      this.IsShowAreaMap(this.IsShowArea);
    },
    IsShowAreaMap(isActive){
      if (isActive) {
        if (this.areaData.length > 0) {
          popupAreaInformation.destroy();
          popupAreaInformation.loadPopup(this.areaData);
        }
      } else {
        popupAreaInformation.destroy();
      }
    },
    legendClick(){
      this.legendShow = !this.legendShow
    },
    PointsName(){
      // IsShowName
      console.log(this.checked)
      this.IsShowName()
    }
  },
  mounted() {
    this.GetMonthEventCountByDay();
    this.createMap();
    // this.GetEventListByHomePage();
    this.GetWarningTypeListToSelect();
    this.GetDropDownMenuItem("Region");
    this.GetNewEvent();
    // this.GetEventNumber();
  },
};
</script>
<style >
.notice-swipe {
  height: 40px;
  line-height: 40px;
}
.van-popup {
  background: transparent;
}
</style>
<style scoped lang="less">
@import "./control.less";
@import "../../assets/css/popup.less";
.home {
  height: 100%;
  background: #cecece;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &::after {
    display: block;
    content: "";
    width: 100%;
    height: 50px;
    background-color: black;
  }
  .box {
    flex: 1;
    overflow: hidden;
    position: relative;
    background: #fff;
    display: flex;
    flex-direction: column;
  }
}
.nav{
  height: 44px;
  background: #000;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
}
</style>
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
  border-color: #000;
}
</style>