$(document).ready(function() {

    var personModel = function(data) {
        var self = this;
        ko.mapping.fromJS(data, {}, self);


    };

    
    //model for create new user 
    var createNewUserModel = function() {
        var self = this;
       
        self.FirstName = ko.observable("");
        self.LastName = ko.observable("");
        self.CoursesTaking = ko.observableArray([]);
        self.CoursesTeaching = ko.observableArray([]);

    };


    var viewModel = function() {
        var self = this;

        //get person list from server when page is rendered
        $.getJSON(GlobalAPI + 'Admin/GetPersonList',
          function (data) {
              var d = $.map(data, function (item) {
                  return new personModel(item);
              });
              self.People(d);
             
          });
        
        
        self.People = ko.observableArray([]);

        self.Person = {
            SelectedPersonId: ko.observable(),
            PersonAttr: ko.observable()
        };

       
        //observables for SaveButton
        self.SaveButtonVisible = ko.observable(false);

        //observables for SaveNewUserButton
        self.SelectedTemplateId = ko.observable();
        
        //observables for CreateNewButton
        self.CreateNewUserAttr = ko.observable();
    
        //observable for NewUser post model
        self.NewUser = ko.observable(new createNewUserModel());
        
        //observable array for Add Courses
        self.CoursesToAdd = ko.observable();

        
        
   
        //fill PersonAttr context
        self.Person.SelectedPersonId.subscribe(function (id) {
            //console.log("You just selected user number " + id);



            $.getJSON(GlobalAPI + 'Admin/GetPersonAttributes/' + id,
                function(result) {
                    //console.log(result);

                    var myd = new personModel(result);
                    self.Person.PersonAttr(myd);
                });
            self.SaveButtonVisible(true);
            
         

        });
        
        //remove course button
        self.RemoveCourseButton = function (viewData) {
    
            self.Person.PersonAttr().Courses.remove(viewData);


            var postData = {
                CourseId: viewData.CourseId
            };


            $.ajax({
                type: "PUT",
                url: GlobalAPI + 'Admin/PutRemoveCourseFromUser',
                contentType: 'application/json',
                dataType: 'json',
                data: ko.mapping.toJSON(postData),
                fail: function () { window.alert('Save Failed!'); }
            });
        };

        
        //Go Back Button
        self.GoBackButton = function() {
            console.log("Go Back!");
            window.location.href = "/";
         
        };
        
        //Save Button
        self.SaveButton = function (viewData) {
          
            var postData = {
                Courses: viewData.Person.PersonAttr().Courses,
                PersonId: viewData.Person.SelectedPersonId,
                IsActive: viewData.Person.PersonAttr().IsActive
            };
            console.log(postData);
           
            $.ajax({
                type: "POST",
                url: GlobalAPI + 'Admin/PostPersonAttributes',
                contentType: 'application/json',
                dataType: 'json',
                data: ko.mapping.toJSON(postData),
                success: function (a) { console.log(a); }
            });


        };

        //Add Courses Button
        self.AddCoursesButton = function(viewData) {
            //console.log(viewData);

            var id = viewData.Person.SelectedPersonId();


            $.getJSON(GlobalAPI + 'Admin/GetAddCourses/' + id ,
                function (data) {
                    var value = new personModel(data);
                    self.CoursesToAdd(value);
                });
            

            $('#addModal').modal('show');
        };
        
        
        //save added courses
        self.SaveAddedCoursesButton = function(viewData) {

            //variable for data to post to the server
            var postData = {
                PersonId: self.Person.SelectedPersonId(),
                CourseIds:[]
            };
            
            //unshift data into the DOM
            $.each(viewData.Courses(), function() {
                if (this.IsSelected() == true) {
                        postData.CourseIds.push(this.CourseId);

                        var unshiftCourses = {
                            CourseName: this.CourseName(),
                            IsTaking: false,
                            IsTeaching: false
                        };

                        self.Person.PersonAttr().Courses.unshift(unshiftCourses);
                }
                
            });

            $.ajax({
                type: 'POST',
                url: GlobalAPI + 'Admin/PostAddedCourses',
                contentType: 'application/json',
                dataType: 'json',
                data: ko.mapping.toJSON(postData),
                success: function () {
                    $('#addModal').modal('hide');

                }
            });
        

        };
       
        //Create New User Button
        self.CreateNewButton = function() {
            console.log("Create New!");
           
            $.getJSON(GlobalAPI + 'Admin/GetCreatePersonAttributes',
               function (result) {
                   console.log(result);
                   
                   var value = new personModel(result);
                   self.CreateNewUserAttr(value);
                   
               });
            
            $('#createModal').modal('show');
        };

        self.DeleteUserButton = function(viewData) {

            $('#deleteUserModal').modal('show');

            $('#confirmDeletUserButton').click(function() {
                console.log(viewData);

                var postData = {
                    id: self.Person.SelectedPersonId()
                };

                $.ajax({
                    type: 'DELETE',
                    url: GlobalAPI + 'Admin/DeleteUser',
                    contentType: 'application/json',
                    data: JSON.stringify(postData),
                    success: function () {

                        //self.CourseOptions.remove(viewData);
                        $('#deleteUserModal').modal('hide');
                        location.reload();

                    }
                });

            });

        };

        //Save New User Button
        self.SaveNewUserButton = function () {
           
            $.ajax({
                type: "POST",
                url: GlobalAPI + 'Admin/PostNewPersonAttributes',
                contentType: 'application/json',
                dataType: 'json',
                data: ko.mapping.toJSON(self.NewUser()),
                success: function (a) { console.log(a); }
            });
           
        };

        //Template dropdown fill content
        self.SelectedTemplateId.subscribe(function(id) {
            console.log("You just selected template " + id);

            $.getJSON(GlobalAPI + 'Admin/GetTemplateCourses/' + id,
               function (result) {
                   console.log(result);
                   //var parsed = JSON.parse(result);
                   //console.log(parsed);

                   self.NewUser().CoursesTaking(result.CoursesTaking);
                   self.NewUser().CoursesTeaching(result.CoursesTeaching);


               });



        });

       

    };
    

    ko.applyBindings(new viewModel());
});



