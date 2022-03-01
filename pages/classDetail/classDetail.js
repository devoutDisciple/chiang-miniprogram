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
		type: 1, // 1-未报名和未组团 2-已报名 3-已组团 4-已经退款
		tid: '', // 组团的id
		teamDetail: {}, // 组团详情
		phoneDialogVisible: false, // phone的弹框
		userDialogVisible: false, // 用户信息弹框
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
		teamProcess: {},
		dialogVisible: false,
		btnType: 1, // 1-报名 2-组团
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const { id, teamUuid, showTeamProcess } = options;
		if (!id) {
			return wx.switchTab({
				url: '/pages/chiang/index',
			});
		}
		if (showTeamProcess) {
			this.setData({
				tab: [
					...this.data.tab,
					{
						id: 4,
						key: 'teamProcess',
						name: '拼团进度',
					},
				],
			});
		}
		if (teamUuid) {
			this.setData({ tid: teamUuid });
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
		const photo = wx.getStorageSync('photo');
		const username = wx.getStorageSync('username');
		if (!phone) {
			this.setData({ phoneDialogVisible: true });
		}
		if (!photo || !username) {
			this.setData({ userDialogVisible: true });
		}
	},

	// 关闭获取手机号弹框
	onClosePhoneDialog: function () {
		this.setData({ phoneDialogVisible: false });
	},

	// 关闭获取用户信息弹框
	onCloseUserInfoDialog: function () {
		this.setData({ userDialogVisible: false });
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
		if (!orderDetail) return;
		if (!orderDetail.type) {
			this.setData({ type: 1 });
		}
		if (orderDetail.type === 1) {
			this.setData({ type: 2 });
		}
		if (orderDetail.type === 2) {
			this.setData({ type: 3, tid: orderDetail.team_uuid }, () => {
				this.getTeamDetail(orderDetail.team_uuid);
			});
		}
		if (Number(orderDetail.pay_state) === 2) {
			this.setData({ type: 4 });
		}
	},

	// 根据teamUUid获取组团详情
	getTeamDetail: async function (team_uuid) {
		const teamDetail = await request.get({
			url: '/team/teamDetailByTeamUuid',
			data: { team_uuid },
		});
		this.setData({ teamDetail: teamDetail, tid: teamDetail.uuid });
	},

	// 获取组团进度
	getTeamProcess: async function () {
		const { tid } = this.data;
		if (!tid) return;
		loading.showLoading();
		const teamProcess = await request.get({
			url: '/team/teamDetailAndProcessByUserid',
			data: { team_uuid: tid },
		});
		this.setData({ teamProcess: teamProcess });
		loading.hideLoading();
	},

	// 刷新
	onRefresh: async function () {
		this.setData({ refresherTriggered: true });
		await this.getSubjectDetailById(this.data.detailId);
		this.setData({ refresherTriggered: false });
	},

	// 切换tan
	onTapTab: function (e) {
		const { idx } = e.detail;
		this.setData({ activeTabIdx: idx });
		if (idx === 3) {
			this.getTeamProcess();
		}
	},

	onShareAppMessage: function () {
		const { detailId, tid } = this.data;
		let path = `/pages/classDetail/classDetail?id=${detailId}`;
		if (tid) {
			path += `&teamUuid=${tid}&showTeamProcess=true`;
		}
		return {
			title: '驰昂考研',
			path,
		};
	},

	// 预览图片
	onPreviewImg: function (e) {
		const { url } = e.currentTarget.dataset;
		wx.previewImage({
			urls: [url],
			showmenu: true,
		});
	},

	// 点击关闭弹框
	onCloseDialog: function () {
		this.setData({ dialogVisible: false });
	},

	// 点击报名或者拼团
	onTapBtn: function (e) {
		const { btntype } = e.currentTarget.dataset;
		this.setData({ btntype, dialogVisible: true });
	},

	// 支付
	onPay: async function (avg) {
		console.log(avg, 111);
		const { name, sex, time, en, ma } = avg;
		const self = this;
		const { btntype } = this.data;
		const openId = wx.getStorageSync('openId');
		const userId = wx.getStorageSync('userId');
		if (!userId) {
			return login.getLogin();
		}
		// 判断是否已经获取用户手机号
		const phone = wx.getStorageSync('phone');
		const photo = wx.getStorageSync('photo');
		const username = wx.getStorageSync('username');
		if (!phone) {
			return this.setData({ phoneDialogVisible: true });
		}
		if (!photo || !username) {
			return this.setData({ userDialogVisible: true });
		}
		const { detail, tid } = this.data;
		const data = {
			openId,
			type: btntype,
			userId,
			project_id: detail.project_id,
			subject_id: detail.id,
			name,
			sex,
			time,
			en,
			ma,
		};
		if (tid) {
			data.teamId = tid;
		}
		const result = await request.post({
			url: '/pay/paySignup',
			data: data,
		});
		const { appId, paySign, packageSign, nonceStr, timeStamp, team_uuid } = result;
		if (!paySign || !packageSign)
			return wx.showToast({
				title: '系统错误',
				icon: 'error',
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
						self.setData({ tid: team_uuid });
						// self.getTeamDetail(team_uuid);
					}
				}
			},
			fail() {},
		});
	},

	// 点击关闭弹框
	onSureDialog: function (e) {
		// eslint-disable-next-line prefer-const
		let { name, sex, time, english, math } = e.detail;
		let en = 1;
		let ma = '';
		if (sex === '男') sex = 1;
		if (math === '数学一') ma = 1;
		if (math === '数学二') ma = 2;
		if (math === '数学三') ma = 3;
		if (english === '英语一') en = 1;
		if (english === '英语二') en = 2;
		this.setData({ dialogVisible: false });
		this.onPay({ name, sex, time, en, ma });
	},
});
