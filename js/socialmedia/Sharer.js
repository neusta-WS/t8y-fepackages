define([ 'module', 'jquery', 'backbone', 't8y/utils/device' ], function (module, $, Backbone, device) {

    return Backbone.View.extend({

        options: {
            width: 550,
            height: 300
        },

        events: {
            'click': 'open'
        },

        initialize: function () {

        },

        render: function() {

        },

        open: function(e) {
            var x = screen.width / 2 - this.options.width / 2;
            var y = screen.height / 4;
            if(device.isPortable()) {
                this.$el.attr({ href: this.getUrl(), target: '_blank' });
            } else {
                e.preventDefault();
                return window.open(this.getUrl(), '', 'top=' + y + ',left=' + x + ',height=' + this.options.height + ',width=' + this.options.width);
            }
        },

        getUrl: function() {},

        getShareableUrl: function() {
            var url = this.$el.attr('href');
            if(url != '' && url != '#') {
                return url;
            } else {
                return window.location.href;
            }
        }
    });
});