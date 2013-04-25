function sanitize(search_capsule) {
    var res = {};
    res.id = search_capsule.pk;
    for (e in search_capsule.fields) {
        res[e] = search_capsule.fields[e];
    }
    return res;
}

function sanitize_list(search_list) {
    var res = []
    for (var i = 0; i < search_list.length; i++) {
        res.push(sanitize(search_list[i]));
    }
    return res;
}

$(document).ready(function(e) {
    $('#search-form').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/api/search/',
            data: {'q': $("input:first").val()},
            success: function(data, status, jqXHR) {
                var res = sanitize_list(data);
                console.log(res);
            },
            error: function(jqXHR, status, error) {
                console.log(error);
            }
        });
    });
});
