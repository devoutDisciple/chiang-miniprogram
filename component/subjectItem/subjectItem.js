// component/class/class.js

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		subject: {
			type: Object,
			value: {},
		},
		pageName: {
			type: String,
			value: '',
		},
		type: {
			type: Number,
			value: 1,
		},
		teamState: {
			type: String,
			value: '',
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
		onClick: function () {
			this.triggerEvent('OnTap');
		},
	},

	attached() {},
});
