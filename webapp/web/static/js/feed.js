$(document).ready(function(e) {
    ProperCapsuleView = StreamCapsuleView;
    var caps = [];
    $.ajax({
        url: '/api/recent_capsules/',
        success: function(data, status, jqXHR) {
            for (var i = 0; i < data.length; i++) {
                var cap = new Capsule(data[i]);
                var view = new StreamCapsuleView({model: cap});
                $(view.el).addClass('stream');
                $(view.el).appendTo($('#main-stream'));
                caps.push(cap);
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

    // currently doesn't work, using a bad method
    $('#load-more').click(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/api/recent_capsules/',
            data: {'to_time': caps[caps.length-1].attributes.last_modified},
            success: function(data, status, jqXHR) {
                for (var i = 0; i < data.length; i++) {
                    var cap = new Capsule(data[i]);
                    var view = new StreamCapsuleView({model: cap});
                    $(view.el).appendTo($('#main-stream'));
                    caps.push(cap);
                }
                console.log(data);
                if (data.length == 0) {
                    $('#load-more').hide();
                }
            },
            error: function(jqXHR, status, error) {
                console.log(error);
            }
        });
    });
});
