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

var Router = Backbone.Router.extend({
	routes: {
		'': 'home',
		'new': 'editCapsule',
		'edit/:id': 'editCapsule'
	}
});



$(document).ready(function() {
	
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
		render: function(options){
			var that = this;
			debugger;
			if(options.id){
				//GET REQUEST
				var capsule = new Capsule({id: options.id});
				capsule.fetch({
					success: function(capsule){
						var template = _.template($('#edit-capsule-template').html(), {capsule: capsule});
						that.$el.html(template);
					}
				});
			} else {
				var template = _.template($('#edit-capsule-template').html(), {capsule: null});
				this.$el.html(template);
			}
			
		
		}, 
		events:{ 'submit .edit-capsule-form': 'saveCapsule' },
		saveCapsule:function (ev)
		{ var capsuleDetails = $(ev.currentTarget).serializeObject(); 
		var capsule = new Capsule(); 
		capsule.save( capsuleDetails, 
		{ 
			success: function(capsule){
				router.navigate('', {trigger: true}); 
			}
		});
		return false;
		}
});


var router = new Router();

var capsuleList = new CapsuleList();
var editCapsule = new EditCapsule();


router.on('route:home', function() {
	capsuleList.render();
});

router.on('route:editCapsule', function(id) {
	editCapsule.render({id: id});
	$('#tags').tagsInput({
	    'width':'488px',
	    'height': '50px',
	    'placeholderColor' : '#999'
	});
});

Backbone.history.start();

});

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