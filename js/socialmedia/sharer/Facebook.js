define([ 'module', 'jquery', 't8y/socialmedia/Sharer' ], function (module, $, Sharer) {

    var baseUrl = 'https://www.facebook.com/sharer/sharer.php';

    return Sharer.extend({

        initialize: function () {
             Sharer.prototype.initialize.apply(this, arguments);
        },

        render: function() {

        },

        getUrl: function() {
            return baseUrl + '?' + $.param({
                u: this.getShareableUrl()
            });
        }
    });
});