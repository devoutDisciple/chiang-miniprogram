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

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {},

	// 刷新
	onRefresh: function () {
		this.setData({ refresherTriggered: true });
		setTimeout(() => {
			this.setData({ refresherTriggered: false });
		}, 3000);
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

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {},
});
