({
    "baseUrl": "../../js",
    "include": ["console"],
    "out": "../../_release/js/polyfills_IE9.js",
    "paths": {
        "console": "../_resources/bower/console-polyfill/index"
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
        "CompilationLevel": "WHITESPACE_ONLY",
        "loggingLevel": "WARNING"
    },
    "removeCombined": false,
    "preserveLicenseComments": false,
    "logLevel": 0
})