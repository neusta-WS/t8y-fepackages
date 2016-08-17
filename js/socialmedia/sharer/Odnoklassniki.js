define([ 'module', 'jquery', 't8y/socialmedia/Sharer' ], function (module, $, Sharer) {

    var baseUrl = 'http://www.odnoklassniki.ru/dk?st.cmd=addShare';

    return Sharer.extend({

        initialize: function () {
             Sharer.prototype.initialize.apply(this, arguments);
        },

        render: function() {

        },

        getUrl: function() {
            var text = this.$el.data('text') || '';
            return baseUrl + '&st._surl=' + encodeURIComponent(this.getShareableUrl()) + '&st.comments=' + encodeURIComponent(text);
        }
    });
});