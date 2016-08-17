define(['jquery', 'underscore', 'backbone', './Controller', './EventBuffer', './Point', '../utils/random', 'jquery-pointerevents'], function($, _, Backbone, Controller, EventBuffer, Point, random) {
    return Controller.extend({
        id: 0,
        bufferSize: 2,
        active: false,

        events: function() {
            return {
                'pointerdown.drag': onDrag,
                'pointermove.and': onAnd,
                'pointerup.drop': onDrop,
                'pointerout.cancel': onDrop,
                'pointercancel.cancel': onDrop,
                'pointermove.mouseover': onMouseOver,
                'pointerenter.hover': onHover,
                'pointerleave.hover': onHover
            }
        },

        initialize: function (options) {
            this.id = random.id();
            this.buffer = new EventBuffer(this.bufferSize);

            Controller.prototype.initialize.apply(this, arguments);

            this.dragPoint = new Point();
        },

        onDrag: function(e) {
            this.buffer.reset();
            this.dragPoint.setX(e.pageX).setY(e.pageY);
            this.buffer.add(e);
        },

        onAnd: function(e) {
            this.buffer.add(e);
        },

        onDrop: function(e) {
            this.buffer.add(e);
        },

        onMouseOver: function(e) {

        },

        onHover: function(e) {
            var className = getHoverClassName(e.pointerType);
            if(className) {
                if(e.type == 'pointerenter') {
                    this.$el.addClass(className);
                } else {
                    this.$el.removeClass(className);
                }
            }
        }
    });

    function onDrag(e) {
        this.active = true;
        this.onDrag(e);
    }

    function onAnd(e) {
        if(this.active == true) {
            this.onAnd(e);
        }
    }

    function onDrop(e) {
        if(this.active == true) {
            this.active = false;
            this.onDrop(e);
        }
    }

    function onMouseOver(e) {
        if(e.pointerType == 'mouse') {
            this.onMouseOver(e);
        }
    }

    function onHover(e) {
        this.onHover(e);
    }

    function getHoverClassName(pointerType) {
        switch(pointerType) {
            case 'mouse':
                return 'hover_mouse';
                break;
            default:
                return null;
                break;

        }
    }
});