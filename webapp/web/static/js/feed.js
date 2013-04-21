
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


$(document).ready(function() {

	var capsules = new Capsules();

	capsules.on("reset", function() {
		this.each(function(capsule) {
			console.log(capsule);
		});
	});

	capsules.fetch({reset: true});
});
