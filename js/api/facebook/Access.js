define(['underscore', '../../types/Controller', '../../types/DomModel', '../Facebook'], function(_, Controller, DomModel, facebook) {

    return Controller.extend({

        model: function() {
            return new (DomModel.extend({
                defaults: function() {
                    return {
                        required: ['public_profile'],
                        access: null
                    }
                }
            }))();
        },

        events: {
            click: login
        },

        initialize: function() {
            Controller.prototype.initialize.apply(this, arguments);

            this.model.on('change:required', _.bind(update, this));
            this.model.on('change:access', _.bind(updateView, this));

            _.bind(update, this)();
        }
    });

    function login(e) {
        e.preventDefault();
        if(this.model.get('access') == false) {
            facebook.login(this.model.get('required'), _.bind(update, this));
        }
    }

    function update() {
        var required = this.model.get('required');
        facebook.hasPermissions(required, _.bind(function(result) {
            this.model.set('access', true);
        }, this), _.bind(function() {
            this.model.set('access', false);
        },  this));
    }

    function updateView(model, value) {
        if(value) {
            this.$el.removeClass('no-access').addClass('access');
        } else {
            this.$el.removeClass('access').addClass('no-access');
        }
    }
});