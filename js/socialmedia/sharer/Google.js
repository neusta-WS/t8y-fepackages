define([ 'module', 'jquery', 't8y/socialmedia/Sharer' ], function (module, $, Sharer) {

    var baseUrl = 'https://plus.google.com/share';

    return Sharer.extend({

        initialize: function () {
            Sharer.prototype.initialize.apply(this, arguments);
        },

        render: function() {

        },

        getUrl: function() {
            return baseUrl + '?' + $.param({
                url: this.getShareableUrl()
            });
        }
    });
});