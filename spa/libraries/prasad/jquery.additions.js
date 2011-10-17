/**
 * Copyright: 2011, http://code.google.com/p/boilerplate-apps/
 * License: Apache 2.0
 * Author: Prasad.A
 */

//////////////////////
// jQuery Additions //
//////////////////////
;(function($){
	$.fn.serializeData = function() {
		var values = $(this).serializeArray();
		var data = {};				
		if (values) {
			$(values).each(function(k,v){data[v.name]=v.value;});
		}
		// If data-type="autocomplete", pickup data-value="..." set
		var autocompletes = $('[data-type="autocomplete"]', $(this));
		$(autocompletes).each(function(i){
			var ac = $(autocompletes[i]);
			data[ac.attr('name')] = ac.data('value');
		});		
		return data;
	}
	
})(jQuery);

/**
 * Attach message to an element for indicating the activity
 * (Remove the indication is already present)
 */
$.fn.loader = function(msg) {
	var node = $('.loader', this);
	
	if (node.length || msg === false) {
		node.remove();
	} else {
		if (typeof(msg) == 'undefined') msg = '<span class="img-loader loader">&nbsp;</span>';
		else msg = '<div class="loader">'+msg+'</div>';
		
		node = $(msg);
		$(this).prepend(node);
	}
}

$.fn.tabify = function() {
	// Make sure we have required elements
	var tabhandlers = $('.tabhandler', this);
	var tabcontents = $('.tabcontent', this);

	if (tabhandlers.length > tabcontents.length) {
		return false; // Mismatch in handler vs content...
	}
	
	var tabhandlersCount = tabhandlers.length;
	for(var index = 0; index < tabhandlersCount; ++index) {
		$(tabhandlers[index]).data('tabcontentindex', index);
	}
	
	tabhandlers.click(function(e){
		e.preventDefault();
		var tabhandler = $(e.currentTarget);
		var tabindex = tabhandler.data('tabcontentindex');
		
		tabhandlers.removeClass('selected');		
		tabcontents.hide();
		
		tabhandler.addClass('selected');
		$(tabcontents[tabindex]).show();
	});
	
}
