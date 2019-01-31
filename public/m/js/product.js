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
	// 点击加入购物车按钮,将数据提交给接口,需要用户登录
	$('#add-to-cart').on('tap', function () {
		// 判断是否选择尺码和数量
		if (!$('.product-size .size.now').length) {
			mui.toast('请选择尺码');
			return;
		}
		if ($('.product-quantity .quantity').val() == '0') {
			mui.toast('请选择数量');
			return;
		}
		// ajax请求向接口提交数据,需要用户登录
		LT.loginAjax({
			url: '/cart/addCart',
			type: 'post',
			data: {
				productId: productID,
				num: $('.product-quantity .quantity').val(),
				size: $('.product-size .size.now').text()
			},
			dataType: 'json',
			success: function (data) {
				// 商品成功添加到购物车
				if (data.success == 'true') {
					mui.confirm('添加成功！是否去购物车看看？', '温馨提示', ['是', '否'], function(e) {
						if (e.index == 0) {
							location.href = LT.cartURL;// 跳转到购物车页面
						} else {
							// 点击'否'则留在当前页面
						}
					});
				}
			}
		});
	});
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
		$('.lt-content .mui-scroll').html(template('product-detail', data));
		//轮播图初始化,必须在ajax异步操作之后
		mui('.mui-slider').slider({
		  interval:5000//自动轮播周期，若为0则不自动播放，默认为0；
		});
		// 在ajax异步操作之后给尺码绑定tap事件
		$('.product-size .size').on('tap', function () {
			$(this).addClass('now').siblings('.size').removeClass('now');
		});
		// 在ajax异步操作之后给"+"、"-"绑定tap事件
		$('.product-quantity span').on('tap', function () {
			var value = parseInt($('.product-quantity .quantity').val());
			var maxValue = parseInt($('.product-quantity .remain').text());
			if ($(this).hasClass('minus')) {// 点击了"-"
				if (value <= 0) return;
				else {
					value--;
					$(this).siblings('.quantity').val(value);
				}
			}else if ($(this).hasClass('plus')) {// 点击了"+"
				if (value >= maxValue) {
					mui.toast('数量已达上限');
					return;
				}else {
					value++;
					$('.product-quantity .quantity').val(value);
				}
			}
		});
	});
};