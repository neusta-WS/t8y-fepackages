define(['module', './Core'], function(module, Core) {
    var isNotInitialLoad = false;

    return Core.extend({
        type: 'p',

        initialize: function() {
            Core.prototype.initialize.apply(this, arguments);

            this.setParameters(module.config());
        },

        send: function(pageName) {
            this.set('pageName', pageName);
            this.set('prop42', 'D=v8+" >" + pageName');
            if(isNotInitialLoad == true) {
                this.set('events', null);
            } else {
                isNotInitialLoad = true;
                this.set('events', 'event1');
                this.set('prop33', this.get('prop32') + ' : Call');
            }
            Core.prototype.send.apply(this, []);
        }
    });
});