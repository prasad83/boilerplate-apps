/**
 * Copyright: 2011, http://code.google.com/p/boilerplate-apps/
 * License: Apache 2.0
 * Author: Prasad.A
 */
Template = Spine.Model.setup('Template', ['content']);

// Instance methods
Template.include({
	execute: function(params) {
		if (typeof(params) == 'undefined') params = {};
		return $.jqote(this.content, params);
	}
});

// Class methods
Template.extend({
	_tpls: {},
	
	add: function(tplname, content) {
		if (typeof this._tpls[tplname] == 'undefined') {
			this._tpls[tplname] = Template.create({content: content});
		}
	},
	get: function(tplname) {
		if (typeof this._tpls[tplname] == 'undefined') {
			throw "Template not found: " + tplname;
		}
		return this._tpls[tplname];
	}	
});