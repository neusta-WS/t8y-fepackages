define([ 'module', 'jquery', 't8y/socialmedia/Plugin', 't8y/socialmedia/api/Twitter' ], function (module, $, Plugin, api) {

    return Plugin.extend({

        template: '<a class="twitter-share-button" data-count="[[count-orientation]]" data-size="medium" data-lang="de" rel="canonical" href="https://twitter.com/share" data-url="[[url]]" data-text="ich bin ein test-text"></a>',

        defaults: {
            'url': window.location.href,
            'count-orientation': 'horizontal'
        },

        options: function() {
            return {
                'count-orientation': {
                    horizontal: 'horizontal',
                    vertical: 'vertical'
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