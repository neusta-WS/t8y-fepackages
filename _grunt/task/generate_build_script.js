module.exports = function(grunt) {
    var async = require('async');
    var _ = require('underscore');

//    var changedFiles = Object.create(null);
//    var onChange = grunt.util._.debounce(function() {
////        grunt.config('generate_build_script.dev.src', Object.keys(changedFiles));
////        changedFiles = Object.create(null);
//        console.log('hmm', changedFiles);
//    }, 200);
//    grunt.event.on('watch', function(action, filepath) {
//        changedFiles[filepath] = action;
//        console.log('toll', filepath, action);
//        onChange();
//    });

    grunt.registerMultiTask('generate_build_script', 'Build the i18n dictionaries from the csv file', function() {
        console.log('uiui');



        //Tell grunt that this is an async task
        var done = this.async();
        var list = new Array();

        console.log('Analyse Files ...');
        async.forEach(this.files, function (f, next) {
            var contents = f.src.filter(function(filepath) {
                // Remove nonexistent files (it's up to you to filter or warn here).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).map(function(filepath) {
                console.log('file:', filepath);
                var content = grunt.file.read(filepath);

                var result = content.match(/data-controller="([^"]*)"/g);
                if(result) {
                    for(var i = 0; i < result.length; i++) {
                        list.push(/data-controller="([^"]*)"/g.exec(result[i])[1]);
                    }
                }
            });
        }, done);
        console.log('Detected Modules: ', _.uniq(list));
    });
}