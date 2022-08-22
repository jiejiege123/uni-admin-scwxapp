<template>
	<view class="my-container">
		<!-- 用户未登录 -->
		<block v-if="!openid">
			<image class="avatar avatar-img" src="/static/vator.png" mode="scaleToFill" />
			<view class="login-desc">登录后可同步数据</view>
			<button class="login-btn" type="primary" @click="getUserInfo">
				微信用户一键登录
			</button>
		</block>

		<!-- 已登录 -->
		<block v-else>
			<image class="avatar avatar-img" :src="userInfo.avatarUrl" mode="scaleToFill" />
			<view class="login-desc">{{ userInfo.nickName }}</view>
			<button class="login-btn" type="default" @click="onLogoutClick">
				退出登录
			</button>
			<!-- <button type="primary" style='margin-top: 20px;' @click="getCoupon">领券并放入卡包</button> -->
			<send-coupon @sendcoupon="getcoupon" @userconfirm="redirectuser"
				:send_coupon_params="couponInfo.send_coupon_params" :sign="couponInfo.sign"
				:send_coupon_merchant="couponInfo.send_coupon_merchant">
				<button type="primary" style='margin-top: 20px;'>领券</button>
			</send-coupon>
		</block>

		<block>
			<view v-if="phone" class="login-desc">{{phone}}</view>
			<button v-else class="login-btn" open-type="getPhoneNumber" type="primary"
				@getphonenumber="getPhnoeNum">获取手机号</button>
		</block>

	</view>
</template>

<script>
	import {
		mapState,
		mapActions
	} from 'vuex';

	import {
		getPhnoeData,
		loginVic,
		getCouponData
	} from 'api/user'
	export default {
		name: 'my-login',
		data() {
			return {
				code: '',
				phone: '',
				openid: false,
				userInfo: {},
				couponInfo: {
					send_coupon_params: '',
					sign: '',
					send_coupon_merchant: '',
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
					success: ({
						confirm,
						cancel
					}) => {
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
						uni.login({
							provider: 'weixin',
							success: async (res) => {
								if (res.errMsg == 'login:ok') {
									loginVic({
										code: res.code
									}).then(res => {
										this.userInfo = obj.userInfo
										this.openid = res.openid
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
				getPhnoeData({
					code: e.detail.code
				}).then((res) => {
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
				// console.log(112)
				// 	wx.addCard({
				// 	  cardList: [
				// 	    {
				// 	      cardId: '36865176319',
				// 	      cardExt: '{"code": "2211", "openid": "2222", "timestamp": "3ss3", "signature":"45"}'
				// 	    }
				// 	  ],
				// 	  success (res) {
				// 	    console.log(res.cardList) // 卡券添加结果
				// 	  },
				// 	  fail(err) {
				// 	  	console.log(err)
				// 	  }
				// 	})


				getCouponData({
					openid: this.openid
				}).then(res => {
					this.couponInfo = res
					console.log(this.couponInfo)
					// wx.addCard({
					//   cardList: [
					//     {
					//       cardId: res.coupon_id,
					//       cardExt: '{"code": "", "openid": "", "timestamp": "", "signature":""}'
					//     }
					//   ],
					//   success (res) {
					//     console.log(res.cardList) // 卡券添加结果
					//   }
					// })
				})
			},
			getSendCoupon(res) {
				let that = this
				console.log('res', res)
				if (res.detail.errcode == 'OK') {
					console.log(222)
					if (res.detail.send_coupon_result[0].code == 'SUCCESS') {
						that.showWechatbool = false
						that.showMask = false
						uni.showToast({
							title: '领取成功',
							icon: 'success',
							duration: 2000,
						})
					} else {
						uni.showModal({
							title: '领取失败',
							content: res.detail.send_coupon_result[0].message,
							showCancel: false,
							success: function(res) {
								that.showWechatbool = false
								that.showMask = false
							}
						})
					}
				} else {
					// uni.showToast({
					//  title: '领取失败',
					//  icon: 'none'
					// })
					that.showWechatbool = false
					that.showMask = false
				}
			},
			getCouponFun: function(id, index, stockId) {
				let that = this
				let list = that.couponsList
				let q = [{
					out_request_no: '60002019189501000121',
					stock_id: stockId
				}]
				//  如果是需要放入卡包的券,走这个请求
				if (stockId) { // stockId 后端返回批次号
					getWechatCoupon(q).then(res => {
						that.sign = res.data.sign // 获取签名
						that.outRequestNo = res.data.outRequestNo // 获取随机数
						that.send_coupon_params = [{ // 发券插件的发券参数
							"stock_id": stockId, // 批次号
							"out_request_no": res.data.outRequestNo // 后读返回的随机数
						}]
						that.showMask = true // 打开弹窗
						that.showWechatbool = true // 打开 领取插件
					}).catch(err => {
						// console.log('err',err)
					})
				} else {
					//  如果不需要领入卡包  直接领进小程序
					getCouponReceive(id)
						.then(function(res) {
							list[index].isUse = true
							// 后台埋点
							that.describeAction = '领取优惠券'
							that.toGetUserVisitadd()
							uni.showToast({
								title: '领取成功',
								icon: 'success',
								duration: 2000,
							})
						})
						.catch(function(err) {
							uni.showToast({
								title: err.msg || err.response.data.msg || err.response.data.message,
								icon: 'none',
								duration: 2000,
							})
						})
				}
			},
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
