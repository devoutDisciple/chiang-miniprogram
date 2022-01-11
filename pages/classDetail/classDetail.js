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
		type: 1, // 1-未报名和未组团 2-已报名 3-已组团
		teamId: '', // 组团的id
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
		this.setData({ detail: detail });
		console.log(detail, 11);
		// 获取订单详情
		await this.getUserSignUp(detail);
		loading.hideLoading();
	},

	// 获取用户是否已报名该课程
	getUserSignUp: async function (detail) {
		const userid = wx.getStorageSync('userId');
		const orderDetail = await request.get({
			url: '/order/orderDetailByUserid',
			data: { userid: userid, subId: detail.id, proId: detail.project_id },
		});
		if (!orderDetail.type) {
			this.setData({ type: 1 });
		}
		if (orderDetail.type === 1) {
			this.setData({ type: 2 });
		}
		if (orderDetail.type === 2) {
			this.setData({ type: 3, teamId: orderDetail.team_uuid });
		}
	},

	// 刷新
	onRefresh: function () {
		this.setData({ refresherTriggered: true });
		setTimeout(() => {
			this.setData({ refresherTriggered: false });
		}, 1000);
	},

	// 点击立即报名
	onClickApply: async function (e) {
		const { type } = e.currentTarget.dataset;
		const openId = wx.getStorageSync('openId');
		const userId = wx.getStorageSync('userId');
		const { detail } = this.data;
		const data = {
			openId,
			type,
			userId,
			project_id: detail.project_id,
			subject_id: detail.id,
		};
		if (type === 2) data.teamId = this.data.teamId;
		const result = await request.post({
			url: '/pay/paySignup',
			data: data,
		});
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
