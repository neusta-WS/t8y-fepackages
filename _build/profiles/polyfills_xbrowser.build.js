({
    "baseUrl": "../../js",
    "include": ["picture"],
    "out": "../../_release/js/polyfills_xbrowser.js",
    "paths": {
        "es5-shim": "../_resources/bower/es5-shim/es5-shim",
        "picture": "../js/polyfills/picture"
    },
    "keepBuildDir": false,
    "optimize": "closure",
    "skipDirOptimize": false,
    "skipModuleInsertion": true,
    "closure": {
        "CompilerOptions": {
            "removeDeadCode": true,
            "removeUnusedLocalVars": true,
            "removeUnusedVars": true
        },
        "CompilationLevel": "SIMPLE_OPTIMIZATIONS",
        "loggingLevel": "WARNING"
    },
    uglify2: {
        output: {
            beautify: false
        },
        compress: {
            dead_code: true,
            drop_debugger: true,
            loops: true,
            unused: true,
            hoist_funs: true,
            hoist_vars: true,
            if_return: true,
            join_vars: true,
            drop_console: true,
            sequences: true
        },
        warnings: true,
        mangle: true
    },
    "removeCombined": false,
    "preserveLicenseComments": false,
    "logLevel": 0
})