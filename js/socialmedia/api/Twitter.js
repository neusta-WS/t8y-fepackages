define([ 'module', 'jquery', 't8y/socialmedia/Api' ], function (module, $, Api) {

    return new(Api.extend({
        initialize: function() {
            Api.prototype.initialize.apply(this, [module.config()]);
            this.set('source', '//platform.twitter.com/widgets.js');
        },

        parse: function(nodes) {
            if(typeof twttr != 'undefined') {
                nodes.parent().each(function(index, node) {
                    twttr.widgets.load(node);
                });
            }
        }
    }))();
});