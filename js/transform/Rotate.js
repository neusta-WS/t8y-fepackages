define(['jquery', 'underscore', '../types/Controller', '../types/Point', '../utils/math', 'jquery-pointerevents'], function($, _, Controller, Point, math) {

    return Controller.extend({

        events: {
            'pointerdown': start
        },

        initialize: function() {
            Controller.prototype.initialize.apply(this, arguments);
            this.pointer = new Point();

            this.tick = _.bind(tick, this);
            this.stop = _.bind(stop, this);
        }
    });

    function start(e) {
        e.stopPropagation();
        this.pointer = this.parentModel.get('position');
        this.refRad = math.getRadBetweenPoints(this.pointer, {x: e.pageX, y: e.pageY});
        this.rotation = this.parentModel.get('rotation');

        $(document).on('pointermove.Rotate', this.tick);
        $(document).one('pointerup', this.stop);
    }

    function tick(e) {
        e.stopPropagation();
        var rad = math.getRadBetweenPoints(this.pointer, {x: e.pageX, y: e.pageY});
        this.parentModel.set('rotation', (rad - this.refRad) + this.rotation);
        this.$target.data('interface').update();
    }

    function stop(e) {
        e.stopPropagation();
        $(document).off('pointermove.Rotate');
    }
});