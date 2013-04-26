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
    className: "stream capsule",
    // events: {
    //   "click .icon":          "open",
    //   "click .button.edit":   "openEditDialog",
    //   "click .button.delete": "destroy"
    // },
    initialize: function() {
        this.listenTo(this.model, "change", this.render);
        this.render();
    },
    template: _.template('<h3 class="title"><%= title %></h3>'),
    render: function() {
        this.$el.html(this.template(this.model.attributes));
        return this;
    }
});

var l; // for debugging
$(document).ready(function(e) {
        $.ajax({
            url: '/api/recent_capsules/',
            success: function(data, status, jqXHR) {
                for (var i = 0; i < data.length; i++) {
                    var view = new CapsuleView({model: new Capsule(data[i])});
                    $(view.el).appendTo($('#main-stream'));
                }
                l = data;
                console.log(data);
                if ($('#main-stream').children().length == 0) {
                    $('#load-more').hide();
                }
                else {
                    $('#load-more').show();
                }
            },
            error: function(jqXHR, status, error) {
                console.log(error);
            }
        });    
    
    $('#search-form').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/api/search/',
            data: {'q': $("input:first").val()},
            success: function(data, status, jqXHR) {
                $('#main-stream').children().remove();
                var res = sanitize_list(data);
                for (var i = 0; i < res.length; i++) {
                    var view = new CapsuleView({model: res[i]});
                    $(view.el).appendTo($('#main-stream'));
                }
                l = res;
                console.log(res);
                if ($('#main-stream').children().length == 0) {
                    $('#load-more').hide();
                }
                else {
                    $('#load-more').show();
                }
            },
            error: function(jqXHR, status, error) {
                console.log(error);
            }
        });
    });
});
