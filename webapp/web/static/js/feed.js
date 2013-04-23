$.fn.serializeObject = function() {
      var o = {};
      var a = this.serializeArray();
      $.each(a, function() {
          if (o[this.name] !== undefined) {
              if (!o[this.name].push) {
                  o[this.name] = [o[this.name]];
              }
              o[this.name].push(this.value || '');
          } else {
              o[this.name] = this.value || '';
          }
      });
      return o;
};


var Capsules = Backbone.Collection.extend({
	url: '/api/filter/capsules/'
});

var Capsule = Backbone.Model.extend({
	urlRoot: '/api/capsule/',
    defaults: {
        title: '',
        text: '',
        path: '',
        tags: ''
    }
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

var EditCapsule = Backbone.View.extend({
	el: '.page',
	render: function(){
		var template = _.template($('#edit-capsule-template').html(), {})
		this.$el.html(template);
		
	},
	events: {
		'submit .edit-capsule-form': 'saveCapsule'
	},
	saveCapsule: function (ev){
		var capsuleDetails = $(ev.currentTarget).serializeObject();
		var capsule = new Capsule();
		capsule.save({
			title: capsuleDetails.title,
			text: capsuleDetails.text,
			tags: capsuleDetails.tags
		}, {
			success: function(){
				console.log(capsule.toJSON());
			}
			
		});
		console.log(capsuleDetails);
		return false;
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
var editCapsule = new EditCapsule();

var router = new Router();

router.on('route:home', function() {
	capsuleList.render();
});

router.on('route:editCapsule', function() {
	editCapsule.render();
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
