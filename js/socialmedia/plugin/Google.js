define([ 'module', 'jquery', 't8y/socialmedia/Plugin', 't8y/socialmedia/api/Google' ], function (module, $, Plugin, api) {

    return Plugin.extend({

        template: '<div class="g-plus" data-action="share" data-annotation="[[count-orientation]]" data-href="[[url]]"></div>',

        defaults: {
            'url': window.location.href,
            'count-orientation': 'horizontal'
        },

        options: function() {
            return {
                'count-orientation': {
                    horizontal: 'bubble',
                    vertical: 'vertical-bubble'
                }
            }
        },

        initialize: function () {
            Plugin.prototype.initialize.apply(this, arguments);
        },

        render: function() {
            Plugin.prototype.render.apply(this, [api]);
        }
    });
});