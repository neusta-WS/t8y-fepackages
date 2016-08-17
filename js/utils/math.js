define([ './math/dimension'], function (dimension) {

    return {
        dimension: dimension,

        getRadBetweenPoints: function (point1, point2) {
            return Math.atan2((point1.y - point2.y), (point1.x - point2.x));
        },

        getDirection: function(value) {
            return (Math.abs(value) / value);
        },

        calcExpectedPosition: function( to, duration, refTime, refDistance ) {
            var pxPerMillisec = this.calcPixelPerMillisecond(refTime, refDistance);
            return to + pxPerMillisec * duration;
        },

        calcExpectedDuration: function( from, to, refTime, refDistance) {
            var pxPerMillisec = this.calcPixelPerMillisecond(refTime, refDistance);
            return Math.abs((to - from) / pxPerMillisec);
        },

        calcPixelPerMillisecond: function( duration, distance ) {
            var pxPerMillisec = distance / duration;
            if(Math.abs(pxPerMillisec) == Infinity ) {
                pxPerMillisec = 0.75;
            }
            return pxPerMillisec;
        },

        clamp: function(value, min, max) {
            if(value < min) {
                value = min;
            } else if(value > max) {
                value = max;
            }
            return value;
        }
    }
});