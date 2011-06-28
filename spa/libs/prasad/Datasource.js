$.Class.extend("Datasource", {
	_rscache: {},
	
	_defn:{},
	
	add: function(withName, definition) {
		if (typeof (Datasource._defn[withName])!='undefined') {
			throw "Datasource "+withName+" already defined.";
		}
		Datasource._defn[withName] = definition;
	},
	
	get: function(withName) {
		if(typeof (Datasource._defn[withName])=='undefined') {
			throw "Datasource "+withName+" not found.";
		}
		return new Datasource(Datasource._defn[withName], withName);
	}
},{
	content:false,
	result:false,
	error:false,
	
	limit: 25,
	name: '',
		
	init: function(data, name){
		// Set random name if not defined
		if (typeof(name) == 'undefined') {
			name = 'DS' + (new Date()).getTime();
		}
		this.name = name;
		this.content = data;
	},
	
	execute: function(/* arguments */){
		var fn = new Function(this.content);
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
		
		var cacheKey = this.name;
		
		if (typeof(Datasource._rscache[cacheKey]) == 'undefined') {
			this.execute.apply(this, arguments).then(function() {
				Datasource._rscache[cacheKey] = thisContext.result;
				aDeferred.resolve();
			});
		} else {
			this.setResponse(Datasource._rscache[cacheKey]);
			aDeferred.resolve();
		}
		
		return aDeferred.promise();
	}
	
});