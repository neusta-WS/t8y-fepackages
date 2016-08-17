({
    "baseUrl": "../../js",
    "name": "bookmarklet",
    "deps": [],
    "out": "../../_release/js/bookmarklet.js",
    "paths": {
        "requireLib": "../_resources/bower/requirejs/require"
    },
    "wrap": {
        "startFile": "../wrapper/bookmarklet_start.frag",
        "endFile": "../wrapper/end.frag"
    },
    "keepBuildDir": false,
    "optimize": "closure",
    "skipDirOptimize": false,
    "closure": {
        "CompilerOptions": {
            "removeDeadCode": true,
            "removeUnusedLocalVars": true,
            "removeUnusedVars": true
        },
        "CompilationLevel": "SIMPLE_OPTIMIZATIONS",
        "loggingLevel": "WARNING"
    },
    "removeCombined": false,
    "preserveLicenseComments": false,
    "logLevel": 0
})