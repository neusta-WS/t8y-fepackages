define([ 'module', 'jquery', 't8y/socialmedia/Api' ], function (module, $, Api) {

    window.___gcfg = {
        lang: 'de',
        parsetags: 'onload'
    };


    return new(Api.extend({
        initialize: function() {
            Api.prototype.initialize.apply(this, [module.config()]);
            this.set('source', '//apis.google.com/js/plusone.js');
        },

        parse: function(nodes) {
            if(typeof gapi != 'undefined') {
                nodes.parent().each(function(index, node) {
                    gapi.plus.go(node);
                });
            }
        }
    }))();
});