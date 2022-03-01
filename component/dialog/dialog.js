// component/dialog/dialog.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {},

	/**
	 * 组件的初始数据
	 */
	data: {
		sexList: ['男', '女'],
		sexSelect: '',
		englishList: ['英语一', '英语二'],
		englishSelect: '',
		mathematicsList: ['数学一', '数学二', '数学三'],
		mathematicsSelect: '',
		timeSelect: '',
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		onBlurIpt: function (e) {
			this.setData({ name: e.detail.value });
		},
		onPickSex: function (e) {
			const { sexList } = this.data;
			this.setData({ sexSelect: sexList[e.detail.value] });
		},
		onPickDate: function (e) {
			this.setData({ timeSelect: e.detail.value });
		},
		onPickEnglish: function (e) {
			const { englishList } = this.data;
			this.setData({ englishSelect: englishList[e.detail.value] });
		},
		onPickMath: function (e) {
			const { mathematicsList } = this.data;
			this.setData({ mathematicsSelect: mathematicsList[e.detail.value] });
		},
		showError: function (title) {
			return wx.showToast({
				title: title,
				icon: 'error',
			});
		},
		onClose: function () {
			this.triggerEvent('OnClose');
		},
		onSure: function () {
			const { name, sexSelect, englishSelect, mathematicsSelect, timeSelect } = this.data;
			if (!name) return this.showError('请输入姓名');
			if (!sexSelect) return this.showError('请选择性别');
			if (!englishSelect) return this.showError('请选择英语');
			if (!timeSelect) return this.showError('请选择时间');
			this.triggerEvent('OnSure', {
				name,
				sex: sexSelect,
				english: englishSelect,
				math: mathematicsSelect,
				time: timeSelect,
			});
		},
	},
});
