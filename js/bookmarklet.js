function require_def(reqs) {
    require.config({
        baseUrl: '//localhost:8050/js'
    });
    require(reqs, function() {
        console.log('t8y Page Analyser');
    });
}(function () {
    if(!require) {
        var s = document.createElement('script');
        s.setAttribute('src', '//cdnjs.cloudflare.com/ajax/libs/require.js/2.1.5/require.min.js');
        s.onload = s.onreadystatechange = function() {
           require_def(['bookmarklet_config']);
        }
        document.getElementsByTagName("body")[0].appendChild(s);
    } else {
        require.undef('bookmarklet_config');
        require.undef('bookmarklet_main');
        require.undef('./layer/Panel');
        require_def(['bookmarklet_config']);
    }
})();