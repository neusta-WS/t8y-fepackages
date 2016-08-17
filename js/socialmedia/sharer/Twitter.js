define([ 'module', 'jquery', 't8y/socialmedia/Sharer' ], function (module, $, Sharer) {

    var baseUrl = 'http://twitter.com/share';

    return Sharer.extend({

        initialize: function () {
            Sharer.prototype.initialize.apply(this, arguments);
        },

        render: function() {

        },

        getUrl: function() {
            var text = this.$el.data('text') || '';
            return baseUrl + '?url=' + encodeURIComponent(this.getShareableUrl()) + '&text=' + encodeURIComponent(text);
        }
    });
});