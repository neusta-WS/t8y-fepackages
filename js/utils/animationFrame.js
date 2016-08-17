define([], function () {
    var nativeSupport = true;

    !(function(window) {
        var lastTime = 0,
            vendors = ['webkit', 'moz'],
            requestAnimationFrame = window.requestAnimationFrame,
            cancelAnimationFrame = window.cancelRequestAnimationFrame,
            i = vendors.length;

        // try to un-prefix existing raf
        while (--i >= 0) {
            requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
            cancelAnimationFrame = window[vendors[i] + 'CancelRequestAnimationFrame'];
        }

        // polyfill with setTimeout fallback
        // heavily inspired from @darius gist mod: https://gist.github.com/paulirish/1579671#comment-837945
        if (!requestAnimationFrame || !cancelAnimationFrame) {
            nativeSupport = false;
            requestAnimationFrame = function(callback) {
                var now = 0;
                if(Date.now){
                    now = +Date.now();
                } else {
                    now = (new Date()).getTime();
                }

                var nextTime = Math.max(lastTime + 16, now);
                return setTimeout(function() {
                    callback(lastTime = nextTime);
                }, nextTime - now);
            };

            cancelAnimationFrame = clearTimeout;
        }

        // export to window
        window.requestAnimationFrame = requestAnimationFrame;
        window.cancelRequestAnimationFrame = cancelAnimationFrame;
    }(window));


    return {
        add: function(callback) {
            if(!nativeSupport) {
                callback();
            } else {
                window.requestAnimationFrame(callback);
            }
        },

        addLoop: function(callback) {
            var handler = {
                id: null,
                callback: callback
            };
            (function animloop(time){
                handler.id = window.requestAnimationFrame(animloop);
                handler.callback(time);
            })();
            return handler;
        },

        cancelLoop: function(handler) {
            window.cancelRequestAnimationFrame(handler.id);
        }
    }

});