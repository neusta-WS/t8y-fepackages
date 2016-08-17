define(['jquery', 'underscore', 'backbone', '../../services/proxy'], function($, _, Backbone, proxy) {
    return Backbone.Model.extend({
        defaults: function() {
            return {
                id: -1,
                url: null,
                image: null,
                title: null,
                streams: [],
                embededMedia: false
            }
        },

        initialize: function() {
            Backbone.Model.prototype.initialize.apply(this, arguments);
        },

        getStreams: function(callback) {
            getStreams(this.get('url'), _.bind(function(response) {
                if(response.status == 200) {
                    this.set('streams', response.data);
                }
                callback(response);
            }, this));
        }
    });

    function getStreams(url, callback) {
        getStreamConfigUrl(url, function(response) {
            if(response.status == 200) {
                proxy.getXML(response.data, function(data) {
                    if(data.status == 200) {
                        var streams = [];
                        $(data.contents).find('rendition').each(function(index, item) {
                            var sourceUrl = $('src', item).text();
                            var splitUrl = sourceUrl.split('/r2/');
                            splitUrl[0] = 'http://cdn.riptide-mtvn.com';
                            streams.push({
                                width: +$(item).attr('width'),
                                height: +$(item).attr('height'),
                                bitrate: +$(item).attr('bitrate'),
                                duration: +$(item).attr('duration'),
                                url: splitUrl.join('/r2/')
                            });
                        });
                        if(streams.length > 0) {
                            callback({status: 200, data: streams});
                        } else {
                            callback({status: 404, message: 'Can\'t find streams inside of ' + url});
                        }
                    } else {
                        callback(data);
                    }
                }, proxy.SERVICES.OWN);
            } else {
                callback(response);
            }
        });
    }

    function getStreamConfigUrl(url, callback) {
        getMetaDataUrl(url, function(response) {
            if(response.status == 200) {
                proxy.getXML(response.data, function(data) {
                    if(data.status == 200) {
                        var mediaElement = $(data.contents).find('media\\:content, content');
                        if(mediaElement.length > 0) {
                            callback({status: 200, data: mediaElement.attr('url') + 'mp4'});
                        } else {
                            callback({status: 404, message: 'Can\'t find media element inside of ' + url});
                        }
                    } else {
                        callback(data);
                    }
                }, proxy.SERVICES.OWN);
            } else {
                callback(response);
            }
        });
    }

    function getMetaDataUrl(url, callback) {
        proxy.getHTML(url, function(data) {
            if(data.status == 200) {
                var result = $(data.contents).text().match(/(http:\/\/www.gameone.de\/api\/mrss\/[a-zA-Z0-9\:\.\-\_]+)/g);

                if(result) {
                    callback({status: 200, data: result[0]});
                } else {
                    callback({status: 404, message: 'Can\'t find meta informations inside of ' + url});
                }
            } else {
                callback(data);
            }
        }, proxy.SERVICES.OWN, true);
    }
});