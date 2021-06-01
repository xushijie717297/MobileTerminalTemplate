import axios from 'axios'
import qs from 'qs'

// import router from '@/router'
import store from '@/store'

const instance = axios.create({
    timeout: 15000,
});

const xhr = {
    get(url, data, config) {
        return new Promise((resolve, reject) => {
            instance.get(url, {params: data}, config).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    fetch(url, data, config, methods) {
        return new Promise((resolve, reject) => {
            instance[methods](url, data, config).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },
    post(url, data, config) {
        return this.fetch(url, data, config, 'post')
    }
}

// instance.defaults.headers.common['token'] = store.state.token

//请求拦截器新增非get请求添加请求头和token
instance.interceptors.request.use(config => {
    console.log(config)
    if (config.method != 'get') {
        config.data = qs.stringify(config.data)
        config.headers['Content-Type'] = 'application/json;charset=UTF-8';
    }
    let token = store.state.token
    if (token) {
        config.headers.common['token'] = token
    }
    return config;
}, error => {
    return Promise.reject(error)
})

//响应拦截器
instance.interceptors.response.use(response => {
    // console.log(response)
    // 对响应数据做点什么
    return response;
}, error => {
    if (error.response) {
        console.log('error.response',error.response)
        // switch (error.response.status) {
        //     case 400:
        //         error.message = '错误请求' ; Dialog.confirm({title: '提示',message: '错误请求',});
        //         break
        //     case 401:
        //         error.message = '未授权，请重新登录' ; Dialog.confirm({title: '提示',message: '未授权',});
        //         break
        //     case 403:
        //         error.message = '拒绝访问' ; Dialog.confirm({title: '提示',message: '拒绝访问',});
        //         break
        //     case 404:
        //         error.message = '请求错误,未找到该资源' ; Dialog.confirm({title: '提示',message: '请求错误,未找到该资源',});
        //         break
        //     case 405:
        //         error.message = '请求方法未允许' ; Dialog.confirm({title: '提示',message: '请求方法未允许',});
        //         break
        //     case 408:
        //         error.message = '请求超时' ; Dialog.confirm({title: '提示',message: '请求超时',});
        //         break
        //     case 500:
        //         error.message = '服务器端出错' ; Dialog.confirm({title: '提示',message: '服务器端出错',});
        //         break
        //     case 501:
        //         error.message = '网络未实现' ; Dialog.confirm({title: '提示',message: '网络未实现',});
        //         break
        //     case 502:
        //         error.message = '网络错误' ; Dialog.confirm({title: '提示',message: '网络错误',});
        //         break
        //     case 503:
        //         error.message = '服务不可用' ; Dialog.confirm({title: '提示',message: '服务不可用',});
        //         break
        //     case 504:
        //         error.message = '网络超时' ; Dialog.confirm({title: '提示',message: '网络超时',});
        //         break
        //     case 505:
        //         error.message = 'http版本不支持该请求' ; Dialog.confirm({title: '提示',message: 'http版本不支持该请求',});
        //         break
        //     default:
        //         error.message = `连接错误${error.response.status}`  ; Dialog.confirm({title: '提示',message: `连接错误${error.response.status}`,});
        // }
    }
    // 对响应错误做点什么

    return Promise.reject(error);
});

export default xhr
