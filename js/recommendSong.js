$(function() {

	function formatTime(m) {
		//将毫秒转换为秒
		var second = Math.floor(m / 1000 % 60);

		second = second >= 10 ? second : '0' + second;

		//将毫秒转换为分钟
		var minute = Math.floor(m / 1000 / 60);

		minute = minute >= 10 ? minute : '0' + minute;

		return minute + ':' + second;
	}

	var startIndex = 12;

	//截取数据数量
	var count = 12;

	//标记是否存在数据
	var isHas = true;

	//音频id前缀
	var baseAudioUrl = 'http://www.arthurdon.top:3000/song/url';

	var audio = $('#audio')[0];

	function createData(data) {

		$.each(data, function(i, v) {

			// console.log('v.name==>',v.name);

			var div1 = $(
				`<div data-id="${v.id}" data-play="0" class="song-list-item">
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
						<div class="fr song-list-item-right">
							<div class="fl song-list-item-time">${formatTime(v.dt)}</div>
							<div class="fl song-list-item-line">
								<i></i>
								<i></i>
								<i></i>
								<i></i>
								<i></i>
							</div>
						</div>
						
						`
			);

			$('.recommend-song-list').append(div1);

		})

	};

	var timers = [];

	var headerHeight = parseFloat($('header').css('height'));
	// console.log('headerHeight ==>', headerHeight);

	function scrollAgain() {

		$('.main-content2').on('scroll', function() {


			if (!isHas) {
				return;
			}

			var self = this;

			var currentSongs = JSON.parse(localStorage.getItem('currentSongs'));

			var songData = currentSongs.playlist.tracks;

			var timer = setTimeout(function() {

				for (var i = 1; i < timers.length; i++) {
					clearTimeout(timers[i]);
				}

				var scrollTop = $(self).scrollTop();

				var last = $('.song-list-item').last();

				var lastTop = last.offset().top;

				var lastHeight = parseFloat(last.css('height'));

				// console.log('lastTop==>',lastTop);
				// console.log('scrollTop + headerHeight + lastHeight ==>', scrollTop + headerHeight + lastHeight * 3);

				if (scrollTop + headerHeight + lastHeight * 3 >= lastTop) {
					console.log('触发加载');
					var data = songData.slice(startIndex, startIndex + count);
					createData(data);

					startIndex += count;

					if (data.length < count) {
						isHas = false;
					}
				}

				timers = [];

			}, 400)

			timers.push(timer);

		})

	}



	$('.main-content2').on('scroll', function() {


		if (!isHas) {
			return;
		}

		var self = this;

		var currentSongs = JSON.parse(localStorage.getItem('currentSongs'));

		var songData = currentSongs.playlist.tracks;

		var timer = setTimeout(function() {

			for (var i = 1; i < timers.length; i++) {
				clearTimeout(timers[i]);
			}

			var scrollTop = $(self).scrollTop();

			var last = $('.song-list-item').last();

			var lastTop = last.offset().top;

			var lastHeight = parseFloat(last.css('height'));

			// console.log('lastTop==>',lastTop);
			// console.log('scrollTop + headerHeight + lastHeight ==>', scrollTop + headerHeight + lastHeight * 3);

			if (scrollTop + headerHeight + lastHeight * 3 >= lastTop) {
				console.log('触发加载');
				var data = songData.slice(startIndex, startIndex + count);
				createData(data);

				startIndex += count;

				if (data.length < count) {
					isHas = false;
				}
			}

			timers = [];

		}, 400)

		timers.push(timer);

	})


	audio.oncanplay = function() {

		this.play();

		$('.song-list-item-active').data('play', 1).find('.song-list-item-line').addClass('play-active');

		$('.song-word-main').empty();

		//下方播放暂停按钮
		$('#playpause').css({
			background: 'url(./icons/pause.png)',
			backgroundSize: '.22rem .22rem'
		})

		var imgUrl = $('.song-list-item-active').find('img').attr('src');

		var songid = $('.controls-box-icon').attr('id');

		$.ajax({
			type: 'GET',
			url: 'http://www.arthurdon.top:3000/lyric',
			data: {
				//歌曲id
				id: songid
			},
			success: function(data) {

				console.log('已加载歌词', data);

				var lrc = data.lrc.lyric;

				// console.log(lrc);

				lrc = lrc.split(/[\n\r]/);

				// console.log(lrc);

				lrc.splice(-1, 1);

				for (var i = 0; i < lrc.length; i++) {

					//根据]符号切割数组内的元素
					var lrcItem = lrc[i].split(/\]/);

					var songCt = lrcItem[0].slice(1);

					var time = songCt.split(/:/);

					var minute = Number(time[0]) * 60;

					var second = Number(time[1]);

					var t0 = minute + second;

					var p = $(`<p name="${t0}">${lrcItem[1]}</p>`);
					$('.song-word-main').append(p);

				}

			}
		})
	}






	$('.recommend-song-list').on('click', '.song-list-item', function() {

		var self = this;


		//当前是否处于激活状态
		if ($(this).hasClass('song-list-item-active')) {

			var playStatus = $(this).data('play');

			console.log('playStatus==>', playStatus);

			//playStatus==> 0 当前状态：播放  name ==> 1 当前状态：播放

			if (playStatus == 0 && $('#playpause').attr('name') == 1) {

				audio.pause();

				$(this).find('.song-list-item-line').removeClass('play-active');

				$('.controls-box-icon').removeClass('active');

				$('#playpause').css({
					background: 'url(./icons/play.png)',
					backgroundSize: '.22rem .22rem',
					backgroundposition: 'center center'
				})

				$('#playpause').attr('name', 0);

				$(this).data('play', 1);


			} else if (playStatus == 1 && $('#playpause').attr('name') == 0) {

				audio.play();
				$('#playpause').css({
					background: 'url(./icons/pause.png)',
					backgroundSize: '.22rem .22rem',
					backgroundposition: 'center center'
				})
				$(this).find('.song-list-item-line').addClass('play-active');

				$('.controls-box-icon').addClass('active');

				$('#playpause').attr('name', 1);

				$(this).data('play', 0);


			} else if (playStatus == 1 && $('#playpause').attr('name') == 1) {
				audio.pause();
				$('#playpause').css({
					background: 'url(./icons/play.png)',
					backgroundSize: '.22rem .22rem',
					backgroundposition: 'center center'
				})
				$(this).find('.song-list-item-line').removeClass('play-active');

				$('.controls-box-icon').removeClass('active');

				$('#playpause').attr('name', 0);

				$(this).data('play', 1);

			} else {
				audio.play();
				$('#playpause').css({
					background: 'url(./icons/pause.png)',
					backgroundSize: '.22rem .22rem',
					backgroundposition: 'center center'
				})
				$(this).find('.song-list-item-line').addClass('play-active');

				$('.controls-box-icon').addClass('active');

				$('#playpause').attr('name', 1);

				$(this).data('play', 0);

			}

		} else {

			var songId = $(this).data('id');
			// console.log('songId==>', songId);

			$('.controls-box-icon').attr('id', songId);

			//获取歌曲详情
			$.ajax({
				type: 'GET',
				url: 'http://www.arthurdon.top:3000/song/detail?ids=' + songId,
				success: function(result) {

					console.log(result);
					$('.controls-box-icon').attr('name', result.songs[0].dt);

					$('.one-text-top').text(result.songs[0].al.name);

					$('.one-text-bottom').text(result.songs[0].name);

					$('.controls-box-icon').css({
						background: 'url(' + result.songs[0].al.picUrl + ')',
						backgroundSize: '.8rem .8rem'
					})

					$('.song-word-img').css({
						background: 'url(' + result.songs[0].al.picUrl + ')',
						backgroundSize: '2.5rem 2.5rem'
					})

					$('#song-word-song').text(result.songs[0].al.name);

					$('#song-word-singer').text(result.songs[0].name);

					$('.controls-box-icon').addClass('active');


					var $songsListItems = $('.recommend-song-list>.song-list-item-active');
					// console.log('$songsListItems==>',$songsListItems);

					var $songsList = $('.recommend-song-list>.song-list-item');

					var cId = $('.controls-box-icon').attr('id');
					// console.log('cId==>',cId);

					for (var i = 0; i < $songsList.length; i++) {


						var sId = $($songsList[i]).data('id');
						// console.log('sId==>',sId);

						if (sId == cId) {
							// console.log('$songsList[i]==>',$songsList[i]);
							$($songsList[i]).addClass('song-list-item-active');
						}

					}


					//获取音频链接
					$.ajax({
						type: 'GET',
						url: baseAudioUrl,
						data: {
							id: songId
						},
						success: function(songUrl) {


							var $songListItem = $('.song-list-item-active');

							console.log('$songListItem==>', $songListItem);

							for (var i = 0; i < $songListItem.length; i++) {

								if ($songListItem.length >= 1) {
									$($songListItem[i-1]).removeClass('song-list-item-active').data('play', 0);

									var $songPlay = $songListItem.find('.song-list-item-line');
									if ($songPlay.hasClass('play-active')) {
										$songPlay.removeClass('play-active');
									}
								};
							}



							$('#playpause').attr('name', 1);

							$(audio).attr('src', songUrl.data[0].url);

							$(self).addClass('song-list-item-active');

							$(self).find('.song-list-item-line').addClass('play-active');

							$(audio).attr('name', songId);

							// console.log(songId);




						}
					})

				}
			})


		}


	})



	$('#playpause').on('click', function() {

		var playpause = $(this).attr('name');
		console.log('playpause ==> ', playpause);

		if (playpause == 2) {
			return;
		}

		if (playpause == 1) {

			$(this).attr('name', 0);

			audio.pause();

			$('.controls-box-icon').removeClass('active');

			$('.song-list-item-active').find('.song-list-item-line').removeClass('play-active');

			$(this).css({
				background: 'url(./icons/play.png)',
				backrepeat: 'no-repeat',
				backgroundSize: '.22rem .22rem',
				backgroundposition: 'center center'
			})

		} else if (playpause == 0) {

			$(this).attr('name', 1);

			audio.play();

			$('.controls-box-icon').addClass('active');

			$('.song-list-item-active').find('.song-list-item-line').addClass('play-active');

			$(this).css({
				background: 'url(./icons/pause.png)',
				backrepeat: 'no-repeat',
				backgroundSize: '.22rem .22rem',
				backgroundposition: 'center center'
			})
		}
	})


	$('#mySong').on('click', function() {

		$('.main-content2').hide().attr('name', 'song0');

		$('.main-content1').show().attr('name', 'song1');

		$('.recommend-song-list').empty();
	})


})
