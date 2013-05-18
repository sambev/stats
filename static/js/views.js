App.Views.ProjectList = Backbone.View.extend({
    el: '#project_list',

    template: _.template( $('#project_list_template').html() ),

    initialize: function () {
        // for the project view
        this.collection.bind('change', this.render, this);
        this.render();
    },

    render: function() {
        this.$el.html(this.template(this.collection.toJSON())); 
    }
});
