App.Views.StatView = Backbone.View.extend({
    el: '#program_stats',

    template: _.template( $('#program_stats_template').html() ),

    initialize: function () {
        this.render();
    },

    render: function() {
        console.log(this.model.toJSON());
        this.$el.html(this.template({
            'model': this.model.toJSON()
        }));
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
        console.log(this.collection.toJSON());
        this.$el.html(this.template({'collection': this.collection.toJSON()})); 
    },

    events: {
        'click button[class=program_btn]': 'selectProgram'
    },

    selectProgram: function(event) {
        // Create a stat view for the selected program
        stat = new App.Models.Stat();
        stat.url = '/stats/' + event.currentTarget.id;
        console.log(stat.url);
        stat.fetch({
            success: function() {
                new App.Views.StatView({
                    model: stat    
                });
            }
        });
    }
});
