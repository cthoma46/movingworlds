// Immediately-Invoked Function Expression (IIFE)
(function(User) {

	// Dependencies
	

	User = Backbone.Model.extend({
		initialize: function() {
			console.log('Users::initialize()')
		}
		, defaults : {
				first_name: null
			,	last_name: null
			, type: 'experteer'
		}
	});

	// var user = new User({first_name:'jonah', last_name:'werre'});
	// user.set('type', 'experteer');
	// 
	// console.log(user.get('type'));


	User.List = Backbone.Collection.extend({
		model: User
	});


	// var ExperteerView = Backbone.View.extend({
	// 	tagName: "article",
	// 	className: "contact-container",
	// 	template: $("#contactTemplate").html(),
	//     
	// 	render: function () {
	// 			var tmpl = _.template(this.template);
	//     
	// 			this.$el.html(tmpl(this.model.toJSON()));
	// 			return this;
	// 	}
	// });

})(MW.module("user"));
