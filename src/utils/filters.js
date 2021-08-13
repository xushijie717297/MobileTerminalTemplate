export function million(value) {
  if (value == "" || value == null) {
    value = "--";
  }
  return value;
}
export function typeMillion(value) {
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
}
export function timeFilter(value) {
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
export function warnType(value) {
  let type = ""
  if (value == "pressure") {
    type = "置信区间";
  } else if (value == "flow") {
    type = "置信区间";
  } else if (value == "pipeburst") {
    type = "漏失定位";
  } else if (value == "minflowatnight") {
    type = "夜间最小流量";
  } else if (value == "offline") {
    type = "离线报警";
  } else if (value == "stop") {
    type = "卡停报警";
  } else if (value == "chaoshangxian") {
    type = "超限报警";
  }
  return type;
}
export function degree(value) {
  console.log(value)
  let type = "";
  if (value == 1) {
    type = "轻微"
  }else if (value == 2) {
    type = "一般"
  }else if (value == 3) {
    type = "严重"
  }
  return type;
}