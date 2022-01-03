import loading from '../../utils/loading';
import request from '../../utils/request';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		// 页面详情id
		detailId: '',
		detail: {}, // 课程详情
		refresherTriggered: false,
		tab: [
			{
				id: 1,
				key: 'sub',
				name: '课程详情',
			},
			{
				id: 2,
				key: 'teach',
				name: '师资团队',
			},
			{
				id: 3,
				key: 'signup',
				name: '报名须知',
			},
		],
		activeTabIdx: 0,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const { id } = options;
		if (!id) {
			return wx.switchTab({
				url: '/pages/chiang/index',
			});
		}
		this.setData({ detailId: id }, () => {
			this.getSubjectDetailById(id);
		});
	},

	// 获取课程详情
	getSubjectDetailById: async function (id) {
		loading.showLoading();
		const detail = await request.get({ url: '/subject/subjectDetailById', data: { id } });
		console.log(detail, 122);
		this.setData({ detail: detail });
		loading.hideLoading();
	},

	// 刷新
	onRefresh: function () {
		this.setData({ refresherTriggered: true });
		setTimeout(() => {
			this.setData({ refresherTriggered: false });
		}, 1000);
	},

	// 点击立即报名
	onClickApply: async function () {
		const openId = wx.getStorageSync('openId');
		const result = await request.get({ url: '/pay/paySign', data: { openId } });
		const { appId, paySign, packageSign, nonceStr, timeStamp, signType } = result;
		if (!paySign || !packageSign)
			return wx.showToast({
				title: '系统错误',
			});
		const params = {
			appId,
			timeStamp,
			nonceStr,
			paySign,
			signType,
			package: packageSign,
		};
		wx.requestPayment({
			...params,
			success(res) {
				console.log(res, 111);
			},
			fail(res) {
				console.log(res, 222);
			},
		});
	},

	// 切换tan
	onTapTab: function (e) {
		const { idx } = e.detail;
		this.setData({ activeTabIdx: idx });
	},
});
