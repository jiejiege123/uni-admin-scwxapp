<template>
  <view class="my-container">
    <!-- 用户未登录 -->
    <block v-if="!openid">
      <image
        class="avatar avatar-img"
        src="/static/vator.png"
        mode="scaleToFill"
      />
      <view class="login-desc">登录后可同步数据</view>
      <button class="login-btn" type="primary" @click="getUserInfo">
        微信用户一键登录
      </button>
	</block>
	
    <!-- 已登录 -->
    <block v-else>
      <image
        class="avatar avatar-img"
        :src="userInfo.avatarUrl"
        mode="scaleToFill"
      />
      <view class="login-desc">{{ userInfo.nickName }}</view>
      <button class="login-btn" type="default" @click="onLogoutClick">
        退出登录
      </button>
	  <send-coupon
	      @sendcoupon="getcoupon"
	      @userconfirm="redirectuser"
	      :send_coupon_params="couponInfo.send_coupon_params"
		 :sign="couponInfo.sign" 
		 :send_coupon_merchant="couponInfo.send_coupon_merchant"
	    >
	      <!-- 内部为自定义代码，按钮点击部分的代码写在这里 -->
	      <!-- [[以下为示例代码 -->
	      <button type="primary" style='margin-top: 20px;'>领券</button>
	      <!-- 以上为示例代码 ]] -->
	    </send-coupon>
    </block>
	
	<block>
		<view v-if="phone" class="login-desc">{{phone}}</view>
		<button v-else class="login-btn" open-type="getPhoneNumber" type="primary" @getphonenumber="getPhnoeNum">获取手机号</button>
	</block>
	 
  </view>	
</template>

<script>
import { mapState, mapActions } from 'vuex';

import { getPhnoeData, loginVic, getCouponData } from 'api/user'
export default {
  name: 'my-login',
  data() {
    return {
      code: '',
	  phone: '',
	  openid: false,
	  userInfo: {},
	  couponInfo: {
		  send_coupon_params: '.',
		  sign: '.',
		  send_coupon_merchant: '.',
	  }
    };
  },
  computed: {
    // ...mapState('user', ['token', 'userInfo', 'openid']),
  },
  methods: {
    // ...mapActions('user', ['login', 'logout', 'loginAuth']),
    /**
     * 获取用户信息
     */
    // getUserInfo() {
    //   // 展示加载框
    //   uni.showLoading({
    //     title: '加载中',
    //   });
    //   uni.getUserProfile({
    //     desc: '登录后可同步数据',
    //     success: async (obj) => {
    //       console.log('obj', obj);
    //       // 调用 action ，请求登录接口
    //       await this.login(obj);
    //     },
    //     fail: () => {
    //       uni.showToast({
    //         title: '授权已取消',
    //         icon: 'error',
    //         mask: true,
    //       });
    //     },
    //     complete: () => {
    //       // 隐藏loading
    //       uni.hideLoading();
    //     },
    //   });
    // },
    /**
     * 退出登录
     */
    onLogoutClick() {
      uni.showModal({
        title: '提示',
        content: '退出登录将无法同步数据哦~',
        success: ({ confirm, cancel }) => {
          if (confirm) {
            this.logout();
          }
        },
      });
    },

    /**
     *
     * 获取用户信息
     */
    getUserInfo() {
      // 展示加载框
      uni.showLoading({
        title: '加载中',
      });
      uni.getUserProfile({
        desc: '登录后可同步数据',
        success: async (obj) => {
          // 调用 action ，请求登录接口
		  // cloudID userInfo
			// console.log(obj) // 
			// this.userInfo = obj.userInfo
			// console.log(this.userInfo)
			uni.login({
			  provider: 'weixin',
			  success: async (res) => {
			    // console.log('登录获取code', res.code);
			    if (res.errMsg == 'login:ok') {
					// await this.loginAuth({
					//   userProfile: obj,
					//   code: res.code,
					//   // appid: 'wx558224455375e422',
					// });
				  loginVic({code:res.code }).then(res => {
					  console.log('res:',res);
					  this.userInfo = obj.userInfo
					  this.openid = res.openid
					  console.log(this.userInfo, this.openid)
					  this.getCoupon()
				  })
			    }
			  },
			})
        },
        fail: () => {
          uni.showToast({
            title: '授权已取消',
            icon: 'error',
            mask: true,
          });
        },
        complete: () => {
          // 隐藏loading
          uni.hideLoading();
        },
      });
    },
	// 获取手机号码
	getPhnoeNum(e) {
		getPhnoeData({code: e.detail.code}).then((res) => {
			this.phone = res.purePhoneNumber
		})
	},
	getcoupon: function(params) {
	    // 插件返回信息在params.detail
	    console.log('getcoupon', params)
	  },
	redirectuser() {
		
	},
	// 获取发券需要的数据
	getCoupon() {
		getCouponData({openid: this.openid}).then(res => {
			console.log(res)
		})
	}
  },
};
</script>

<style lang="scss" scoped>
.my-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 25%;
  .avatar-img {
    width: 78px;
    height: 78px;
  }
  .login-desc {
    color: #999;
    font-size: 14px;
    margin-top: 16px;
  }
  .login-btn {
    margin-top: 16px;
    width: 85%;
  }
}
</style>
