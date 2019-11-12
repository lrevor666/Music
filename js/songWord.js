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

	var isPress = false;
	
	window.index = 0;
	
	var wordsBoxTop = parseFloat($('.song-word-main').css('top'));

	$('.controls-box-icon').on('click', function() {

		//触发歌词界面
		$('.song-word').animate({
			// display:'block',
			top: 0,
		}, 300)


	})

	$('.song-word-return').on('click', function() {

		$('.song-word').animate({
			// display:'none',
			top: '100%',
		}, 300)

	})
	
	var progressWidth = $('.progress').width();
	
	var maskWidth = $('.mask').width();
	
	var minLeft = 0;
	
	var maxLeft = progressWidth - maskWidth;

	audio.ontimeupdate = function() {

		if(isPress){
			return;
		}
		
		var thisT = this.currentTime;
		
		var dt = parseInt($('.controls-box-icon').attr('name') / 1000);
		
		var percent1 = thisT / dt;
		
		$('.s-time').text(formatTime(thisT * 1000));
		
		$('.e-time').text(formatTime(dt * 1000));
		
		$('.mask').css({
		  left: maxLeft * percent1 + 'px'
		})
		
		$('.active-progress').css({
		  width: (maxLeft * percent1) + maskWidth / 2 + 'px'
		})
		
		var $ps = $('.song-word-main>p');
		
		var pHeight = $($ps[0]).height();
		
		for(var i = index;i < $ps.length;i++){
			
			var t1 = Number($($ps[i]).attr('name'));
			
			var t2 = 0;
			if($ps[i+1]){
				t2 = Number($($ps[i+1]).attr('name'));
			}else{
				t2 = Number.MAX_VALUE;
			}
			
			if(thisT >= t1 && thisT < t2){
				index = i;
				
				$($ps[i]).addClass('active').prev().removeClass('active');
				
				var top = wordsBoxTop - pHeight * i;
				
				$('.song-word-main').animate({
				  top: top + 'px'
				}, 20)
				
				break;
			}
			
		}

	}



	$('.song-word-img').on('click',function(){
		
		var imgName = $('.song-word-img').attr('name');
		
		console.log('imgName==>',imgName);
		
		var bg = $(".controls-box-icon").css("background");
		
		if(imgName == 0){
			$('.song-word-img').css({
				background:'transparent',
			})
			$('.song-word-img').attr('name',1);
		}
		if(imgName == 1){
			$('.song-word-img').css({
				background:bg,
				backgroundRepeat:'no-repeat',
				backgroundSize:'2.5rem 2.5rem',
			})
			$('.song-word-img').attr('name',0);
		}
	
		
	})


	$('#song-word-play').on('click',function(){
		
		
		
	})

})
