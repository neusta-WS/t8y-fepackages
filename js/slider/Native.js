define(['jquery', 'underscore', '../types/Controller', './NativeModel', '../utils/animationFrame'], function($, _, Controller, NativeModel, animationFrame) {
    return Controller.extend({
        loop: null,
        model: NativeModel,

        initialize: function() {
            Controller.prototype.initialize.apply(this, arguments);

            this.model.on('change:scrollBy', _.bind(function(model, value) {
                if(value != 0 && !this.loop) {
                    this.loop = animationFrame.addLoop(_.bind(updateScrollPosition, this));
                } else if(value == 0 && this.loop) {
                    animationFrame.cancelLoop(this.loop);
                    delete this.loop;
                }
            }, this));
        }
    });

    function updateScrollPosition() {
        $('.wrapper', this.$el).scrollLeft($('.wrapper', this.$el).scrollLeft() + this.model.get('scrollBy'));
    }
});