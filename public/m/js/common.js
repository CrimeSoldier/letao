window.LT = {};
LT.getURLParams = function (search) {
	if(search) {
		var params = {};
		var searchArr = search.replace('?', '').split('&');
		searchArr.forEach(function (item, i) {
			var itemArr = item.split('=');
			params[itemArr[0]] = itemArr[1];
		});
		return params;
	}
	return;
};
// 登录页地址
LT.loginURL = '/m/login.html';
// 购物车页地址
LT.cartURL = '/m/cart.html';
// 用户首页地址
LT.userIndexURL = '/m/user/index.html';
// 需要进行登录验证的ajax请求
LT.loginAjax = function (params) {
	$.ajax({
		url: params.url || '',
		type: params.type || 'get',
		data: params.data || '',
		dataType: params.dataType || 'json',
		success: function (data) {
			// 未登录状态的拦截,跳转到登录页
			if (data.error == 400) {
				location.href = LT.loginURL + "?returnURL=" + location.href;
				return;
			}else {// 表示已登录状态
				params.success && params.success(data);
			}
		},
		error: function () {
			mui.toast('服务器繁忙');
		}
	});
};
LT.serialize2Object = function (serializeStr) {
	var obj = {};
	var arr = serializeStr.split('&');
	arr.forEach(function (item, index) {
		var itemArr = item.split('=');
		obj[itemArr[0]] = itemArr[1];
	});
	return obj;
};