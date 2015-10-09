/**
 * Created by dmercier on 2015-10-06.
 */

Task = Backbone.Model.extend({

    urlRoot: '/tasks',
    default: {
        UID: 0,
        Description: 'My task'
    },
    initialize: function() {
    }
});

var task = new Task();
task.fetch({
    success: function(task) {
        alert(task.toJSON());
    }
})