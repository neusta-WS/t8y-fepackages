define(['jquery', '../types/Controller'], function($, Controller) {

    return Controller.extend({

        events: {
            'click > a': toggleActive
        },

        initialize: function() {
            Controller.prototype.initialize.apply(this, arguments);

        }
    });

    function toggleActive(e) {
        console.log('AHA', e.currentTarget);
        e.preventDefault();
        this.$el.toggleClass('active');
    }
});