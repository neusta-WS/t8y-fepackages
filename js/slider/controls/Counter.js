define([ 'module', 'jquery', 'underscore', 'backbone' ], function (module, $, _, Backbone) {

    return Backbone.View.extend({
        events: {

        },

        initialize: function () {
            var master = $(this.$el.data('target'));

            this.model = master.data('interface').model;
            this.model.on('change:view', _.bind(this.render, this));
            this.model.on('change:viewMax', _.bind(this.render, this));

            this.count = $('<span class="count"></span>').appendTo(this.$el);
            this.separator = $('<span class="separator">' + this.$el.data('separator') + '</span>').appendTo(this.$el);
            this.max = $('<span class="max"></span>').appendTo(this.$el);

            this.render();
        },

        render: function(e) {
            this.count.text(this.model.get('view')+1);
            this.max.text(this.model.get('viewMax'));
        }
    });
});