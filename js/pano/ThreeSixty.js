define(['jquery', '../types/PointerController', '../types/ImageCache'], function($, PointerController, ImageCache) {
    return PointerController.extend({
        imageCache: null,
        show: 0,

        initialize: function() {
            PointerController.prototype.initialize.apply(this, arguments);

            this.imageCache = new ImageCache();

            var imageList = [];
            for(var i = 1; i <= 421; i++) {
                imageList.push({url: '../assets/img/threesixty/' + i + '.jpg'});
            }
            this.imageCache.add(imageList);

            this.imageCache.on('progress', onProgress);
            this.imageCache.on('complete:partial', onPartialComplete);
            this.imageCache.on('complete', onComplete);

            this.imageCache.load(4);


            this.image = $('<img src="' + imageList[0].url + '" />').appendTo(this.$el);

        },

        onDrag: function(e) {
            e.preventDefault();
            PointerController.prototype.onDrag.apply(this, arguments);
        },

        onAnd: function(e) {
            PointerController.prototype.onAnd.apply(this, arguments);

            this.buffer.pagePoint.addLocal(this.position).subtractLocal(this.dragPoint).divideLocal(-this.$el.width(), this.$el.height());

//            console.log(this.imageCache.at(Math.round(this.buffer.pagePoint.x * this.imageCache.length)).get('url'));
//            console.log(this.buffer.pagePoint.x, this.imageCache.length);
            var no = (this.show + Math.round(this.buffer.pagePoint.x * this.imageCache.length)) % this.imageCache.length;
            if(no < 0) {
                no = this.imageCache.length + no;
            }

            if(this.imageCache.at(no).get('loaded')) {
//                this.image.src =  this.imageCache.at(no).get('url');
                $(this.image).replaceWith(this.imageCache.at(no).get('image'));
                this.image = this.imageCache.at(no).get('image');
            }
//            console.log('aktuell', no);
        },

        onDrop: function(e) {
            PointerController.prototype.onDrop.apply(this, arguments);
            this.buffer.pagePoint.addLocal(this.position).subtractLocal(this.dragPoint).divideLocal(-this.$el.width(), this.$el.height());
//            this.buffer.pagePoint.addLocal(this.position).subtractLocal(this.dragPoint).divideLocal(this.$el.width(), this.$el.height());
            var no = (this.show + Math.round(this.buffer.pagePoint.x * this.imageCache.length)) % this.imageCache.length;
            if(no < 0) {
                no = this.imageCache.length + no;
            }
            this.show = no;
//            console.log('komisch ' + no);
        }
    });

    function onProgress(progress) {
        console.log('PROGRESS: ' + ~~(progress * 100) + '%');
    }

    function onPartialComplete(progress) {
        console.log('PARTIAL COMPLETE: ' + ~~(progress * 100) + '%');

    }

    function onComplete(progress) {
        console.log('COMPLETE: ' + ~~(progress * 100) + '%');

    }
});