import request from '../../utils/request';

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		visible: {
			type: Boolean,
			value: false,
		},
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		logoUrl: 'https://www.chiangky.com/public/logo.png',
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		getUserInfo: function () {
			wx.getUserProfile({
				desc: '获取您的昵称、头像',
				complete: (res) => {
					if (res.userInfo) {
						const { nickName, avatarUrl } = res.userInfo;
						const userid = wx.getStorageSync('userId');
						request.post({
							url: '/user/updateInfo',
							data: { userid: userid, username: nickName, photo: avatarUrl },
						});
						wx.setStorageSync('username', nickName);
						wx.setStorageSync('photo', avatarUrl);
						this.setData({ username: nickName, photo: avatarUrl });
					}
					this.triggerEvent('OnClose');
				},
			});
		},
		onClose: function () {
			this.triggerEvent('OnClose');
		},
	},
});
