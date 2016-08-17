define(['./FBBaseModel', './Albums'], function(FBBaseModel, Albums) {
    return FBBaseModel.extend({



        getName: function() {
            return this.get('data').first_name + ' ' + this.get('data').last_name;
        },

        getAlbumCollection: function(callback) {
            this.get('albums').update(this.get('id'), callback);
        }
    });
})