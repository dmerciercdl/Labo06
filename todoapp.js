/**
 * Created by dmercier on 2015-10-07.
 */

var Task = Backbone.Model.extend({
    'id': 0,
    'task': 'toto'
});

var Tasks = Backbone.Collection.extend({
    'url': 'http://localhost:5000/tasks',
    'model': Task,

    'parse': function( apiResponse ){
        return apiResponse.tasks;
    }
});

var TaskView = Backbone.View.extend({
    'el': '.page',
    'template': _.template($('#task-list-template').html()),

    'render': function() {
        var that = this;
        var tasks = new Tasks();

        tasks.fetch( {
            success: function() {
                that.$el.html( that.template( { 'tasks': tasks } ) );
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
