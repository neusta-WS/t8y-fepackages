define(['jquery_1.10.2'], function (jq) {
    var jq = jq || $;
    console.log('VERSION', jq);
    return jq.noConflict( true );
});