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

	// 默认事件被阻止,设置点击商品的a标签进入商品详情页
	$('.product').on('tap', 'a', function () {
		location.href = $(this).attr('href');
	});

	// 根据key的值来保持搜索框中的值
	var search = location.search;// 拿location中的"?key=XXX"字符串
	var params = LT.getURLParams(search);
	$('.lt-search form input').val(params.key || '');

	// 点击搜索按钮则带参数重新加载该页面
	$('.lt-search form a').on('tap', function () {
		var key = $('.lt-search form input').val().replace(/\s+/g, "");
		if (!key) {
			mui.toast('请输入关键字搜索', {duration: '3000', type: 'div'});
			return;
		}
		// 带参数重新加载页面
		location.href = 'searchList.html?key=' + key;
	});

	// 排序搜索列表
	$('.lt-sort a').on('tap', function () {
		// 箭头向下代表由高到低,箭头向上代表由低到高
		var $this = $(this);
		if (!$this.hasClass('now')) {
			$this.addClass('now').siblings().removeClass('now')
			.find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
		}else {
			if ($this.find('span').hasClass('fa-angle-down')) {
				$this.find('span').removeClass('fa-angle-down').addClass('fa-angle-up');
			}else {
				$this.find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
			}
		}
		// 根据排序类型和参数获取搜索数据并渲染
		var sortParams = {
			page: 1,
			pageSize: 4,
			proName: params.key
		};
		var sortType = $this.attr('data-sort');
		var sortValue = $this.find('span').hasClass('fa-angle-down') ? 2 : 1;
		sortParams[sortType] = sortValue;
		render(sortParams);

	});

	// 下拉刷新和上拉加载
	mui.init({
	  pullRefresh: {
	    container: "#refreshContainer",// 下拉刷新和上拉加载容器标识,querySelector能定位的css选择器均可,比如：id、.class等
	    down: {
	      height: 50,// 可选,默认50,触发下拉刷新拖动距离
	      auto: false,// 可选,默认false,首次加载自动下拉刷新一次
	      contentdown: "下拉可以刷新",// 可选,在下拉可刷新状态时,下拉刷新控件上显示的标题内容
	      contentover: "释放立即刷新",// 可选,在释放可刷新状态时,下拉刷新控件上显示的标题内容
	      contentrefresh: "正在刷新...",// 可选,正在刷新状态时,下拉刷新控件上显示的标题内容
	      callback: function () {// 必选,刷新函数,根据具体业务来编写,比如通过ajax从服务器获取新数据
	      	currentPage = 1;
	      	getSearchData({
	      		page: currentPage,
				pageSize: 4,
				proName: params.key
	      	}, function (data) {
	      		//请求到的数据不带任何排序,所以需要重置排序组件样式
	      		$('.lt-sort a').removeClass('now').find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
	      		$('.lt-content .product').html(template('product', data));
	      		mui('#refreshContainer').pullRefresh().endPulldownToRefresh();// 结束刷新必须在ajax异步操作完成之后
	      		mui('#refreshContainer').pullRefresh().refresh(true);// 重置上拉加载
	      	});
	      }
	    },
	    up: {
	      height:50,// 可选,默认50,触发上拉加载拖动距离
	      auto:false,// 可选,默认false,自动上拉加载一次
	      contentrefresh: "正在加载...",// 可选,正在加载状态时,上拉加载控件上显示的标题内容
	      contentnomore:'没有更多数据了',// 可选,请求完毕若没有更多数据时显示的提醒内容
	      callback: function () {// 必选,刷新函数,根据具体业务来编写,比如通过ajax从服务器获取新数据
	      	var sortParams = {
				page: ++currentPage,
				pageSize: 4,
				proName: params.key
			};
			var sortOptions = $('.lt-sort a');
			for (var i = 0; i < sortOptions.length; i++) {
				var $sortOption = $(sortOptions[i]);
				if ($sortOption.hasClass('now')) {
					var sortType = $sortOption.attr('data-sort');
					var sortValue = $sortOption.find('span').hasClass('fa-angle-down') ? 2 : 1;
					sortParams[sortType] = sortValue;
					break;
				}
			}
			getSearchData(sortParams, function (data) {
	      		$('.lt-content .product').append(template('product', data));// 渲染的数据添加到原有数据之后
	      		// 当数据小于4条时结束上拉加载且该操作必须在ajax异步操作完成之后
	      		if (data.data.length < 4) {
	      			mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
	      		}
	      	});
	      }
	    }
	  }
	});

	// 获取搜索列表数据并传给回调函数
	var getSearchData = function (params, callback) {
		$.ajax({
			url: '/product/queryProduct',
			type: 'get',
			data: params,
			dataType: 'json',
			success: function (data) {
				callback && callback(data);
			}
		});
	};

	// 获取搜索数据并渲染
	var render = function (params) {
		getSearchData(params, function (data) {
			window.currentPage = 1;
			$('.lt-content .product').html(template('product', data));// 渲染搜索列表数据
		});
	};

	// 初始化页面时获取搜索数据并渲染
	render({
		page: 1,
		pageSize: 4,
		proName: params.key
	});
});