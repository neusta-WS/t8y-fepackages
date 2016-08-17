module.exports = function(grunt) {
    return function() {
        // register global templates
        var handlebars = require('handlebars');
        var path = require('path');

        grunt.file.expand('tmpl*//***/*//*.handlebars').forEach(function (tmpl) {
            var name = 'master' + tmpl.substring('tmpl'.length, tmpl.lastIndexOf('.'));
            //TODO: change this to master
            handlebars.registerPartial(name, require(path.resolve(tmpl)));
        });
    }
}