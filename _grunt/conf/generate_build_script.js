module.exports = {
    dev: {
        options: {
            dumpLineNumbers: false,
            cleancss: false
        },
        files: [{
            expand: true,
            src: ['tests/**.html'],
            cwd: '_release/',
            dest: './'
        }]
    }
}