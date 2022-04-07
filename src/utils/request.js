import axios from 'axios';
import Message from '@/components/message';
import qs from 'querystring';
import router from "@/router"
import { getToken } from "@/utils/auth";

axios.defaults.withCredentials = true;

const app_key = 'banana';
const app_secret = '37b590063d593716405a2c5a382b1130b28bf8a7';
const domain = 'weipeiyang.twt.edu.cn';

const service = axios.create({
    baseURL: 'https://api.twt.edu.cn/api',
    transformRequest: [
        (oldData, config) => {
            if (!config['Content-Type']) {
                config['Content-Type'] = 'application/x-www-form-urlencoded'
                return qs.stringify(oldData);
            }
            switch (config['Content-Type']) {
                case 'multipart/form-data':
                    return oldData;
                case 'application/json':
                    return JSON.stringify(oldData)
                default:
                    return qs.stringify(oldData);
            }
        },
    ],
    timeout: 60000,
    headers: {
        domain,
        'Access-Control-Allow-Credentials': 'true',
        ticket: window.btoa(`${app_key}.${app_secret}`),
    },
    withCredentials: true,
});

service.interceptors.request.use(
    (config) => {
        config.headers['token'] = getToken();
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

service.interceptors.response.use(
    (response) => {
        if (response.status === 200) {
            const { data } = response;
            if (response.request.responseType === 'blob') {
                return data;
            }
            // 登录状态无效，跳转至登录页
            if (data['error_code'] === 40001 || data['error_code'] === 40005) {
                router.push({ path: "/login" })
            }
            switch (data['error_code']) {
                case 0:
                    return Promise.resolve(data);
                case 40001:
                    Message.error(`${data['message']},请重新登陆`);
                    return Promise.reject(data['message']);
                case 40002:
                    Message.error(`该用户不存在`);
                    return Promise.reject(data['message']);
                case 40004:
                    Message.error(`用户名或密码错误`);
                    return Promise.reject(data['message']);
                case 40005:
                    Message.error(`登录超时，请重新登录`);
                    return Promise.reject(data['message']);
                case 50001:
                    Message.error(`数据库错误`);
                    return Promise.reject(data['message']);
                case 50002:
                    Message.error(`逻辑错误错误`);
                    return Promise.reject(data['message']);
                case 50003:
                    Message.error(`无效的URL`);
                    return Promise.reject(data['message']);
                case 50004:
                    Message.error(`秘钥错误`);
                    return Promise.reject(data['message']);
                case 50005:
                    Message.error(`学号和身份证号不匹配`);
                    return Promise.reject(data['message']);
                case 50006:
                    Message.error(`用户名或邮箱已存在`);
                    return Promise.reject(data['message']);
                case 50007:
                    Message.error(`用户名已存在`);
                    return Promise.reject(data['message']);
                case 50008:
                    Message.error(`邮箱已存在`);
                    return Promise.reject(data['message']);
                case 50009:
                    Message.error(`无效的手机号`);
                    return Promise.reject(data['message']);
                case 50010:
                    Message.error(`发送失败，请稍后重试`);
                    return Promise.reject(data['message']);
                case 50011:
                    Message.error(`验证失败`);
                    return Promise.reject(data['message']);
                case 50012:
                    Message.error(`邮箱或手机号格式错误`);
                    return Promise.reject(data['message']);
                case 50013:
                    Message.error(`邮箱或手机号已存在`);
                    return Promise.reject(data['message']);
                case 50014:
                    Message.error(`手机号已存在`);
                    return Promise.reject(data['message']);
                case 50015:
                    Message.error(`目标账号信息不存在`);
                    return Promise.reject(data['message']);
                case 50016:
                    Message.error(`无效的学院名称`);
                    return Promise.reject(data['message']);
                default:
                    // Message.error(`${data['error_code'] + data['msg']},请联系管理员`);
                    // alert(`${data['error_code'] + data['msg']},请联系管理员`)
                    return Promise.reject(data['message']);
            }
        } else if (response.status === 500) {
            Message.error('500系统错误，请联系管理员');
        }
        return response;
    },
    (error) => {
        Message.error('发生未知错误，请联系管理员');
        return Promise.reject(error);
    }
);

export default service;