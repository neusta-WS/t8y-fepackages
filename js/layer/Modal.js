define(['jquery', 'underscore', 'backbone', '../types/PointerController', '../types/DomModel', '../History', '../utils/parser'], function($, _, Backbone, PointerController, DomModel, History, parser) {

    var cache = new (Backbone.Collection.extend({
        model: Backbone.Model.extend({
            defaults: function () {
                return {
                    id: null,
                    content: null,
                    parent: null
                }
            }
        })
    }))();

    return PointerController.extend({
        model: DomModel.extend({
            defaults: function() {
                return {
                    deep: null
                }
            }
        }),
        listener: [],
        pos: null,
        maxScroll: 0,
        overscrollFixActivated: false,

        events: function() {
            return _.extend(PointerController.prototype.events(), {
                'click a[data-element="close"]': close
            });
        },

        initialize: function() {
            PointerController.prototype.initialize.apply(this, arguments);
            //console.log('INIT MODAL', 'a[data-deep="' + this.$el.data('deep') + '"]');
            disable.bind(this)(this.$el);
            History.register(this.$el.data('deep'), _.bind(this.update, this));
            $('body').on('click', 'a[data-deep="' + this.$el.data('deep') + '"]', open);
            this.$el.on('click', closeOutside);


        },

        update: function(value) {
            var button = $('a[href="#' + value + '"]');
            if(this.$el.data('ajax')) {
                if(value) {
                    var caching = ( button.data('no-cache') == undefined ) ? true : false;

                    getAjaxContent(this.$el.data('ajax') + value, _.bind(function(node) {
                        //getAjaxContent( button.data('page'), _.bind(function(node) {
                        node.appendTo($('.content', this.$el));

                        try{
                            parser.parse(node);
                        } catch (e){

                        }

                        // open modal
                        $(this.$el).removeClass('hidden');
                        $("div.controller.modal").scrollTop(0);
                        setTimeout(_.bind(function(){
                            enable.bind(this)(this.$el);
                        },this),100);
                    }, this), caching);
                } else {
                    disable.bind(this)(this.$el);
                    $('.content > *', this.$el).detach();
                }
            } else {
                if(!!value) {
                    enable.bind(this)(this.$el);
                } else {
                    disable.bind(this)(this.$el);
                }
            }
        },

        onDrag: function(e) {
            PointerController.prototype.onDrag.apply(this, arguments);
            if(e.pointerType == 'touch') {

                this.maxScroll = $('[data-element="content-container"]', this.$el).outerHeight(true) - this.$el.outerHeight();
                if(this.maxScroll < 0) {
                    this.overscrollFixActivated = true;
                    $(document).on('touchmove.overscrollfix', _.bind(preventPageScroll, this));
                }
            }
        },

        onAnd: function(e) {
            if(this.overscrollFixActivated == true) {
                PointerController.prototype.onAnd.apply(this, arguments);
                var distance = this.buffer.getLatestEntry();

                if (this.$el.scrollTop() <= 0 && distance.pageY > this.dragPoint.y) {
                    e.preventDefault();
                } else if (this.$el.scrollTop() >= this.maxScroll && distance.pageY < this.dragPoint.y) {
                    e.preventDefault();
                }
            }
        },

        onDrop: function(e) {
            PointerController.prototype.onDrop.apply(this, arguments);
            $(document).off('touchmove.overscrollfix');
        }
    });

    function open(e) {
        e.preventDefault();

        var modal = $("div.controller.modal.active");
        $('section[data-element="content-container"] .content > *', modal).detach();
        $(document).trigger( "t8y.modal.open", [ modal ] );

        History.update($(e.currentTarget).data('deep'), $(e.currentTarget).attr('href'));

        setTimeout(_.bind(function() {
            $('[data-fragment="modal"]').offset();
            $("body").offset();
        }, this), 500);
    }



    function closeOutside(e){
        var modal = $(e.currentTarget);
        if (modal.is(e.target )) {
            $(this).find('a[data-element="close"]').trigger('click');
        }
    }

    function close(e) {
        e.preventDefault();
        var modal = $("div.controller.modal.active");
        $(document).trigger( "t8y.modal.close", [ modal ] );
        History.remove(this.$el.data('deep'));
    }

    function enable(node) {
        $('body').addClass('active-modal ' + node.data('deep'));
        node.removeClass('no-active').addClass('active');
    }

    function disable(node) {
        $('body').removeClass('active-modal ' + node.data('deep'));
        node.removeClass('active').addClass('no-active');
    }

    function getContent(key) {
        if(cache.get(key)) {
            return cache.get(key).get('content');
        } else {
            var node = $(key);
            node.data('selector', key);
            cache.add({id: key, content: node, parent: node.parent()});
            return node;
        }
    }

    function getAjaxContent(key, callback, caching ) {
        if(cache.get(key) && caching ) {
            callback(cache.get(key).get('content'));
        } else {
            $.ajax({
                url: key,
                context: this,
                dataType: 'html',
                dataFilter: function(data) {
                    return $(data)
                }
            }).done(function(node){
                cache.add({id: key, content: node});
                callback(node);
            });
        }
    }

    function preventPageScroll(e) {
        if (this.$el.has($(e.target)).length == 0) {
            e.preventDefault();
        }
    }
});