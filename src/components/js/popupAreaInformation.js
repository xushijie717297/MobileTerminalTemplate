import $ from "jquery";
class Methods {
    popupView = null;
    popupSpatialReference = null;
    popupName = "";//避免重复使用
    popupInfoData = [];

    initPopupEvent(_view, _spatialReference, _popupName = ""){
        this.popupView = _view;
        this.popupSpatialReference = _spatialReference;
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
            popupInfo.id = i;
            //坐标转换
            var mapPoint = {
                x: popupInfo.X,
                y: popupInfo.Y,
                spatialReference: this.popupSpatialReference
            };
            var screenPoint = this.popupView.toScreen(mapPoint);
            popupInfo.screenPointX = screenPoint.x;
            popupInfo.screenPointY = screenPoint.y;
            this.popupInfoData.push(popupInfo);
            this.loadinfoWindow(popupInfo);
        }
    }

    loadinfoWindow(obj) {
        const popupID = this.popupName + obj.id;
        //动态添加气泡窗口DIV
        var infoDiv = '<div id="popup-AreaInformation' + popupID + '" class="popupAreaInformation">' +
            '<div id="' + popupID + '" class="content-popupAreaInformation1">' + 
            '<div class="popupAreaInformation-title" title="' + obj.Name + '">' + obj.Name + '</div>' + 
            '<div class="popupAreaInformation-content">' + 
            '<div class="' + (String(obj.Values[0].Value) == 0 ? 'popupAreaInformation-LevelAsh' : 'popupAreaInformation-Level3') + '"><div class="' + (String(obj.Values[0].Value).length > 3 ? 'popupAreaInformation-Level-fontSize10' : 'popupAreaInformation-Level-fontSize12') + '">' + obj.Values[0].Value + '</div></div>' + 
            '<div class="' + (String(obj.Values[1].Value) == 0 ? 'popupAreaInformation-LevelAsh' : 'popupAreaInformation-Level2') + '"><div class="' + (String(obj.Values[1].Value).length > 3 ? 'popupAreaInformation-Level-fontSize10' : 'popupAreaInformation-Level-fontSize12') + '">' + obj.Values[1].Value + '</div></div>' + 
            '<div class="' + (String(obj.Values[2].Value) == 0 ? 'popupAreaInformation-LevelAsh' : 'popupAreaInformation-Level1') + '"><div class="' + (String(obj.Values[2].Value).length > 3 ? 'popupAreaInformation-Level-fontSize10' : 'popupAreaInformation-Level-fontSize12') + '">' + obj.Values[2].Value + '</div></div>' + 
            '</div>' +
            '</div>' +
            '</div>' + 
            '</div>' +
            '</div>';
        $("#" + this.popupView.container.id).append(infoDiv);
        //刷新气泡窗口位置
        this.positionPopUp(obj);
    }
    
    positionPopUp(obj) {//刷新气泡窗口位置
        const popupID = this.popupName + obj.id;
        var tempPopup = $('#popup-AreaInformation' + popupID);
        if (tempPopup && tempPopup[0]) {
            var tempPopupHeight = tempPopup[0].offsetHeight / 2;
            var tempPopupWidth = tempPopup[0].offsetWidth / 2;
            tempPopup.css('transform', 'translate3d(' + (obj.screenPointX - tempPopupWidth) + 'px, ' + (obj.screenPointY - tempPopupHeight) + 'px, 0)');
        }
    }

    positionToScreen(popupInfo){//位置转换
        //坐标转换
        var mapPoint = {
            x: popupInfo.X,
            y: popupInfo.Y,
            spatialReference: this.popupSpatialReference
        };
        var screenPoint = this.popupView.toScreen(mapPoint);
        popupInfo.screenPointX = screenPoint.x;
        popupInfo.screenPointY = screenPoint.y;
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

    destroy() {
        $(".popupAreaInformation").remove();
        this.popupInfoData = [];
    }
}
export default new Methods()