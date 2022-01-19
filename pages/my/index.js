import utils from '../../utils/deviceUtil';
import login from '../../utils/login';
import request from '../../utils/request';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		headerHight: 60,
		refresherTriggered: false,
		username: '',
		photo: '',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		this.getDeviceInfo();
		this.getUserInfo();
	},

	getUserInfo: function () {
		if (!login.isLogin()) {
			return login.getLogin();
		}
		const username = wx.getStorageSync('username');
		const photo = wx.getStorageSync('photo');
		this.setData({ username, photo });
	},

	getUserProfile: function () {
		wx.getUserProfile({
			desc: '驰昂考研想要获取您的基本信息',
			success: (res) => {
				if (res.userInfo) {
					const { nickName, avatarUrl } = res.userInfo;
					const userid = wx.getStorageSync('userId');
					request.post({
						url: '/user/updateInfo',
						data: { userid: userid, username: nickName, photo: avatarUrl },
					});
					wx.setStorageSync('username', nickName);
					wx.setStorageSync('photo', avatarUrl);
					this.setData({ username: nickName, photo: avatarUrl });
				}
			},
		});
	},

	// 刷新
	onRefresh: function () {
		this.setData({ refresherTriggered: true });
		setTimeout(() => {
			this.setData({ refresherTriggered: false });
		}, 1000);
	},

	getDeviceInfo: function () {
		// 获取设备相关信息
		utils.getDeviceInfo().then((res) => {
			const {
				headerHight,
				statusBarHeight: statusHeight,
				navHeight,
				conHegiht,
				disWidth,
				paddingLeft,
				paddingTop,
			} = res;
			this.setData({
				headerHight,
				statusHeight,
				navHeight,
				conHegiht: conHegiht - 2,
				disWidth,
				paddingLeft,
				paddingTop,
			});
		});
	},

	// 点击选择条目
	onTapItem: function (e) {
		console.log(e, 111);
		const { key } = e.currentTarget.dataset;
		switch (key) {
			case 'bill':
				wx.navigateTo({
					url: '/pages/bill/index',
				});
				break;
			case 'our':
				wx.navigateTo({
					url: '/pages/aboutUs/index',
				});
				break;
			case 'team':
				wx.navigateTo({
					url: '/pages/teamRecord/index',
				});
				break;
			case 'class':
				wx.navigateTo({
					url: '/pages/signupRecord/index',
				});
				break;
			default:
				break;
		}
	},
});
