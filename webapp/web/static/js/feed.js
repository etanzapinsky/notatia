var Capsules = Backbone.Collection.extend({
	url: '/api/filter/capsules/'
});

var CapsuleList = Backbone.View.extend({
	el: '.page',
	render: function(){
		var that = this;
		var capsules = new Capsules();
		capsules.fetch({
			success: function(capsules){
				var template = _.template($('#capsule-list-template').html(), {capsules: capsules.models})
				that.$el.html(template);
			}
		});
		
	}
});



var Router = Backbone.Router.extend({
	routes: {
		'': 'home',
		'new': 'editCapsule'
	}
});


$(document).ready(function() {

var capsuleList = new CapsuleList();
var router = new Router();
router.on('route:home', function() {
	capsuleList.render();
});

Backbone.history.start();

});




/*
var Capsule = Backbone.Model.extend({
    urlRoot: '/api/capsule/',
    defaults: {
        title: '',
        text: '',
        path: '',
        tags: ''
    }
});

var Capsules = Backbone.Collection.extend({
	model: Capsule,
	url: '/api/filter/capsules/'
});

var CapsulesView = Backbone.View.extend({
	tagName: 'div',
	id: 'capsuleList',
	render: function(){
		this.el.innerHTML = this.model.get("0").attributes.title;
		return this;
	}
});


$(document).ready(function() {
	
	var capsules = new Capsules();

	capsules.on("reset", function() {
		var cv = new CapsulesView();
		cv.render();
		this.each(function(capsule) {
			console.log(capsule.attributes);
			
		});
	});

	capsules.fetch({reset: true});
		
});
*/
