define(['jQuery_1.9.1'], function (jq) {
    console.log(jq);
    var jq = jq || $;
    console.log('VERSION', jq().jquery);
    return jq.noConflict( true );
});