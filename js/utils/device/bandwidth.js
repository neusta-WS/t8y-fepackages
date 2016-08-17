define([ 'jquery', 'ImageInfo', 'modernizr' ], function($) {
    var bandwidth = 0;
    $('html').addClass('bandwidth-unknown');
    /*
     * @description		Ermittlung der zur Verfügung stehenden Bandbreite
     * 					Die entsprechenden Konstanten zum Abgleich finden sich in dem Unterobjekt "types"
     */
    return {
        types: { UNKNOWN: 0, LOW: 1, HIGH: 2 },
        getType: function() {
            return bandwidth;
        },
        isHigh: function() {
            return (this.types.HIGH === bandwidth);
        },
        isLow: function() {
            return (this.types.LOW === bandwidth);
        },
        isUnknown: function() {
            return (this.types.UNKNOWN === bandwidth);
        },
        doSpeedTest: function(imageUrl, callback) {
            imageUrl = imageUrl + '?n=' + Math.random();
            var types = this.types;
            var startTime = (new Date()).getTime();
            ImageInfo.loadInfo(imageUrl, function() {
                var duration = ((new Date()).getTime() - startTime) / 1000;
                var imageInfo = ImageInfo.getAllFields(imageUrl);
                var speed = verifySpeedData(imageInfo.byteSize, duration, types);
                callback(imageInfo, speed, imageUrl);
            });
        }
    }

    function verifySpeedData(byteSize, duration, types) {
        $('html').removeClass('bandwidth-high bandwidth-low bandwidth-unknown');

        var bitsLoaded = byteSize * 8;
        var speed = {Bps: (bitsLoaded / duration).toFixed(2)};
        speed.Kbps = (speed.Bps / 1024).toFixed(2);
        speed.Mbps = (speed.Kbps / 1024).toFixed(2);

        if(speed.Mbps >= 0.8) {
            bandwidth = types.HIGH;
            $('html').addClass('bandwidth-high');
        } else if(speed.Mbps < 0.8) {
            bandwidth = types.LOW;
            $('html').addClass('bandwidth-low');
        } else {
            bandwidth = types.UNKNOWN;
            $('html').addClass('bandwidth-unknown');
        }
        return speed;
    }
});
