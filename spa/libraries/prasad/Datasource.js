/**
 * Copyright: 2011, http://code.google.com/p/boilerplate-apps/
 * License: Apache 2.0
 * Author: Prasad.A
 */
Datasource = Spine.Model.setup('Datasource', ['name', 'content', 'result', 'error', 'limit']);

// Instance methods
Datasource.include({
	execute: function(){		
		/* 
		 * Wrap the content with outer-context to make easy for asynchronous behavior.
		 * Invoke main function (mandatory implementation)
		 */
		var fnDefn = 'var __aDeferred=$.Deferred(), thisInstance=this';
		fnDefn += ';function done(res, err){thisInstance.setResponse(res,err);__aDeferred.resolve(res, err);};';
		fnDefn += this.content;
		fnDefn += ';main.apply(this, arguments);return __aDeferred.promise();'

		var fn = new Function(fnDefn);
		return fn.apply(this,arguments);
	},
	
	setResponse: function(res, err) {
		this.result = res;
		this.error = err;
	},
	
	close: function() {
		delete this.result;
		delete this.error;
	},
	
	getPageLimit: function() {
		return this.limit;
	},
	
	setPageLimit: function(value) {
		this.limit = value;
	},
	
	getPageStart: function(page) {
		return parseInt(page) * this.limit;
	},
	
	cacheExecute: function(/* arguments */) {
		var aDeferred = $.Deferred();
		var thisContext = this;

		var params = (arguments.length)? null : arguments[0];
		var cachekey = (arguments.length > 1)? arguments[1] : this.name;
		
		if (typeof(Datasource._rscache[cachekey]) == 'undefined') {
			this.execute.apply(this, arguments).then(function() {
				Datasource._rscache[cachekey] = thisContext.result;
				aDeferred.resolve();
			});
		} else {
			this.setResponse(Datasource._rscache[cachekey]);
			aDeferred.resolve();
		}
		
		return aDeferred.promise();
	}
});

// Class methods
Datasource.extend({
	_rscache: {},
	_defn: {},
	
	add: function(dsname, data) {
		if (typeof this._defn[dsname] == 'undefined') {
			this._defn[dsname] = (typeof data == 'object')? data : {src:data};
		}
	},
	get: function(dsname) {
		if (typeof this._defn[dsname] == 'undefined') {
			throw "Datasource not found " + dsname;
		}
		return this.create({name: dsname, content: this._defn[dsname]['src']});
	}
});