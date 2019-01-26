$(function () {
	// 区域滚动初始化
	mui('.mui-scroll-wrapper').scroll({
		scrollY: true, //是否竖向滚动
		scrollX: false, //是否横向滚动
		startX: 0, //初始化时滚动至x
		startY: 0, //初始化时滚动至y
		indicators: false, //是否显示滚动条
		deceleration: 0.0008, //阻尼系数,系数越小滑动越灵敏
		bounce: true //是否启用回弹
	});
	// 保持搜索框中的值
	var search = location.search;// 拿location中的"?key=XXX"字符串
	var params = LT.getURLParams(search);
	$('.lt-search form input').val(params.key || '');

	// 初始化:获取搜索数据并渲染
	getSearchData({
		page: 1,
		pageSize: 4,
		proName: params.key

	}, function (data) {
		// 渲染搜索列表数据
	});

	//获取搜索列表数据并传给回调函数
	var getSearchData = function (params, callback) {
		$ajax({
			url: '/product/queryProduct',
			type: 'get',
			data: params,
			dataType: 'json',
			success: function (data) {
				callback && callback(data);
			}
		});
	};
});