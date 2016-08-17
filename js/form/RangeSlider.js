define(['jquery', '../types/PointerController'], function($, PointerController) {
    return PointerController.extend({

        initialize: function() {
            PointerController.prototype.initialize.apply(this, arguments);

            this.min = this.$el.data('min');
            this.max = this.$el.data('max');

            this.handle = $('.handle', this.$el);
            this.input = $('input[type="hidden"]', this.$el);

            var min = this.$el.data('min') || 0;
            var max = this.$el.data('max') || 1;
            var value = this.$el.data('default') || 0;
            var normValue = value / (max-min);

            setPosition(this.handle, normValue);
            setFormValue(this.input, normValue, this.min, this.max);
        },

        onDrag: function() {

        },

        onAnd: function(e) {
            var pos = getNormalizedPosition(e.offsetX, this.handle, this.$el);
            setPosition(this.handle, pos);
        },

        onDrop: function(e) {
            var pos = getNormalizedPosition(e.offsetX, this.handle, this.$el);
            setPosition(this.handle, pos);
            setFormValue(this.input, pos, this.min, this.max);
        }
    });

    function setPosition(handle, pos) {
        if(pos > 0 && pos < 1) {
            handle.css('left', (pos * 100) + '%');
        } else if(pos <= 0) {
            handle.css('left', '0%');
            pos = 0;
        } else {
            handle.css('left', '100%');
            pos = 1;
        }
    }

    function setFormValue(input, pos, min, max) {
        min = min || 0;
        max = max || 1;
        var value = (max - min) * pos + min;
        input.val(value);
    }

    function getNormalizedPosition(posX, handle, range) {
        return (posX - handle.outerWidth() / 2) / range.width();
    }
})