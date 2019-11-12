$(function() {

	//格式化时间
	function formatTime(m) {
		//将毫秒转换为秒
		var second = Math.floor(m / 1000 % 60);

		second = second >= 10 ? second : '0' + second;

		//将毫秒转换为分钟
		var minute = Math.floor(m / 1000 / 60);

		minute = minute >= 10 ? minute : '0' + minute;

		return minute + ':' + second;
	}

	// 开始截取下标
	var startIndex = 0;
	// 截取数据数量
	var count = 12
	//标记是否存在数据
	var isHas = true;

	function createData(data) {

		$.each(data, function(i, v) {

			var div = $(
				`<div class="info-item fl" id="${v.id}">
						<div class="info-item-top clearfix">
							<div class="fr">
								<span class="fl listen-icon"></span>
								<span class="fl listen-count">${v.playCount}</span>
							</div>
						</div>
						<div class="info-item-img">
							<img class="auto-img" src="${v.picUrl}" >
						</div>
						<div class="info-item-text">
							${v.name}
						</div>
					</div>`
			);

			$('.recommend-info').append(div);

		})

	}


	//获取热门推荐内容
	$.ajax({

		type: 'GET',

		url: 'http://www.arthurdon.top:3000/personalized',

		success: function(result) {

			// createData(result.result);

		},

	})

	var recommendInfo = localStorage.getItem('recommendInfo');
	// console.log('recommendInfo ==> ', recommendInfo);

	if (!recommendInfo) {

		console.log('不存在缓存数据');

		$.ajax({

			type: 'GET',

			url: 'http://www.arthurdon.top:3000/personalized',

			success: function(result) {

				localStorage.setItem('recommendInfo', JSON.stringify(result));

				recommendInfo = result;

				createData(result.result.slice(startIndex, startIndex + count));

				startIndex += count;

			}

		})

	} else {

		recommendInfo = JSON.parse(recommendInfo);

		console.log('存在缓存数据');

		createData(recommendInfo.result.slice(startIndex, startIndex + count));

		startIndex += count;

	}

	var headerHeight = parseFloat($('header').css('height'));
	// console.log('headerHeight==>',headerHeight);

	$('.main-content1').on('scroll', function() {


		if (!isHas) {
			console.log('没有更多数据可加载');
			return;
		}

		timers = [];


		var self = this;

		var timer = setTimeout(function() {

			for (var i = 1; i < timers.length; i++) {
				clearTimeout(timer[i]);
			}


			var scrollTop = $(self).scrollTop();
			// console.log('scrollTop==>',scrollTop);

			//最后一个节点
			var last = $('.info-item').last();
			var lastTop = parseFloat(last.offset().top);
			var lastHeight = parseFloat(last.css('height'));

			// console.log('lastTop==>',lastTop);

			// console.log('scrollTop + headerHeight + lastHeight ==>',scrollTop + headerHeight + lastHeight)

			if (scrollTop + headerHeight + lastHeight >= lastTop) {

				var data = recommendInfo.result.slice(startIndex, startIndex + count);
				createData(data);

				startIndex += count;

				if (data.length < count) {
					isHas = false;
				}

			}

		}, 400);

		timers.push(timer);

	})

	var songName = '';
	//绑定推荐歌单点击事件, 未来创建的节点也会绑定
	$('.recommend-info').on('click', '.info-item', function() {
		var songId = $(this).attr('id');

		$('.main-content1').hide();

		$('.main-content2').show();



		$.ajax({

			type: 'GET',

			url: 'http://www.arthurdon.top:3000/playlist/detail?id=' + songId,

			success: function(result) {

				$('.main-content1').hide().attr('name', 'song0');

				$('.main-content2').show().attr('name', 'song1');


				$('#name').text(result.playlist.name);

				var data = result.playlist.tracks.slice(0, 12);

				localStorage.setItem('currentSongs', JSON.stringify(result));

				$.each(data, function(i, v) {

					var div = $(
						`<div data-id="${v.id}" data-play="0" class="song-list-item ">
							<div class="fl song-list-item-left">
								<div class="fl song-list-item-left-img">
									<img class="auto-img" src="${v.al.picUrl}" />
								</div>
								<div class="fl song-list-item-left-text">
									<div class="song-list-item-left-text1">${v.al.name}</div>
									<div class="song-list-item-left-text2">${v.name}</</div>
								</div>
							</div>
									
						</div>
						<div class="fr song-list-item-right ">
							<div class="fl song-list-item-time">${formatTime(v.dt)}</div>
							<div class="fl song-list-item-line">
								<i></i>
								<i></i>
								<i></i>
								<i></i>
								<i></i>
							</div>
						</div>
								
								`);

					$('.recommend-song-list').append(div);

				})

				// song.id = result.playlist.id;

			}

		})



	})




})
