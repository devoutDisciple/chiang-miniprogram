// component/getPhone/getPhone.js
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
	data: {},

	/**
	 * 组件的方法列表
	 */
	methods: {
		getPhoneNumber: function (e) {
			console.log(e, 32832);
		},
		onClose: function () {
			this.triggerEvent('OnClose');
		},
	},
});
