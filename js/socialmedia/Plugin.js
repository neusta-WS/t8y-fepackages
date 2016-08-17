define([ 'module', 'jquery', 'underscore', '../types/Controller' ], function (module, $, _, Controller) {

    return Controller.extend({
        template: '',
        defaults: {},
        options: {},
        plugin: null,

        initialize: function () {
            Controller.prototype.initialize.apply(this, arguments);
            this.parentModel.on('change:active', _.bind(this.render, this));
        },

        render: function(api) {
            if(this.parentModel.get('active') == true) {
                var plugin = $(replacePlaceholders(this.template, this.defaults, this.options(), this.$el));
    //            this.$el.empty();
                plugin.appendTo(this.$el);

                api.load(_.bind(function() {    console.log('JAPP');
                    api.parse(plugin);
                }, this));
            }
        }
    });

    function replacePlaceholders(tmpl, defaults, options, node) {
        for(var key in defaults) {
            if(options[key]) {
                tmpl = tmpl.replace('[[' + key + ']]', options[key][node.data(key) || defaults[key]]);
            } else {
                tmpl = tmpl.replace('[[' + key + ']]', node.data(key) || defaults[key]);
            }
        }
        return tmpl;
    }
});