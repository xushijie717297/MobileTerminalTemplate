<template>
  <div class="eventItem">
    <p id="statusBar"></p>
    <div class="main">
      <van-nav-bar :title="title" left-arrow @click-left="onClickLeft" />
      <div class="content">
        <h3>数据曲线</h3>
        <partitionEcharts
          :id="'partition'"
          :PartitionId="activeName"
          :echartstype="PartitionData.type"
        />
        <h3>关联曲线</h3>
                  <div class="relation">
            <div class="echartsline_body" v-if="chartsData.length > 0">
              <div class="swiper-container">
                <swiper
                  ref="mySwiper"
                  class="swiper-wrapper"
                  :options="swiperOption"
                >
                  <swiper-slide
                    v-for="(item, index) in chartsData"
                    :key="index"
                  >
                    <div class="swiper_div">
                      <DataEventTagNumberEchart
                        v-if="PartitionData.type === 'Partition'"
                        :itemInfo="item"
                      />
                      <RelativeSingleEcharts
                        v-else
                        :id="item.MonitoringPointName"
                        :itemInfo="item"
                      />
                    </div>
                    <div
                      class="slidename"
                      :class="{
                        activeborderbgStyle: activebgClickswiperIndex === index,
                      }"
                    >
                      {{ item.MonitoringPointName }}
                    </div>
                  </swiper-slide>
                </swiper>
                <div
                  class="swiper-button-prev"
                  v-show="chartsData.length > 4"
                ></div>
                <div
                  class="swiper-button-next"
                  v-show="chartsData.length > 4"
                ></div>
              </div>
            </div>
            <div
              class="echartsline_body"
              style="
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: 10%;
              "
              v-else
            >
              暂 无 相 关 曲 线
            </div>
          </div>
        <h3>全天有效数据统计</h3>
        <EffectiveEcharts />
        <!--  <RelativeSingleEcharts
          v-else
          :id="item.MonitoringPointName"
          :itemInfo="item"
        /> -->
        <h3>详细信息</h3>
        <div class="mapView">
          <div class="mapViews" id="mapViews"></div>
        </div>
        <div v-if="PartitionData.type == ''">
          <div class="cell">
          <p>表名称</p>
          <span>{{LastMileData.MonitoringPointName}}</span>
        </div>
        <div class="cell">
          <p>类型</p>
          <span>{{ LastMileData.DataType }}</span>
        </div>
        <div class="cell">
          <p>分区</p>
          <span>{{ LastMileData.PartitionName }}</span>
        </div>
        <div class="cell">
          <p>坐标</p>
          <span>{{ LastMileData.X }} , {{ LastMileData.Y }}</span>
        </div>
        <div class="cell">
          <p>瞬时位号</p>
          <span>{{LastMileData.PositiveMomentDirection}}</span>
        </div>
        <div class="cell">
          <p>累计位号</p>
          <span>{{LastMileData.ReverseMomentDirection}}</span>
        </div>
        <div class="cell">
          <p>实时数据</p>
          <span>{{ LastMileData.Data }}</span>
        </div>
        </div>
        <div v-else>
            <div class="cell">
          <p>分区</p>
          <span>{{PartitionData.PartitionName}}</span>
        </div>
        <div class="cell">
          <p>实时数据</p>
          <span>{{ PartitionData.Data }}</span>
        </div>
        </div>
      </div>
    </div>
    <!-- <van-popup v-model="popupShow" :close-on-click-overlay="false" get-container="#app"> -->
    <van-popup v-model="popupShow" get-container="#app">
      <van-loading type="spinner" color="#1989fa" size="24" />
    </van-popup>
  </div>
</template>

<script>
import Vue from "vue";
import { NavBar, Popup, Loading} from "vant";

Vue.use(Loading);
Vue.use(Popup);
Vue.use(NavBar);
import urlClass from "../../../components/js/UrlClass";
import Bus from "../../../utils/bus";
import apiClass from "../../../components/js/apiClass";
import tileInfo from "../../../components/js/tdt_data";
import global from "../../../components/js/Global"
import config from "../../../components/json/config.json"
import popupTableWaterExit from "../../../components/js/popupTableWaterExit"
import popupTableWater from "../../../components/js/popupTableWater"
import { loadModules } from "esri-loader";
import EffectiveEcharts from "./EffectiveEcharts";
import partitionEcharts from "./partitionEcharts";
import RelativeSingleEcharts from "./RelativeSingleEcharts";
import DataEventTagNumberEchart from "./DataEventTagNumberEchart";
import impor from "../../../assets/img/controlImg/import.png"
import expor from "../../../assets/img/controlImg/export.png"
import tl1 from "../../../assets/img/controlImg/tl1.png"
import tl2 from "../../../assets/img/controlImg/tl2.png"
export default {
  components: {
    EffectiveEcharts,
    partitionEcharts,
    RelativeSingleEcharts,
    DataEventTagNumberEchart,
  },
  data() {
    return {
      popupShow:true,
      title: "",
      PartitionData: {},
      activeName: "",
      LastMileData: [],
      chartsData: [],
      DrawingData:[],
      item:[],
      arcgisAPI:null,
      view:null,
      isLoadMap:false,
      exitPoints:null,
      activebgClickswiperIndex:null,
      swiperOption: {
        // effect: "fadeOut",
        slidesPerView: 3,
        spaceBetween: 10,
        loopAdditionalSlides: 0,
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        loop: false,
        //  speed: 20000,
        autoplay: false,
        preventClicks: false,
        simulateTouch: true, //鼠标拖到swiper无效
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      },
    };
  },
  mounted() {
    console.log(this.$route.query);
    this.item = this.$route.query.item;
    console.log(this.item)
    if ("MonitoringPointName" in this.item) {
      this.title = this.$route.query.item.MonitoringPointName;
      this.PartitionData.type = "";
      this.activeName = this.$route.query.item.MonitoringPointId;
      this.GetMonitoringPointDataInfo(this.activeName);
    }else{
        this.activeName = this.item.PartitionId;
        this.PartitionData.type = "Partition";
        this.GetPartitionDataInfo();
        this.title = this.$route.query.item.PartitionName;
    }
  },
  methods: {
    onClickLeft() {
      this.$router.push("/event");
    },
    GetPartitionDataInfo() {
      let params = {
        PartitionId: this.activeName,
        Date: this.initializationTime(),
        /* Date: this.$moment()
          .subtract(45, "minutes")
          .format("YYYY-MM-DD HH:mm:ss"), //往前推45分钟  取整点00 15 30 45 */
      };
      this.$axios
        .post(urlClass.DetectWise + "GetPartitionDataInfo", params)
        .then((Response) => {
          Response.data.Result.type = "Partition";
          this.PartitionData = Response.data.Result;
          Bus.$emit("EquipmentList", this.PartitionData.EquipmentList);
          this.GetRelativePartitionDataInfoList();
        });
    },
    GetMonitoringPointDataInfo(id) {
      let params = {
        MonitoringPointId: id,
        DataTypeId: "1",
        Date: this.$moment()
          .subtract(45, "minutes")
          .format("YYYY-MM-DD HH:mm:ss"),
      };
      this.$axios
        .post(urlClass.DetectWise + "GetMonitoringPointDataInfo", params)
        .then((Response) => {

          this.LastMileData = Response.data.Result;
          if (this.LastMileData) {
            this.popupShow = false
          }
          Bus.$emit("EquipmentList", this.LastMileData.EquipmentList);
          this.GetRelativeMonitoringPointDataInfoList(id);
        });
    },
    GetRelativePartitionDataInfoList() {
      let params = {
        PartitionId: this.activeName,
        Date: "2021-05-24",
        PageNo: 1,
        PageSize: 5,
      };
      this.$axios
        .post(urlClass.DetectWise + "GetRelativePartitionDataInfoList", params)
        .then((Response) => {
          console.log(Response.data.Result)
          this.chartsData = Response.data.Result.TagNumberList;
          this.DrawingData = {
            PartitionName: this.PartitionData.PartitionName,
            RegionCoordiantes: this.PartitionData.RegionCoordiantes,
            TagNumberList: this.chartsData,
          };
          console.log(this.DrawingData)
          //地图初始化
          this.createMap()
        });
    },
    GetRelativeMonitoringPointDataInfoList(id) {
      let params = {
        MonitoringPointId: id,
        Date: "2021-05-24",
        DataTypeId: "1",
        PageNo: 1,
        PageSize: 5,
      };
      this.$axios
        .post(
          urlClass.DetectWise + "GetRelativeMonitoringPointDataInfoList",
          params
        )
        .then((Response) => {
          console.log(Response.data.Result)
          this.chartsData = Response.data.Result.MonitoringPointList;
          this.DrawingData = {
            PartitionName: this.LastMileData.PartitionName,
            RegionCoordiantes: this.LastMileData.RegionCoordiantes,
            TagNumberList: this.chartsData,
          };
          console.log(this.DrawingData)
          //地图初始化
          this.createMap()
        });
    },
    initializationTime() {
      let date = this.$moment()
        .subtract(45, "minutes")
        .format("YYYY-MM-DD HH:mm:ss")
        .split(":");
      let mm = "";
      if (date[1] >= 0 && date[1] <= 10) {
        mm = "00"
      }else if(date[1] >= 10 && date[1] <= 20){
        mm = "15"
      }else if(date[1] >= 20 && date[1] <= 30){
        mm = "30"
      }else if(date[1] >= 30 && date[1] <= 45){
        mm = "45"
      }else if(date[1] >= 45 && date[1] <= 60){
        mm = "45"
      }
      return date[0]+ ":" + mm + ":" + "00"
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
          var wtl_tileInfo = new TileInfo(tileInfoTemp);
          let webTileMap = new WebTileLayer(apiClass.googleMapUrl1, {
            tileInfo: wtl_tileInfo,
          });
          map.add(webTileMap);
          var initExtent = new Extent(
            global.initExtent.minX,
            global.initExtent.minY,
            global.initExtent.maxX,
            global.initExtent.maxY,
            new SpatialReference({ wkid: global.spatialReference })
          );
          var view = (this.view = new MapView({
            container: "mapViews",
            map: map,
            extent: initExtent,
            spatialReference: new SpatialReference({
              wkid: global.spatialReference,
            }),
          }));
          //初始化
            var glPoint  = new GraphicsLayer();
            map.add(glPoint);
            var gl  = new GraphicsLayer();
            map.add(gl);
            var exitPointLayer = new GraphicsLayer();
            map.add(exitPointLayer);
          this.view.ui._removeComponents(["attribution", "zoom"]);
          this.view.popup.actions = null;
          // console.log(this.itemInfo)
          var self = this;
          var graData = [];
          var tempGra;
          var highlightHover;
          var featurePolygonLayerview;
          view.on("click", function (e) {});
          view.when(
            function (e) {
              console.log("map加载完成！");
              popupTableWater.initPopupEvent(view, view.spatialReference, "jcdPopup_list");
              popupTableWaterExit.initPopupEvent(view, view.spatialReference, "exitPopup_list");
              self.isLoadMap = true;
              GetAreaCoordinatesInfo();
            },
            function (error) {
              console.log("The view's resources failed to load: ", error);
            }
          );
          function GetAreaCoordinatesInfo() {
            if (self.DrawingData) {
              if (self.DrawingData.RegionCoordiantes) {
                getAreaData(self.DrawingData.RegionCoordiantes, self.DrawingData.PartitionName);
              }
              if (self.DrawingData.TagNumberList) {
                let exitPointData = [];
                for (let i = 0; i < self.DrawingData.TagNumberList.length; i++) {
                  const element = self.DrawingData.TagNumberList[i];
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
                    exitPointData.push({name: element.MonitoringPointName, type: _type, X: element.X, Y: element.Y});
                  }
                }
                if (exitPointData.length > 0) {
                  loadExitPoints(exitPointData);
                }
              }
            }
          }
          function loadExitPoints(_exitPoints) {
              self.exitPoints = _exitPoints;
              drwdExitPoints();
          }
          function drwdExitPoints() {
            if (exitPointLayer) {
              exitPointLayer.removeAll();
            }
            // if (popupTableWaterExit) {
            //   popupTableWaterExit.destroy();
            // }
            if (self.isLoadMap && self.exitPoints.length > 0) {
              var tempData = [];
              for (let i = 0; i < self.exitPoints.length; i++) {
                const obj = self.exitPoints[i];
                var symbol = { type: "picture-marker", url: impor, width: '30px', height: '30px' };
                if(obj.type == "import"){
                  symbol = { type: "picture-marker", url: impor, width: '30px', height: '30px' };
                } else if(obj.type == "export") {
                  symbol = { type: "picture-marker", url: expor, width: '30px', height: '30px' };
                } else if(obj.type == "pressure") {
                  symbol = { type: "picture-marker", url: tl1, width: '30px', height: '30px' };
                } else if(obj.type == "flow") {
                  symbol = { type: "picture-marker", url: tl2, width: '30px', height: '30px' };
                }
                if (obj.X && obj.Y) {
                  let _type = "flow";
                  if(obj.type == "pressure"){
                    _type = "pressure";
                  }
                  var tempObj = { Name: obj.name, Type: _type, X: obj.X, Y: obj.Y };
                  tempData.push(tempObj);
                  //画点
                  var pt = new Point({x: obj.X, y: obj.Y, spatialReference: view.spatialReference});
                  var gra = new Graphic({ geometry: pt, symbol: symbol, attributes: obj });
                  exitPointLayer.add(gra);
                }
              }
              // if (tempData.length > 0) {
              //   popupTableWaterExit.destroy();
              //   popupTableWaterExit.loadPopup(tempData);
              // }
            }
          }
          function getAreaData(result, partitionName) {
            var areaList = [];
            var rings = [];
            for (let j = 0; j < result.length; j++) {
              const element = result[j];
              rings.push([element.X,element.Y]);
            }
            if (rings.length > 0) {
              rings = config.mapDataReversal ? rings.reverse() : rings;
              var obj = {OTITLE: partitionName, Color: "rgba(66, 163, 239,0.1)", BorderColor: "rgb(220,220,220)", BorderWidth: (1 + "px"), rings: rings};
              areaList.push(obj);
              createFeatureLayer(areaList);
            }
          }
          function createFeatureLayer(dataList) {
            // console.log("dataList:", dataList);
            var tempLayer = map.findLayerById("featurePolygon");
            if (tempLayer) {
              map.remove(tempLayer);
            }
            graData = [];
            var rings = [];
            let uniqueValueInfos = [];
            for (let i = 0; i < dataList.length; i++) {
              const element = dataList[i];
              rings.push(element.rings);
              const poly = new Polygon({ rings: element.rings, spatialReference: view.spatialReference });
              const gra = new Graphic({ geometry: poly, attributes: element });
              graData.push(gra);
              view.extent = poly.extent;
              view.zoom --;
              //渲染分级随机颜色
              uniqueValueInfos.push({ value: element.OTITLE, symbol: { type: "simple-fill", color: element.Color, outline: { color: element.BorderColor, width: element.BorderWidth } } });
            }
            // console.log("uniqueValueInfos:", uniqueValueInfos);
            // const tempPoly = new esriApi.Polygon({rings: rings, spatialReference: view.spatialReference});
            // var point = tempPoly.extent.center;
            // view.center = point;
            // view.zoom --;
            var featurePolygon = new FeatureLayer({
              id: "featurePolygon",
              source: graData,
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
                uniqueValueInfos: uniqueValueInfos
              }
            });
            map.addMany([featurePolygon], 2);
            view.whenLayerView(featurePolygon).then(setupHoverTooltip);
          }
          function setupHoverTooltip(layerview) {
            featurePolygonLayerview = layerview;
            if (self.DrawingData && self.DrawingData.PartitionName) {
              HighlightHoverByLabel(self.DrawingData.PartitionName);
            }
            var highlight;
            var tooltip = createTooltip();
            var hitTest = self.arcgisAPI.promiseUtils.debounce(function (event) {
              return view.hitTest(event).then(function (hit) {
                // var results = hit.results.filter(function (result) {
                //   return result.graphic.layer === layerview.layer;
                // });
                var results = hit.results.filter(function (result) {
                  return (result.graphic.layer === gl || result.graphic.layer === exitPointLayer);
                });
                if (!results.length) {
                  return null;
                }
                return {
                  graphic: results[0].graphic,
                  screenPoint: hit.screenPoint
                };
              });
            });
            view.on("pointer-move", function (event) {
              return hitTest(event).then(
                function (hit) {
                  if (highlight) {
                    highlight.remove();
                    highlight = null;
                    if(tempGra){
                      layerview.highlight(tempGra);
                    }
                  }
                  if (hit) {
                    var graphic = hit.graphic;
                    var screenPoint = hit.screenPoint;
                    highlight = layerview.highlight(graphic);
                    tooltip.show(
                      screenPoint, graphic.attributes
                    );
                  } else {
                    tooltip.hide();
                  }
                },
                function () { }
              );
            });
          }
          function HighlightHoverByLabel(label) {
            if (highlightHover) {
              highlightHover.remove();
            }
            if (featurePolygonLayerview && label != "") {
              for (let i = 0; i < graData.length; i++) {
                const gra = graData[i];
                const item = gra.attributes;
                if (item.OTITLE == label) {
                  // console.log("item:", item);
                  tempGra = gra;
                  highlightHover = featurePolygonLayerview.highlight(gra);
                  view.center = gra.geometry.extent.center;
                  break;
                }
              }
            }
          }
          function createTooltip() {
            var tooltip = document.createElement("div");
            var style = tooltip.style;
            tooltip.setAttribute("role", "tooltip");
            tooltip.classList.add("tooltip");
            var textElement = document.createElement("div");
            textElement.classList.add("esri-widget");
            tooltip.appendChild(textElement);
            view.container.appendChild(tooltip);
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
              }
            };
          }
        }
      );
    },
  },
  beforeDestroy() {
    if (this.view) {
      // destroy the map view
      this.view.container = null;
    }
  },
};
</script>

<style lang="less" scoped>
.eventItem {
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
}
.main {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-y: scroll;
  /deep/ .van-nav-bar__left {
    color: #fff;
    .van-nav-bar__text {
      color: #fff;
    }
  }
  /deep/ .van-nav-bar__title {
    color: #fff;
  }
  /deep/ .van-nav-bar {
    background-color: #000;
  }
  /deep/ .van-icon {
    color: #fff;
  }
}
.content {
  flex: 1;
  overflow-y: scroll;
  .cell {
    height: 48px;
    padding: 0px 14px;
    background: #fff;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    p{
      color: #9A9A9A;
    }
    &::after {
      position: absolute;
      box-sizing: border-box;
      content: " ";
      pointer-events: none;
      right: 0px;
      bottom: 0;
      left: 0px;
      border-bottom: 1px solid #f1f1f1;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
  }
}
h3{
  height: 44px;
  line-height: 44px;
  box-sizing: border-box;
  padding: 0 12px;
  font-size: 14px;/*px*/
  font-weight: normal;
  position: relative;
  background: #fff;
    &::after {
    position: absolute;
    box-sizing: border-box;
    content: " ";
    pointer-events: none;
    right: 0px;
    bottom: 0;
    left: 0px;
    border-bottom: 1px solid #f1f1f1;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
}
.mapView{
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
}
.mapViews{
    height: 172px;
    width: 100%;
    position: relative;
    overflow: hidden;
}
  .echartsline_body {
      width: 100%;
      display: flex;
      height: 108px;
      padding: 0 12px;/*no*/
      box-sizing: border-box;
      .swiper-container {
        width: 100%;
        height:100%;
      }
      .swiper-slide {
        height: 100%;
        width: 116px;
        text-align: center;
        font-size: 18px;
        background: #fff;
        display: flex;
        flex-direction: column;
        .swiper_div{
            flex: 1;
            width: 100%;
        }
        .slidename {
            width: 100%;
            height: 20px;
            background: red;
            margin-right: 10px;
            background: #fff;
            line-height: 20px;
            font-size: 12px;
            font-weight: normal;
            color: #506779;
            // margin-top: 5px;
            white-space: nowrap;
            word-wrap: normal;
            text-overflow: ellipsis;
            overflow: hidden;
        }
      }
    }
</style>