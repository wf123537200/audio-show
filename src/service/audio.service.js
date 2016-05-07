exports.init = function(Sound, url = './xx.mp3') {
    var audio = new Audio();
    // 当可以播放时开始播放
    audio.addEventListener('canplay', function() {
        var sound = Object.create(Sound);
        sound.element = audio;
        sound.play();
    });
    /* Reject the promise on an error. */
    audio.addEventListener('error', function() {
        alert('读取音频出错.');
    });

    audio.src = url;
    audio.crossOrigin = 'anonymous';

    // 事件绑定
    document.getElementById('play').onclick = function() {
        audio.play();
    };

    document.getElementById('pause').onclick = function() {
        audio.pause();
    };

    return audio;
};