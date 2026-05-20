from django.urls import include, path

from info.api import views

urlpatterns = [
    path('web/', include('info.api.web_urls')),
    path('details/', views.DetailView.as_view()),
    path('attendance/', views.AttendanceView.as_view()),
    path('marks/', views.MarksView.as_view()),
    path('timetable/', views.TimetableView.as_view()),
    path('auth/', include('djoser.urls')),
]
