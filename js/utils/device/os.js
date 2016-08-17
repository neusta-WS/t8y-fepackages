define([ 'jquery', 'modernizr' ], function() {
	var agent = navigator.userAgent;
	var os = {
		android: /Android/i.test(agent),
		ios: /(iPhone|iPod|iPad)/i.test(agent),
		osx: /(Macintosh)/i.test(agent),
		windowsphone: /(Windows Phone)/i.test(agent),
		windows: /(Win)/i.test(agent) && !this.windowsphone
	};
	
	var osDetected = -1;
	var osCONSTANTS = { UNKNOWN: osDetected };	
	/*
	 * @description 	Erzeugt im HTML Element einen CSS Klassen Namen, der Aufschluss darüber gibt, 
	 * 					auf welchem Betriebssytem die Webseite ausgeführt wird
	 * @className		os-android		Android
	 * @className		os-ios			iOS
	 * @className		os-osx			OSX
	 * @className		os-windowsphone	Windows Phone
	 * @className		os-windows		Windows
	 * 
	 * TODO: Überprüfen ob mehrfach positive RegExp Resultate auftreten können
	 */
	(function() {
		var flagName;
		var count = 0;
		for( var key in os ) {
			osCONSTANTS[ key.toUpperCase() ] = count;
			if(os[key] == true) {
				flagName = key;	
				osDetected = count;
			}			
			count++;
		}
		Modernizr.addTest('os-' + (flagName || 'unknown'), true);
	})();
	
	/*
	 * @description		Ermittlung des Betriebssytems auf dem Webseite abgerufen wird
	 * 					Die entsprechenden Konstanten zum Abgleich finden sich in dem Unterobjekt "types"
	 */
	return {				
		types: osCONSTANTS,			
		getType: function() {
			return osDetected;
		},				
		isAndroid: function() {
			return os.android;
		},
		isIOS: function() {
			return os.ios;
		},
		isOSX: function() {
			return os.osx;
		},	
		isWindows: function() {
			return os.windows;
		},	
		isWindowsPhone: function() {
			return os.windowsphone;
		},	
		isUnix: function() {
			return os.unix;
		},	
		isLinux: function() {
			return os.linux;
		}
	}
});

	