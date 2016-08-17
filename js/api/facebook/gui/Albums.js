define(['underscore', '../../../types/Controller', '../Albums'], function(_, Controller, AlbumsModel) {

    return Controller.extend({
        model: AlbumsModel,

        initialize: function() {
            Controller.prototype.initialize.apply(this, arguments);

            this.parentModel.set('required', _.union(this.parentModel.get('required'), this.model.get('permissions')));
            this.parentModel.on('change:access', _.bind(function() {
                this.model.update(function(collection) {
                    collection.each(function(album, index) {
                        console.log(album);
                        album.getPhotos(function() {
                            console.log('toll', arguments);
                        });
                    });
                    console.log(collection);
                });
            }, this));
        }
    });
});