// component/tab/tab.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		list: {
			type: Array,
			value: [],
		},
		activeIdx: {
			type: Number,
			value: 0,
			// observer: function (e) {
			// 	console.log(e, 3443);
			// },
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
		onTapTab: function (e) {
			this.triggerEvent('OnTapTab', { idx: e.currentTarget.dataset.idx });
		},
	},
});
