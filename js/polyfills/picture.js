(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['es5-shim'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('es-5shim'));
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root.b);
    }
}(this, function () {
    var devicePixelRatio = window.devicePixelRatio || 1;

    var screenMatrix = [
        'lg', 'md', 'sm', 'xs', 'default'
    ];
    var pictureSupport = false; //window.HTMLPictureElement;

    document.pictures = {
        parse: function (node) {
            if (!pictureSupport) {
                if(!node) {
                    node = document.body;
                }
                if (node.get) {
                    node = node.get(0);
                }
                if(node.typeName === 'PICTURE') {
                    render(node);
                } else {
                    render(node.getElementsByTagName('picture'));
                }

            }
            return;
        }
    }

    if (!pictureSupport) {
        document.createElement('picture');
        document.createElement('source');

        if (window.addEventListener) {
            document.addEventListener('DOMContentLoaded', function() {
                document.pictures.parse();
            }, false);
            window.addEventListener('resize', function () {
                render(document.getElementsByTagName('picture'));
            }, false);
        } else {
            document.attachEvent("onreadystatechange", function() {
                document.pictures.parse();
            });
            window.attachEvent('onresize', function () {
                render(document.getElementsByTagName('picture'));
            });
        }
    }

    function render(pictures) {
        if (pictures.length > 0) {
            var screenSize = null;
            if (window.getComputedStyle) {
                screenSize = screenMatrix.indexOf(window.getComputedStyle(document.body, ':after').getPropertyValue('content').replace(/"/g, ""));
            } else {
                screenSize = document.body.currentStyle['zIndex'];
            }
            iteratePictures(pictures, screenSize);
        }
    }

    function iteratePictures(pictures, screenSize) {
        for (var i = 0; i < pictures.length; i++) {
            var picture = pictures[i];
            if (!picture.formats) {
                picture.formats = new Array();
                removeIE9VideoShim(picture);
            }

            if (picture.formats.indexOf(screenSize) == -1) {
                showImage(picture, screenSize);
            }

            var source = picture.getElementsByTagName('source');
            if( source.length && source[source.length-1].className.indexOf('last-child')==-1 ){
                source[source.length-1].className += ' last-child';
            }
        }
    }

    function removeIE9VideoShim(picture) {
        var videos = picture.getElementsByTagName('video');
        if (videos.length) {
            var video = videos[ 0 ];
            var vsources = video.getElementsByTagName('source');
            while (vsources.length) {
                picture.insertBefore(vsources[ 0 ], video);
            }
            video.parentNode.removeChild(video);
        }
    }

    function showImage(picture, screenSize) {
        var screenType = screenMatrix[screenSize];
        if (screenType) {
            picture.formats.push(screenSize);
            var source = picture.querySelectorAll('source.' + screenMatrix[screenSize]);
            if (source.length > 0) {
                createImage(source[0]);
            } else {
                showImage(picture, ++screenSize);
            }
        }
    }

    function createImage(source) {
        if (source.childNodes.length == 0) {
            var img = new Image();
            img.onload = function () {
                img.className = 'ready';
            };
            var srcset = source.getAttribute('srcset');
            if(srcset) {
                if(img.srcset !== undefined) {
                    img.srcset = srcset;
                } else {
                    var candidates = getCandidates(srcset);
                    var bestCandidate = getBestCandidate(candidates);

                    img.src = bestCandidate.url;
                    img.currentSrc = bestCandidate.url;
                }
            } else {
                img.src = source.src;
            }
            source.appendChild(img);
        }
    }

    function getCandidates(srcset) {
        var candidates = srcset.split( /\s*,\s*/ );
        var formattedCandidates = [];

        for ( var i = 0, len = candidates.length; i < len; i++ ) {
            var candidate = candidates[ i ];
            var candidateArr = candidate.split( /\s+/ );
            var sizeDescriptor = candidateArr[ 1 ];
            var resolution;
            if ( sizeDescriptor && ( sizeDescriptor.slice( -1 ) === "w" || sizeDescriptor.slice( -1 ) === "x" ) ) {
                sizeDescriptor = sizeDescriptor.slice( 0, -1 );
            }

            resolution = sizeDescriptor ? parseFloat( sizeDescriptor, 10 ) : 1;

            var formattedCandidate = {
                url: candidateArr[ 0 ],
                resolution: resolution
            };
            formattedCandidates.push( formattedCandidate );
        }
        return formattedCandidates;
    }

    function getBestCandidate(candidates) {
        candidates.sort(function( a, b ) {
            return b.resolution - a.resolution;
        });
        var candidate, bestCandidate = candidates[0];
        for ( var l=1; l < candidates.length; l++ ) {
            candidate = candidates[ l ];
            if ( candidate.resolution >= Math.round(devicePixelRatio) && candidate.resolution <= bestCandidate.resolution) {
                bestCandidate = candidate;
            } else {
                break;
            }
        }
        return bestCandidate;
    };

    return document.pictures;
}));