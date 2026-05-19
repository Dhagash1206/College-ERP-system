from django.urls import include, path

from info.web_urls import urlpatterns as web_urlpatterns

urlpatterns = web_urlpatterns + [
    path('api/', include('info.api.urls')),
]
