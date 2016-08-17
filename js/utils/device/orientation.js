define(['jquery', 'underscore', 'backbone', '../../types/AngleBuffer', './display'], function($, _, Backbone, AngleBuffer, display) {

    var bufferSize = 10;
    var buffer = {
        alpha: new AngleBuffer(bufferSize),
        beta: new AngleBuffer(bufferSize),
        gamma: new AngleBuffer(bufferSize)
    };

    return new (Backbone.Model.extend({
        defaults: function() {
            return {
                alpha: 0,
                beta: 0,
                gamma: 0,

                compass: 0,
                tiltLeftRight: 0,
                tiltTopBottom: 0,

                deltaCompass: 0,
                deltaTiltLeftRight: 0,
                deltaTiltTopBottom: 0
            }
        },

        initialize: function() {
            $(window).on('deviceorientation', _.bind(function(e) {
                writeEventToBuffer(e);

                this.set('alpha', buffer.alpha.get());
                this.set('beta', buffer.beta.get());
                this.set('gamma', buffer.gamma.get());

                this.set('compass', buffer.alpha.getDegree());
                this.set('tiltTopBottom', buffer.beta.getDegree());
                this.set('tiltLeftRight', buffer.gamma.getDegree());

                this.trigger('tilt');
            }, this));

            $(display).on('orientationchange', resetBuffer);
        }
    }))();

    function resetBuffer() {
        buffer.alpha.reset();
        buffer.beta.reset();
        buffer.gamma.reset();
    }

    function writeEventToBuffer(e) {
        var alpha = getNormalizedAlpha(e);
        if(display.isPortrait()) {
            fillBuffer(alpha, e.originalEvent.beta, e.originalEvent.gamma);
        } else {
            fillBuffer(alpha, e.originalEvent.gamma, -e.originalEvent.beta);
        }
    }

    function getNormalizedAlpha(e) {
        if(e.originalEvent.webkitCompassHeading != undefined) {
            return 360 - e.originalEvent.webkitCompassHeading;
        } else if (e.originalEvent.alpha != null) {
            return (270 - e.originalEvent.alpha) * -1;
        }
        return 0;
    }

    function fillBuffer(alpha, beta, gamma) {
        buffer.alpha.addDegree(alpha);
        buffer.beta.addDegree(beta);
        buffer.gamma.addDegree(gamma);
    }
});