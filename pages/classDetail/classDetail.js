// pages/classDetail/classDetail.js
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

	onRefresh: function () {
		this.setData({ refresherTriggered: true });
		setTimeout(() => {
			this.setData({ refresherTriggered: false });
		}, 1000);
	},

	// 切换tan
	onTapTab: function (e) {
		const { idx } = e.detail;
		this.setData({ activeTabIdx: idx });
	},
});
