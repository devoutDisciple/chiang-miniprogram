import loading from '../../utils/loading';
import request from '../../utils/request';

// pages/order/index.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		payList: [],
		refresherTriggered: false,
		keywords: '',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (option) {
		const { keywords } = option;
		this.setData({ keywords: keywords }, () => {
			this.getSubjectByKeywords();
		});
	},

	// 获取课程
	getSubjectByKeywords: async function () {
		loading.showLoading();
		const userId = wx.getStorageSync('userId');
		const result = await request.get({ url: '/pay/allPayByUserId', data: { userId: userId } });
		this.setData({ payList: result });
		loading.hideLoading();
	},

	// 刷新
	onRefresh: async function () {
		this.setData({ refresherTriggered: true });
		await this.getSubjectByKeywords();
		this.setData({ refresherTriggered: false });
	},
});
