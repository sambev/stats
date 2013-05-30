App.Models.StatType = Backbone.Model.extend();

App.Models.Stat = Backbone.Model.extend({
    initialize : function() {
        this.bind('change', function() {
            // If the value of this model changes, we need to save it
            if (this.hasChanged('value')) {
                this.save()
            }
        });
    },
    urlRoot: '/stats/'
});

App.Models.Program = Backbone.Model.extend();

App.Collections.StatCollection = Backbone.Collection.extend({
    model: App.Models.Stat,
});

App.Collections.ProgramCollection = Backbone.Collection.extend({
    model: App.Models.Program,
    url: '/programs'
});
