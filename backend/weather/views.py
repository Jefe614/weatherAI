import httpx
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

BASE = settings.WEATHER_AI_BASE_URL
KEY = settings.WEATHER_AI_KEY


def weather_headers():
    return {"Authorization": f"Bearer {KEY}"}


class WeatherView(APIView):
    """GET /api/weather/?lat=&lon=&days=&units=&ai="""
    def get(self, request):
        params = {k: v for k, v in request.query_params.items()}
        try:
            r = httpx.get(f"{BASE}/v1/weather", params=params, headers=weather_headers(), timeout=15)
            return Response(r.json(), status=r.status_code)
        except httpx.RequestError as e:
            return Response({"error": str(e)}, status=status.HTTP_502_BAD_GATEWAY)


class ForecastHourlyView(APIView):
    """GET /api/weather/hourly/?lat=&lon=&days="""
    def get(self, request):
        params = {k: v for k, v in request.query_params.items()}
        try:
            r = httpx.get(f"{BASE}/v1/hourly", params=params, headers=weather_headers(), timeout=15)
            return Response(r.json(), status=r.status_code)
        except httpx.RequestError as e:
            return Response({"error": str(e)}, status=status.HTTP_502_BAD_GATEWAY)


class UsageView(APIView):
    """GET /api/weather/usage/"""
    def get(self, request):
        try:
            r = httpx.get(f"{BASE}/v1/usage", headers=weather_headers(), timeout=10)
            return Response(r.json(), status=r.status_code)
        except httpx.RequestError as e:
            return Response({"error": str(e)}, status=status.HTTP_502_BAD_GATEWAY)
