/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/build";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var browserService = __webpack_require__(1);
	var audioService = __webpack_require__(2);
	var BorderAnimation = __webpack_require__(3).BorderAnimation;

	// 构造音频文件
	var audio, context;
	try {
	    context = new AudioContext();
	} catch (e) {
	    alert('您的浏览器不支持当前api,请使用最新版本的chrome进行体验.');
	    document.querySelector('.not-support').classList.add('open');
	}

	var processor = context.createScriptProcessor(256),
	    analyser = context.createAnalyser();

	processor.connect(context.destination);
	analyser.connect(processor);

	// 构建解析器数据
	var data = new Uint8Array(analyser.frequencyBinCount);

	var Sound = {
	    // 音频播放元素,audio
	    element: undefined,
	    // 播放音频,连接audio元素和解析器
	    play: function play() {
	        var sound = context.createMediaElementSource(this.element);

	        // 结束时断开整个连接
	        this.element.onended = function () {
	            sound.disconnect();
	            sound = null;
	            processor.onaudioprocess = function () {};
	        };

	        // 连接解析器,开始进行处理
	        sound.connect(analyser);
	        sound.connect(context.destination);

	        processor.onaudioprocess = function () {
	            data = new Uint8Array(analyser.frequencyBinCount);
	            analyser.getByteTimeDomainData(data);
	        };

	        // 播放音频元素,不然没有声音
	        this.element.play();
	    }
	};

	// 初始化音频,包括音频控制
	audio = audioService.init(Sound);

	// 可视化
	// 初始化色环
	var b1 = new BorderAnimation();
	var b2 = new BorderAnimation();
	var b3 = new BorderAnimation();
	var b4 = new BorderAnimation();

	b1.init({
	    width: 300 || window.innerWidth,
	    height: 300 || window.innerHeight
	}, document.querySelector('#canvas1'), 3, '', true);

	b2.init({
	    width: 300 || window.innerWidth,
	    height: 300 || window.innerHeight
	}, document.querySelector('#canvas2'), 2, 'rgba(255, 127, 0, 0.4)', '', 1.03);

	b3.init({
	    width: 300 || window.innerWidth,
	    height: 300 || window.innerHeight
	}, document.querySelector('#canvas3'), 2, 'rgba(34, 142, 35, 0.6)', '', 1);

	b4.init({
	    width: 300 || window.innerWidth,
	    height: 300 || window.innerHeight
	}, document.querySelector('#canvas4'), 2, 'rgba(135, 31, 120, 0.4)', '', 0.97);

	var sum = 0;
	var oldSum = 0;
	var rollAngle = 0;
	var isPause = false;
	var hasBeenEnded = false;

	// 动效展示
	(function renderFrame() {
	    window.requestAnimationFrame(renderFrame);
	    if (isPause) {
	        b1.resetStrokeStyle('#ccc');
	        b2.resetFillStyle();
	        b3.resetFillStyle();
	        b4.resetFillStyle('rgb(135, 31, 120)');
	        return;
	    };

	    for (var i = 0; i < data.length; i++) {
	        sum += data[i];
	    }

	    if (oldSum === sum && sum != 0) {
	        b1.resetStrokeStyle('#ccc');
	        b2.resetFillStyle();
	        b3.resetFillStyle();
	        b4.resetFillStyle('rgb(135, 31, 120)');
	    } else {
	        b1.render();

	        console.log(Math.abs((sum - oldSum) / 12800 - 10) * 100);
	        rollAngle += Math.abs((sum - oldSum) / 12800 - 10) * 100;
	        document.querySelector('#canvas1').style.transform = 'rotate(' + rollAngle + 'deg)';
	        document.querySelector('#canvas2').style.transform = 'rotate(' + rollAngle + 'deg)';
	        document.querySelector('#canvas3').style.transform = 'rotate(' + rollAngle + 'deg)';
	        document.querySelector('#canvas4').style.transform = 'rotate(' + rollAngle + 'deg)';
	        oldSum = sum;
	        data = [];
	    }
	})();

	// 音频事件监控
	audio.addEventListener('pause', function () {
	    isPause = true;
	});

	audio.addEventListener('play', function () {
	    if (hasBeenEnded) return location.reload();
	    var n = 20;
	    while (n) {
	        b2.render(true);
	        b3.render(true);
	        b4.render(true);
	        n--;
	    }

	    isPause = false;
	});

	audio.addEventListener('ended', function () {
	    hasBeenEnded = true;
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	exports.isChrome = function () {
	    var chrome = window.chrome,
	        vendor = navigator.vendor;
	    return chrome !== void 0 && chrome !== null && vendor === 'Google Inc.';
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	exports.init = function (Sound) {
	    var url = arguments.length <= 1 || arguments[1] === undefined ? './xx.mp3' : arguments[1];

	    var audio = new Audio();
	    // 当可以播放时开始播放
	    audio.addEventListener('canplay', function () {
	        var sound = Object.create(Sound);
	        sound.element = audio;
	        sound.play();
	    });
	    /* Reject the promise on an error. */
	    audio.addEventListener('error', function () {
	        alert('读取音频出错.');
	    });

	    audio.src = url;
	    audio.crossOrigin = 'anonymous';

	    // 事件绑定
	    document.getElementById('play').onclick = function () {
	        audio.play();
	    };

	    document.getElementById('pause').onclick = function () {
	        audio.pause();
	    };

	    return audio;
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	function Blob(attr) {
	    this.drawStyle = attr.drawStyle;
	    this.points = attr.points;
	    this.color = attr.color;
	}

	Blob.prototype.render = function (ctx) {
	    var firstPoint,
	        ctrlPoint,
	        nextPoint,
	        that = this;
	    firstPoint = this.points[0];
	    ctx.save();
	    ctx.strokeStyle = this.color;
	    ctx.fillStyle = this.color;
	    ctx.lineWidth = 1;
	    ctx.lineJoin = 'round';
	    ctx.lineCap = 'round';
	    ctx.beginPath();
	    ctx.moveTo(this.points[0].x, this.points[0].y);
	    this.points.forEach(function (p, i) {
	        nextPoint = that.points[i + 1];
	        if (nextPoint) {
	            ctrlPoint = {
	                x: (p.x + nextPoint.x) / 2,
	                y: (p.y + nextPoint.y) / 2
	            };
	            ctx.quadraticCurveTo(p.x, p.y, ctrlPoint.x, ctrlPoint.y);
	        } else {
	            ctrlPoint = {
	                x: (that.points[that.points.length - 1].x + firstPoint.x) / 2,
	                y: (that.points[that.points.length - 1].y + firstPoint.y) / 2
	            };
	            ctx.quadraticCurveTo(that.points[that.points.length - 1].x, that.points[that.points.length - 1].y, ctrlPoint.x, ctrlPoint.y);
	        }
	    });
	    ctx.closePath();
	    if (this.drawStyle === 'stroke') {
	        ctx.stroke();
	    } else if (this.drawStyle === 'fill') {
	        ctx.lineWidth = 0.1;
	        ctx.fill();
	        ctx.stroke();
	    }
	    ctx.restore();
	};

	var BorderAnimation = function BorderAnimation() {};

	BorderAnimation.prototype.init = function (size, cnvs, num, fillColor, isFillStyle, fillSize) {
	    this.width = size.width;
	    this.height = size.height;
	    this.canvas = cnvs;
	    this.ctx = this.canvas.getContext('2d');
	    this.canvas.width = this.width;
	    this.canvas.height = this.height;
	    this.blobs = this.generateBlobs(num, fillColor, fillSize);
	    this.ctx.fillStyle = isFillStyle ? getComputedStyle(document.body).backgroundColor || '#fff' : 'transparent';
	};

	BorderAnimation.prototype.generateBlobs = function (num, fillColor, size) {
	    var i, blob, blobs, point, x, y, angle, radius, drawStyle, color, offset, divider;
	    blobs = [];
	    divider = 7;
	    for (i = 1; i < num; i += 1) {
	        blob = [];
	        for (angle = 0; angle <= Math.PI * 2; angle += 0.2) {
	            offset = -20 + Math.random() * 20;

	            if (i === 1) {
	                radius = this.height / divider * (i * 2.5 * size);
	                drawStyle = 'fill';
	                color = fillColor || '#fff';
	            } else if (i === 2) {
	                radius = this.height / divider * (i * 1.2);
	                drawStyle = 'stroke';
	                color = '#ccc';
	            }
	            x = this.width / 2 + Math.sin(angle) * radius;
	            y = this.height / 2 + Math.cos(angle) * radius;
	            point = {
	                x: x,
	                y: y,
	                targetX: x + offset,
	                targetY: y + offset,
	                angle: Math.random() * (Math.PI * 2),
	                speed: 0.05 + Math.random() * 0.05
	            };
	            blob.push(point);
	        }
	        blobs.push(new Blob({
	            drawStyle: drawStyle,
	            points: blob,
	            color: color
	        }));
	    }

	    return blobs;
	};

	BorderAnimation.prototype.render = function (isFill) {
	    var _this = this;
	    if (!isFill) this.ctx.fillRect(0, 0, this.width, this.height);
	    for (var i = 0; i < this.blobs.length; i++) {
	        _this.renderBlob(this.blobs[i]);
	    };
	};

	BorderAnimation.prototype.renderBlob = function (blob) {
	    var _this = this;
	    blob.points.forEach(_this.updatePoint);
	    blob.render(this.ctx);
	};

	BorderAnimation.prototype.updatePoint = function updatePoint(p, i) {
	    var radius;
	    radius = 0.5;
	    p.x = p.x + Math.sin(p.angle) * radius;
	    p.y = p.y + Math.cos(p.angle) * radius;
	    i % 2 === 0 ? p.angle += p.speed : p.angle -= p.speed;
	};

	BorderAnimation.prototype.resetStrokeStyle = function (color) {
	    var ctx = this.ctx;
	    ctx.clearRect(0, 0, this.width, this.height);
	    ctx.beginPath();
	    ctx.strokeStyle = color || this.color;
	    var circle = {
	        x: this.width / 2,
	        y: this.height / 2,
	        r: 100
	    };
	    ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2, false);
	    ctx.stroke();
	};

	BorderAnimation.prototype.resetFillStyle = function (color) {
	    var ctx = this.ctx;

	    ctx.clearRect(0, 0, this.width, this.height);
	    ctx.beginPath();
	    ctx.fillStyle = color || this.fillColor;
	    var circle = {
	        x: this.width / 2,
	        y: this.height / 2,
	        r: 100
	    };

	    ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2, false);
	    ctx.fill();
	    ctx.closePath();
	};

	exports.BorderAnimation = BorderAnimation;

/***/ }
/******/ ]);