/**
 * Created by dmercier on 2015-10-07.
 */
$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        var ref = this.name;
        if(o[ref] !==undefined) {
            if(!o[ref].push) {
                o[ref] = [o[this.name]];
            }
            o[ref].push(this.value || '');
        }
        else {
            o[ref] = this.value || '';
        }
    });
    return o;
};

var Task = Backbone.Model.extend({
    'urlRoot': 'http://localhost:5000/tasks',

    'defaults': {
        id: null,
        task: 'default'
    },

    'parse': function( apiResponse ){
        console.log(apiResponse);
        if(apiResponse.task.task === undefined ) {
            return apiResponse;
        }
        return apiResponse.task;
    }
});

var Tasks = Backbone.Collection.extend({
    'url': 'http://localhost:5000/tasks',
    'model': Task,

    'parse': function( apiResponse ){
        return apiResponse.tasks;
    }
});

var TaskListView = Backbone.View.extend({
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

var TaskEditView = Backbone.View.extend({
    'el': '.page',
    'template': _.template($('#task-edit-template').html()),

    'render': function(options) {
        if(options.id) {
            var that = this;
            var existingTask = new Task({id: options.id});
            existingTask.fetch({
                success: function(gotObject) {
                    that.$el.html( that.template( { task: existingTask } ) );
                }
            });
        }
        else {
            var task = new Task();
            this.$el.html( this.template( { task: null } ) );
        }
    },

    'events': {
        'submit .edit-task-form': 'saveTask'
    },

    saveTask: function(ev) {
        var taskDetails = $(ev.currentTarget).serializeObject();
        var task = new Task;
        console.log(taskDetails);
        task.save(taskDetails, {
            success: function(task) {
                router.navigate('', {trigger: true});
            },
            error: function(model, response) {
                var responseObj = $.parseJSON(response.responseText);
                console.log('Type: ' + responseObj.error + ' Message: ' + responseObj.message);
            }
        });
        return false;
    }
});

var Router = Backbone.Router.extend({
    routes: {
        '' : 'home', // intentionally blank for the home page
        'new' : 'editTask',
        'edit/:id' : 'editTask'
    }
});

// Display logic
var taskListView = new TaskListView({ });
var taskEditView = new TaskEditView({ });
var router = new Router();

router.on('route:home', function() {
    taskListView.render();
});

router.on('route:editTask', function(id) {
    taskEditView.render({id: id});
});

Backbone.history.start();
