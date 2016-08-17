define([ 'jquery', 'modernizr' ], function($) {
	var agent = navigator.userAgent;
    var phone = false;
    var tablet = false;
    if(window.matchMedia) {
        phone = window.matchMedia('only screen and (min-device-width: 240px) and (max-device-width: 767px)').matches;
        tablet = window.matchMedia('only screen and (min-device-width: 768px) and (max-device-width: 1024px)').matches;
    }

	var device = {
		phone: phone,
		tablet: tablet,
		tv: /GoogleTV|SmartTV|Internet.TV|NetCast|NETTV|AppleTV|boxee|Kylo|Roku|DLNADOC|CE\-HTML/i.test(agent),
		console: /Xbox|PLAYSTATION.3|Wii/i.test(agent)
	};
	
	var deviceDetected = -1;
	var deviceCONSTANTS = { DESKTOP: deviceDetected };
	
	(function() {
		var flagName;
		var count = 0;
		for( var key in device ) {
			deviceCONSTANTS[ key.toUpperCase() ] = count;
			if(device[key] == true) {
				flagName = key;	
				deviceDetected = count;
			}			
			count++;
		}
		Modernizr.addTest('device-' + (flagName || 'desktop'), true);
	})();	
	
	return {	
		types: deviceCONSTANTS,
		getType: function() {
			return deviceDetected;
		},		
		isPhone: function() {
			return device.phone;
		},
		isTablet: function() {
			return device.tablet;
		},
        isPortable: function() {
            return device.phone || device.tablet;
        },
		isDesktop: function() {
			return deviceDetected == deviceCONSTANTS.DESKTOP;
		},
		isTV: function() {
			return device.tv;
		},		
		isConsole: function() {
			return device.console;
		},
		isWebapp: function() {
			if(!window.navigator.standalone){
        		return false;
        	} else {
        		return true;
        	}
		},
		screen: {
			
		}
	}
});