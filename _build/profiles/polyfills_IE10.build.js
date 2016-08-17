({
    "baseUrl": "../../js",
    "include": ["tokenizer", "parser", "vminpoly"],
    "out": "../../_release/js/polyfills_IE10.js",
    "paths": {
        "vminpoly": "../_resources/bower/vminpoly/vminpoly",
        "tokenizer": "../_resources/bower/vminpoly/tokenizer",
        "parser": "../_resources/bower/vminpoly/parser"
    },
    "keepBuildDir": false,
    "optimize": "none",
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