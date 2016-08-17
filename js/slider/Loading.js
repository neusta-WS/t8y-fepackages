define([ 'module', 'jquery', 'Backbone' ], function (module, $) {

    return Backbone.View.extend({
        options: {

        },

        initialize: function () {
            var master = $(this.$el.data('target'));
            this.render();
        },

        render: function() {
            console.log('READY');
            this.$el.delay(500).fadeOut();
        }
    });
});