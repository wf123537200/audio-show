exports.isChrome = function() {
    var chrome = window.chrome,
        vendor = navigator.vendor;
    return chrome !== void 0 && chrome !== null && vendor === 'Google Inc.';
};