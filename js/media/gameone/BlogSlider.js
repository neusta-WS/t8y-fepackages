define(['jquery', 'underscore', './BlogPost', '../../slider/Flip', '../../services/proxy'], function($, _, BlogPost, Flip, proxy) {
    var basePath = 'http://www.gameone.de';

    return Flip.extend({
        nextPageUrl: basePath + '/blog',

        initialize: function() {
            Flip.prototype.initialize.apply(this, arguments);

            this.model.on('change:status', _.bind(function(model, value) {
                if(value == 0 && model.get('view') >= model.get('viewMax') -1 ) {
                    // break out of process because we don't want to overwrite the own value until event bubbling has finished
                    _.defer(_.bind(this.next, this));
                }
            }, this));
            this.next();
        },

        next: function(callback) {
            this.model.set('status', this.model.STATUS.LOADING);
            proxy.getHTML(this.nextPageUrl, _.bind(function(data){
                if(data.status == 200) {
                    this.nextPageUrl = basePath + $('.pagination.pagination_bottom > a.next_page', $(data.contents)).attr('href');
                    var posts = getPosts($(data.contents));
                    _.each(posts, _.bind(function(post, index) {
                        var blogPost = new BlogPost({data: post});
                        this.addView(blogPost.$el);
                    }, this));
                    this.model.set('status', this.model.STATUS.DEFAULT);
                } else {

                }
            }, this), proxy.SERVICES.OWN, true);     //IE PROBLEMATIK use whateverorigin
        }
    });

    function getPosts(content) {
        var posts = [];
        $('.post.teaser_box.teaser', content).each(function(index, post) {
            posts.push({
                id: post.id,
                url: basePath + $('a.image_link', post).attr('href'),
                image: $('a.image_link > img', post).data('src'),
                title: $('h3', post).text()
            });
        });
        return posts;
    }
})