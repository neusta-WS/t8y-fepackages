define([ 'module', 'jquery', 'backbone', 't8y/socialmedia/api/facebook/Post' ], function (module, $, Backbone, Post) {
    return Backbone.Collection.extend({
        model: Post,
        initialize: function() {

            this.on('add', function(model, collection) {
                if(!model.get('object_id')) {
                    var applicationName = 'unknown'
                    if(model.get('application')) {
                        applicationName = model.get('application').name;
                    }
                    console.error('Missing Object ID in Post of ' + model.get('from').name + ' created by ' + applicationName + '!');
                    collection.remove(model);
                }
            });
        }
    });
});