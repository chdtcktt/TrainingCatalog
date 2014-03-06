$(document).ready(function () {

    var studentSummaryModel = function(data) {
        var self = this;
        ko.mapping.fromJS(data, {}, self);

        self.completionPct = ko.computed(function() {
            return self.CoursesCompleted() / self.TotalCourses();
        });
        
        self.CourseProgress = ko.computed(function() {
            return self.CoursesCompleted() + "/" + self.TotalCourses();
        });

        self.ProgressBarValue = ko.computed(function() {
            return (self.completionPct()) * 100 + "%";
        });

        self.TrainingStatusMessage = ko.computed(function() {
            if (self.ProgressBarValue() == '100%')
                return "All Training Completed";

            return "In Progress";
        });

        self.StudentDetailsURL = ko.computed(function() {
            return "/training/studentdetails/" + self.StudentId();
            
        });
    };  
    
   
       
   


    var viewModel = function() {
        var self = this;
        
        self.Students = ko.observableArray([]);

        $.getJSON(GlobalAPI + 'Students/GetAllStudents',
            function (data) {
            var d = $.map(data, function (item) {
                console.log(data);
                return new studentSummaryModel(item);

            });

            self.Students(d);
        });



        //buttons
        self.CreateButton = "/Admin/EditUser";


    };

    ko.applyBindings(new viewModel());

});






















