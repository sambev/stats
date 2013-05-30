App.Views.StatList = Backbone.View.extend({
    el: '#program_stats',

    template: _.template( $('#program_stats_template').html() ),

    initialize: function () {
        this.render();
    },

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
        console.log('create a new stat');
    },
    
});


App.Views.ProjectList = Backbone.View.extend({
    el: '#program_list',

    template: _.template( $('#program_list_template').html() ),

    initialize: function () {
        // for the program view
        this.render();
    },

    render: function() {
        this.$el.html(this.template({'programs': this.collection.toJSON()})); 
    },

    events: {
        'click button[class=program_btn]': 'selectProgram',
        'click button[class=new_project]': 'createProgram',
    },

    /* selectProgram Function
     * render the stat view for the selected program
     */
    selectProgram: function(event) {
        stats = new App.Collections.StatCollection();
        stats.url = '/stats/' + event.currentTarget.id;
        stats.fetch({
            success: function() {
                new App.Views.StatList({
                    collection: stats
                });
            }
        });
    },

    /* createProgram function
     * create a new program
     */
});
