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
        var tableStr = '';
        if (obj.Values) {
            tableStr += '<table cellspacing="0" cellpadding="0" border="0" class="table1-popupTableWater_p"><thead>';
            for (let i = 0; i < obj.Values.length; i++) {
                const element = obj.Values[i];
                tableStr += '<tr><td class="table-td-l-popupTableWater_p">' + element.Label + '</td><td class="table-td-r-popupTableWater_p">' + element.Value + '</td></tr>';
            }
            tableStr += '</thead></table>';
        }else{
            tableStr = '<div class="table-td-l-popupTableWater_p" title="'+obj.Name+'">'+obj.Name+'</div>';
        }
        //动态添加气泡窗口DIV  
        var infoDiv = '<div id="popup-TableWater_p' + popupID + '" class="popupTableWater_p">' +
            '<div id="' + popupID + '" class="content-popupTableWater_p">' + 
            '<div id="table' + popupID + '" class="table-popupTableWater_p-'+obj.Type+'">' + tableStr + '</div>' + 
            '</div>' +
            '<div class="tip-container-popupTableWater_p">' +
            '<div class="tip-b-popupTableWater_p-'+obj.Type+'"></div><div class="tip-popupTableWater_p-'+obj.Type+'"></div>' +
            '</div>' +
            '</div>';
        $("#" + this.popupView.container.id).append(infoDiv);
        //刷新气泡窗口位置
        this.positionPopUp(obj);
    }
    
    positionPopUp(obj) {//刷新气泡窗口位置
        const popupID = this.popupName + obj.id;
        var tempPopup = $('#popup-TableWater_p' + popupID);
        if (tempPopup && tempPopup[0]) {
            var tempPopupHeight = tempPopup[0].offsetHeight + 25;
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
        $(".popupTableWater_p").remove();
        this.popupInfoData = [];
    }
}
export default new Methods()