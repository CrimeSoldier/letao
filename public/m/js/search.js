$(function () {
	$('.lt-search form a').on('tap', function() {
		var key = $('.lt-search form input').val().replace(/\s+/g, "");//正则表达式将字符串中的空格去掉
		// 用户没有输入关键字
		if (!key) {
			mui.toast('请输入关键字搜索', {duration: '3000', type: 'div'});
			return;
		}
		//用户输入了关键字
		location.href = 'searchList.html?key=' + key;
	});
});