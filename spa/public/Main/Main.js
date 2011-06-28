/**
 * Copyright: 2011, http://code.google.com/p/boilerplate-apps/
 * License: Apache 2.0
 * Author: Prasad.A
 */
 
var Main = {
	
	init: function() {
		Sample.run();
	},
	
	/* Utility functions */
	pushPage: function(popTo) {
		if (typeof(popTo) != 'undefined') {
			$('.main').popVirtualPageTo(popTo);
		}
		return $('.main').pushVirtualPage();
	},
	popPage: function() {
		$('.main').popVirtualPage();
	},
	activePage: function() {
		return $('.main').activeVirtualPage();
	}
}

$(document).ready(Main.init);