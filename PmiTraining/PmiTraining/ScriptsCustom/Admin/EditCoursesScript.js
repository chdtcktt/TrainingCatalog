$(document).ready(function() {

    //main model for page
    var coursesModel = function (data) {
        var self = this;
        ko.mapping.fromJS(data, {}, self);
        
    };
    
    //model for saving new course
    var newCourse = function() {
        var self = this;

        self.CourseName = ko.observable("");
        self.CourseNote = ko.observable("");
        self.IsActive = ko.observable(true);
    };



    var viewModel = function() {
        var self = this;
        
        //get person list from server when page is rendered
        $.getJSON(GlobalAPI + 'Admin/GetCourseOptions',
          function (data) {
              var list = $.map(data, function (item) {
                  return new coursesModel(item);
              });
              self.CourseOptions(list);
              
           

          });

       
        //observable for saving new course
        self.SaveCourseOptions = ko.observable(new newCourse());

        //observable for course options to edit
        self.CourseOptions = ko.observableArray([]);
        
        

        
        //Go Back button
        self.GoBackButton = function() {
            console.log("Go Back!");
            //window.location.href = "http://localhost:41029/Training/index";
            
            parent.history.back();         
        };
        
        //Save button
        self.SaveCourseChangesButton = function (viewData) {
            console.log("save stuff");

            var postData = ko.mapping.toJSON(viewData.CourseOptions());
            console.log(postData);


            $.ajax({
                type: 'POST',
                url: GlobalAPI + 'Admin/PostCourseOptions',
                contentType: 'application/json',
                data: postData,
                success: function () {}
                 
            });
        };
        

        //Create New Course button
        self.CreateNewCourseButton = function() {
            console.log("Create New!");
            $('#createCourseModal').modal('show');

        };

        //Save New Course button
        self.SaveNewCourseButton = function(viewData) {
            var postData = ko.mapping.toJSON(viewData.SaveCourseOptions());
            console.log(postData);

            $.ajax({
                type: 'POST',
                url: GlobalAPI + 'Admin/PostNewCourseOptions',
                contentType: 'application/json',
                dataType: 'json',
                data: postData,
                success: function() {
                    self.CourseOptions.unshift(viewData.SaveCourseOptions());
                    self.SaveCourseOptions(new newCourse());
                    $('#createCourseModal').modal('hide');



                }
            });

        };

        //Delete Course button
        self.ConfirmDeleteCourseButton = function (viewData) {
            $('#deleteCourseModal').modal('show');

            $('#deleteCourseButton').click(function() {

                var postData = {
                    id: viewData.CourseId()
                };
                
                $.ajax({
                    type:'DELETE',
                    url: 'http://localhost:7717/api/Admin/DeleteCourse',
                    contentType: 'application/json',
                    data: JSON.stringify(postData),
                    success: function () {
                        
                        self.CourseOptions.remove(viewData);
                        $('#deleteCourseModal').modal('hide');
                        
                    }
                });
            });

        };

    };

    ko.applyBindings(new viewModel());

});