define(['module', 'backbone', '../../types/DomModel', '../Facebook'], function(module, Backbone, DomModel, facebook) {

    return DomModel.extend({
        defaults: function(model) {
            return {
                id: null,
                permissions: [],
                restUrl: '',
                collection: new (Backbone.Collection.extend({
                    model: model
                }))()
            }
        },

        initialize: function() {
            DomModel.prototype.initialize.apply(this, arguments);
        },

        update: function(id, callback) {
            if(arguments.length == 2) {
                this.getData(id, this.get('restUrl'), callback);
            } else {
                this.getData(null, this.get('restUrl'), arguments[0]);
            }

        },

        getData: function(id, restUrl, onSuccess, onError) {
            var scope = this;

            facebook.getApiData(
                '/' + (id || this.get('id') || facebook.get('id')) + restUrl,
                this.get('permissions'),
                function(data) {
                    scope.get('collection').reset(data);
                    onSuccess(scope.get('collection'));
                },
                onError || function() {}
            );
        }
    });
});