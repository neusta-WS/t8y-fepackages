var controllers = [];
var fs = require('fs');
var path = require('path');
var cheerio = require('cheerio');
var root = path.dirname(module.parent.filename);

'use strict';

module.exports = function(grunt, registeredTask) {

    return function(action, sourcePath, watchTask) {
        if((action == 'added' || action == 'changed') && watchTask == registeredTask) {
            fs.readFile(sourcePath, 'utf8', function (err,data) {
                if (err) {
                    return console.log(err);
                }
                $ = cheerio.load(data);
                controllers = getControllerClasses($('.controller[data-controller]'), controllers);
                writePackagesFile();
            });
        }
    };

    function getControllerClasses(nodes, list) {
        for(var i = 0; i < nodes.length; i++) {
            list.push(nodes.eq(i).data('controller'));
        }
        return list.filter(getUnique);
    }

    function getUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    function writePackagesFile() {
        console.log('WRITE');
        fs.writeFile(root + '/js/packages.js', 'define("packages", ' + JSON.stringify(controllers) + ');', function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log("The file was saved!");
            }
        });
    }
}