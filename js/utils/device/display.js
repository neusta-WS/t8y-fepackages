define([ 'module', '../device', './os', 'jquery', 'underscore', 'modernizr' ], function(module, device, os, $, _) {
	var viewmodes = { NONE: -1, PORTRAIT: 0, LANDSCAPE: 1 };
	var orientationAvailable = 'orientation' in window || module.config().orientationOnDesktop === true;
	var orientationAngle = 0;
	var orientation = viewmodes.NONE;
	var initLoad = true;
	var lastWidth = 0;
	var resizeIterations = 0;
	var blur = false;
	
	var defaultPixelRatio = 1;
	var actualPixelRatio = -1;
	
	if('devicePixelRatio' in window) {
		defaultPixelRatio = window.devicePixelRatio;
	}
	var retina = (defaultPixelRatio > 1.5);
	
	/*
	 * @description		Erzeugt im HTML Element einen CSS Klassen Namen, der Aufschluss darüber gibt, 
	 * 					ob es sich bei dem Gerät um eines mit einem Retina Display handelt
	 * 
	 * @className		display-retina		Gerät hat ein Retina Display
	 * @className		display-normal		Gerät hat KEIN Retina Display
	 */
	( function() {
		var flagName = 'display-'
		if(retina===true) {
			flagName += 'retina';
		} else {
			flagName += 'normal';
		}
		Modernizr.addTest(flagName, true);
	} )();		
	
	/*
	 * @description		Daten rund um das Device Display
	 * 					Die entsprechenden Konstanten zum Abgleich der Viewmodes finden sich in dem Unterobjekt "viewmodes"
	 */
	var display = {	
	    viewmodes: viewmodes,
	    width: function() {
            return document.documentElement.clientWidth;
		},
		height: function() {
			return document.documentElement.clientHeight;
		},		
		isRetina: function() {
			return retina;
		},
		getDefaultPixelRatio: function() {
			return defaultPixelRatio;
		},
		getActualPixelRatio: function() {
			return actualPixelRatio;
		},		
		getOrientation: function() {
			return orientation;
		},
        isPortrait: function() {
            return (orientation == viewmodes.PORTRAIT);
        },
        isLandscape: function() {
            return (orientation == viewmodes.LANDSCAPE);
        },
		getOrientationAngle: function() {
			return orientationAngle;
		},
		getScrollingOffset: function() {
			return {
				x: window.pageXOffset,
				y: window.pageYOffset
			}
		}
	}
	$(window).on( 'blur', function(){
		blur = true;
	});
	$(window).on( 'focus', function() {
		blur = false;
	});

    $(function() {
        _.bind(onResize, display)();
    });

	$(window).on( 'resize', _.bind(onResize, display));
	
	return display;
		
	/*
	 * @description		Event Handler für Window Resize
	 * 					Das Resize Event löst das Orientation Change Event ab, da "onorientationchange" 
	 * 					zu spät geworfen wird und somit bei CSS-Änderungen in Javascript ein zusätzlicher 
	 * 					CSS Render Prozess erzeugt werden würde
	 * 
	 * 					Desktop:	Resize der Browserfenstergröße
	 * 					Mobile:		OrientationChange und Wechsel in den Fullscreen Modus
	 */
	function onResize( e ) {
		var tmpOrient = orientation;
		var orientationChangeDetected = false;
		if(orientationAvailable === true) {
			var orientationChangeDetected = detectOrientationChange();
			var tmpHeight = parseInt($('html').css('min-height'));
			if(orientationChangeDetected === true) {
                if(!$(document.activeElement).is($('body'))) {
                    $(document.activeElement).blur();
                }
				setViewport();
				if( actualPixelRatio == -1)
					actualPixelRatio = window.innerWidth / window.outerWidth;
			}
			
			var height = window.innerHeight;			
			if(module.config().fullscreen === true) {
				height = getFullscreenHeight(orientationChangeDetected, initLoad);
				if(height != parseInt($('html').css( 'min-height' ))) {
					if( os.isAndroid() === true) {						
						$('html').add('body').css( { minHeight: height, height: height } );
					} else {
						$('html').add('body').css( { minHeight: height, height: height } );
					}
					
					resizeIterations++;

					if(orientationChangeDetected === true) {
						hideAddressBar();
					}					
				}
			} else {
				$('html').css( { minHeight: height } );
				hideAddressBar();
			}

			if(orientationChangeDetected==true) {
				toggleClassOrientation(orientation);
				callOrientationEvent(this);
			}
		}
        callResizeEvent(this);
		
		if(initLoad === true) {
			initLoad = false;
		}
	}	
	
	/*
	 * @decription		Vergrößert die Webseite auf Display Größe, 
	 * 					so dass die URL Bar ausgeblendet werden kann
	 */
	function getFullscreenHeight(orientationChangeDetected, initLoad) {
		if(os.isIOS() == true) {
			return doIOSFullscreen(initLoad)
		} else if(os.isAndroid()) {
			return doAndroidFullscreen()
		} else {
			return doDefaultFullscreen();
		}
	}	
	
	/*
	 * @platform 		IOS
	 * @description		Ermittlung der Höhe um eine Page im Fullscreen darstellen zu können.
	 * 					Für iPads wird nur der Wert von innerHeight benötigt
	 */
	function doIOSFullscreen(initLoad) {
		if(device.isPhone() === true) {
			if(initLoad === true) {
				var height = window.innerHeight;
				return addUrlBarHeight( height);
			} else {
				if( window.innerHeight == document.documentElement.offsetHeight) {
					return window.innerHeight;
				} else {				
					if(orientation == viewmodes.PORTRAIT) {
						return calcHeight( screen.height);
					} else {
						return calcHeight( screen.width );	
					}	
				}
			}
		} else {
			return window.innerHeight;
		}		
	}
	
	/*
	 * @platform 		IOS
	 * @description		Berechnung der Höhe der Webseite für die Fullscreen Darstellung
	 */
	function calcHeight(refSize) {
		var height = document.documentElement.clientHeight;
		var extHeight = addUrlBarHeight(height);
		if( extHeight <= refSize * display.getActualPixelRatio()) {
			return extHeight; 
		} else {
			return height;
		}					
	}	
	
	/*
	 * @platform 		IOS
	 * @description		Addition der Url Bar Höhe multipliziert mit dem aktuellen PixelRatio (1 oder 2)
	 */
	function addUrlBarHeight( height) {
		return Math.ceil( height + 60 * display.getActualPixelRatio() );
	}
	
	/*
	 * @platform 		Android 
	 * @description 	Ermittlung der Höhe um eine Page im Fullscreen darstellen zu können.
	 */
	function doAndroidFullscreen() {
		if( 1 / display.getActualPixelRatio() >= display.getDefaultPixelRatio()) {
			return Math.round(window.outerHeight / display.getDefaultPixelRatio());
		} else {
			return window.outerHeight;
		}			
	}	
	
	/*
	 * @platform 		Desktop 
	 * @description 	Ermittlung der Höhe um eine Page im Fullscreen darstellen zu können.
	 */
	function doDefaultFullscreen() {
		return $(window).height();
	}	
	
	/*
	 * @platform 		iOS, Android, Desktop
	 * @description		Ermittlung der Device Orientation anhand der Höhe und Breite der Webpage
	 */
	function detectOrientationChange() {
		var tmpOrient = null;
		if( window.innerWidth != lastWidth ) {
            // war vorher mal  if(window.outerWidth > window.outerHeight) {
			if(window.innerWidth > window.innerHeight) {
				tmpOrient = viewmodes.LANDSCAPE;				
				orientationAngle = 90;
			} else {
				tmpOrient = viewmodes.PORTRAIT;
				orientationAngle = 0;
			}
			lastWidth = window.innerWidth;
		} else {
			tmpOrient = orientation;
		}
			
		var detected = (tmpOrient != orientation);
		orientation = tmpOrient;
		return detected;
	}	
	
	/*
	 * @description 	Setzen der Orientation per CSS Klasse auf dem HTML Element
	 * 
	 * @className		orientation-landscape		Device befindet sich im Landscape Modus
	 * @className		orientation-portrait		Device befindet sich im Portrait Modus
	 */
	function toggleClassOrientation( orientation ) {
		if(orientation === viewmodes.PORTRAIT) {
			$('html').removeClass( 'orientation-landscape' ).addClass('orientation-portrait');
		} else {
			$('html').removeClass( 'orientation-portrait' ).addClass( 'orientation-landscape' );
		}		
	}
	
	/*
	 * @platform		IOS, Android & Desktop
	 * @description 	Setzen des passenden Viewport, angepasst an das Device.
	 * 					Wenn der Support von Retina Displays aktiviert ist, wird der 
	 * 					Viewport entsprechend auf die physikalischen Pixelwerte angepasst
	 * 					Soll die Page zoombar sein, wird kein Max-Scale definiert.
	 */
	function setViewport() {
		var scale = 1;
		var content = [];
		if(retina === true && 'retinaSupport' in module.config()) {
			if(os.isAndroid() && 'android' in module.config().retinaSupport && module.config().retinaSupport.android === true) {
				scale /= defaultPixelRatio;
				content.push('width=' + window.outerWidth);	
			} else if(os.isIOS() && 'ios' in module.config().retinaSupport && module.config().retinaSupport.ios === true) {
				scale /= defaultPixelRatio;				
			}		
			content.push('initial-scale=' + scale);	
		}
		
		if(content != null) {
			content.push('minimum-scale=' + scale);
			content.push('initial-scale=' + scale);
			content.push('width=device-width');
			if('zoomable' in module.config() && module.config().zoomable === false ) {
				content.push('maximum-scale=' + scale);
			}
			/*$('meta[name="viewport"]').attr({
				content: content.join(',')
			}); */
		}
	}
	
	/*
	 * @description		verbergen der URL Leiste auf Mobile Devices
	 * 					Die Page muss hierfür eine entsprechende Höhe vorweisen.
	 * 					Um sicherzugehen, dass dies der Fall ist, den Fullscreen 
	 * 					Modus von display aktivieren
	 */
	function hideAddressBar() {
		setTimeout( function() {
			window.scrollBy(0,1);
		}, 100 );
//		if(os.isAndroid()) {
//			setTimeout( function() {
//				window.scrollTo(0,1);
//			}, 100 );
//		} else {
//			window.scrollTo(0,1);
//		}
	}
	
	/*
	 * @description 	OrientationChange Event für Listener
	 * 
	 * @param 	orientation 		Beinhaltet die entsprechende Konstante (Integer) aus display.viewmodes	
	 * @param 	orientationAngle 	Winkel (Integer) des Devices (0/90Grad)	
	 */
	function callOrientationEvent(node) {
		$(node).trigger($.Event('orientationchange', {
			orientation: orientation,
			angle: orientationAngle
		}));			
	}
	
	/*
	 * @description 	Resize Event für Listener
	 * 					Nicht das original wird weitergeben, sondern ein eigens genreriertes
	 * TODO:			Anpassung, so dass immer nur ein Resize Event geworfen wird
	 * 					Bisher wird im Landscape Modus beim Wechsel von Normal auf Fullscreen und umgedreht 2 Events geworfen
	 */
	function callResizeEvent(node) {
		$(node).trigger($.Event('resize'));
	}
});