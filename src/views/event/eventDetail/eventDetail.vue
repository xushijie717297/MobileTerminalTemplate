<template>
  <div class="eventDetail">
    <p id="statusBar"></p>
    <div class="content">
      <!-- 头部标题 -->
      <van-nav-bar
        title="事件详情"
        left-text=""
        right-text="处置"
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
      />
      <div class="legend">
        <p class="iconfont icontuli2" @click="legendClick()"></p>
      </div>

      <div class="mapView" id="mapView"></div>
      <div class="operation" ref="operation">
        <div
          class="oper"
          @touchstart.capture="touchStart"
          @touchend.capture="touchEnd"
        >
          <van-tabs v-model="active" @click="onClick">
            <van-tab
              v-for="(item, index) in eventList"
              :key="index"
              :title="item.name"
            ></van-tab>
          </van-tabs>
        </div>
        <!-- 详情内容 -->
        <div class="tabContent">
          <eventChat v-show="tabValue == 0"></eventChat>
          <eventNews v-show="tabValue == 1"></eventNews>
        </div>
      </div>
    </div>
    <van-popup
      v-model="legendShow"
      position="right"
      get-container="#app"
      :style="{ width: '50%', height: '100%', background: '#fff' }"
    >
      <div class="legendPopup">
        <h3>图例</h3>
        <h4>监测点</h4>
        <div class="point">
          <p>
            <img src="../../../assets/img/controlImg/dw1.png" alt="" />
            <span>压力点</span>
          </p>
          <p>
            <img src="../../../assets/img/controlImg/dw2.png" alt="" />
            <span>流量点</span>
          </p>
          <p>
            <img src="../../../assets/img/controlImg/import.png" alt="" />
            <span>进口流量</span>
          </p>          
          <p>
            <img src="../../../assets/img/controlImg/export.png" alt="" />
            <span>出口流量</span>
          </p>
        </div>
        <div class="switch">
          <p>点位名称</p>
          <van-switch size="18" @change="PointsName()" v-model="checked" />
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import Vue from "vue";
import { NavBar, Tab, Tabs, Popup, Switch } from "vant";
Vue.use(Switch);
Vue.use(Popup);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(NavBar);
import { loadModules } from "esri-loader";
// import urlClass from "../../../components/js/UrlClass";
import tileInfo from "../../../components/js/tdt_data";
import global from "../../../components/js/Global";
import apiClass from "../../../components/js/apiClass";
import urlClass from "../../../components/js/UrlClass";
import eventChat from "./eventChat.vue";
import eventNews from "./eventNews.vue";
// import itemInfo from "./data.json";
import diffuseBubbles from "../../../components/js/DiffuseBubbles";
import popupTableWater from "../../../components/js/popupTableWater";
import popupTableWaterExit from "../../../components/js/popupTableWaterExit";
import config from "../../../components/json/config.json";
import dw1 from "../../../assets/img/controlImg/dw1.png";
import dw2 from "../../../assets/img/controlImg/dw2.png";
import tl1 from "../../../assets/img/controlImg/tl1.png";
import tl2 from "../../../assets/img/controlImg/tl2.png";
import impor from "../../../assets/img/controlImg/import.png";
import expor from "../../../assets/img/controlImg/export.png";
import event_yellowdot from "../../../assets/img/controlImg/event_yellowdot.png"
import event_orangedot from "../../../assets/img/controlImg/event_orangedot.png"
import event_reddot from "../../../assets/img/controlImg/event_reddot.png"
import Bus from "../../../utils/bus"
export default {
  name: "eventDetail",
  components: {
    eventChat,
    eventNews,
  },
  data() {
    return {
      startY: 0,
      endY: 0,
      eventList: [
        { name: "事件曲线", value: 0 },
        { name: "详细信息", value: 1 },
      ],
      tabValue: 0,
      active: 0,
      isActive: false,
      isLoadMap: false,
      legendShow: false,
      checked: false,
      glPoint: null,
      gl: null,
      exitPointLayer: null,
      featurePolygonLayerview: null,
      highlightHover: null,
      itemInfo: {},
      arcgisAPI: null,
      view: null,
      map: null,
      listData: [],
      lableData: [],
      graData: [],
      tempGra: [],
      exitPoints: [],
      chartsData: [],
    };
  },
  mounted() {
    // Bus.$on("eventData", (res) => {
    //   console.log(res)
    //   this.itemInfo = res
    // })
    this.itemInfo = JSON.parse(localStorage.getItem("item"));
    // console.log(this.$route.query.item)
    this.createMap();
  },
  methods: {
    legendClick() {
      this.legendShow = !this.legendShow;
    },
    PointsName() {
      // IsShowName
      // console.log(this.checked);
      this.isActive = this.checked
      this.IsShowName();
    },
    IsShowName() {
      if (this.isActive) {
        var tempData = [];
        // console.log(this.lableData)
        for (let i = 0; i < this.lableData.length; i++) {
          const obj = this.lableData[i];
          var tempObj = { Name: obj.name, Type: obj.type, X: obj.X, Y: obj.Y };
          tempData.push(tempObj);
        }
        if (tempData.length > 0) {
          popupTableWater.destroy();
          popupTableWater.loadPopup(tempData);
        }
        this.drwdExitPoints();
      } else {
        popupTableWater.destroy();
        if (popupTableWaterExit) {
          popupTableWaterExit.destroy();
        }
      }
    },
    onClick(name, title) {
      this.tabValue = name;
      console.log(name, title);
    },
    onClickLeft() {
      console.log("左边按钮");
      this.$router.push("/event")
    },
    onClickRight() {
      console.log("右边按钮");
    },
    touchStart(e) {
      this.startY = e.touches[0].clientY;
    },
    touchEnd(e) {
      this.endY = e.changedTouches[0].clientY;
      var moveY = this.endY - this.startY;
      // console.log(moveY);
      var positionB1 = 0;
      var positionB2 = -335;
      this.$refs.operation.style.transition = "bottom 0.6s";
      this.searchMove(moveY, positionB1, positionB2, this.$refs.operation);
    },
    searchMove(moveY, positionB1, positionB2, box) {
      if (moveY > 30) {
        this.$refs.operation.style.bottom = positionB2 + "px";
      } else if (moveY < 0) {
        this.$refs.operation.style.bottom = positionB1 + "px";
      }
    },
    GetAreaCoordinatesInfo() {
      var self = this;
      // console.log("GetAreaCoordinatesInfo:", this.itemInfo);
      // debugger
      if (this.itemInfo && this.itemInfo.Geometry) {
        var result = this.itemInfo.Geometry;
        console.log(result.GeoType,this.itemInfo.EventType)
        if (result.GeoType == "Point") {
          // console.log("+")
          if (this.itemInfo.EventType == "pipeburst") {
            this.listData.push({
              Level: this.itemInfo.Level,
              X: result.Geo.X,
              Y: result.Geo.Y,
            });
            self.drwdListPoints();
          } else {
            // console.log("--")
            diffuseBubbles.destroyByPopupName("eventMap");
            var _up = "P";
            if (
              this.itemInfo.EventType == "flow" ||
              this.itemInfo.EventType == "minflowatnight"
            ) {
              _up = "F";
            }
            // console.log(result.Geo)
            if (result.Geo != null) {
              diffuseBubbles.loadPopup([
                { id: 0, type: "red", up: _up, x: result.Geo.X, y: result.Geo.Y },
              ]);
            }
          }
          console.log(this.itemInfo.RegionGeo)
          this.getAreaData(this.itemInfo.RegionGeo);
        } else if (result.GeoType == "Polygon") {
          // console.log("Polygon");
          this.getAreaData(result);
        } else if (result.GeoType == "Special") {
          if (this.itemInfo.EventType == "pipeburst") {
            var locations = result.Geo.Locations;
            for (let i = 0; i < locations.length; i++) {
              var level = locations[i].Heat == 1 ? 3 : 2;
              this.listData.push({
                Level: level,
                X: locations[i].X,
                Y: locations[i].Y,
              });
            }
            self.drwdListPoints(this.listData);
          }
          var tempData = [];
          var warnFlows = result.Geo.WarnFlows;
          for (let i = 0; i < warnFlows.length; i++) {
            const warnFlow = warnFlows[i];
            tempData.push({
              name: warnFlow.StationName,
              type: "flow",
              X: warnFlow.X,
              Y: warnFlow.Y,
            });
          }
          var warnPressures = result.Geo.WarnPressures;
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
            // debugger
            self.loadLablePoints(tempData);
          }
          console.log(this.itemInfo.RegionGeo)
          this.getAreaData(this.itemInfo.RegionGeo);
        }
      }
    },
    drwdListPoints(listData) {
      console.log(listData)
    if (this.isLoadMap && listData.length > 0) {
      var tempData = [];
      this.glPoint.removeAll();
      for (let i = 0; i < listData.length; i++) {
        const obj = listData[i];
        let type = obj.Level;
        var symbol = { type: "picture-marker", url: event_yellowdot, width: '24px', height: '24px' };
        switch (obj.Level) {
          case 1:
            type = "blue";
            symbol = { type: "picture-marker", url: event_yellowdot, width: '24px', height: '24px' };
            break;
          case 2:
            type = "yellow";
            symbol = { type: "picture-marker", url: event_orangedot, width: '24px', height: '24px' };
            break;
          case 3:
            type = "red";
            symbol = { type: "picture-marker", url: event_reddot, width: '24px', height: '24px' };
            break;
        }
        if (obj.X && obj.Y) {
          var tempObj = { id: i, type: type, x: obj.X, y: obj.Y };
          tempData.push(tempObj);
          //画点
          var pt = new this.arcgisAPI.Point({ x: obj.X, y: obj.Y, spatialReference: this.view.spatialReference });
          // var markerSymbol = { type: "simple-marker", color: type, size: 6, outline: { color: [153, 153, 153, 0.7], width: 0.75 }};
          // var gra = new esriApi.Graphic({ geometry: pt, symbol: markerSymbol });
          var gra = new this.arcgisAPI.Graphic({ geometry: pt, symbol: symbol });
          this.glPoint.add(gra);
        }
      }
    }
  },
    loadLablePoints(_lableData) {
      this.lableData = _lableData;
      this.drwdLablePoints(_lableData);
    },
    drwdLablePoints(lableData) {
    if (this.isLoadMap && lableData.length > 0) {
      var tempData = [];
      this.gl.removeAll();
      var symbol = { type: "picture-marker", url: dw1, width: '30px', height: '30px' };
      for (let i = 0; i < lableData.length; i++) {
        const obj = lableData[i];
        switch (obj.type) {
          case "flow":
            symbol = { type: "picture-marker", url: dw2, width: '30px', height: '30px' };
            break;
          case "pressure":
            symbol = { type: "picture-marker", url: dw1, width: '30px', height: '30px' };
            break;
        }
        var tempObj = { Name: obj.name, Type: obj.type, X: obj.X, Y: obj.Y };
        tempData.push(tempObj);
        const point = { type: "point", x: obj.X, y: obj.Y, spatialReference: this.view.spatialReference };
        var gra = new this.arcgisAPI.Graphic({ geometry: point, symbol: symbol, attributes: obj });
        this.gl.add(gra);
      }
      if (this.isActive && tempData.length > 0) {
        popupTableWater.destroy();
        popupTableWater.loadPopup(tempData);
      }
    }
  },
    getAreaData(result) {
      var areaList = [];
      if (result.GeoType == "Polygon") {
        var tempList = result.Geo;
        for (let i = 0; i < tempList.length; i++) {
          const item = tempList[i];
          var rings = [];
          for (let j = 0; j < item.Coordiantes.length; j++) {
            const element = item.Coordiantes[j];
            rings.push([element.X, element.Y]);
          }
          rings = config.mapDataReversal ? rings.reverse() : rings;
          var obj = {
            OTITLE: item.Label,
            Color: item.Color ? item.Color : "rgba(66, 163, 239,0.1)",
            BorderColor: item.BorderColor
              ? item.BorderColor
              : "rgb(220,220,220)",
            BorderWidth: 1 + "px",
            rings: rings,
          };
          areaList.push(obj);
        }
        this.createFeatureLayer(areaList);
      }
    },
    createFeatureLayer(dataList) {
      console.log("dataList:", dataList);
      var tempLayer = this.map.findLayerById("featurePolygon");
      if (tempLayer) {
        this.map.remove(tempLayer);
      }
      this.graData = [];
      var rings = [];
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
          var textSymbol = {
            type: "text",
            text: element.EventNumber,
            color: "#2f4554",
            font: {
              family: "Merriweather",
              size: 12,
              style: "italic",
              weight: "bold",
            },
          };
          const gra1 = new this.arcgisAPI.Graphic({
            geometry: poly.extent.center,
            symbol: textSymbol,
          });
          this.gl.add(gra1);
        }
        this.view.extent = poly.extent;
        this.view.zoom--;
        //渲染分级随机颜色
        uniqueValueInfos.push({
          value: element.OTITLE,
          symbol: {
            type: "simple-fill",
            color: element.Color,
            outline: { color: element.BorderColor, width: element.BorderWidth },
          },
        });
      }
      // console.log("uniqueValueInfos:", uniqueValueInfos);
      // const tempPoly = new esriApi.Polygon({rings: rings, spatialReference: view.spatialReference});
      // var point = tempPoly.extent.center;
      // view.center = point;
      // view.zoom --;
      var featurePolygon = new this.arcgisAPI.FeatureLayer({
        id: "featurePolygon",
        source: this.graData,
        fields: [
          { name: "ObjectID", alias: "ObjectID", type: "oid" },
          { name: "OTITLE", alias: "OTITLE", type: "string" },
          // { name: "Level1Number", alias: "Level1Number", type: "string" },
          // { name: "Level2Number", alias: "Level2Number", type: "string" },
          // { name: "Level3Number", alias: "Level3Number", type: "string" }
        ],
        objectIdField: "ObjectID",
        geometryType: "polygon",
        renderer: {
          type: "unique-value",
          field: "OTITLE",
          uniqueValueInfos: uniqueValueInfos,
        },
      });
      this.map.addMany([featurePolygon], 2);
      var self = this;
      this.view.whenLayerView(featurePolygon).then(self.setupHoverTooltip);
    },
    setupHoverTooltip(layerview) {
      //高亮
      // console.log(this.itemInfo);
      this.featurePolygonLayerview = layerview;
      if (this.itemInfo && this.itemInfo.RegionGeo.Geo[0].Label) {
        this.HighlightHoverByLabel(this.itemInfo.RegionGeo.Geo[0].Label);
      }
      var highlight;
      var self = this;
      var tooltip = this.createTooltip();
      var hitTest = this.arcgisAPI.promiseUtils.debounce(function (event) {
        return self.view.hitTest(event).then(function (hit) {
          var results = hit.results.filter(function (result) {
            return (
              result.graphic.layer === self.gl ||
              result.graphic.layer === self.exitPointLayer
            );
          });
          if (self.isActive || !results.length) {
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
              var screenPoint = hit.screenPoint;
              highlight = layerview.highlight(graphic);
              tooltip.show(screenPoint, graphic.attributes);
            } else {
              tooltip.hide();
            }
          },
          function () {}
        );
      });
    },
    createTooltip() {
      var tooltip = document.createElement("div");
      var style = tooltip.style;
      tooltip.setAttribute("role", "tooltip");
      tooltip.classList.add("tooltip");
      var textElement = document.createElement("div");
      textElement.classList.add("esri-widget");
      tooltip.appendChild(textElement);
      this.view.container.appendChild(tooltip);
      var x = 0;
      var y = 0;
      var targetX = 0;
      var targetY = 0;
      var visible = false;
      function move() {
        x += (targetX - x) * 0.1;
        y += (targetY - y) * 0.1;
        if (Math.abs(targetX - x) < 1 && Math.abs(targetY - y) < 1) {
          x = targetX;
          y = targetY;
        } else {
          requestAnimationFrame(move);
        }
        style.transform =
          "translate3d(" + Math.round(x) + "px," + Math.round(y) + "px, 0)";
      }
      return {
        show: function (point, obj) {
          if (!visible) {
            x = point.x;
            y = point.y;
          }
          targetX = point.x;
          targetY = point.y;
          style.opacity = 1;
          visible = true;
          textElement.innerHTML = obj.name;
          // textElement.innerHTML = obj.OTITLE;
          // textElement.innerHTML = "<b>" + obj.OTITLE + "</b><br/>1级：" + obj.Level1Number + "<br/>2级：" + obj.Level2Number + "<br/>3级：" + obj.Level3Number;
          move();
        },
        hide: function () {
          style.opacity = 0;
          visible = false;
        },
      };
    },
    HighlightHoverByLabel(label) {
      if (this.highlightHover) {
        this.highlightHover.remove();
      }
      if (this.featurePolygonLayerview && label != "") {
        for (let i = 0; i < this.graData.length; i++) {
          const gra = this.graData[i];
          const item = gra.attributes;
          if (item.OTITLE == label) {
            // console.log("item:", item);
            this.tempGra = gra;
            this.highlightHover = this.featurePolygonLayerview.highlight(gra);
            this.view.center = gra.geometry.extent.center;
            break;
          }
        }
      }
    },
    async GetMinFlowAlarmAtNightEventTagNumberInfoList() {
      let res = {
        EventId: this.itemInfo.EventId,
        Date: this.$moment(this.itemInfo.EndTime)
          .add(1, "days")
          .format("YYYY-MM-DD"),
        PageNo: 1,
        PageSize: 99,
      };
      this.$axios
        .post(
          urlClass.DetectWise + "GetMinFlowAlarmAtNightEventTagNumberInfoList",
          JSON.stringify(res)
        )
        .then((Response) => {
          console.log(
            "GetMinFlowAlarmAtNightEventTagNumberInfoList:",
            this.chartsData
          );
          this.chartsData = Response.data.Result.TagNumberList;
          this.exitPointData = [];
          this.chartsData.forEach((element) => {
            if (element.X && element.Y) {
              let _type = "pressure";
              if (element.DataType) {
                if (String(element.DataType).toLowerCase() == "p") {
                  _type = "pressure";
                } else if (String(element.DataType).toLowerCase() == "f") {
                  _type = "flow";
                }
              } else {
                if (String(element.MonitoringPointName).indexOf("进口") > -1) {
                  _type = "import";
                } else {
                  _type = "export";
                }
              }
              this.exitPointData.push({
                name: element.MonitoringPointName,
                type: _type,
                X: element.X,
                Y: element.Y,
              });
            }
          });
           localStorage.setItem('chartsData', JSON.stringify(this.chartsData));
           console.log(this.exitPointData)
           console.log("路过")
          this.drwdExitPoints();
        });
    },
    GetPipeBurstEventTagNumberInfoList() {
      let params = {
        EventId: this.itemInfo.EventId,
        Date: this.itemInfo.BeginTime,
        PageNo: 1,
        PageSize: 99,
      };
      this.$axios
        .post(
          urlClass.DetectWise + "GetPipeBurstEventTagNumberInfoList",
          JSON.stringify(params)
        )
        .then((Response) => {
          this.chartsData = Response.data.Result.TagNumberList;
          console.log("GetPipeBurstEventTagNumberInfoList:", this.chartsData);
          let exitPointData = [];
          this.chartsData.forEach((element) => {
            if (element.X && element.Y) {
              let _type = "pressure";
              if (element.DataType) {
                if (String(element.DataType).toLowerCase() == "p") {
                  _type = "pressure";
                } else if (String(element.DataType).toLowerCase() == "f") {
                  _type = "flow";
                }
              } else {
                if (String(element.MonitoringPointName).indexOf("进口") > -1) {
                  _type = "import";
                } else {
                  _type = "export";
                }
              }
              exitPointData.push({
                name: element.MonitoringPointName,
                type: _type,
                X: element.X,
                Y: element.Y,
              });
            }
          });
          localStorage.setItem('chartsData', JSON.stringify(this.chartsData));
          this.drwdExitPoints();
        });
    },
    GetRelativeEquipmentEventInfoList() {
      console.log("2343")
      let params = {
        EventId: this.itemInfo.EventId,
        Date: this.itemInfo.BeginTime,
        PageNo: 1,
        PageSize: 5,
      };
      this.$axios
        .post(
          urlClass.DetectWise + "GetRelativeEquipmentEventInfoList",
          JSON.stringify(params)
        )
        .then((Response) => {
          this.chartsData = Response.data.Result.MonitoringPointList;
          console.log("GetPipeBurstEventTagNumberInfoList:", Response.data.Result);
          let relationData = [];
          let DataInList = Response.data.Result.PipeBurstEventInfo.DataInList;
          let LimitUpDownList =
            Response.data.Result.PipeBurstEventInfo.LimitUpDownList;
          DataInList.forEach((item, idx) => {
            relationData.push({
              Vlaue: item.Value,
              Time: item.Time,
              Sx: LimitUpDownList[idx].Temperature[1],
              Xx: LimitUpDownList[idx].Temperature[0],
            });
          });
          this.chartsData.unshift({
            ChartData: relationData,
            MonitoringPointName:
              Response.data.Result.PipeBurstEventInfo.PartitionName,
          });
          this.exitPointData = [];
          this.chartsData.forEach((element) => {
            if (element.X && element.Y) {
              let _type = "pressure";
              if (element.DataType) {
                if (String(element.DataType).toLowerCase() == "p") {
                  _type = "pressure";
                } else if (String(element.DataType).toLowerCase() == "f") {
                  _type = "flow";
                }
              } else {
                _type = this.itemInfo.EventType;
              }
              this.exitPointData.push({
                name: element.MonitoringPointName,
                type: _type,
                X: element.X,
                Y: element.Y,
              });
            }
          });
          console.log(this.chartsData)
          localStorage.setItem('chartsData', JSON.stringify(this.chartsData));
          this.drwdExitPoints();
        });
    },
        GetInterestingPoints() {
      let res = {
        EventName: this.itemInfo.EventName,
        BeginTime: this.itemInfo.BeginTime,
        EndTime: this.itemInfo.EndTime,
        ContinueTime: this.itemInfo.ContinueTime,
        EventState: this.itemInfo.EventState,
        EventType: this.itemInfo.EventType,
        EventDetailType: this.itemInfo.EventDetailType,
        Region: this.itemInfo.Region,
        Level: this.itemInfo.Level,
        EventId: this.itemInfo.EventId,
        Value: this.itemInfo.Value,
        Geometry: this.itemInfo.Geometry,
        ChartData: this.itemInfo.ChartData,
        RegionGeo: this.itemInfo.RegionGeo,
      };
      this.$axios
        .post(
          urlClass.DetectWise + "GetEventRelationPoints",
          JSON.stringify(res)
        )
        .then((e) => {
          var eventList = e.data.Result;
          var chartsData = [];
          for (let i = 0; i < eventList.length; i++) {
            const element = eventList[i];
            const _chartData = eventList[i].ChartData;
            const obj = {
              today_data: [],
              limit_up: [],
              limit_down: [],
              time: [],
              index: i,
              MaxValue: element.MaxValue,
              MinValue: element.MinValue,
              StationName: element.StationName,
            };
            for (let j = 0; j < _chartData.length; j++) {
              const item = _chartData[j];
              obj.today_data.push(item.Vlaue);
              obj.limit_up.push(item.Sx);
              obj.limit_down.push(item.Xx);
              obj.time.push(item.Time);
            }
            chartsData.push(obj);
          }
          this.chartsData = chartsData;
        });
    },
    GetRelativeSingleIntervalAlarmEventInfoList(typeval) {
      console.log(this.itemInfo.EventId)
      let params = {
        EventId: this.itemInfo.EventId,
        Date: this.itemInfo.BeginTime,
        Type: typeval,
        PageNo: 1,
        PageSize: 5,
      };
      this.$axios
        .post(
          urlClass.DetectWise + "GetRelativeSingleIntervalAlarmEventInfoList",
          JSON.stringify(params)
        )
        .then((Response) => {
          console.log(Response.data.Result.MonitoringPointList)
          // debugger
          this.chartsData = Response.data.Result.MonitoringPointList;
          localStorage.setItem('chartsData', JSON.stringify(this.chartsData));
          let relationData = [];
          if (Response.data.Result.PipeBurstEventInfo) {
            var DataInList = Response.data.Result.PipeBurstEventInfo.DataInList;
          }
          let LimitUpDownList =
            Response.data.Result.PipeBurstEventInfo.LimitUpDownList;
          if (DataInList) {
            DataInList.forEach((item, idx) => {
              relationData.push({
                Vlaue: item.Value,
                Time: item.Time,
                Sx: LimitUpDownList[idx].Temperature[1],
                Xx: LimitUpDownList[idx].Temperature[0],
              });
            });
            this.chartsData.unshift({
              ChartData: relationData,
              MonitoringPointName:
                Response.data.Result.PipeBurstEventInfo.PartitionName,
            })
          }
          console.log("relationData", this.chartsData);
          this.exitPointData = [];
          this.chartsData.forEach((element) => {
            if (element.X && element.Y) {
              let _type = "pressure";
              if (element.DataType) {
                if (String(element.DataType).toLowerCase() == "p") {
                  _type = "pressure";
                } else if (String(element.DataType).toLowerCase() == "f") {
                  _type = "flow";
                }
              } else {
                _type = this.itemInfo.EventType;
              }
              this.exitPointData.push({
                name: element.MonitoringPointName,
                type: _type,
                X: element.X,
                Y: element.Y,
              });
            }
          });
          Bus.$emit("chartsData", this.chartsData);
          console.log(this.exitPointData)
          localStorage.setItem('chartsData', JSON.stringify(this.chartsData));
          this.drwdExitPoints();
        });
    },
    drwdExitPoints() {
      console.log(this.exitPointData);
      if (this.exitPointLayer) {
        this.exitPointLayer.removeAll();
      }
      if (popupTableWaterExit) {
        popupTableWaterExit.destroy();
      }
      if (this.isLoadMap && this.exitPointData.length > 0) {
        var tempData = [];
        for (let i = 0; i < this.exitPointData.length; i++) {
          const obj = this.exitPointData[i];
          var symbol = {
            type: "picture-marker",
            url: impor,
            width: "30px",
            height: "30px",
          };
          if (obj.type == "import") {
            symbol = {
              type: "picture-marker",
              url: impor,
              width: "30px",
              height: "30px",
            };
          } else if (obj.type == "export") {
            symbol = {
              type: "picture-marker",
              url: expor,
              width: "30px",
              height: "30px",
            };
          } else if (obj.type == "pressure") {
            symbol = {
              type: "picture-marker",
              url: tl1,
              width: "30px",
              height: "30px",
            };
          } else if (obj.type == "flow") {
            symbol = {
              type: "picture-marker",
              url: tl2,
              width: "30px",
              height: "30px",
            };
          }
          if (obj.X && obj.Y) {
            let _type = "flow";
            if (obj.type == "pressure") {
              _type = "pressure";
            }
            var tempObj = { Name: obj.name, Type: _type, X: obj.X, Y: obj.Y };
            tempData.push(tempObj);
            //画点
            var pt = new this.arcgisAPI.Point({
              x: obj.X,
              y: obj.Y,
              spatialReference: this.view.spatialReference,
            });
            var gra = new this.arcgisAPI.Graphic({
              geometry: pt,
              symbol: symbol,
              attributes: obj,
            });
            this.exitPointLayer.add(gra);
            // console.log(this.exitPointLayer)
          }
        }
        // console.log(this.isActive)
        // this.isActive = true
        if (this.isActive && tempData.length > 0) {
          popupTableWaterExit.destroy();
          popupTableWaterExit.loadPopup(tempData);
        }
      }
    },
    judgeEquipment(type) {
      if (type == "offline" || type == "stop" || type == "overrun") {
        return true;
      }
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
          this.map = map;
          this.viewMap = map; //外部使用
          var wtl_tileInfo = new TileInfo(tileInfoTemp);
          let webTileMap = new WebTileLayer(apiClass.googleMapUrl1, {
            tileInfo: wtl_tileInfo,
          });
          map.add(webTileMap);
          // var self = this;
          var initExtent = new Extent(
            global.initExtent.minX,
            global.initExtent.minY,
            global.initExtent.maxX,
            global.initExtent.maxY,
            new SpatialReference({ wkid: global.spatialReference })
          );
          var view = (this.view = new MapView({
            container: "mapView",
            map: map,
            extent: initExtent,
            spatialReference: new SpatialReference({
              wkid: global.spatialReference,
            }),
          }));
          //初始化
         
         
          this.exitPointLayer = new GraphicsLayer();
          map.add(this.exitPointLayer);
          this.gl = new GraphicsLayer();
          map.add(this.gl);
          this.glPoint = new GraphicsLayer();
          map.add(this.glPoint);
          this.view.ui._removeComponents(["attribution", "zoom"]);
          this.view.popup.actions = null;
          // console.log(this.itemInfo)
          var self = this;
          view.on("click", function (e) {});
          view.when(
            function (e) {
              console.log("map加载完成！");
              self.isLoadMap = true;
              diffuseBubbles.initPopupEvent(view, "eventMap");
              popupTableWater.initPopupEvent(
                view,
                view.spatialReference,
                "jcdPopup"
              );
              popupTableWaterExit.initPopupEvent(
                view,
                view.spatialReference,
                "exitPopup"
              );
              // console.log(1017)  
              self.GetAreaCoordinatesInfo();
              console.log(self.itemInfo.EventType)
              if (self.itemInfo.EventType == "minflowatnight") {
                console.log(1111111111)
                self.GetMinFlowAlarmAtNightEventTagNumberInfoList();
              }else if(self.itemInfo.EventType == "pipeburst"){
                self.GetPipeBurstEventTagNumberInfoList();
              }else if(self.itemInfo.EventType == "flow" || self.itemInfo.EventType == "pressure"){
                self.GetRelativeSingleIntervalAlarmEventInfoList(self.itemInfo.EventType);
              }else if (self.judgeEquipment(self.itemInfo.EventType)) {
                self.GetRelativeEquipmentEventInfoList();
              } else {
                self.GetInterestingPoints();
              }
              
            },
            function (error) {
              console.log("The view's resources failed to load: ", error);
            }
          );
        }
      );
    },
  },
  //   beforeDestroy() {
  //   if (this.view) {
  //     // destroy the map view
  //     this.view.container = null;
  //   }
  // },
};
</script>
<style lang="less" scoped>
@import "./eventDetail.less";
@import "../../../assets/css/popup.less";
</style>