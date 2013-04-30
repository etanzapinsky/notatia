$(document).ready(function() {
    var previewable = $('.previewable');
    var preview = $('<div>').addClass('hover-box');

    previewable.on('click', function(e) {
        preview.css({
            'top': e.pageY,
            'left': e.pageX
        })
        $(this).after(preview);
    });

    ProperCapsuleView = FriendCapsuleView;
    if (capsule) {
        var main_capsule = new MainCapsuleView({model: capsule});
        capsule.view = main_capsule;
        $(main_capsule.el).attr('id', 'main-capsule');
        $('#main-body').prepend(main_capsule.el);
    }
    else {
        var main_capsule = new MainCapsuleView({model: new Capsule()});
        capsule.view = main_capsule;
        main_capsule.template = main_capsule.edit_template;
        main_capsule.render();
        $(main_capsule.el).attr('id', 'main-capsule');
        $('#main-body').prepend(main_capsule.el);
    }

    var links = capsule.attributes.links;
    for (var i = 0; i < links.length; i++) {
        $.ajax({
            type: 'GET',
            url: '/api/capsule/' + links[i].capsule,
            data: {},
            success: function(data, status, jqXHR) {
                var view = new FriendCapsuleView({model: new Capsule(data)});
                view.original_template = view.template;
                view.template = view.linked_template;
                view.render();
                var match;
                for (var j = 0; j < links.length; j++) {
                    if (links[j].capsule == data.id)
                        match = links[j];
                }
                if (match.left == null) {
                    $(view.el).appendTo($('#main-stream'));
                }
                else {
                    var t = capsule.attributes.text;
                    var new_html = t.slice(0, match.left) + '<span class="previewable">' + t.slice(match.left, match.width) + '</span>' + t.slice(match.width);
                    $('#main-capsule-body').html(new_html);
                }
            },
            error: function(jqXHR, status, error) {
                console.log(error);
            }
        });
    }

    $('#delete-confirm').click(function(e) {
        e.preventDefault();
        capsule.destroy({
            success: function(model, response) {
                window.location.pathname = '/';
            }
        });
    });
});
