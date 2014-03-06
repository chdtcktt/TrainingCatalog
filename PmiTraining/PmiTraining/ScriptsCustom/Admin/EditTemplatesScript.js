$(document).ready(function() {

    //main model for page
    var templatesModel = function(data) {
        var self = this;
        ko.mapping.fromJS(data, {}, self);
        
    };

   

    var viewModel = function() {
        var self = this;

        $.getJSON(GlobalAPI + 'Admin/GetTemplateList',
            function(data) {
                var value = new templatesModel(data);
                self.TemplateList(value);
            });

        
        //-----observables-------------
        
        //List of templates for dropdown
        self.TemplateList = ko.observable();
        
        //selected template
        self.SelectedTemplateId = ko.observable();

        //template attributes
        self.TemplateAttributes = ko.observable();

        //controls if the main buttons are visible
        self.ButtonsVisible = ko.observable(false);

        //for new template create
        self.NewTemplate = ko.observable();

        //new template data to post
        self.PostTemplate = {
            TemplateName: ko.observable(),
            IsTaking: ko.observableArray([]),
            IsTeaching: ko.observableArray([])
        };

        //kickes off when user selects an option
        self.SelectedTemplateId.subscribe(function(id) {
            console.log(id);
            

            $.getJSON(GlobalAPI + 'Admin/GetTemplateAttributes/' + id,
                function(data) {
                    var value = new templatesModel(data);
                    self.TemplateAttributes(value);

                    self.ButtonsVisible(true);

                });
        });
        

        //------buttons----------------


        self.GoBackButton = function() {
            console.log('go back');
            parent.history.back();
        };

        self.SaveButton = function(viewData) {
            console.log(ko.mapping.toJSON(viewData.TemplateAttributes()));
            

        };

        self.CreateNewButton = function() {
            console.log('create new template');

            $.getJSON(GlobalAPI + 'Admin/GetAddNewTemplate',
                function (data) {
                    var value = new templatesModel(data);
                    self.NewTemplate(value);

                });

            $('#createModal').modal('show');

        };
        
        self.SaveNewTemplate = function () {
            
            $.ajax({
                type: 'POST',
                url: GlobalAPI + 'Admin/PostNewTemplate',
                contentType: 'application/json',
                dataType: 'json',
                data: ko.mapping.toJSON(self.PostTemplate),
                success: function () {
                    $('#createModal').modal('hide');
                }

            });

        };

        self.DeleteTempButton = function() {
            console.log('delete');

            $('#deleteTemplateModal').modal('show');

            $('#confirmDeletTemplateButton').click(function () {
                var postData = {
                    templateId: self.SelectedTemplateId()
                };

                $.ajax({
                    type: 'DELETE',
                    url: GlobalAPI + 'Admin/DeleteTemplate',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: ko.mapping.toJSON(postData),
                    success: function () {
                        $('#deleteTemplateModal').modal('hide');
                        location.reload();
                    }
                });


            });
        
        };
    };

    ko.applyBindings(new viewModel());

});