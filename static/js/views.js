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
    },

    /* createProgram function
     * create a new program with the name they typed in
     */
    createProgram: function() {
        // create a new model
        var program_name = document.getElementById('new_program_name').value;
        this.model.set({'name': program_name});
        this.model.save(null, {
            success: function(model) {
                // add it to the collection and clear the form
                App.Programs.add([model]);
                document.getElementById('new_program_name').value = '';

                // select that program
                App.ProgramList.selectProgram(event, model.get('name'));
            },
            error: function() {
                console.log('there was an error');
            },
        });
    }
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
        this.listenTo(this.collection, 'add', this.render);
        this.render();
    },

    render: function() {
        this.$el.html(this.template({'programs': this.collection.toJSON()})); 
    },

    events: {
        'click button[class=program_btn]': 'selectProgram',
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
                if (App.StatView) {
                    App.StatView.undelegateEvents();
                }
                App.StatView = new App.Views.StatList({
                    collection: stats
                });
            }
        });
    },
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
        this.collection.on('add', this.render, this);
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
        App.NewStatModel.save();
        // add it to the collection
        this.collection.add(App.NewStatModel);
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


