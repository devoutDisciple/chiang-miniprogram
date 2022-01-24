const team_state = [
	{
		state: 1,
		label: '未开始',
	},
	{
		state: 2,
		label: '进行中',
	},
	{
		state: 3,
		label: '拼团成功',
	},
	{
		state: 4,
		label: '拼团失败',
	},
	{
		state: 5,
		label: '拼团失败',
	},
	{
		state: 6,
		label: '已退款',
	},
];

const filterTeamState = (state) => {
	return team_state.filter((item) => Number(item.state) === Number(state))[0].label;
};

module.exports = {
	filterTeamState,
};
