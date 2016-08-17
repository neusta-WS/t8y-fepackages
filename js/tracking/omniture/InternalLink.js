define(['module', './Core'], function(module, Core) {
    return Core.extend({
        type: 'o',

        initialize: function() {
            Core.prototype.initialize.apply(this, arguments);

            this.setParameters(module.config());
        },

        send: function(pageName) {
            this.set('pev2', pageName);
            Core.prototype.send.apply(this, []);
        }
    });
});