define(['module', 'jquery', 't8y/types/DomModel', 'jquery-cookie'], function(module, $, DomModel) {
    console.log($);
    return DomModel.extend( {

        defaults: function() {
            return {
                active: false,
                name: 'default'
            }
        },

        initialize: function(options, scope) {
            DomModel.prototype.initialize.apply(this, arguments);
            this.set('active', $.cookie(module.id + ':' + this.get('name')) == 'true');
        },

        enable: function() {
            $.cookie(module.id + ':' + this.get('name'), true, { path: '/' });
            this.set('active', true);
        },

        disable: function() {
            $.removeCookie(module.id + ':' + this.get('name'), { path: '/' });
            this.set('active', false);
        },

        toggle: function() {
            if(this.get('active') == true) {
                this.disable();
            } else {
                this.enable();
            }
        }
    } );
});