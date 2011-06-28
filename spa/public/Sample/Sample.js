$.Class.extend("Sample", {
	
	// Static(s)...
	singleton: false,
	run: function() {
		if (!Sample.singleton) {
			Sample.singleton = new Sample();
		}
		Sample.singleton.greet();
	}
		
}, {
	init: function() {
		this.page = Main.pushPage();
		var indexTpl = Template.get('Sample.Index');
		this.page.html(indexTpl.execute());
		this.page.addClass('main viewport');
		
		$('[data-action="again"]', this.page).click($.proxy(this, 'greet'));
	},
	
	greet: function() {
		var thisContext = this;
		
		var usernameDS = Datasource.get('Sample.UserName');
		usernameDS.execute().then(function() {
			var greetTpl = Template.get('Sample.GreetUser');
			$('.greetarea', thisContext.page).empty().html(
				greetTpl.execute({
					USERNAME: usernameDS.result
				})
			);
		});
	}
});