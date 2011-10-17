/**
 * Copyright: 2011, http://code.google.com/p/boilerplate-apps/
 * License: Apache 2.0
 * Author: Prasad.A
 */
Sample = Spine.Class.create();

Sample.extend({
	
	// Static(s)...
	singleton: false,
	run: function() {
		if (!Sample.singleton) {
			Sample.singleton = Sample.init();
		}
		Sample.singleton.greet();
	}
		
});

Sample.include({
	init: function() {
		this.page = Main.pushPage();
		var indexTpl = Template.get('Sample.Index');
		this.page.html(indexTpl.execute());
		this.page.addClass('viewport');
		
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
