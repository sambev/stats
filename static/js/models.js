App.Models.StatType = Backbone.Model.extend();

App.Models.Stat = Backbone.Model.extend();

App.Models.Program = Backbone.Model.extend();

App.Collections.ProgramCollection = Backbone.Collection.extend({
    model: App.Models.Program,
    url: '/programs'
});
