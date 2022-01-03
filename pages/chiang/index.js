import login from '../../utils/login';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		tab: [
			{
				id: 1,
				name: '全日制集训',
			},
			{
				id: 2,
				name: '寄宿Space',
			},
			{
				id: 3,
				name: '法硕',
			},
			{
				id: 4,
				name: '管综',
			},
		],
		activeTabIdx: 1,
		swiperList: [
			{
				id: 1,
				text: 1,
				url: '/asserts/temp/1.png',
			},
			{
				id: 2,
				text: 2,
				url: '/asserts/temp/2.png',
			},
			{
				id: 3,
				text: 3,
				url: '/asserts/temp/3.png',
			},
			{
				id: 4,
				text: 4,
				url: '/asserts/temp/4.png',
			},
		],
		classList: [
			{
				id: 1,
				name: '热门课程',
			},
		],
		phoneDialogVisible: false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		// 判断用户是否登录
		if (!login.isLogin()) {
			login.getLogin();
		}
		// 判断是否已经获取用户手机号
		const phone = wx.getStorageSync('phone');
		if (!phone) {
			this.setData({ phoneDialogVisible: true });
		}
	},

	// 关闭获取手机号弹框
	onClosePhoneDialog: function () {
		this.setData({ phoneDialogVisible: false });
	},

	// 点击item
	onTapClassItem: function () {
		wx.navigateTo({ url: '/pages/classDetail/classDetail' });
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {},

	// 选择tab
	onTapTab: function (e) {
		const { idx } = e.detail;
		this.setData({ activeTabIdx: idx });
	},

	// 选择课程
	onTapClassTab: function () {},

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
