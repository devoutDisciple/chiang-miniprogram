import { showLoading, hideLoading } from '../../utils/loading';
import login from '../../utils/login';
import request from '../../utils/request';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		// 类别
		typeList: [],
		// 选择的tab标签
		selectTypeIdx: 0,
		// 轮播图
		swiperList: [],
		// 课程list
		projectList: [],
		// 选中的班级下标
		selectProjectIdx: 0,
		// 课程list
		subjectList: [],
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
		this.init();
	},

	// 获取初始化数据
	init: async function () {
		showLoading();
		// 获取轮播图
		await this.getAllSwiper();
		// 获取所有类别
		await this.getAllType();
	},

	// 关闭获取手机号弹框
	onClosePhoneDialog: function () {
		this.setData({ phoneDialogVisible: false });
	},

	// 获取swiper
	getAllSwiper: async function () {
		const result = (await request.get({ url: '/swiper/allSwiper' })) || [];
		this.setData({ swiperList: result });
	},

	// 获取所有类别
	getAllType: async function () {
		const result = await request.get({ url: '/type/allType' });
		this.setData({ typeList: result }, () => {
			this.setData({ selectTypeIdx: 0 });
			this.getAllProjectByTypeId(result[0].id);
		});
	},

	// 获取所有班级
	getAllProjectByTypeId: async function (typeid) {
		const result = await request.get({ url: '/project/allProjectByTypeId', data: { typeid } });
		this.setData({ projectList: result }, () => {
			this.setData({ selectProjectIdx: 0 });
			this.getAllSubjectByProjectId(result[0].id);
		});
	},

	// 获取所有课程
	getAllSubjectByProjectId: async function (projectid) {
		const result = await request.get({ url: '/subject/allSubjectByProjectId', data: { projectid } });
		this.setData({ subjectList: result });
		hideLoading();
	},

	// 点击item，前往详情页面
	onTapClassItem: function () {
		wx.navigateTo({ url: '/pages/classDetail/classDetail' });
	},

	// 选择tab
	onTapType: function (e) {
		const { idx } = e.detail;
		this.setData({ selectTypeIdx: idx }, () => {
			const typeid = this.data.typeList[idx].id;
			this.getAllProjectByTypeId(typeid);
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
