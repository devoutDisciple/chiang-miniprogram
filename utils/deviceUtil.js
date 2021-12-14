const getDeviceInfo = () => {
	return new Promise((resolve) => {
		// 菜单按钮的布局信息
		const menuDetail = wx.getMenuButtonBoundingClientRect();
		// 获取设备信息
		wx.getSystemInfo({
			success: function (res) {
				const { height: btnHeight, top: btnTop, width: btnWidth, right: btnRight } = menuDetail;
				const { screenHeight, statusBarHeight, screenWidth, system, pixelRatio, model } = res;
				const headerHight = (btnTop - statusBarHeight) * 2 + statusBarHeight + btnHeight;
				const navHeight = headerHight - statusBarHeight;
				const disWidth = (screenWidth - btnRight) * 2 + btnWidth;
				const paddingLeft = screenWidth - btnRight;
				const paddingTop = btnTop - statusBarHeight;
				const conHegiht = navHeight - paddingTop * 2;
				resolve({
                    // 屏幕高度，单位px
					screenHeight, 
                    // 屏幕宽度，单位px
					screenWidth,
                    // 操作系统及版本
					system,
                    // 设备像素比
					pixelRatio,
                    // 设备型号。新机型刚推出一段时间会显示unknown，微信会尽快进行适配。
					model,
                    // 状态栏的高度，单位px
					statusBarHeight,
					headerHight,
					navHeight,
					conHegiht,
					disWidth,
					paddingLeft,
					paddingTop,
				});
			},
		});
	});
};

module.exports = {
	getDeviceInfo,
};
