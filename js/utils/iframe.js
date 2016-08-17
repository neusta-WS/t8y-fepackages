(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root.b);
    }
}(this, function () {

    window.iframeCommunicator = {
        sendMessageToParentPage: function(data, origin) {
            sendMessage(parent, data, origin);
        },

        sendMessageToIframe: function(iframe, data, origin) {
            iframe = getTarget(iframe);
            sendMessage(iframe.contentWindow, data, origin);
        },

        sendMessageToPopup: function(popup, data, origin) {
            popup = getTarget(popup);
            sendMessage(popup, data, origin);
        },

        receiveMessage: function(callback) {
            if (window.addEventListener) {
                window.addEventListener('message', callback, false);
            } else {
                window.attachEvent('onmessage', callback);
            }
        }
    };

    function sendMessage(target, data, origin) {
        target.postMessage(data, (origin || '*'));
    }

    function getTarget(target) {
        if(target.length) {
            return target[0];
        }
        return target;
    }
}));