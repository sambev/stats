$(function() {
    // create the collection and build the view for programs
    programs = new App.Collections.ProgramCollection();
    programs.fetch({
        success: function() {
            programs_view = new App.Views.ProjectList({
                collection: programs
            });
        }
    });

});
