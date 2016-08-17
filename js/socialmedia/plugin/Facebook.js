define([ 'module', 'jquery', 't8y/socialmedia/Plugin', 't8y/socialmedia/api/Facebook' ], function (module, $, Plugin, api) {

    if($('#fb-root').length == 0) {
        $('<div id="fb-root"></div>').appendTo($('body'));
    }

    return Plugin.extend({

        template: '<div class="fb-like" data-href="[[url]]" data-send="false" data-layout="[[count-orientation]]" data-show-faces="false" data-font="arial" data-action="recommend"></div>',

        defaults: {
            'url': window.location.href,
            'count-orientation': 'horizontal'
        },

        options: function() {
            return {
                'count-orientation': {
                    horizontal: 'button_count',
                    vertical: 'box_count'
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