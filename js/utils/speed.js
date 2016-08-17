define(['module', 'jquery', './url', './random'], function(module, $, url, random) {

    var info = null;

    var speed = {
        QUALITY: {
            GSM: 0,
            HSCSD: 1,
            GPRS: 2,
            EDGE: 3,
            UMTS: 4,
            HSPA: 5,
            LTE: 6,
            LTE_ADVANCED: 7
        },

        test: function(uri, callback) {
            if(uri || module.config().testFile) {
                var startTime = Date.now();
                uri = addTimestampToUrl((uri|| module.config().testFile), startTime);
                $.ajax({
                    type: 'GET',
                    url: uri,
                    success: function(data, status, xhr){
                        var size = xhr.getResponseHeader('Content-Length');
                        info = getSpeed(size, startTime, Date.now());
                        callback(info);
                    }
                });
            }
        },

        isLow: function() {
            return (info.transmission <= speed.QUALITY.GPRS);
        },

        isMedium: function() {
            return (info.transmission > speed.QUALITY.GPRS && info.transmission <= speed.QUALITY.UMTS);
        },

        isHigh: function() {
            return (info.transmission > speed.QUALITY.UMTS);
        }
    }

    function getSpeed(size, startTime, endTime) {
        var duration = (endTime - startTime) / 1000;
        var bitsLoaded = size * 8;
        var bitrate = getBitrate(bitsLoaded, duration);

        return {
            duration: duration,
            bitsLoaded: bitsLoaded,
            bitrate: bitrate,
            transmission: getTransmission(bitrate)
        }
    }

    function addTimestampToUrl(uri, timestamp) {
        var param = 'timestamp=' + timestamp;
        if(uri.indexOf('?') == -1) {
            return uri + '?' + param;
        } else {
            return uri + '&' + param;
        }
    }

    function getBitrate(bitsLoaded, duration) {
        var bps = (bitsLoaded / duration).toFixed(2);
        var kbps = (bps / 1024).toFixed(2);
        var mbps = (kbps / 1024).toFixed(2);

        return {
            bps: bps,
            kbps: kbps,
            mbps: mbps
        };
    }

    // Transmission Matrix from http://www.elektronik-kompendium.de/sites/kom/0406221.htm
    function getTransmission(bitrate) {
        if(bitrate.kbps < 9.6) {
            return speed.QUALITY.GSM;
        } else if(bitrate.kbps < 57.6) {
            return speed.QUALITY.HSCSD;
        } else if(bitrate.kbps < 115) {
            return speed.QUALITY.GPRS;
        } else if(bitrate.kbps < 236) {
            return speed.QUALITY.EDGE;
        } else if(bitrate.kbps < 384) {
            return speed.QUALITY.UMTS;
        } else if(bitrate.mbps < 14.4) {
            return speed.QUALITY.HSPA;
        } else if(bitrate.mbps < 150) {
            return speed.QUALITY.LTE;
        } else {
            return speed.QUALITY.LTE_ADVANCED;
        }
    }

    return speed;
});