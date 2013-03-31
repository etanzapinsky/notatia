(function ($) {
    		Group = Backbone.Model.extend({
    			// Show Model that holds the group name attribute
    			name: null
    		});

    		Groups = Backbone.Collection.extend({
    			initialize: function (models, options) {
    				this.bind("add", options.view.addGroupList);
    				// Listen for new additions to the collection and call a view function addGroupList if so
    			}
    		})

    		window.AppView = Backbone.View.extend({
    			el: $("body"),
    			initialize: function () {
    				this.groups = new Groups( null, {view: this});
    			},
    			events: {
    				"click #addGroup": "addVal",
    			},
    			addVal: function() {
    				var group_name = $('#groupName').val();
                    $('#groupName').val('');
    				var group_model = new Group({ name: group_name });
    				this.groups.add(group_model);
    			},
    			addGroupList: function (model){
    				$("#groupList").append("<li class='span2'><a href='#"+model.get('name')+"' class='thumbnail'>" + model.get('name') + "</a></li>");
    			}
    		});
    		var appview = new AppView;
    	})(jQuery);