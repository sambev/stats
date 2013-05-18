App.Models.StatType = Backbone.Model.extend({
    defaults: {
        name: '',
    }
});

App.Models.Stat = Backbone.Model.extend({
    defaults: {
        type_id: '',
        program_id: '',
        user_id: '',
        value: '',
    }
});


App.Models.Program = Backbone.Model.extend({
    defaults: {
        name: '',
        url: '/programs/' + this.name,
    },
});


App.Collections.ProgramCollection = Backbone.Collection.extend({
    model: App.Models.Project,
    url: '/programs'
});
