$.Class.extend("Template", {
	
	get: function(withName) {
		var script = $('script[data-name="'+withName+'"]');
		if (script.length == 0) {
			throw "Template "+ withName + " not found.";
		}
		return new Template('<div>'+script.html()+'</div>');
	}
	
}, {
	content: false,
	
	init: function(data) {
		if (typeof(data) != 'undefined') {
			this.content = data;
		}
	},
	
	setContent: function(data) {
		this.content = data;
	},
	
	execute: function(params) {
		if (typeof(params) == 'undefined') params = {};
		return $.jqote(this.content, params);
	}
})