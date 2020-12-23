import Vue from 'vue'
import router from '@/router'
import axios from 'axios'
axios.defaults.withCredentials = false;
axios.defaults.headers['Content-Type'] = 'application/json';
axios.defaults.headers['Accept'] = 'application/json';

//添加一个请求拦截器
/*
axios.interceptors.request.use( (config:any) => {
    const token = sessionStorage.getItem('token');
    let { data, url } : { data:object ,url:string} = config;
    let params = {};

    if (url.indexOf('/doLogin') < 0 && !token) {
        sessionStorage.setItem('token','');
        router.push({path: '/login'}).then(r => r);
    }else if (url.indexOf('/doLogin') > 0) {

    } else {
        //添加统一入参
        params = {
            // cmId: 10001,
            // communityType: 0,
            // cpId: 1,
            campusId:100003,
            schoolId:1
        }
    }
    config.data = {...data, ...params};
    config.headers.common['token'] = token || '';
    return config;
}, function (error) {
    // Do something with request error
    console.info("error: ");
    console.info(error);
    return Promise.reject(error);
});
*/

/*
// 添加一个响应拦截器
axios.interceptors.response.use(function (response) {
    if (response.status === 202){
        Vue.prototype.$message({
            message: response.data.msg || '',
            type: 'error'
        });
    }
    return response;
}, function (error) {
    if (error.response.status === 401) {
        //返回登录页
        Vue.prototype.$message({
            message: error.response.data.msg || '登录凭证已失效，请重新登录',
            type: 'error'
        });
        sessionStorage.setItem('token','');
        router.push({path: '/login'}).then(r => r);
    }
    return Promise.reject(error);
})
*/

//通用方法
export const POST = (url:string, params?:object) => {
    return axios.post(`${url}`, params).then(res => {
        return res.data;
    })
}