function sanitize(search_capsule) {
    var res = {};
    res.id = search_capsule.pk;
    for (e in search_capsule.fields) {
        res[e] = search_capsule.fields[e];
    }
    return new Capsule(res);
}

function sanitize_list(search_list) {
    var res = []
    for (var i = 0; i < search_list.length; i++) {
        res.push(sanitize(search_list[i]));
    }
    return res;
}


var Capsule = Backbone.Model.extend({
    urlRoot: '/api/capsule/',
    defaults: {
        title: '',
        text: '',
        path: '',
        tags: ''
    }
});

var CapsuleView = Backbone.View.extend({
    tagName: "div",
    className: "capsule",
    events: {
        "click": function(e) {
            if (this.el.className.indexOf('friend') > -1 || this.el.className.indexOf('stream') > -1) {
                window.location.pathname = '/capsule/' + this.model.id;
            }
            else {
                e.preventDefault();
            }
        },
      // "click .button.edit":   "openEditDialog",
      // "click .button.delete": "destroy"
    },
    initialize: function() {
        this.listenTo(this.model, "change", this.render);
        this.render();
    },
    template: _.template('<h3 class="title"><%= title %></h3><p><%= text %></p>'),
    render: function() {
        this.$el.html(this.template(this.model.attributes));
        return this;
    }
});

var FriendCapsuleView = CapsuleView.extend({
    className: "capsule friend",
    template: _.template('<h4 class="title"><%= title %></h4><p><%= text %></p>')
});

var StreamCapsuleView = CapsuleView.extend({
    className: "capsule stream",
    template: _.template('<h3 class="title"><%= title %></h3><p><%= text %></p>')
});

var MainCapsuleView = CapsuleView.extend({
    className: "span8 capsule",
    template: _.template('<h1 class="title"><%= title %><button class="btn pull-right" id="edit-button">Edit</button></h1><div class="main-capsule-body"><%= text %></div>'),
});

var ProperCapsuleView;

var l; // for debugging
$(document).ready(function(e) {
    $('#search-form').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/api/search/',
            data: {'q': $("input:first").val()},
            success: function(data, status, jqXHR) {
                $('#main-stream').children().remove();
                caps = []
                var res = sanitize_list(data);
                for (var i = 0; i < res.length; i++) {
                    var view = new ProperCapsuleView({model: res[i]});
                    $(view.el).appendTo($('#main-stream'));
                }
                l = res;
                caps = res;
                console.log(res);
            },
            error: function(jqXHR, status, error) {
                console.log(error);
            }
        });
    });
});
