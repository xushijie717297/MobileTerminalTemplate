/*
 * @Descripttion:请求拦截器
 * @version:
 * @Author: xushijie
 * @Date: 2021-07-01
 * @LastEditors: xushijie
 * @LastEditTime: 2021-07-01
 */
import axios from 'axios'
import { Dialog } from 'vant';
// 请求拦截
const request = axios.interceptors.request.use(config => {
//   console.log(config)
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截
const response = axios.interceptors.response.use(res => {
//   console.log(res)
  const apiRes = res
  return apiRes
}, async error => {
  if (error.response.status) {
    // 错误状态码
    switch (error.response.status) {
        case 400:
            error.message = '错误请求' ; Dialog.confirm({title: '提示',message: '错误请求'});
            break
        case 401:
            error.message = '未授权，请重新登录' ; Dialog.confirm({title: '提示',message: '未授权，请重新登录'});
            break
        case 403:
            error.message = '拒绝访问' ; Dialog.confirm({title: '提示',message: '拒绝访问'});
            break
        case 404:
            error.message = '请求错误,未找到该资源' ; Dialog.confirm({title: '提示',message: '请求错误,未找到该资源'});
            break
        case 405:
            error.message = '请求方法未允许' ; Dialog.confirm({title: '提示',message: '请求方法未允许'});
            break
        case 408:
            error.message = '请求超时' ; Dialog.confirm({title: '提示',message: '请求超时'});
            break
        case 500:
            error.message = '服务器端出错' ; Dialog.confirm({title: '提示',message: '服务器端出错'});
            break
        case 501:
            error.message = '网络未实现' ; Dialog.confirm({title: '提示',message: '网络未实现'});
            break
        case 502:
            error.message = '网络错误' ; Dialog.confirm({title: '提示',message: '网络错误'});
            break
        case 503:
            error.message = '服务不可用' ; Dialog.confirm({title: '提示',message: '服务不可用'});
            break
        case 504:
            error.message = '网络超时' ; Dialog.alert({title: '提示',message: '网络超时'});
            break
        case 505:
            error.message = 'http版本不支持该请求' ; Dialog.confirm({title: '提示',message: 'http版本不支持该请求'});
            break
        default:
            error.message = `连接错误${error.response.status}`  ; Dialog.confirm({title: '提示',message: `'连接错误'${error.response.status}`});
    }
  }
  return Promise.reject(error)
})

export default {request, response}