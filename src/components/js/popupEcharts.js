import $ from "jquery";

class Methods {
    popupView = null;
    popupName = "";//避免重复使用
    yoffset = 20;
    popupInfoData = [];

    initPopupEvent(_view, _popupName = ""){
        this.popupView = _view;
        this.popupName = _popupName + "_" ;
        //监听地图变化事件，对应刷新气泡窗口位置
        var self = this;
        this.popupView.watch(["extent","rotation"], function() {
            self.relocatePopup();
        });
    }

    /**
     * 加载popup的数据(id唯一标识)，可以累积添加数据
     */
    loadPopup(_popupInfoData) {
        for (var i = 0; i < _popupInfoData.length; i++) {
            var popupInfo = _popupInfoData[i];
            //坐标转换
            var mapPoint = {
                x: popupInfo.x,
                y: popupInfo.y,
                spatialReference: this.popupView.spatialReference
            };
            var screenPoint = this.popupView.toScreen(mapPoint);
            popupInfo.screenPointX = screenPoint.x;
            popupInfo.screenPointY = screenPoint.y - this.yoffset;
            this.popupInfoData.push(popupInfo);
            this.loadinfoWindow(popupInfo);
        }
    }

    loadinfoWindow(obj) {
        const popupID = this.popupName + obj.type + obj.id;
        let _colorType = "#24896B";
        switch (obj.type) {
            case "流量":
                _colorType = "#B03256";
                break;
            case "压力":
                _colorType = "#24896B";
                break;
            case "水质":
                _colorType = "#874856";
                break;
            case "加压站":
                _colorType = "#3F426E";
                break;
        }
        //动态添加气泡窗口DIV
        var infoDiv = '<div id="popup-Echarts' + popupID + '" class="popupEcharts">' +
            '<div class="content-wrapper-popupEcharts" style="border: 1px solid ' + _colorType + ';">' +
            '<div id="' + popupID + '" class="content-popupEcharts">' + 
            '<div>'+
            '<span id="title' + popupID + '" class="content-txttitle-popupEcharts"></span>'+
            '</div>' + 
            '</div>' +
            '<div id="tip' + popupID + '" class="tip-container-popupEcharts">' +
            '<div class="tip-popupEcharts" style="border: 1px solid ' + _colorType + ';"></div>' +
            '</div>' +
            '</div>';
        $("#" + this.popupView.container.id).append(infoDiv);
        //填充标题
        $('#title' + popupID).append(obj.title);
        //刷新气泡窗口位置
        this.positionPopUp(obj);
    }

    zIndexPopup(divID) {//恢复气泡窗口层级
        for (var i = 0; i < this.popupInfoData.length; i++) {
            var popupInfo = this.popupInfoData[i];
            if(popupInfo.id){
                const popupID = this.popupName + popupInfo.type + popupInfo.id;
                $('#popup-Echarts' + popupID).css("z-index","auto");
            }
        }
        $(divID).css("z-index","1");
    }
    
    positionPopUp(obj) {//刷新气泡窗口位置
        const popupID = this.popupName + obj.type + obj.id;
        var tempPopup = $('#popup-Echarts' + popupID);
        if (tempPopup && tempPopup[0]) {
            var tempPopupHeight = tempPopup[0].offsetHeight;
            var tempPopupWidth = tempPopup[0].offsetWidth / 2;
            tempPopup.css('transform', 'translate3d(' + (obj.screenPointX - tempPopupWidth) + 'px, ' + (obj.screenPointY - tempPopupHeight) + 'px, 0)');
        }
    }

    positionToScreen(popupInfo){//位置转换
        //坐标转换
        var mapPoint = {
            x: popupInfo.x,
            y: popupInfo.y,
            spatialReference: this.popupView.spatialReference
        };
        var screenPoint = this.popupView.toScreen(mapPoint);
        popupInfo.screenPointX = screenPoint.x;
        popupInfo.screenPointY = screenPoint.y - this.yoffset;
        //刷新气泡窗口位置
        this.positionPopUp(popupInfo);
    }
    
    relocatePopup(id = null) {//移动气泡窗口位置(传入id匹配单个，否则全部)
        for (var i = 0; i < this.popupInfoData.length; i++) {
            var popupInfo = this.popupInfoData[i];
            if(id){
                if(id == popupInfo.id){
                    this.positionToScreen(popupInfo);
                    break;
                }
            }else{
                this.positionToScreen(popupInfo);
            }
        }
    }

    /**
     * 按类型销毁
     */
    typeDestroy(type) {
        const tempPopupInfoData = [];
        for (let j = 0; j < this.popupInfoData.length; j++) {
            var _infoData = this.popupInfoData[j];
            if (type == _infoData.type) {
                const popupID = this.popupName + _infoData.type + _infoData.id;
                $("#popup-Echarts" + popupID).remove();
            }else{
                tempPopupInfoData.push(_infoData);
            }
        }
        this.popupInfoData = tempPopupInfoData;
    }

    destroy() {
        $(".popupEcharts").remove();
        this.popupInfoData = [];
    }
}
export default new Methods()