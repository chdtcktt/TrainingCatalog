$(document).ready(function() {
    console.log("You are on student number " + studentId);

    var studentDetailsViewModel = function (data) {

        var self = this;
        console.log(data);
        ko.mapping.fromJS(data, {}, self);
        self.PageHeadline = ko.computed(function() {
            return "Courses for " + self.StudentName();
        });
    };

    var viewModel = function() {
        var self = this;
        self.StudentValues = ko.observable();

        $.getJSON(GlobalAPI + 'Students/GetStudentDetails' + '/' + studentId,
            function (data) {

            var d = new studentDetailsViewModel(data);
            self.StudentValues(d);

        });

        self.SaveItem = function (viewData) {


            var data = {
                StudentId: Number(studentId),
                CourseId: viewData.CourseTakingId
            };

            $.ajax({
                url: GlobalAPI + 'Students/PostCourseDetailsStatus',
                contentType: 'application/json',
                type: 'POST',
                dataType: 'json',
                data: ko.toJSON(data),
                success: function(result) {
                    console.log(result);
                    if (viewData.CourseCompleted() == false)
                        viewData.CourseCompleted(true);
                    else {
                        viewData.CourseCompleted(false);
                    }

                    viewData.DateCourseCompleted(result);
                    
                    console.log("Saved");

                    
                }
            });

        };
    };
    
    ko.applyBindings(new viewModel());
});

