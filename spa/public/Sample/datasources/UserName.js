// To enable function chaining
var aDeferred = $.Deferred();

// Reference to this instance inside inner functions...
var thisContext = this;

function run( /* arguments */ ) {
	// var params = arguments;
	var username = prompt('What is your name?');
	thisContext.setResponse(username);
	
	// Singal completion of data-fetch
	aDeferred.resolve(); 
}

// Auto-trigger the first function
run.apply(this, arguments); 
return aDeferred.promise();