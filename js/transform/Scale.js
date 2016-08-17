define(['jquery', 'underscore', '../types/Controller', '../types/Point', '../types/Matrix', 'jquery-pointerevents'], function($, _, Controller, Point, Matrix) {

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
        console.log(this.parentModel.get('position').x);
        this.pointer.setX(e.pageX - this.parentModel.get('position').x).setY(e.pageY - this.parentModel.get('position').y);
        this.scale = {
            x: this.parentModel.get('scale').x,
            y: this.parentModel.get('scale').y
        }

        $(document).on('pointermove.Scale', this.tick);
        $(document).one('pointerup', this.stop);

        console.log('start');
    }

    function tick(e) {
        e.stopPropagation();

        var sx = Math.abs((e.pageX - this.parentModel.get('position').x) / this.pointer.x);
        var sy = Math.abs((e.pageY - this.parentModel.get('position').y) / this.pointer.y);
        console.log(sx, sy);
        this.parentModel.get('scale').setX(sx*this.scale.x).setY(sy*this.scale.y);

        this.$target.data('interface').update();
//        this.matrix.scale(sx, sy);
//        this.$target.css('transform', this.matrix.toString());
//        this.pointer.setX(e.pageX - this.matrix.dx).setY(e.pageY - this.matrix.dy);
        console.log('tick');
    }

    function stop(e) {
        e.stopPropagation();

        $(document).off('pointermove.Scale');

        console.log('stop');
    }
});