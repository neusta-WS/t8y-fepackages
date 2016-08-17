define(['module', './InternalLink'], function(module, InternalLink) {
    return InternalLink.extend({
        initialize: function() {
            InternalLink.prototype.initialize.apply(this, arguments);

            this.setParameters(module.config());
        },

        send: function(pageName, prop33) {
            this.set('prop33', this.get('prop32') + ' : Call ' + prop33 );
            InternalLink.prototype.send.apply(this, [pageName]);
        }
    });
});