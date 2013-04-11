$(document).ready(function() {

});

var CapsuleModel = Backbone.Model.extend({
    urlRoot: '/api/capsule/',
    defaults: {
        title: '',
        text: '',
        path: '',
        tags: ''
    }
});
