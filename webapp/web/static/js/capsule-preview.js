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
});
