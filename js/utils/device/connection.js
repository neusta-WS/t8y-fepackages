define([ 'jquery', 'modernizr' ], function($) {
	var connection = connection in navigator || { type: 0 };
	var lowBandwidth = connection.type == 3 || connection.type == 4 || /^[23]g$/.test(connection.type);
	var highBandwidth = connection.type == 1 || connection.type == 2;
	
	/*
	 * @description		Ermittlung der zur Verfügung stehenden Bandbreite
	 * 					Die entsprechenden Konstanten zum Abgleich finden sich in dem Unterobjekt "types"
	 */
	return {
		types: { UNKNOWN: 0, ETHERNET: 1, WIFI: 2, CELL_2G: 3, CELL_3G: 4 },
		getType: function() {
			return connection.type;
		},			
		isEthernet: function() {
			return connection.type == this.types.ETHERNET;
		},		
		isWifi: function() {
			return connection.type == this.types.WIFI;
		},		
		is3G: function() {
			return connection.type == this.types.CELL_3G;
		},
		is2G: function() {
			return connection.type == this.types.CELL_2G;
		},
		isUnknown: function() {
			return connection.type == this.types.UNKNOWN;
		}
    }
});
