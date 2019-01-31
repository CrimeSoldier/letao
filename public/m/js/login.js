$(function () {
	var returnURL = location.search.replace('?returnURL=', '');// 返回地址
	$('#submit').on('tap', function () {
		var formStr = $('.lt-content form').serialize();// 表单序列化
		var formObj = LT.serialize2Object(formStr);// 转序列化字符串为对象
		// 判断用户名是否为空
		if (!formObj.username) {
			mui.toast('请输入用户名');
			return;
		}
		// 判断密码是否为空
		if (!formObj.password) {
			mui.toast('请输入密码');
			return;
		}
		$.ajax({
			url: '/user/login',
			type: 'post',
			data: formObj,
			dataType: 'json',
			success: function (data) {
				if (data.success == true) {// 登录成功
					if (returnURL) {// 存在返回地址
						location.href = returnURL;
						return;
					}else {// 不存在返回地址
						location.href = LT.userIndexURL;// 返回用户首页
						return;
					}
				}else {// 登录失败
					mui.toast(data.message);
				}
			},
			error: function () {
				mui.toast('服务器繁忙');
			}
		});
	});
});