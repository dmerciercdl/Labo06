/**
 * Created by dmercier on 2015-10-07.
 */

var Tasks = Backbone.Collection.extend({
    url: 'http://localhost:5000/tasks'
});

var TaskView = Backbone.View.extend({
    el: '.page',
    render: function() {
        var that = this;
        var tasks = new Tasks();

        tasks.fetch( {
            success: function(tasks) {
                var template = _.template($('#task-list-template').html(), {tasks: tasks.models});

                that.$el.html(template);
            }
        })
    }
});

var Router = Backbone.Router.extend({
    routes: {
        '' : 'home' // intentionally blank for the home page
    }
});

// Display logic
var taskListView = new TaskView({ });
var router = new Router();

router.on('route:home', function() {
    taskListView.render();
});

Backbone.history.start();
