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
		// 老师的基本信息
		teachers: [],
		phoneDialogVisible: false,
		iptValue: '',
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
		wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline'],
		});
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
		showLoading();
		const result = await request.get({ url: '/type/allType' });
		this.setData({ typeList: result }, () => {
			hideLoading();
			this.setData({ selectTypeIdx: 0 });
			if (!result[0]) {
				return this.setData({ projectList: [], subjectList: [] });
			}
			this.getAllProjectByTypeId(result[0]?.id);
		});
	},

	// 获取所有班级
	getAllProjectByTypeId: async function (typeid) {
		showLoading();
		const result = await request.get({ url: '/project/allProjectByTypeId', data: { typeid } });
		this.setData({ projectList: result }, () => {
			hideLoading();
			this.setData({ selectProjectIdx: 0 });
			if (!result[0]) {
				return this.setData({ projectList: [], subjectList: [] });
			}
			this.getAllSubjectByProjectId(result[0]?.id);
		});
	},

	// 获取所有课程
	getAllSubjectByProjectId: async function (projectid) {
		showLoading();
		const result = await request.get({
			url: '/subject/allSubjectByProjectId',
			data: { projectid },
		});
		this.setData({ subjectList: result });
		hideLoading();
	},

	// 选择type
	onTapType: function (e) {
		const { idx } = e.detail;
		this.setData({ selectTypeIdx: idx }, () => {
			const typeid = this.data.typeList[idx].id;
			this.getAllProjectByTypeId(typeid);
		});
	},

	// 点击item，前往详情页面
	onTapSubjectItem: function (e) {
		const { id } = e.currentTarget.dataset.detail;
		wx.navigateTo({ url: `/pages/classDetail/classDetail?id=${id}` });
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		return {
			title: '驰昂考研',
			path: '/home/index',
		};
	},

	// 输入框改变
	onInputChange: function (e) {
		const { value } = e.detail;
		this.setData({ iptValue: value });
	},

	// 输入确定搜索
	onConfirmIpt: function () {
		const value = String(this.data.iptValue).trim();
		if (!value) {
			return wx.showToast({
				title: '请输入条件',
				icon: 'error',
			});
		}
		wx.navigateTo({
			url: `/pages/search/index?keywords=${value}`,
		});
	},
});
