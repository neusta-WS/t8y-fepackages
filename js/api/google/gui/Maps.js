define(['underscore', '../../../types/Controller', '../../Google', '../Maps', '../Icon'], function(_, Controller, googleAPI, MapsModel, Icon) {

    return Controller.extend({
        model: MapsModel,

        initialize: function() {
            Controller.prototype.initialize.apply(this, arguments);

            googleAPI.getMaps(_.bind(function(mapsAPI) {
                this.map = new mapsAPI.Map(this.el, {
                    mapTypeId: mapsAPI.MapTypeId[this.model.get('mapType')]
                });
                this.centerAddress('Deutschland');
                this.render();
            }, this));
        },

        render: function() {
            if(this.map) {
//
//                new Icon().set({url: 'assets/img/icons/apple-touch-icon-iphone.png'});
//                this.addMarker();
            }
        },

        centerAddress: function(address) {
            var scope = this;
            googleAPI.getMaps(function(maps) {
                var geocoder = new maps.Geocoder();
                geocoder.geocode( {address : address}, function(results, status) {
                    if (status == maps.GeocoderStatus.OK) {
                        scope.map.fitBounds(results[0].geometry.bounds);
                    }
                });
            });
        }

//        addMarker: function(marker, coordList) {
//            var image = {
//                url: 'images/beachflag.png',
//                // This marker is 20 pixels wide by 32 pixels tall.
//                size: new google.maps.Size(20, 32),
//                // The origin for this image is 0,0.
//                origin: new google.maps.Point(0,0),
//                // The anchor for this image is the base of the flagpole at 0,32.
//                anchor: new google.maps.Point(0, 32)
//            };
//            // Shapes define the clickable region of the icon.
//            // The type defines an HTML &lt;area&gt; element 'poly' which
//            // traces out a polygon as a series of X,Y points. The final
//            // coordinate closes the poly by connecting to the first
//            // coordinate.
//            var shape = {
//                coords: [1, 1, 1, 20, 18, 20, 18 , 1],
//                type: 'poly'
//            };
//            for (var i = 0; i < locations.length; i++) {
//                var beach = locations[i];
//                var myLatLng = new google.maps.LatLng(beach[1], beach[2]);
//                var marker = new google.maps.Marker({
//                    position: myLatLng,
//                    map: map,
//                    icon: image,
//                    shape: shape,
//                    title: beach[0],
//                    zIndex: beach[3]
//                });
//            }
//        }
//
//    }
    });
});