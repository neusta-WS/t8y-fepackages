define(['module', 'jquery'], function(module, $) {
    var BASEURL = 'https://api-ssl.bitly.com/v3';



    return {
        shorten: function(url, callback) {
            $.getJSON(BASEURL + '/shorten?callback=?', {
                "format": "json",
                "access_token": getAPIKey(),
                "longUrl": url
            }, function(response) {
                callback(response.data.url);
            });
        },

        expand: function(url, callback) {
            $.getJSON(BASEURL + '/expand?callback=?', {
                "format": "json",
                "access_token": getAPIKey(),
                "shortUrl": url
            }, function(response) {
                callback(response.data.expand[0]);
            });
        }
    }

    function getAPIKey() {
        if(!module.config().apiKey) {
            throw 'API Key not defined in config. Sample: "t8y/services/urlshortener/bitly": { apiKey: "<YOUR API KEY>"}';
        } else {
            return module.config().apiKey;
        }
    }
});