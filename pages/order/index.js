import loading from '../../utils/loading';
import request from '../../utils/request';
import login from '../../utils/login';

// pages/order/index.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		orderList: [],
		refresherTriggered: false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		this.getUserOrder();
	},

	// 获取课程
	getUserOrder: async function () {
		if (!login.isLogin()) {
			login.getLogin();
		}
		loading.showLoading();
		const userId = wx.getStorageSync('userId');
		const result = await request.get({ url: '/order/allOrderByUserid', data: { userid: userId } });
		this.setData({ orderList: result });
		loading.hideLoading();
	},

	// 点击item，前往详情页面
	onTapSubjectItem: function (e) {
		const { id } = e.currentTarget.dataset.detail;
		wx.navigateTo({ url: `/pages/classDetail/classDetail?id=${id}&showTeamProcess=true` });
	},

	// 刷新
	onRefresh: async function () {
		this.setData({ refresherTriggered: true });
		await this.getUserOrder();
		this.setData({ refresherTriggered: false });
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {},

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
