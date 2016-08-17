define([ 'module', 'jquery', 'underscore', '../../types/PointerController'], function (module, $, _, PointerController) {

    return PointerController.extend({

        onMouseOver: function(e) {
            var centerX = 50;
            var centerY = 0;

            var y = (e.offsetY - this.$el.height() / 2) / (this.$el.height() / 2);

            if(this.$el.hasClass('prev')) {
                var x = e.offsetX / this.$el.width();
            } else {
                var x = e.offsetX / this.$el.width()-1;
            }
//            console.log(x);
            var length = Math.sqrt(x*x+y*y);
            if(length < 1) {
                this.parentModel.set('scrollBy', (length - 1) * -~~this.$el.data('direction'));
            }
        },

        onHover: function(e) {
            if(e.type == 'pointerleave') {
                this.parentModel.set('scrollBy', 0);
            }
        }
    });


});