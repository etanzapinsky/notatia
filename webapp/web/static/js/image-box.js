$(document).ready(function() {
    var $container = $('.drawing-container');
    var selection = $('<div>').addClass('selection-box');
    var click_y, click_x;

    $container.on('mousedown', function(e) {
        click_y = e.pageY;
        click_x = e.pageX;

        selection.css({
            'top':    click_y,
            'left':   click_x,
            'width':  0,
            'height': 0
        });
        selection.appendTo($(this));

        $(this).on('mousemove', function(e) {
            var move_x = e.pageX,
            move_y = e.pageY,
            width  = Math.abs(move_x - click_x),
            height = Math.abs(move_y - click_y),
            new_x, new_y;

            new_x = (move_x < click_x) ? (click_x - width) : click_x;
            new_y = (move_y < click_y) ? (click_y - height) : click_y;

            selection.css({
                'width': width,
                'height': height,
                'top': new_y,
                'left': new_x
            });
        });
    }).on('mouseup', function(e) {
        // $(this).off('mousemove');
        var comment = selection.clone();
        comment.addClass('comment-box');
        comment.removeClass('selection-box');
        selection.remove();

        if (e.pageX == click_x && e.pageY == click_y) {
            return;
        }

        var cap_height = 100
        var cap_width = 100

        var cap_left = (document.witdh - e.pageX < cap_width) ? e.pageX - cap_width : e.pageX;

        // var cap = $('<div>').addClass('capsule').css({
        //     'position': 'fixed',
        //     'border': '1px solid red',
        //     'background': 'white'
        // });

        var new_capsule = new PopupCapsuleView({model: new Capsule()});

        $('#main-capsule').after(comment);

        new_capsule.pos = {
            'left': comment.position().left,
            'top': comment.position().top,
            'width': comment.width(),
            'height': comment.height()
        }
        new_capsule.$el.css({
            'position': 'absolute',
            'top': e.pageY,
            'left': cap_left,
        });
        $('#main-capsule').after(new_capsule.el);
    });
}); 
