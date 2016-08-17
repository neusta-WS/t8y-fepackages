define(['module', 'jquery', 'underscore', 'backbone', './Video', '../types/Controller'], function(module, $, _, Backbone, Video, Controller) {

    var callbacks = [];
    var kewego = new (Backbone.Model.extend({
        defaults: function() {
            return {
                callbacks: [],
                token: null
            }
        },

        initialize: function() {
            Backbone.Model.prototype.initialize.apply(this, arguments);

            $.ajax({
                url: module.config().path,
                success: _.bind(function(token) {
                    while(callbacks.length > 0) {
                        callbacks.pop()(token);
                    }
                }, this)
            });
        },

        register: function(callback) {
            var token = this.get('token');
            if(token) {
                callback(token);
            } else {
                callbacks.push(callback);
            }
        }
    }));

    return Video.extend({

        initialize: function() {
            Controller.prototype.initialize.apply(this, arguments);

            kewego.register(_.bind(function(token) {
                var sig = $('video', this.$el).data('kewego-id');
                $('video > source', this.$el).each(function(index, node) {
                    $(node).attr('src', 'http://api.kewego.com/video/getStream/?sig=' + sig + '&appToken=' + token + '&format=' + $(node).data('format'));
                });
                this.createPlayer();
            }, this));
        }
    });
});