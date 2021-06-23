import $ from "jquery";
class Methods {
    popupView = null;
    viewHandles = null;
    popupName = "";
    popupInfoData = [];
    frameHeight = 0;
    frameWidth = 0;
    initPopupEvent(_view, _popupName = "diffuseBubbles"){
        this.popupView = _view;
        this.popupName = _popupName + "_";
        this.viewHandles = this.popupView.watch("extent, rotation", function() {
            this.relocatePopup();
        }.bind(this));
    }
    loadPopup(_popupInfoData) {
        for (var i = 0; i < _popupInfoData.length; i++) {
            var popupInfo = _popupInfoData[i];
            var mapPoint = {
                x: popupInfo.x,
                y: popupInfo.y,
                spatialReference: this.popupView.spatialReference
            };
            var screenPoint = this.popupView.toScreen(mapPoint);
            popupInfo.screenPointX = screenPoint.x;
            popupInfo.screenPointY = screenPoint.y;
            this.popupInfoData.push(popupInfo);
            this.loadinfoWindow(popupInfo);
        }
    }
    loadinfoWindow(obj) {
        const popupID = this.popupName + obj.type + obj.id;
        var infoDiv = '<div id="diffuseBubbles' + popupID + '" class="diffuseBubbles diffuseBubbles-' + obj.up + '">'+
        '<div class="diffuseBubbles-circle-icon">'+
        '<div class="diffuseBubbles-circle-icon ' + obj.type + '"></div>'+
        '</div>';
        '</div>';
        $("#" + this.popupView.container.id).append(infoDiv);
        this.positionPopUp(obj);
    }
    positionPopUp(obj) {
        const popupID = this.popupName + obj.type + obj.id;
        var tempPopup = $('#diffuseBubbles' + popupID);
        if (tempPopup && tempPopup[0]) {
            var tempPopupHeight = tempPopup[0].offsetHeight - this.frameHeight;
            var tempPopupWidth = tempPopup[0].offsetWidth / 2 - this.frameWidth;
            tempPopup.css('transform', 'translate3d(' + (obj.screenPointX - tempPopupWidth) + 'px, ' + (obj.screenPointY - tempPopupHeight) + 'px, 0)');
        }
    }
    positionToScreen(popupInfo){
        var mapPoint = {
            x: popupInfo.x,
            y: popupInfo.y,
            spatialReference: this.popupView.spatialReference
        };
        var screenPoint = this.popupView.toScreen(mapPoint);
        popupInfo.screenPointX = screenPoint.x;
        popupInfo.screenPointY = screenPoint.y;
        this.positionPopUp(popupInfo);
    }
    relocatePopup() {
        for (var i = 0; i < this.popupInfoData.length; i++) {
            var popupInfo = this.popupInfoData[i];
            if(popupInfo){
                this.positionToScreen(popupInfo);
            }
        }
    }
    destroyByPopupName(_popupName = "diffuseBubbles") {
        if ((_popupName + "_") === this.popupName) {
            for (let j = 0; j < this.popupInfoData.length; j++) {
                var _infoData = this.popupInfoData[j];
                const popupID = this.popupName + _infoData.type + _infoData.id;
                $("#diffuseBubbles" + popupID).remove();
            }
            this.popupInfoData = [];
        }
    }
    destroy() {
        this.popupName = "";
        this.popupInfoData = [];
        this.viewHandles = null;
        this.popupView = null;
        console.log("destroy");
    }
}
export default new Methods()