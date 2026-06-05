import httpx
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser

BASE = settings.WEATHER_AI_BASE_URL
KEY = settings.WEATHER_AI_KEY


def weather_headers():
    return {"Authorization": f"Bearer {KEY}"}


class TreeAnalyzeView(APIView):
    """POST /api/trees/analyze/ — multipart/form-data with image"""
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        image_file = request.FILES.get("image")
        if not image_file:
            return Response({"error": "No image provided"}, status=400)

        form_fields = {
            k: v for k, v in request.data.items() if k != "image"
        }

        try:
            files = {"image": (image_file.name, image_file.read(), image_file.content_type)}
            r = httpx.post(
                f"{BASE}/v1/trees/analyze",
                headers=weather_headers(),
                data=form_fields,
                files=files,
                timeout=60,
            )
            return Response(r.json(), status=r.status_code)
        except httpx.RequestError as e:
            return Response({"error": str(e)}, status=status.HTTP_502_BAD_GATEWAY)


class TreeHistoryView(APIView):
    """GET /api/trees/history/"""
    def get(self, request):
        params = {k: v for k, v in request.query_params.items()}
        try:
            r = httpx.get(f"{BASE}/v1/trees/history", params=params, headers=weather_headers(), timeout=15)
            return Response(r.json(), status=r.status_code)
        except httpx.RequestError as e:
            return Response({"error": str(e)}, status=status.HTTP_502_BAD_GATEWAY)


class TreeQuotaView(APIView):
    """GET /api/trees/quota/"""
    def get(self, request):
        try:
            r = httpx.get(f"{BASE}/v1/trees/quota", headers=weather_headers(), timeout=10)
            return Response(r.json(), status=r.status_code)
        except httpx.RequestError as e:
            return Response({"error": str(e)}, status=status.HTTP_502_BAD_GATEWAY)
