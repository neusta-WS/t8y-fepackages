define(['module', '../../types/DomModel', '../Facebook'], function(module, DomModel, facebook) {

    return DomModel.extend({
        defaults: function(Model) {
            return {
                id: null,
                permissions: [],
                data: null
            }
        },

        initialize: function() {
            DomModel.prototype.initialize.apply(this, arguments);
        },

        update: function(onSuccess, onError) {
            var scope = this;

            facebook.getApiData(
                this.get('id'),
                this.get('permissions'),
                function(data) {
                    scope.set('data', data);
                    onSuccess(scope);
                },
                onError || function() {}
            );
        }
    });
});