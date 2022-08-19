import { loginVic } from 'api/user';
const STORAGE_KEY = 'user-info';
const TOKEN_KEY = 'token';
const OPEN_ID = 'openid';

export default {
  namespaced: true,
  state: () => {
    return {
      // 用户 token
      token: uni.getStorageSync(TOKEN_KEY) || '',
      // 用户信息
      userInfo: uni.getStorageSync(STORAGE_KEY) || {},
      // 微信用户唯一标识
      openid: uni.getStorageSync(OPEN_ID) || '',
    };
  },
  mutations: {
    /**
     * 保存 token 到 vuex
     */
    setToken(state, token) {
      state.token = token;
      this.commit('user/saveToken');
    },
    /**
     * 保存 token 到 本地存储
     */
    saveToken(state) {
      uni.setStorage({
        key: TOKEN_KEY,
        data: state.token,
      });
    },

    /**
     * 保存 用户信息 到 vuex
     */
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
      this.commit('user/saveUserInfo');
    },
    /**
     * 保存 用户信息 到 本地存储
     */
    saveUserInfo(state) {
      uni.setStorage({
        key: STORAGE_KEY,
        data: state.userInfo,
      });
    },

    /**
     * 保存 openid 到 vuex
     */
    setOpenid(state, openid) {
      state.openid = openid;
      this.commit('user/saveOpenid');
    },
    /**
     * 保存 openid 到 本地存储
     */
    saveOpenid(state) {
      uni.setStorage({
        key: OPEN_ID,
        data: state.openid,
      });
    },

    /**
     * 删除 token
     */ removeToken(state) {
      state.token = '';
      this.commit('user/saveToken');
    },

    /**
     * 删除用户信息
     */
    removeUserInfo(state) {
      state.userInfo = {};
      this.commit('user/saveUserInfo');
    },

    /**
     * 删除 openid
     */
    removeOpenid(state) {
      state.openid = '';
      this.commit('user/saveOpenid');
    },
  },
  actions: {
    /**
     * 完成登录
     */
    // async login(context, userProfile) {
    //   console.log(userProfile);
    //   // 用户数据
    //   const rawData = userProfile.userInfo;
    //   // 调用登录接口
    //   const { data: res } = await login({
    //     signature: userProfile.signature,
    //     iv: userProfile.iv,
    //     nickName: rawData.nickName,
    //     gender: rawData.gender,
    //     city: rawData.city,
    //     province: rawData.province,
    //     avatarUrl: rawData.avatarUrl
    //   });
    //   // 登录逻辑
    //   this.commit('user/setToken', res.token);
    //   this.commit('user/setUserInfo', JSON.parse(userProfile.rawData));
    // },

    // 微信用户授权登录，携带appid和code参数，调用后端接口获取Openid
    async loginAuth(context, data) {
      console.log('data', data);
      const userInfo = data.userProfile;
      const { res } = await loginVic({
        code: data.code,
      });

      // 解析后端传送过来的json对象
      const userAuthInfo = JSON.parse(res);
      const openid = userAuthInfo.openid;
      // console.log('sessionKey', userAuthInfo.sessionKey);
      console.log('openid', openid);

      // 保存到vuex中，通过commit
      this.commit('user/setOpenid', userAuthInfo.openid);
      this.commit('user/setUserInfo', JSON.parse(userInfo.rawData));
    },

    /**
     * 退出登录
     */
    logout(context) {
      this.commit('user/removeOpenid');
      // this.commit('user/removeToken');
      this.commit('user/removeUserInfo');
    },
  },
};
