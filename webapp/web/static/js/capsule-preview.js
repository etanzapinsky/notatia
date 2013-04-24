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

    $(document).mouseup(function (e) {
        var container = $('.hover-box');

        if (container.has(e.target).length === 0) {
            container.remove();
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
            console.log(selection.toString());            
        }
    });
});
