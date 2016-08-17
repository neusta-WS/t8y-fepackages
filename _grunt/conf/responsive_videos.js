module.exports = {
    myTask:{
        options: {
            sizes: [{
                name: "phone",
                width: 320,
                poster: true
            }, {
                name: "phone-retina",
                width: 640,
                poster: true
            }, {
                name: "tablet",
                width: 1024,
                poster: true
            }, {
                name: "tablet-retina",
                width: 2048,
                poster: true
            }, {
                name: "desktop",
                width: 1280,
                poster: true
            }],
            encodes: [{
                webm: [
                    {'-vcodec': 'libvpx'},
                    {'-acodec': 'libvorbis'},
                    {'-crf': '12'},
                    {'-q:a': '100'},
                    {'-threads': '0'}
                ],
                mp4: [
                    {'-vcodec':'libx264'},
                    {'-acodec': 'libfaac'},
                    {'-pix_fmt': 'yuv420p'},
                    {'-q:v': '4'},
                    {'-q:a': '100'},
                    {'-threads': '0'}
                ]
            }]
        },
        files: [{
            expand: true,
            src: ['assets/videos/**.{mov,mp4}'],
            cwd: './',
            dest: '_release/'
        }]
    }
}