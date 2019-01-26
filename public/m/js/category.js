$(function () {
	mui('.mui-scroll-wrapper').scroll({
		scrollY: true, //是否竖向滚动
		scrollX: false, //是否横向滚动
		startX: 0, //初始化时滚动至x
		startY: 0, //初始化时滚动至y
		indicators: false, //是否显示滚动条
		deceleration: 0.0006, //阻尼系数,系数越小滑动越灵敏
		bounce: true //是否启用回弹
	});

	// 默认渲染一级分类数据和渲染一级分类的第一个选项所对应的二级分类数据
	getFirstCategoryData(function (data) {
		$('.category-left ul').html(template('firstCategory', data));//渲染一级分类数据
		//渲染一级分类的第一个选项所对应的二级分类数据
		var categoryID = $('.category-left ul li:first-child').attr('data-id');//拿到第一个li的data-id
		renderSecondCategory(categoryID);
	});

	// 点击一级分类选项渲染对应的二级分类数据
	$('.category-left ul').on('tap', 'li', function () {// 因为li是动态的，所以使用委托的方式绑定tap事件
		if ($(this).hasClass('now')) return;// 重复点击则不请求数据
		// 请求二级分类数据并渲染
		var categoryID = $(this).attr('data-id');//拿到所点击的li的data-id
		renderSecondCategory(categoryID);
		// 切换now这个类
		$('.category-left ul li').removeClass('now');
		$(this).addClass('now');
	});
});

// 获取一级分类数据并传给回调函数
var getFirstCategoryData = function (callback) {
	$.ajax({
		url: '/category/queryTopCategory',
		type: 'get',
		data: '',
		dataType: 'json',
		success: function (data) {
			callback && callback(data);
		}
	});
};

//获取二级分类数据并传给回调函数
var getSecondCategoryData = function (params, callback) {
	$.ajax({
		url: '/category/querySecondCategory',
		type: 'get',
		data: params,
		dataType: 'json',
		success: function (data) {
			callback && callback(data);
		}
	});
};

// 获取二级分类数据并渲染
var renderSecondCategory = function (categoryID) {//参数是li的data-id
	getSecondCategoryData({
		id: categoryID
	}, function (data) {
		$('.category-right ul').html(template('secondCategory', data));
	});
};