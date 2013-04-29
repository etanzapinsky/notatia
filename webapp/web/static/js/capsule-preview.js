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
    var main_capsule = new MainCapsuleView({model: capsule});
    $(main_capsule.el).attr('id', 'main-capsule');
    $('#main-body').prepend(main_capsule.el);

    var link_ids = capsule.attributes.links;
    for (var i = 0; i < link_ids.length; i++) {
        $.ajax({
            type: 'GET',
            url: '/api/link/' + link_ids[i].id,
            data: {},
            success: function(data, status, jqXHR) {
                $.ajax({
                    type: 'GET',
                    url: '/api/capsule/' + data.capsule,
                    data: {},
                    success: function(data, status, jqXHR) {
                        var view = new FriendCapsuleView({model: new Capsule(data)});
                        view.original_template = view.template;
                        view.template = view.linked_template;
                        view.render();
                        $(view.el).appendTo($('#main-stream'));
                    },
                    error: function(jqXHR, status, error) {
                        console.log(error);
                    }
                    
                });
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
