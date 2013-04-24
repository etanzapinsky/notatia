$(document).ready(function() {
    var $container = $('.drawing-container');
    var selection = $('<div>').addClass('selection-box');

    $container.on('mousedown', function(e) {
        var click_y = e.pageY;
        var click_x = e.pageX;

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
        })
    }).on('mouseup', function(e) {
        $(this).off('mousemove');
        var comment = selection.clone().appendTo($(this));
        comment.addClass('comment-box');
        comment.removeClass('selection-box');
        selection.remove();

        var cap_height = 100
        var cap_width = 100

        var cap_top = (e.pageY < cap_height) ? e.pageY : e.pageY - cap_height;
        var cap_left = (document.witdh - e.pageX < cap_width) ? e.pageX - cap_width : e.pageX;

        var cap = $('<div>').css({
            'position': 'absolute',
            'width': cap_width,
            'height': cap_height,
            'top': cap_top,
            'left': cap_left,
            'border': '1px solid red'
        });

        cap.appendTo($(this))
    });
}); 
