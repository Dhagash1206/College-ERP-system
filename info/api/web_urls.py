from django.urls import path

from info.api import web_views

urlpatterns = [
    path('me/', web_views.MeView.as_view()),
    path('login/', web_views.LoginView.as_view()),
    path('logout/', web_views.LogoutView.as_view()),
    path('student/attendance/', web_views.StudentAttendanceView.as_view()),
    path(
        'student/attendance/<slug:course_id>/',
        web_views.StudentAttendanceDetailView.as_view(),
    ),
    path('student/marks/', web_views.StudentMarksView.as_view()),
    path('student/timetable/', web_views.StudentTimetableView.as_view()),
    path('student/profile/', web_views.StudentProfileView.as_view()),
    path('student/courses/', web_views.StudentCoursesView.as_view()),
    path('student/assignments/', web_views.StudentAssignmentsView.as_view()),
    path('courses/', web_views.CoursesCatalogView.as_view()),
    path('teacher/profile/', web_views.TeacherProfileView.as_view()),
    path('teacher/courses/', web_views.TeacherCoursesView.as_view()),
    path('teacher/catalog/assignments/', web_views.TeacherAssignmentCatalogView.as_view()),
    path('teacher/assignments/', web_views.TeacherAssignmentsView.as_view()),
    path('teacher/assignments/<int:assign_id>/sessions/', web_views.TeacherClassDatesView.as_view()),
    path('teacher/assignments/<int:assign_id>/students/', web_views.TeacherStudentsView.as_view()),
    path('teacher/sessions/<int:session_id>/', web_views.TeacherAttendanceSessionView.as_view()),
    path('teacher/sessions/<int:session_id>/cancel/', web_views.TeacherCancelSessionView.as_view()),
    path('teacher/assignments/<int:assign_id>/extra-class/', web_views.TeacherExtraClassView.as_view()),
    path('teacher/assignments/<int:assign_id>/marks-tests/', web_views.TeacherMarksTestsView.as_view()),
    path('teacher/marks-tests/<int:marks_class_id>/', web_views.TeacherMarksEntryView.as_view()),
    path('teacher/assignments/<int:assign_id>/student-marks/', web_views.TeacherStudentMarksView.as_view()),
    path('teacher/assignments/<int:assign_id>/report/', web_views.TeacherReportView.as_view()),
    path('teacher/timetable/', web_views.TeacherTimetableView.as_view()),
    path('teacher/free-teachers/<int:assign_time_id>/', web_views.TeacherFreeTeachersView.as_view()),
]
