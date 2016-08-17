define(['jquery', '../types/Controller'], function($, Controller) {
    return Controller.extend({

        initialize: function() {
            Controller.prototype.initialize.apply(this, arguments);

            $('.content', this.$el).on('mousewheel DOMMouseScroll', preventMouseOverscroll);
        }
    });

    function preventMouseOverscroll(e) {
        var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
        if (delta > 0 && $(this).scrollTop() <= 0) {
            return false;
        } else if (delta < 0 && $(this).scrollTop() >= this.scrollHeight - $(this).height()) {
            return false;
        }
        return true;
    }
});