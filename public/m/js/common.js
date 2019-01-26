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