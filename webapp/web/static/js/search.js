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

function redirect(e) {
    if (this.el.className.indexOf('friend') > -1 || this.el.className.indexOf('stream') > -1) {
        window.location.pathname = '/capsule/' + this.model.id;
    }    
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
        "click": redirect
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
    template: _.template('<h4 class="title"><span><%= title %></span><button class="btn btn-success pull-right link">Link</button></h4><p><%= text %></p>'),
    events: $.extend(this.events, {
        "click button.link": function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            $.ajax({
                type: 'POST',
                url: '/api/link/' + window.capsule.id + '/' + this.model.id,
                data: {},
                success: function(data, status, jqXHR) {
                    // this.original_template = this.template;
                    // this.template = _.template('<h4 class="title"><span><%= title %></span><button class="btn btn-danger pull-right link">Unlink</button></h4><p><%= text %></p>');
                    // debugger;
                    // this.render();
                    console.log(data);
                },
                error: function(jqXHR, status, error) {
                    console.log(error);
                }
            });
        },
        "click": redirect
    })
});

var StreamCapsuleView = CapsuleView.extend({
    className: "capsule stream",
    template: _.template('<h3 class="title"><%= title %></h3><p><%= text %></p>')
});

var MainCapsuleView = CapsuleView.extend({
    className: "span8 capsule",
    template: _.template('<h1 class="title"><%= title %><button class="btn pull-right top-button" id="edit-button">Edit</button></h1><div class="main-capsule-body"><%= text %></div>'),
    events: {
        "mouseup div": function(e) {
            var selection;
            var new_capsule = $('<div>').addClass('alert new-capsule-box fade in');
            var x = $('<button>').addClass('close').attr('data-dismiss', 'alert').html('&times;');
            x.appendTo(new_capsule);

            if (window.getSelection) {
                selection = window.getSelection();
            } else if (document.selection) {
                selection = document.selection.createRange();
            }
            if (selection.toString() !== '') {
                new_capsule.css({
                    'top': e.pageY,
                    'left': e.pageX
                })
                $(this.el).after(new_capsule);
            }
        },
        "click #edit-button": function(e) {
            e.preventDefault();
            this.original_template = this.template;
            this.template = _.template('<h1 class="title"><input id="title-input" class="input-xxlarge" value="<%= title %>"</input><button type="submit" class="btn btn-danger pull-right top-button">Delete</button></h1><textarea id="text-input" class="main-capsule-body"><%= text %></textarea><button class="btn btn-primary pull-right bottom-button" id="save-button">Save</button>');
            this.render();
        },
        "click #save-button": function(e) {
            e.preventDefault();
            this.model.attributes.title = this.$('#title-input').val();
            this.model.attributes.text = this.$('#text-input').val();
            this.model.save();
            this.template = this.original_template;
        }
    }
});

var ProperCapsuleView;

var l; // for debugging
$(document).ready(function(e) {
    $('#search-form').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/api/search/',
            data: {
                'q': $("input:first").val(),
                'id': window.capsule ? window.capsule.id : null,
            },
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
