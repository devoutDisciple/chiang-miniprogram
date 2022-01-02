import reqrest from '../../utils/request';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		refresherTriggered: false,
		tab: [
			{
				id: 1,
				name: '课程详情',
			},
			{
				id: 2,
				name: '师资团队',
			},
			{
				id: 3,
				name: '报名须知',
			},
		],
		activeTabIdx: 0,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {},

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
		}, 1000);
	},

	// 点击立即报名
	onClickApply: async function () {
		const openId = wx.getStorageSync('openId');
		const result = await reqrest.get({ url: '/pay/paySign', data: { openId } });
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
