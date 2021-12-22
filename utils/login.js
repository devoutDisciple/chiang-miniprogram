import { post } from './request';
import loading from './loading';

const app = getApp();

module.exports = {
	getLogin: (userinfo = {}) => {
		return new Promise((resolve, reject) => {
			loading.showLoading();
			const userId = wx.getStorageSync('userId');
			if (userId) {
				post({ url: '/login/loginByUserId', data: { userId } })
					.then((data) => {
						app.globalData.userInfo = data;
						const { id, username, photo } = data;
						// 将用户信息缓存下来
						wx.setStorageSync('userId', id);
						wx.setStorageSync('username', username);
						wx.setStorageSync('photo', photo);
						resolve(data);
					})
					.catch(() => reject())
					.finally(() => loading.hideLoading());
				return;
			}
			// 微信登录
			wx.login({
				// 成功失败与否
				complete: (res) => {
					if (res && res.errMsg === 'login:ok') {
						const { code } = res;
						post({ url: '/login/loginByWxOpenid', data: { code, ...userinfo } })
							.then((data) => {
								app.globalData.userInfo = data;
								const { id, username, photo } = data;
								// 将用户信息缓存下来
								wx.setStorageSync('userId', id);
								wx.setStorageSync('username', username);
								wx.setStorageSync('photo', photo);
								resolve(data);
							})
							.catch(() => reject())
							.finally(() => loading.hideLoading());
					} else {
						loading.hideLoading();
						wx.showToast({
							title: '登录失败',
							icon: 'error',
						});
					}
				},
			});
		});
	},

	// 获取用户手机号
	getUserPhone: () => {},

	// 判断用户是否登录
	isLogin: () => {
		const userId = wx.getStorageSync('userId');
		return !!userId;
	},
};
