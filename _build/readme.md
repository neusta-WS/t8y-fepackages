Compile JS Files

OSX
java -classpath optimizer/js.jar:optimizer/compiler.jar org.mozilla.javascript.tools.shell.Main optimizer/r.js -o ./profiles/master.build.js
java -classpath optimizer/js.jar:optimizer/compiler.jar org.mozilla.javascript.tools.shell.Main optimizer/r.js -o ./profiles/polyfills_IE8.build.js
java -classpath optimizer/js.jar:optimizer/compiler.jar org.mozilla.javascript.tools.shell.Main optimizer/r.js -o ./profiles/polyfills_IE9.build.js
java -classpath optimizer/js.jar:optimizer/compiler.jar org.mozilla.javascript.tools.shell.Main optimizer/r.js -o ./profiles/polyfills_xbrowser.build.js
java -classpath optimizer/js.jar:optimizer/compiler.jar org.mozilla.javascript.tools.shell.Main optimizer/r.js -o ./profiles/_t8y.packages.socialmedia.build.js

WINDOWS
java -classpath optimizer/js.jar;optimizer/compiler.jar org.mozilla.javascript.tools.shell.Main optimizer/r.js -o ./profiles/master.build.js
java -classpath optimizer/js.jar;optimizer/compiler.jar org.mozilla.javascript.tools.shell.Main optimizer/r.js -o ./profiles/polyfills_IE8.build.js
java -classpath optimizer/js.jar;optimizer/compiler.jar org.mozilla.javascript.tools.shell.Main optimizer/r.js -o ./profiles/polyfills_IE9.build.js
java -classpath optimizer/js.jar;optimizer/compiler.jar org.mozilla.javascript.tools.shell.Main optimizer/r.js -o ./profiles/_t8y.packages.socialmedia.build.js


Node
node optimizer/r.js -o ./profiles/bookmarklet.build.js optimize=uglify2