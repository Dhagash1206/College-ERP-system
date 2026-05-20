from django.urls import re_path

from info.views.spa import spa

urlpatterns = [
    re_path(r'^.*$', spa, name='spa'),
]
