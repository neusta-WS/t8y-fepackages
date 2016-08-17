({
    "baseUrl": "../../js",
    "name": "config",
    "deps": ["requireLib"],
    "out": "../../_release/js/main.js",
    "paths": {
        "requireLib": "../_resources/bower/requirejs/require"
    },
    "wrap": {
        "startFile": "../wrapper/start.frag",
        "endFile": "../wrapper/end.frag"
    },
    "mainConfigFile": "../../js/config.js",
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