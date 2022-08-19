// import request from '../util/request';

// /**
//  * 获取用户基本信息
//  */
// export function login(data) {
//   return request({
//     url: '/sys/login',
//     method: 'POST',
//     data,
//   });
// }

// /**
//  * 微信用户授权登录，携带appid和code参数，调用后端接口获取Openid
//  */
// export function loginAuth(data) {
//   return request({
//     url: '/wx/user/' + data.appid + '/login/',
//     data: {
//       code: data.code,
//     },
//   });
// }


const { http } = uni.$u
// 获取菜单
// export const fetchMenu = (params, config = {}) => http.post('/ebapi/public_api/index', params, config)
export function getPhnoeData(params, config = {}) {
	return http.post('/user/phone', params, config)
}

export function loginVic(params, config = {}) {
	return http.post('/auth/login', params, config)
}

export function getCouponData(params, config = {}) {
	return http.post('/wechat/api/send', params, config)
}
