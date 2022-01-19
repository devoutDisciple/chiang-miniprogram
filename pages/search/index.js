import loading from '../../utils/loading';
import request from '../../utils/request';

// pages/order/index.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		subjectList: [],
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
		const { keywords } = this.data;
		const result = await request.get({ url: '/subject/allSubjectByKeywords', data: { keywords: keywords } });
		this.setData({ subjectList: result });
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
		await this.getSubjectByKeywords();
		this.setData({ refresherTriggered: false });
	},
});
