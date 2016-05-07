var browserService = require('browserService');
var audioService = require('audioService');
var BorderAnimation = require('borderAnimation').BorderAnimation;

// 构造音频文件
var audio, context;
try {
    context = new AudioContext();
} catch(e) {
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
    play: function() {
        var sound = context.createMediaElementSource(this.element);

        // 结束时断开整个连接
        this.element.onended = function() {
            sound.disconnect();
            sound = null;
            processor.onaudioprocess = function() {};
        };

        // 连接解析器,开始进行处理
        sound.connect(analyser);
        sound.connect(context.destination);

        processor.onaudioprocess = function() {
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
    },
    document.querySelector('#canvas1'),
    3, '', true
);

b2.init({
        width: 300 || window.innerWidth,
        height: 300 || window.innerHeight
    },
    document.querySelector('#canvas2'),
    2, 'rgba(255, 127, 0, 0.4)', '', 1.03
);

b3.init({
        width: 300 || window.innerWidth,
        height: 300 || window.innerHeight
    },
    document.querySelector('#canvas3'),
    2, 'rgba(34, 142, 35, 0.6)', '', 1
);

b4.init({
        width: 300 || window.innerWidth,
        height: 300 || window.innerHeight
    },
    document.querySelector('#canvas4'),
    2, 'rgba(135, 31, 120, 0.4)', '', 0.97
);

var sum = 0;
var oldSum = 0;
var rollAngle = 0;
var isPause = false;
var hasBeenEnded = false;

// 动效展示
(function renderFrame() {
    window.requestAnimationFrame(renderFrame);
    if(isPause) {
        b1.resetStrokeStyle('#ccc');
        b2.resetFillStyle();
        b3.resetFillStyle();
        b4.resetFillStyle('rgb(135, 31, 120)');
        return;
    };

    for(var i = 0; i < data.length; i++) {
        sum += data[i];
    }

    if(oldSum === sum && sum != 0) {
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
        data  = [];
    }
}());

// 音频事件监控
audio.addEventListener('pause', function() {
    isPause = true;
});

audio.addEventListener('play', function() {
    if(hasBeenEnded) return location.reload();
    var n = 20;
    while(n) {
        b2.render(true);
        b3.render(true);
        b4.render(true);
        n--;
    }

    isPause = false;
});

audio.addEventListener('ended', function() {
    hasBeenEnded = true;
});