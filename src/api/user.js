import service from '../utils/request';

// 账密登录
export function login(data) {
    return service({
        url: 'auth/common',
        method: "post",
        data
    })
}

// 验证码登录
export function loginWithPhone(data) {
    return service({
        url: 'auth/phone',
        method: "post",
        data
    })
}

// 获取登录短信验证码
export function loginVerifyCode(data) {
    return service({
        url: '/auth/phone/msg',
        method: 'post',
        data,
    });
}

// 获取当前用户信息
export function userInfo() {
    return service({
        url: '/user/single',
        method: 'get'
    })
}

//修改密码
export function changePWD(data) {
    return service({
        url: '/password/person/reset',
        method: 'put',
        data
    })
}

// 获取全部学院
export function getDepartmentAll(params) {
    return service({
        url: '/department/all',
        method: 'get',
        params
    })
}

//根据学院获取专业
export function getMajorByDepartment(id) {
    return service({
        url: `/major/department/${id}`,
        method: 'get',
    })
}

//获取所有专业
export function getMajorAll() {
    return service({
        url: '/major/all',
        method: 'get',
    })
}

//向所有用户推送通知
export function notificationAll(data) {
    return service({
        url: '/notification/all',
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data
    })
}

//向指定用户推送通知
export function notificationSpecific(data) {
    return service({
        url: '/notification/specific',
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        data
    })
}

//根据学号推送通知
export function notificationToUser(data) {
    return service({
        url: '/notification/toUser',
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        data
    })
}

//获得所有历史通知
export function notificationHistoryAll() {
    return service({
        url: '/notification/history/all',
        method: 'get'
    })
}
// #TODO 对接口进行分类