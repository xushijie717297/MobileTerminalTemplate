class Methods{
  ObjectDepthCopy(object) {
    var data = object;
    var str = JSON.stringify(data);
    var result = JSON.parse(str);
    return result;
  }
}
export default new Methods()