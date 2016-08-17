var handlebars = require('../../node_modules/grunt-compile-handlebars/node_modules/handlebars');

module.exports = function(context, options) {
    return JSON.stringify(context);
};