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
    },
});

var Link = Backbone.Model.extend({
    urlRoot: '/api/link/',
})

// fetch is currently f-ed up
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

var linked_template = _.template('<h5 class="title"><span><%= title %></span><button class="btn btn-danger pull-right link">Unlink</button></h5><p><%= text %></p>');
var unlinked_template = _.template('<h4 class="title"><span><%= title %></span><button class="btn btn-success pull-right link">Link</button></h4><p><%= text %></p>');

var popup_edit_template = _.template('<p class="underline"><input class="input-large" type="text" id="popup-title" value="<%= title %>"</input><button class="close" data-dimiss="alert">&times;</button></p><textarea id="popup-textarea"><%= text %></textarea><button class="btn btn-primary pull-right bottom-button" id="save-button">Save</button>');
var popup_view_template = _.template('<h4 class="title"><span><%= title %></span><button class="close pull-right popup-view-close" data-dimiss="alert">&times;</button><button class="btn pull-right link" id="edit-button">Edit</button></h4><p><%= text %></p>');

var FriendCapsuleView = CapsuleView.extend({
    className: "capsule friend",
    template: unlinked_template,
    linked_template: linked_template,
    unlinked_template: unlinked_template,
    events: $.extend(this.events, {
        "click button.link": function(e) {
            self = this; // for some reason no var works properly
            e.preventDefault();
            e.stopImmediatePropagation();
            if (this.$('button').text() == 'Unlink') {
                $.ajax({
                    type: 'DELETE',
                    url: '/api/link/' + window.capsule.id + '/' + this.model.id,
                    data: {},
                    success: function(data, status, jqXHR) {
                        self.template = unlinked_template;
                        self.render();
                        console.log(data);
                    },
                    error: function(jqXHR, status, error) {
                        console.log(error);
                    }
                });                
            }
            else if (this.$('button').text() == 'Link') {
                $.ajax({
                    type: 'POST',
                    url: '/api/link/' + window.capsule.id + '/' + this.model.id,
                    data: {},
                    success: function(data, status, jqXHR) {
                        self.template = linked_template;
                        self.render();
                        console.log(data);
                    },
                    error: function(jqXHR, status, error) {
                        console.log(error);
                    }
                });
            }
        },
        "click": redirect
    })
});

var StreamCapsuleView = CapsuleView.extend({
    className: "capsule stream",
    template: _.template('<h3 class="title"><%= title %></h3><p><%= text %></p>')
});

var PopupCapsuleView = CapsuleView.extend({
    className: 'new-capsule-box capsule fade in',
    template: popup_edit_template,
    popup_view_template: popup_view_template,
    popup_edit_template: popup_edit_template,
    events: {
        "click .close": function(e) {
            e.preventDefault();
            this.$el.remove();
            var sel = $('span.selection');
            sel.removeClass('selection');
            sel.addClass('previewable');
        },
        "click #save-button": function(e) {
            e.preventDefault();
            this.model.attributes.title = this.$('#popup-title').val();
            this.model.attributes.text = this.$('#popup-textarea').val();
            self = this;
            this.model.save({}, {
                success: function(model, response, options) {
                    self.template = self.popup_view_template;
                    self.render();
                    $.ajax({
                        type: 'POST',
                        url: '/api/link/' + window.capsule.id + '/' + self.model.id,
                        data: self.pos,
                        success: function(data, status, jqXHR) {
                            console.log(data);
                        },
                        error: function(jqXHR, status, error) {
                            console.log(error);
                        }
                    });
                }
            });
        },
        "click #edit-button": function(e) {
            e.preventDefault();
            this.template = popup_edit_template;
            this.render();
        }
    }
})

var view_template = _.template('<h1 class="title"><%= title %><button class="btn pull-right top-button" id="edit-button">Edit</button></h1><div id="main-capsule-body"><% if (path) { %><div class="drawing-container"><img src="<%= path %>" /></div><% } else { %><%= text %><% } %></div>');
var edit_template = _.template('<h1 class="title"><input class="input-xxlarge" type="text" value="<%= title %>" id="title-input"</input><button type="submit" class="btn btn-danger pull-right top-button" id="delete-button" data-toggle="modal" href="#are-you-sure">Delete</button></h1><ul class="nav nav-pills"><li class="active"><a href="#text-input" data-toggle="tab">Text</a></li><li><a href="#image-input" data-toggle="tab">Image</a></li></ul><div class="tab-content"><textarea id="text-input" class="tab-pane active"><%= text %></textarea><input class="tab-pane" type="text" id="image-input" value="<%= path %>"</input></div><button class="btn btn-primary pull-right bottom-button" id="save-button">Save</button>');

var MainCapsuleView = CapsuleView.extend({
    className: "span8 capsule",
    template: view_template,
    view_template: view_template,
    edit_template: edit_template,
    events: {
        "mouseup div": function(e) {
            var selection;
            var new_capsule = new PopupCapsuleView({model: new Capsule()});
            new_capsule.pos = {};

            // NOTE: this only works moving forward in the text
            if (window.getSelection) {
                selection = window.getSelection();
                if (selection.toString() !== '') {
                    new_capsule.$el.css({
                        'top': e.pageY,
                        'left': e.pageX
                    })
                    $(this.el).after(new_capsule.el);
                };
                new_capsule.pos = {
                    'left': selection.baseOffset,
                    'width': selection.extentOffset
                }
                var text = selection.baseNode.textContent;
                var new_html = $('<span class="selection">' + text.slice(selection.baseOffset, selection.extentOffset) + '</span>')[0];
                var r = selection.getRangeAt();
                r.deleteContents();
                r.insertNode(new_html);
            }
        },
        "click #edit-button": function(e) {
            e.preventDefault();
            $('#main-body .comment-box').remove();
            this.template = this.edit_template;
            this.render();
        },
        "click #save-button": function(e) {
            e.preventDefault();
            this.model.attributes.title = this.$('#title-input').val();
            this.model.attributes.text = this.$('#text-input').val();
            this.model.attributes.path = this.$('#image-input').val();
            if (this.model.id) {
                this.model.save();
                this.template = this.view_template;
            }
            else {
                this.model.save({}, {
                    success: function(model, response, options) {
                        window.location.pathname = '/capsule/' + model.id;
                    }
                });
            }
        },
        "click .previewable": function(e) {
            var popup = capsule.links[0];
            popup.$el.css({
                'top': e.pageY,
                'left': e.pageX
            })
            popup.template = popup.popup_view_template;
            popup.render();
            $(this.el).after(popup.el);
        },
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
                    if (window.capsule) {
                        view.template = view.unlinked_template;
                        links = window.capsule.attributes.links;
                        for (var j = 0; j < links.length; j++) {
                            if (view.model.attributes.id == links[j].capsule) {
                                view.template = view.linked_template;
                                view.render();
                                break;
                            }
                        }
                    }
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
