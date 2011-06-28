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

;(function($){
	// http://stackoverflow.com/questions/1036742/date-difference-in-javascript-ignoring-time-of-day/2483476#2483476	
	$.daysBetween = function(first, second) {
		/**
		 * first < second: result +ve (later)
		 * first > second: result -ve (ago)
		 * first = second: result 0   (today)
		 */
				
		// Convert input to Date types
		if (first == 'null' || first == null) first = false;
		else if (typeof(first) == 'string') {
			try { first = $.datepicker.parseDate('yy-mm-dd', first); } catch(e) { first = false; }
		}
		
		if (second == 'null' || second == null) second = false;
		if (typeof(second) == 'string') {
			try { second = $.datepicker.parseDate('yy-mm-dd', second); } catch(e) { second = false; }
		}
				
		if (!first || !second) return NaN;
		
	    // Copy date parts of the timestamps, discarding the time parts.
	    var one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
	    var two = new Date(second.getFullYear(), second.getMonth(), second.getDate());

	    // Do the math.
	    var millisecondsPerDay = 1000 * 60 * 60 * 24;
	    var millisBetween = two.getTime() - one.getTime();	
	    var days = millisBetween / millisecondsPerDay;

	    // Round down.
	    return Math.floor(days);
	}
	
	$.daysBetweenInfo = function(first, second) {
		var today = new Date();	
		var otherday = false;
		
		if (typeof(second) == 'undefined') {
			otherday = first;
		} else {
			today = first;
			otherday = second;
		}
		
		var diffdays = $.daysBetween(today, otherday);
		
		var label = '';
		if      (diffdays == 0)  label = 'today';
		else if (diffdays == 1)  label = 'tomorrow';
		else if (diffdays == -1) label = 'yesterday';
		else if (diffdays > 0)   label = 'days later';
		else label = 'days ago';
		
		var info = {};
		info['diff'] = diffdays;
		info['diffpositive'] = (diffdays > 0)? diffdays: (diffdays*-1);
		
		info['label']= label;
		info['html'] = isNaN(diffdays)? 'Not set...' : 
			((info['diffpositive'] > 1)? info['diffpositive']+' '+label: label);
		
		return info;
	}
	
})(jQuery);

$.makeAutoCompleteDatasource = function(options) {
	
	options = $.extend({}, {cache: true, datasource: ''}, options);
	
	var fnExecAndFilter = function(req, responseFn) {
		var ds = Datasource.get(options.datasource);	
		
		var triggerExecute = function() {
			var params = {input:req.term};
			if (options.cache) {
				ds.cacheExecute(params).then(fnFilter);
			} else {
				ds.execute(params).then(fnFilter);
			}
		}		
		
		var fnFilter = function(){
			// Filter result
			var last = req.term.split ( /,\s*/ ).pop();
			var re = $.ui.autocomplete.escapeRegex(last);
			var matcher = new RegExp( "^" + re, "i" );
			var found = $.grep( ds.result.records, function(item,index){
				return matcher.test(item.label);
			});
			ds.close();
			responseFn( found );
		}
		
		triggerExecute();
		
	}
	
	return fnExecAndFilter;
}