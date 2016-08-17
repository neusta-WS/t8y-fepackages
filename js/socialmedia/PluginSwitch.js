define([ 'module', 'jquery', 'underscore', '../types/Controller', 't8y/socialmedia/PluginSwitchModel' ], function (module, $, _, Controller, PluginSwitchModel) {

    return Controller.extend({

        model: PluginSwitchModel,

        options: {},

        events: {
            'click': changeStatus
        },

        initialize: function () {
            Controller.prototype.initialize.apply(this, arguments);
            this.model.on('change:active', _.bind(this.render, this));

//            this.render();
        },

        render: function() {
            if(this.model.get('active')) {
                this.$el.addClass('active');
            }
        }
    });

    function changeStatus(e) {
        e.preventDefault();
        this.model.toggle();
        if(this.model.get('active') == false) {
            window.location.reload();
        }
    }

    function changeOwnStatus(e) {
        if(e.status == true) {
            this.$el.addClass('active');
        }
    }
});