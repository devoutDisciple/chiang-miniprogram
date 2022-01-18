import loading from '../../utils/loading';
import request from '../../utils/request';
import login from '../../utils/login';

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
		team_uuid: '', // 组团的id
		teamDetail: {}, // 组团详情
		phoneDialogVisible: false, // phone的弹框
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
		const { id, teamUuid } = options;
		if (!id) {
			return wx.switchTab({
				url: '/pages/chiang/index',
			});
		}
		if (teamUuid) {
			this.setData({ team_uuid: teamUuid });
			this.getTeamDetail(teamUuid);
		}
		this.getUserLogin();
		this.setData({ detailId: id }, () => {
			this.getSubjectDetailById(id);
		});
	},

	// 查看用户是否登录，并获取手机号
	getUserLogin: function () {
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

	// 获取课程详情
	getSubjectDetailById: async function (id) {
		loading.showLoading();
		const detail = await request.get({ url: '/subject/subjectDetailById', data: { id } });
		this.setData({ detail: detail });
		// 获取报名或者组团详情
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
			this.setData({ type: 3, team_uuid: orderDetail.team_uuid }, () => {
				this.getTeamDetail(orderDetail.team_uuid);
			});
		}
	},

	// 根据teamUUid获取组团详情
	getTeamDetail: async function (team_uuid) {
		const teamDetail = await request.get({
			url: '/team/teamDetailByTeamUuid',
			data: { team_uuid },
		});
		this.setData({ teamDetail: teamDetail, team_uuid: teamDetail.team_uuid });
	},

	// 刷新
	onRefresh: async function () {
		this.setData({ refresherTriggered: true });
		await this.getSubjectDetailById(this.data.detailId);
		this.setData({ refresherTriggered: false });
	},

	// 点击立即报名
	onClickApply: async function (e) {
		const self = this;
		const { btntype } = e.currentTarget.dataset;
		const openId = wx.getStorageSync('openId');
		const userId = wx.getStorageSync('userId');
		if (!userId) {
			return login.getLogin();
		}
		// 判断是否已经获取用户手机号
		const phone = wx.getStorageSync('phone');
		if (!phone) {
			return this.setData({ phoneDialogVisible: true });
		}
		const { detail } = this.data;
		const data = {
			openId,
			type: btntype,
			userId,
			project_id: detail.project_id,
			subject_id: detail.id,
		};
		const result = await request.post({
			url: '/pay/paySignup',
			data: data,
		});
		const { appId, paySign, packageSign, nonceStr, timeStamp } = result;
		if (!paySign || !packageSign)
			return wx.showToast({
				title: '系统错误',
			});
		const params = {
			appId,
			timeStamp,
			nonceStr,
			paySign,
			signType: 'RSA',
			package: packageSign,
		};
		wx.requestPayment({
			...params,
			success(res) {
				if (res.errMsg === 'requestPayment:ok') {
					self.setData({ type: Number(btntype) === 1 ? 2 : 3 });
					if (Number(btntype) === 2) {
						self.setData({ team_uuid: result.team_uuid }, () => {
							self.getTeamDetail(result.team_uuid);
						});
					}
				}
			},
			fail() {},
		});
	},

	// 切换tan
	onTapTab: function (e) {
		const { idx } = e.detail;
		this.setData({ activeTabIdx: idx });
	},

	onShareAppMessage: function () {
		const { detailId, team_uuid } = this.data;
		const path = `/classDetail/calssDetail?teamUuid=${team_uuid}&id=${detailId}`;
		return {
			title: '驰昂考研',
			path,
		};
	},
});
