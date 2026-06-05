from django.urls import path, include
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("api/weather/", include("weather.urls")),
    path("api/trees/", include("trees.urls")),
]

# Serve React SPA for everything else (production)
if not settings.DEBUG:
    urlpatterns += [path("<path:path>", TemplateView.as_view(template_name="index.html"))]
    urlpatterns += [path("", TemplateView.as_view(template_name="index.html"))]
