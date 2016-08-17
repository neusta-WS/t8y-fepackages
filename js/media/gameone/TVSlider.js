define(['jquery', 'underscore', './BlogPost', '../../slider/Flip', '../../services/proxy'], function($, _, BlogPost, Flip, proxy) {
    var basePath = 'http://www.gameone.de';
    var episodeBaseUrl = basePath + '/api/mrss/mgid:gameone:video:mtvnn.com:tv_show-';

    return Flip.extend({
        nextEpisode: -1,

        initialize: function() {
            Flip.prototype.initialize.apply(this, arguments);

            this.model.on('change:status', _.bind(function(model, value) {
                if(value == 0 && model.get('view') >= model.get('viewMax') -1 ) {
                    // break out of process because we don't want to overwrite the own value until event bubbling has finished
                    _.defer(_.bind(this.next, this));
                }
            }, this));

            proxy.getHTML(basePath + '/tv', _.bind(function(data) {
                this.nextEpisode = +$('.more_link', data.contents).attr('href').match(/\d+$/)[0];
                this.next();
            }, this));
        },

        next: function(callback) {
            if(this.nextEpisode > 0) {
                this.model.set('status', this.model.STATUS.LOADING);
                proxy.getHTML(basePath + '/tv/' + this.nextEpisode, _.bind(function(data){
                    var post = getPost(this.nextEpisode, data);
                    var blogPost = new BlogPost({data: post});
                    this.addView(blogPost.$el);
                    this.model.set('status', this.model.STATUS.DEFAULT);

                    this.nextEpisode--;
                }, this), proxy.SERVICES.OWN, true);     //IE PROBLEMATIK use whateverorigin
            }
        }
    });

    function getPost(id, data) {
        data.contents = data.contents.replace(/(html|head|body)/ig, '$1a');
        return {
            id: id,
            url: basePath + '/tv/' + id,
            image: $('meta[rel="image_src"]', data.contents).attr('href'),
            title: $('#show-video > h2', data.contents).text()
        };
    }
})