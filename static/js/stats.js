$(function() {
    // create the create program view
    App.Models.CreateProgramView = new App.Views.CreateProgram({
        model: new App.Models.Program()
    });

    // create the collection and build the view for programs
    App.Programs = new App.Collections.ProgramCollection();
    App.Programs.fetch({
        success: function() {
            App.ProgramList = new App.Views.ProgramList({
                collection: App.Programs
            });
        }
    });
});
