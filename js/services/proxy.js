define(['module', 'jquery'], function(module, $) {
    return {
        SERVICES: {
            'ANYORIGIN': 'http://anyorigin.com/dev/get/',
            'WHATEVERORIGIN': 'http://whateverorigin.org/get',
            'OWN': module.config().service
        },

        getHTML: function(url, callback, service, preventImageLoad) {
            ajax((service || this.SERVICES.OWN) + '?url=' + encodeURIComponent(url) + '&callback=?', function(data) {
                if(preventImageLoad && data.contents) {
                    data.contents = data.contents.replace(/( src=)+/g, ' data-src=');
                }
                callback(data);
            })
        },

        getXML: function(url, callback, service) {
            ajax((service || this.SERVICES.OWN) + '?url=' + encodeURIComponent(url), function(data) {
                if(data.contents) {
                    data.contents = $($.parseXML(data.contents));
                }
                callback(data);
            })
        }
    }

    function ajax(url, callback) {
//        $.getJSON(url, function(data, textStatus, jqXHR){
//            data.status = jqXHR.status;
//            callback(data);
//        }).fail(function() {
//                console.log('BAM', arguments);
//            });
        $.ajax({
            url: url,
            dataType: 'jsonp',
            success: function(data, textStatus, jqXHR) {
                data.status = jqXHR.status;
                callback(data);
            },
            error: function(e, text) {
                throw text;
            }
        });
    }
});