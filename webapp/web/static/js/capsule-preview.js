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
    var main_capsule = new MainCapsuleView({model: new Capsule(capsule)});
    $(main_capsule.el).attr('id', 'main-capsule');
    $('#main-body').prepend(main_capsule.el);

    $('#edit-button').click(function(e) {
        e.preventDefault();
        main_capsule.template = _.template('<h1  class="title"><input value="<%= title %>"</input><button class="btn pull-right" id="edit-button">Edit</button></h1><textarea class="main-capsule-body" "value="<%= text %>"</textarea>');
        main_capsule.render();
    });
});
