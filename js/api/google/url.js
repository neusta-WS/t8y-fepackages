define(['module', 'jquery', '../Google', '../../utils/url'], function(module, $, googleAPI, url) {

    var defaultQRCodeSize = 150;

    return {
        shorten: function(uri, callback) {
            googleAPI.loadClientLibrary('urlshortener', function(urlshortener) {
                urlshortener.url.insert({
                    'resource': {
                        'longUrl': uri
                    }
                }).execute(function(resp) {
                    if (resp.error) {
                        console.log('Error. ' + resp.error.message);
                    } else {
                        callback(resp.id);
                    }
                });
            });
        },

        expand: function(uri, callback) {
            googleAPI.loadClientLibrary('urlshortener', function(urlshortener) {
                urlshortener.url.get({
                    'shortUrl': uri
                }).execute(function(resp) {
                    if (resp.error) {
                        console.log('Error. ' + resp.error.message);
                    } else {
                        callback(resp.result);
                    }
                });
            });
        },

        toQRCode: function(uri, callback, size) {
            size = size || defaultQRCodeSize;
            var urlObj = url.toObject('//chart.googleapis.com/chart');
            urlObj.query = {
                chs: size + 'x' + size,
                cht: 'qr',
                chl: uri,
                choe: 'UTF-8',
                chld: 'H'
            }
            createImage(urlObj.toString(), callback);
        }
    }

    function createImage(url, callback) {
        var img = new Image();
        img.onload = function() {
            callback({
                image: img,
                url: url
            });
        };
        img.src = url;
    }
});