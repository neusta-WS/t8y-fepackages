define([ 'module', 'jquery', 't8y/socialmedia/Sharer' ], function (module, $, Sharer) {

    var baseUrl = 'mailto:';

    return Sharer.extend({

        pattern: {
            baseUrl: 'mailto:',
            parameter: {
                subject: 'u',
                text: 'body'
            }
        },

        initialize: function () {
            Sharer.prototype.initialize.apply(this, arguments);
            this.render();
        },

        render: function() {
            this.$el.attr('href', this.getUrl());
        },

        open: function(e) {
//            var popup = Sharer.prototype.open.apply(this, arguments);
//            if(popup) {
//                popup.close();
//            }

        },

        getUrl: function() {
            var shareableUrl = this.getShareableUrl();
            var urlMarker = '[[url]]';

            var subject = (this.$el.data('subject') || '').replace(urlMarker, shareableUrl);
            var body = (this.$el.data('text') || '').replace(urlMarker, shareableUrl);

            body = body.replace(/\\n/g, '\n');

            var url = baseUrl + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
            return url;
        }
    });
});