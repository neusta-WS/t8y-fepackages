define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {

    $.event.special.removed = {
        remove: function(o) {
            if (o.handler) {
                o.handler();
            }
        }
    };

    return Backbone.View.extend({

        options: function() {
            return {};
        },

        initialize: function (options) {
            this.$el.on('removed', _.bind(function() {this.remove();}, this));
            this.$el.data('interface', this);

            if(this.model) {
                if(this.model.prototype) {
                    this.model = new this.model(options.data || {}, this.$el.data());
                }
                this.model.on('destroy', _.bind(function() {
                    this.model = null;
                    this.remove();
                }, this));
            }

            if(this.collection) {
                this.collection = new this.collection(options.$items);
                this.$items = options.$items;
            }

            this.$target = options.$target;

            if(this.$target) {
                this.ready(this.$target.data('interface').model);
            } else {
                this.ready();
            }
        },

        ready: function(parentModel) {
            if(parentModel) {
                this.parentModel = parentModel;
            }
            this.render(parentModel||this.model);
        },

        render: function() {

        },

        redraw: function() {
            this.$el.get(0).offsetHeight;
        },

        remove: function() {
            if(this.model) {
                if(_.isEmpty(this.model.__proto__)) {
                    Backbone.View.prototype.remove.apply(this, arguments);
                    this.off();
                } else {
                    this.model.destroy();
                }
            } else {
                Backbone.View.prototype.remove.apply(this, arguments);
            }
        }
    });
});