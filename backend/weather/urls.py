from django.urls import path
from .views import WeatherView, ForecastHourlyView, UsageView

urlpatterns = [
    path("", WeatherView.as_view(), name="weather"),
    path("hourly/", ForecastHourlyView.as_view(), name="hourly"),
    path("usage/", UsageView.as_view(), name="usage"),
]
