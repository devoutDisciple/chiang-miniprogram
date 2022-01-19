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
		const result = await request.get({ url: '/order/allOrderByUseridAndType', data: { userid: userId, type: 2 } });
		this.setData({ orderList: result });
		loading.hideLoading();
	},

	// 点击item，前往详情页面
	onTapSubjectItem: function (e) {
		const { id } = e.currentTarget.dataset.detail;
		wx.navigateTo({ url: `/pages/classDetail/classDetail?id=${id}` });
	},

	// 刷新
	onRefresh: async function () {
		this.setData({ refresherTriggered: true });
		await this.getUserOrder();
		this.setData({ refresherTriggered: false });
	},
});
