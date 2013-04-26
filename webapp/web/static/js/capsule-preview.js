$(document).ready(function() {
    var previewable = $('.previewable');
    var preview = $('<div>').addClass('hover-box');
    var new_capsule = $('<div>').addClass('new-capsule-box');

    previewable.on('click', function(e) {
        preview.css({
            'top': e.pageY,
            'left': e.pageX
        })
        $(this).after(preview);
    });

    $(document).mouseup(function (e) {
        var selection;
        var hover_box = $('.hover-box');
        var new_capsule_box = $('.new-capsule-box');

        if (hover_box.has(e.target).length === 0) {
            hover_box.remove();
        }

        if (window.getSelection) {
            selection = window.getSelection();
        } else if (document.selection) {
            selection = document.selection.createRange();
        }
        if (selection.toString() === '') {
            new_capsule_box.remove();
        }
    });

    $('.main-capsule-body').bind('mouseup', function(e){
        var selection;
        
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
            $(this).after(new_capsule);
        }
    });

    ProperCapsuleView = FriendCapsuleView;
    var main_capsule = new MainCapsuleView({model: new Capsule(capsule)});
    $(main_capsule.el).attr('id', 'main-capsule');
    $('#main-body').prepend(main_capsule.el);
});
