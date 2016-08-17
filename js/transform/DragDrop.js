define(['jquery', 'underscore', '../types/Controller', '../types/DomModel', '../types/Point', '../types/Matrix', 'jquery-pointerevents'], function($, _, Controller, DomModel, Point, Matrix) {

    var matrix = new Matrix();

    return Controller.extend({
        model: DomModel.extend({
            defaults: function() {
                return {
                    position: new Point(),
                    scale: new Point(1,1),
                    rotation: 0
                }
            }
        }),

        events: {
            'pointerdown': start
        },

        initialize: function() {
            Controller.prototype.initialize.apply(this, arguments);
            this.pointer = new Point();
            this.tick = _.bind(tick, this);
            this.stop = _.bind(stop, this);

            var pos = this.$el.position();
            if($('html').hasClass('csstransforms')) {
//                this.model.get('matrix').reset(1, 0, 0, 1, pos.left, pos.top);
                this.model.get('position').setX(pos.left).setY(pos.top);
                this.$el.css({top: 'auto', left: 'auto'});
            } else {
                this.model.get('matrix').reset(1, 0, 0, 1, pos.left + this.$el.width() / 2, pos.top + this.$el.height() / 2);
            }
            this.update();
        },

        update: function() {
            matrix.setIdentity();
            matrix = matrix.translate(this.model.get('position').x, this.model.get('position').y, 0);
            matrix = matrix.rotate(0,0,this.model.get('rotation') * (180/Math.PI));
            matrix = matrix.scale(this.model.get('scale').x, this.model.get('scale').y);

            if($('html').hasClass('csstransforms')) {
                this.$el.css('transform', matrix.toString());
            } else {
//                this.$el.css({
//                    'left': this.model.get('matrix').dx - this.$el.width() / 2,
//                    'top': this.model.get('matrix').dy - this.$el.height() / 2
//                })
            }
        }
    });

    function start(e) {
        this.pointer.setX(e.pageX).setY(e.pageY);

        $(document).on('pointermove.DragAndDrop', this.tick);
        $(document).one('pointerup', this.stop);
    }

    function tick(e) {
        this.model.get('position').addLocal(e.pageX - this.pointer.x, e.pageY - this.pointer.y);
        this.update();
        this.pointer.setX(e.pageX).setY(e.pageY);
    }

    function stop(e) {
        $(document).off('pointermove.DragAndDrop');
        console.log('stop');
    }
});