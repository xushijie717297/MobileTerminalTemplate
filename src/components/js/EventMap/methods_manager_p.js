/**
 * Created by W on 2020-04-26.
 */
import axios from "axios";
import esriLoader from 'esri-loader';
import global from '@/components/js/Global';
import tileInfo from '@/components/js/tdt_data';  //广水
// import tileInfo from '@/components/js/tdt_dataZZ';  //郑州
import config from '../../../../static/config.json'
import urlClass from '@/components/js/UrlClass';
import mainClass from '@/components/js/MainClass';
import popupTableWater_p from '@/components/js/popupTableWater_p';
import popupTableWaterExit_p from '@/components/js/popupTableWaterExit_p';

var esriApi, mapView, webTileMap1Temp, dynamicMapServiceLayerTemp, seattleLayer, drwdLayer, drwdPointLayer, exitPointLayer, isbool = false, isLoadMap = false, listData = [], exitPoints = [], lableData = [], itemInfo, funGetAreaCoordinatesInfo;
class Methods {
  loadArcgis(val, _itemInfo) {// 该方法用于加载 arcgis 依赖的js,css 等
    isbool = val;
    itemInfo = _itemInfo;
    // 加载css
    esriLoader.loadCss('http://' + urlClass.arcgisUrlIp + '/library/4.12/esri/css/main.css');
    esriLoader.loadCss('http://' + urlClass.arcgisUrlIp + '/library/4.12/dijit/themes/tundra/tundra.css');
    // 加载模块
    esriLoader.loadModules([
      'esri/Map',
      'esri/Basemap',
      'esri/views/MapView',
      'esri/layers/WebTileLayer',
      'esri/geometry/SpatialReference',
      'esri/geometry/Extent',
      'esri/layers/support/TileInfo',
      'esri/geometry/Point',
      'esri/geometry/Circle',
      'esri/layers/MapImageLayer',
      'esri/layers/TileLayer',
      'esri/symbols/PictureMarkerSymbol',
      'esri/symbols/SimpleMarkerSymbol',
      'esri/symbols/SimpleLineSymbol',
      'esri/Graphic',
      'esri/layers/GraphicsLayer',
      "esri/layers/FeatureLayer",
      "esri/geometry/Polygon",
      "esri/core/promiseUtils"
    ], {
      url: 'http://' + urlClass.arcgisUrlIp + '/library/4.12/init.js'
    })
      .then(this.loadingMap)
      .then(obj => {
        this.initMap(obj);
      })
      .catch((err) => {
        console.trace(err.message);
      });
  }

  loadingMap([// 注意 这里的参数是数组,该方法用于自定义TiledMapServiceLayer加载天地图;
    Map,
    Basemap,
    MapView,
    WebTileLayer,
    SpatialReference,
    Extent,
    TileInfo,
    Point,
    Circle,
    MapImageLayer,
    TileLayer,
    PictureMarkerSymbol,
    SimpleMarkerSymbol,
    SimpleLineSymbol,
    Graphic,
    GraphicsLayer,
    FeatureLayer,
    Polygon,
    promiseUtils
  ]) {
    return { // return 之后才能使用链式调用
      Map,
      Basemap,
      MapView,
      WebTileLayer,
      SpatialReference,
      Extent,
      TileInfo,
      Point,
      Circle,
      MapImageLayer,
      TileLayer,
      PictureMarkerSymbol,
      SimpleMarkerSymbol,
      SimpleLineSymbol,
      Graphic,
      GraphicsLayer,
      FeatureLayer,
      Polygon,
      promiseUtils
    };
  }

  initMap(obj) { // 初始化地图,并设置中心点等
    esriApi = obj;

    //基础图层加载
    var map = new esriApi.Map();// 创建地图实例
    var tileInfoTemp = mainClass.ObjectDepthCopy(tileInfo.tileInfo);
    if (global.isRatio) {
      for (var i = 0; i < tileInfoTemp.lods.length; i++) {
        tileInfoTemp.lods[i].resolution *= global.googleRatio;
      }
    }
    var wtl_tileInfo = new esriApi.TileInfo(tileInfoTemp);
    let webTileMap = new esriApi.WebTileLayer(urlClass.googleMapUrl, { tileInfo: wtl_tileInfo });
    webTileMap.id = "styleDefault_true";
    webTileMap.opacity = 0.7;
    webTileMap.visible = isbool;
    map.add(webTileMap);
    let webTileMap1 = webTileMap1Temp = new esriApi.WebTileLayer(urlClass.googleMapUrl1, { tileInfo: wtl_tileInfo });
    webTileMap1.id = "styleDefault_false";
    webTileMap1.opacity = 0.7;
    webTileMap1.visible = !isbool;
    map.add(webTileMap1);

    var initExtent = new esriApi.Extent(global.initExtent.minX, global.initExtent.minY, global.initExtent.maxX, global.initExtent.maxY, new esriApi.SpatialReference({ wkid: global.spatialReference }));
    var view = mapView = new esriApi.MapView({
      map: map,
      container: "map_p",
      extent: initExtent,
      highlightOptions: {
        fillOpacity: 0
      },
      spatialReference: new esriApi.SpatialReference({ wkid: global.spatialReference })
    });
    //业务图层加载
    /* var dynamicMapServiceLayer = dynamicMapServiceLayerTemp = new esriApi.MapImageLayer(urlClass.businessLayers);
    webTileMap.id = "baseMapUrl";
    dynamicMapServiceLayer.opacity = 0.7;
    map.add(dynamicMapServiceLayer); */

    // seattleLayer = new esriApi.FeatureLayer({
    //   title: "ztLayer",
    //   url: "http://10.1.208.16:8088/ArcGisUrl/ArcGIS/rest/services/ModelPipe_gs_BaseMap_Dw/MapServer/8",
    //   outFields: ["ElementId", "Physical_PipeMaterial"],
    //   renderer: {
    //     type: "unique-value",
    //     field: "Physical_PipeMaterial",
    //     uniqueValueInfos: [
    //       { symbol: { type: "simple-line", color: "#632CA5", style: "solid", width: "1" }, value: "PE" },
    //       { symbol: { type: "simple-line", color: "#A52484", style: "solid", width: "1" }, value: "UPVC" },
    //       { symbol: { type: "simple-line", color: "#94457B", style: "solid", width: "1" }, value: "玻璃钢" },
    //       { symbol: { type: "simple-line", color: "#AD5D21", style: "solid", width: "1" }, value: "不锈钢" },
    //       { symbol: { type: "simple-line", color: "#8C5542", style: "solid", width: "1" }, value: "镀锌" },
    //       { symbol: { type: "simple-line", color: "#4AAEB5", style: "solid", width: "1" }, value: "钢管" },
    //       { symbol: { type: "simple-line", color: "#FF5500", style: "solid", width: "1" }, value: "钢塑" },
    //       { symbol: { type: "simple-line", color: "#00FFC6", style: "solid", width: "1" }, value: "球墨" },
    //       { symbol: { type: "simple-line", color: "#A5AA39", style: "solid", width: "1" }, value: "熟铁管" },
    //       { symbol: { type: "simple-line", color: "#942C39", style: "solid", width: "1" }, value: "砼管" },
    //       { symbol: { type: "simple-line", color: "#2FF25A", style: "solid", width: "1" }, value: "铸铁" },
    //       { symbol: { type: "simple-line", color: "#29AFF0", style: "solid", width: "1" }, value: "未知" }
    //     ]
    //   },
    //   minScale: 0,
    //   maxScale: 0,
    //   opacity: 1,
    //   visible: false
    // });
    // map.add(seattleLayer);

    var glPoint = drwdPointLayer = new esriApi.GraphicsLayer();
    map.add(glPoint);
    var gl = drwdLayer = new esriApi.GraphicsLayer();
    map.add(gl);
    exitPointLayer = new esriApi.GraphicsLayer();
    map.add(exitPointLayer);

    view.ui.components = [];//清空所有ESRI自带的组件
    view.popup.dockEnabled = false;
    view.popup.collapseEnabled = false;
    view.popup.dockOptions = { buttonEnabled: false, breakpoint: false, position: "bottom-left" };//禁用停靠
    view.popup.actions = null;

    var self = this;
    var graData = [];
    var tempGra;
    var highlightHover;
    var featurePolygonLayerview;
    view.when(function (e) {
      // console.log("LoadMap完成");
      popupTableWater_p.initPopupEvent(view, mapView.spatialReference, "jcdPopup_p");
      popupTableWaterExit_p.initPopupEvent(view, mapView.spatialReference, "exitPopup_p");
      isLoadMap = true;
      // self.drwdListPoints();
      funGetAreaCoordinatesInfo();
      // self.drwdLablePoints();
      // self.drwdExitPoints();
    }, function (error) {
      console.log("The view's resources failed to load: ", error);
    });

    funGetAreaCoordinatesInfo = function GetAreaCoordinatesInfo() {
      // listData = [];
      // lableData = [];
      // exitPoints = [];
      // if (exitPointLayer) {
      //   exitPointLayer.removeAll();
      // }
      // if (popupTableWaterExit_p) {
      //   popupTableWaterExit_p.destroy();
      // }
      // if(drwdLayer) {
      //   drwdLayer.removeAll();
      // }
      // if (popupTableWater_p) {
      //   popupTableWater_p.destroy();
      // }
      if (itemInfo && itemInfo.Geometry) {
        var result = itemInfo.Geometry;
        // console.log("GetAreaCoordinatesInfo:", itemInfo.Geometry);
        if (result.GeoType == "Point") {
          listData.push({ Level: itemInfo.Level, X: result.Geo.X, Y: result.Geo.Y });
          self.drwdListPoints();
          getAreaData(itemInfo.RegionGeo);
        } else if (result.GeoType == "Polygon") {
          console.log("Polygon");
          getAreaData(result);
          
        } else if (result.GeoType == "Special") {
          
          var locations = result.Geo.Locations;
          for (let i = 0; i < locations.length; i++) {
            var level = locations[i].Heat == 1 ? 3 : 2;
            listData.push({ Level: level, X: locations[i].X, Y: locations[i].Y });
          }
          self.drwdListPoints();
          var tempData = [];
          var warnFlows = result.Geo.WarnFlows;
          for (let i = 0; i < warnFlows.length; i++) {
            const warnFlow = warnFlows[i];
            tempData.push({ name: warnFlow.StationName, type: "flow", X: warnFlow.X, Y: warnFlow.Y });
          }
          var warnPressures = result.Geo.WarnPressures;
          for (let j = 0; j < warnPressures.length; j++) {
            const warnPressure = warnPressures[j];
            tempData.push({ name: warnPressure.StationName, type: "pressure", X: warnPressure.X, Y: warnPressure.Y });
          }
          if (tempData.length > 0) {
            self.loadLablePoints(tempData);
          }
          // getAreaData(result);
          getAreaData(itemInfo.RegionGeo);
        }
      }
    }
    function getAreaData(result) {
      var areaList = [];
      // console.log(result);
      if(result.GeoType == "Polygon"){
        var tempList = result.Geo;
        for (let i = 0; i < tempList.length; i++) {
          const item = tempList[i];
          var rings = [];
          for (let j = 0; j < item.Coordiantes.length; j++) {
            const element = item.Coordiantes[j];
            rings.push([element.X,element.Y]);
          }
          rings = config.mapDataReversal ? rings.reverse() : rings;
          var obj = {OTITLE: item.Label, Color: item.Color ? item.Color  : "rgba(66, 163, 239,0.1)", BorderColor: item.BorderColor ? item.BorderColor : "rgb(220,220,220)", BorderWidth: (1 + "px"), rings: rings};
          areaList.push(obj);
        }
        createFeatureLayer(areaList);
      }
      /* let res = {
        StartTime: "2021-01-25",
        EndTime: "2021-02-03"
      }
      axios.post(urlClass1.DetectWise + "GetAreaGeometry", res).then(e => {
        var areaList = [];
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
            Color: item.Color ? item.Color : "rgba(66, 163, 239,0.1)", 
            BorderColor: item.BorderColor ? item.BorderColor : "rgb(	220,220,220)",
            BorderWidth: (1 + "px"), 
            rings: rings 
          };
          areaList.push(obj);
        }
        createFeatureLayer(areaList);
      }); */
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
        const poly = new esriApi.Polygon({ rings: element.rings, spatialReference: view.spatialReference });
        const gra = new esriApi.Graphic({ geometry: poly, attributes: element });
        graData.push(gra);
        if (Number(element.EventNumber) > 0) {
          var textSymbol = {
            type: "text",
            text: element.EventNumber,
            color: "#2f4554",
            font: {
              family: "Merriweather",
              size: 12,
              style: "italic",
              weight: "bold"
            }
          };
          view.extent = poly.extent;
          const gra1 = new esriApi.Graphic({ geometry: poly.extent.center, symbol: textSymbol});
          gl.add(gra1);
        }
        //渲染分级随机颜色
        uniqueValueInfos.push({ value: element.OTITLE, symbol: { type: "simple-fill", color: element.Color, outline: { color: element.BorderColor, width: element.BorderWidth } } });
      }
      // console.log("uniqueValueInfos:", uniqueValueInfos);
      // const tempPoly = new esriApi.Polygon({rings: rings, spatialReference: view.spatialReference});
      // var point = tempPoly.extent.center;
      // view.center = point;
      // view.zoom --;
      var featurePolygon = new esriApi.FeatureLayer({
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
            mapView.center = gra.geometry.extent.center;
            break;
          }
        }
      }
    }
    function setupHoverTooltip(layerview) {
      featurePolygonLayerview = layerview;
      if (itemInfo && itemInfo.RegionGeo.Geo[0].Label) {
        HighlightHoverByLabel(itemInfo.RegionGeo.Geo[0].Label);
      }
      var highlight;
      var tooltip = createTooltip();
      var hitTest = esriApi.promiseUtils.debounce(function (event) {
        return view.hitTest(event).then(function (hit) {
          var results = hit.results.filter(function (result) {
            return result.graphic.layer === layerview.layer;
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
          textElement.innerHTML = obj.OTITLE;
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

  loadMapData(_itemInfo){
    itemInfo = _itemInfo;
    funGetAreaCoordinatesInfo();
  }

  IsShowName(_isActive) {
    if (_isActive) {
      var tempData = [];
      for (let i = 0; i < lableData.length; i++) {
        const obj = lableData[i];
        var tempObj = { Name: obj.name, Type: obj.type, X: obj.X, Y: obj.Y };
        tempData.push(tempObj);
      }
      if (tempData.length > 0) {
        popupTableWater_p.destroy();
        popupTableWater_p.loadPopup(tempData);
      }
      this.drwdExitPoints();
    } else {
      popupTableWater_p.destroy();
      if (popupTableWaterExit_p) {
        popupTableWaterExit_p.destroy();
      }
    }
  }

  loadLablePoints(_lableData) {
    lableData = _lableData;
    this.drwdLablePoints();
  }

  drwdLablePoints() {
    if (isLoadMap && lableData.length > 0) {
      var tempData = [];
      drwdLayer.removeAll();
      var symbol = { type: "picture-marker", url: '/static/images/dw1.png', width: '30px', height: '30px' };
      for (let i = 0; i < lableData.length; i++) {
        const obj = lableData[i];
        switch (obj.type) {
          case "flow":
            symbol = { type: "picture-marker", url: '/static/images/dw2.png', width: '30px', height: '30px' };
            break;
          case "pressure":
            symbol = { type: "picture-marker", url: '/static/images/dw1.png', width: '30px', height: '30px' };
            break;
        }
        var tempObj = { Name: obj.name, Type: obj.type, X: obj.X, Y: obj.Y };
        tempData.push(tempObj);
        const point = { type: "point", x: obj.X, y: obj.Y, spatialReference: mapView.spatialReference };
        var gra = new esriApi.Graphic({ geometry: point, symbol: symbol });
        drwdLayer.add(gra);
      }
      if (tempData.length > 0) {
        popupTableWater_p.destroy();
        popupTableWater_p.loadPopup(tempData);
      }
    }
  }

  loadListPoints(_listData) {
    listData = _listData;
    this.drwdListPoints();
  }

  loadExitPoints(_exitPoints) {
    exitPoints = _exitPoints;
    this.drwdExitPoints();
  }

  drwdExitPoints() {
    if (exitPointLayer) {
      exitPointLayer.removeAll();
    }
    if (popupTableWaterExit_p) {
      popupTableWaterExit_p.destroy();
    }
    if (isLoadMap && exitPoints.length > 0) {
      var tempData = [];
      for (let i = 0; i < exitPoints.length; i++) {
        const obj = exitPoints[i];
        var symbol = { type: "picture-marker", url: '/static/images/import.png', width: '30px', height: '30px' };
        if(obj.type == "import"){
          symbol = { type: "picture-marker", url: '/static/images/import.png', width: '30px', height: '30px' };
        } else if(obj.type == "export") {
          symbol = { type: "picture-marker", url: '/static/images/export.png', width: '30px', height: '30px' };
        } else if(obj.type == "pressure") {
          symbol = { type: "picture-marker", url: '/static/images/tl1.png', width: '30px', height: '30px' };
        } else if(obj.type == "flow") {
          symbol = { type: "picture-marker", url: '/static/images/tl2.png', width: '30px', height: '30px' };
        }
        if (obj.X && obj.Y) {
          let _type = "flow";
          if(obj.type == "pressure"){
            _type = "pressure";
          }
          var tempObj = { Name: obj.name, Type: _type, X: obj.X, Y: obj.Y };
          tempData.push(tempObj);
          //画点
          var pt = new esriApi.Point({x: obj.X, y: obj.Y, spatialReference: mapView.spatialReference});
          var gra = new esriApi.Graphic({ geometry: pt, symbol: symbol });
          exitPointLayer.add(gra);
        }
      }
      if (tempData.length > 0) {
        popupTableWaterExit_p.destroy();
        popupTableWaterExit_p.loadPopup(tempData);
      }
    }
  }

  drwdListPoints() {
    if (isLoadMap && listData.length > 0) {
      drwdPointLayer.removeAll();
      for (let i = 0; i < listData.length; i++) {
        const obj = listData[i];
        let type = obj.Level;
        var symbol = { type: "picture-marker", url: '/static/images/event_yellowdot.png', width: '24px', height: '24px' };
        switch (obj.Level) {
          case 1:
            type = "blue";
            symbol = { type: "picture-marker", url: '/static/images/event_yellowdot.png', width: '24px', height: '24px' };
            break;
          case 2:
            type = "yellow";
            symbol = { type: "picture-marker", url: '/static/images/event_orangedot.png', width: '24px', height: '24px' };
            break;
          case 3:
            type = "red";
            symbol = { type: "picture-marker", url: '/static/images/event_reddot.png', width: '24px', height: '24px' };
            break;
        }
        if (obj.X && obj.Y) {
          //画点
          var pt = new esriApi.Point({x: obj.X, y: obj.Y, spatialReference: mapView.spatialReference});
          var gra = new esriApi.Graphic({ geometry: pt, symbol: symbol });
          drwdPointLayer.add(gra);
        }
      }
    }
  }

  layerMapShowById(val) {
    var layerMap_true = mapView.map.findLayerById("styleDefault_true");
    var layerMap_false = mapView.map.findLayerById("styleDefault_false");
    if (layerMap_true && layerMap_false) {
      layerMap_true.visible = val;
      layerMap_false.visible = !val;
    }
  }

  LayerBasemapControlChange(_visible) {
    webTileMap1Temp.visible = _visible;
  }
  LayerControlChange(_visible) {
    dynamicMapServiceLayerTemp.visible = _visible;
  }
  EventChangeLayer(value) {
    seattleLayer.visible = (value == "Material");
  }
}

export default new Methods()
