export function million(value){
    if (value == "") {
        value = "--";
      }
      return value;
}
export function typeMillion(value){
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
    }
    return type;
}
export function timeFilter(value){
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
}