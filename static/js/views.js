/*============================================================================
 * CreateProgram View
 * handles the creation of new programs
 * =========================================================================*/
App.Views.CreateProgram = Backbone.View.extend({
    el: '#create_program',

    template: _.template( $('#create_program_template').html() ),

    initialize: function() {
        this.render()
    },

    render: function() {
        this.$el.html(this.template());
    },

    events: {
        'click button[id=new_program]': 'createProgram',
        'click button[id=add_stat]': 'addStat' //NOT IMPLEMENTED
    },

    /* createProgram function
     * create a new program with the name they typed in
     * and the stats provided
     */
    createProgram: function() {
        // create a new program model
        var program_name = document.getElementById('new_program_name').value;
        this.model.set({'name': program_name});
        this.model.save(null, {
            success: function(model) {
                // add it to the collection and clear the form
                App.Programs.add([model]);

                // create the stat entered with that model
                var stat_name = document.getElementById('stat1name').value;
                var stat_value = document.getElementById('stat1value').value;
                // create the model and save it to the db
                App.NewStatModel = new App.Models.Stat({
                   name: stat_name,
                   program_id: model.get('program_id'),
                   value: stat_value
                });
                App.NewStatModel.save();

                // clear the forms
                document.getElementById('new_program_name').value = '';
                document.getElementById('stat1name').value = '';
                document.getElementById('stat1value').value = '';
                

                // select that program
                App.ProgramList.selectProgram(event, model.get('name'));
            },
            error: function() {
                console.log('there was an error');
            },
        });
    },

    /* addStat function
     * add a stat name and value input to the template
     * XXX NOT IMPLEMENTED YET
     */
    addStat: function() {
        console.log('add stat');
        // create an input element
        var new_input = document.createElement('input');
        new_input.setAttribute('type', 'text');
        new_inpute.setAttribute('placeholder', 'Stat name')
    },
});



/*============================================================================
 * ProgramList View
 * view representing the program list, selects new stat lists to show
*============================================================================*/
App.Views.ProgramList = Backbone.View.extend({
    el: '#program_list',

    template: _.template( $('#program_list_template').html() ),

    initialize: function () {
        // for the program view
        this.collection.on('remove', this.render, this);
        this.collection.on('add', this.render, this);
        this.render();
    },

    render: function() {
        this.$el.html(this.template({'programs': this.collection.toJSON()})); 
    },

    events: {
        'click button[class=program_btn]': 'selectProgram',
        'click button[class=delete_prog]': 'deleteProgram'
    },

    /* selectProgram Function
     * render the stat view for the selected program
     */
    selectProgram: function(event, program_name) {
        App.Stats = new App.Collections.StatCollection();
        var stats = App.Stats;
        if (program_name) {
            stats.url = '/stats/' + program_name
        } else {
            stats.url = '/stats/' + event.currentTarget.name;
        }
        stats.fetch({
            success: function() {
                // If successful create a new view with the stats
                if (App.StatView) {
                    App.StatView.undelegateEvents();
                }
                App.StatView = new App.Views.StatList({
                    collection: stats
                });
            },
            error: function(ret) {
                // If it fails create the view without stats
                if (App.StatView) {
                    App.StatView.undelegateEvents();
                }
                App.StatView = new App.Views.StatList({
                    collection: stats
                });
            }
        });
    },

    /* deleteProgram function
     * delete the program on the server and remove it from the collection
     */
    deleteProgram: function(event) {
        var program_id = event.currentTarget.getAttribute('program_id');
        var program = this.collection.get(program_id);
        // remove the model from the collection then destroy it
        this.collection.remove(program);
        program.destroy();
    }
});



/*============================================================================
 * StatList View
 * Shows the stats for a particular program and lets you change the value of
 * the particular stats
*===========================================================================*/
App.Views.StatList = Backbone.View.extend({
    el: '#program_stats',

    template: _.template( $('#program_stats_template').html() ),

    initialize: function () {
        this.collection.on('remove', this.render, this);
        this.render();
    },

    // render this view, if this view already has a program, set it
    render: function() {
        if (this.collection.models[0]) {
            var program_name = this.collection.models[0].get('program');
        } else {
            var program_name = null;
        }

        this.$el.html(this.template({
            'stats': this.collection.toJSON(),
            'program': program_name
        }));
    },

    events: {
        'blur td[id=stat_value]': 'saveStat',
        'click button[id=new_stat]': 'newStat',
        'click button[id=del_stat]': 'deleteStat',
    },

    /* saveStat Function
     * When you click on the td containing the value, you should be able to edit the value
     * When you are done (unfocus) save the data
     */
    saveStat: function(event) {
        var model_id = event.currentTarget.getAttribute('model_id');
        var stat_model = this.collection.get(model_id);
        var new_value = event.currentTarget.textContent;
        stat_model.set({value: new_value});
    },

    /* newStat Function
     * When you click the new stat button, create a new stat model with that name they put in
     * and the program that is currently being viewed
     */
    newStat: function(event) {
        var stat_name = document.getElementById('new_stat_name').value;
        var prog_id = this.collection.models[0].get('program_id');
        // create the model and save it to the db
        App.NewStatModel = new App.Models.Stat({
           name: stat_name,
           program_id: prog_id,
           value: 0
        });
        this.collection.add(App.NewStatModel);
        App.NewStatModel.save(null, {
            success: function(ret) {
                App.StatView.render();
            }
        });
    },

    /* deleteStat Function
     * When you click on this button, delete the specified stat
     */
    deleteStat: function(event) {
        // find and delete that model from the collection and server
        var model_id = event.currentTarget.getAttribute('stat_id');
        var model = this.collection.get(model_id);
        this.collection.remove(model);
        model.destroy();
    },
    
});


