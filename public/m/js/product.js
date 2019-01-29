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
	render(productID.productID);
});

// 获取商品ID
var productID = LT.getURLParams(location.search);

// 获取商品详情数据
var getProductData = function (productID, callback) {
	$.ajax({
		url: '/product/queryProductDetail',
		type: 'get',
		data: {
			id: productID
		},
		dataType: 'json',
		success: function (data) {
			callback && callback(data);
		}
	});
};

// 渲染商品详情数据
var render = function (productID) {
	getProductData(productID, function (data) {
		console.log(data);
	});
};