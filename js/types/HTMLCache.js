define(['jquery', 'underscore', 'backbone', '../utils/parser'], function($, _, Backbone, parser) {
    return Backbone.Collection.extend({
        model: Backbone.Model.extend({
            idAttribute : 'url',
            defaults: function() {
                return {
                    url: null,
                    content: null
                }
            }
        }),

        getPage: function(url, callback) {
            var result = this.get(url);
            if(!result) {
                console.log('load from server', url);
                $.ajax({
                    type: "GET",
                    dataType: 'html',
                    context: this,
                    url: url,
                    data: {},
                    dataFilter: function(data) {
                        return $(data);
                    }
                }).done(_.bind(function(data) {
                    this.add({
                        url: url,
                        content: data
                    });
                    callback(this.get(url).get('content'));
                }, this));
            } else {
                console.log('load from cache', url);
                callback(result.get('content'));
            }
        }
    });
})