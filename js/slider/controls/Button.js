define([ 'module', 'jquery', 'underscore', 'backbone' ], function (module, $, _, Backbone) {

    return Backbone.View.extend({
        events: {
            'click': sendUpdate
        },

        initialize: function () {
            var master = $(this.$el.data('target'));
            this.model = master.data('interface').model;
            this.model.on('change:view', _.bind(this.render, this));
            this.model.on('change:viewMax', _.bind(this.render, this));
            this.model.on('change:status', _.bind(this.changeStatus, this));

            this.render();
        },

        render: function() {
            if(this.$el.is('[data-direction]')) {
                _.bind(updateDirectionStatus, this)(this.$el, this.model.get('view'), this.model.get('viewMax'))
            } else if(this.$el.is('[data-show-view]')) {
                _.bind(updateShowViewStatus, this)(this.$el, this.model.get('view'))
            }
        },

        changeStatus: function(model, value) {
            if(model.STATUS.LOADING == value && this.$el.is('[data-direction*="+"]') && this.model.get('view') >= this.model.get('viewMax') - 1) {
                this.$el.addClass('loading');
            } else if(model.STATUS.DEFAULT == value) {
                this.$el.removeClass('loading');
            }
        }
    });

    function sendUpdate(e) {
        e.preventDefault();
        if(this.$el.is('[data-direction]') && this.$el.hasClass('active')) {
            this.model.set('scrollToDirection', +$(e.currentTarget).data('direction'));
        } else if(this.$el.is('[data-show-view]')) {
            this.model.set('scrollToView', +$(e.currentTarget).data('show-view'));
        }
    }

    function updateDirectionStatus(node, view, viewMax) {
        console.log(view, viewMax);
        if(node.is('[data-direction*="-"]') && view <= 0) {
            node.removeClass('active').find("a").blur();
        } else if(node.is('[data-direction*="+"]') && view >= viewMax - 1) {
            console.log('JAPP');
            node.removeClass('active').find("a").blur();
        } else {
            node.addClass('active');
        }
    }

    function updateShowViewStatus(node, view) {
        if(node.data('show-view') == view) {
            node.addClass('active');
        } else {
            node.removeClass('active').find("a").blur();
        }
    }
});