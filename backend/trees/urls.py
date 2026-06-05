from django.urls import path
from .views import TreeAnalyzeView, TreeHistoryView, TreeQuotaView

urlpatterns = [
    path("analyze/", TreeAnalyzeView.as_view(), name="tree-analyze"),
    path("history/", TreeHistoryView.as_view(), name="tree-history"),
    path("quota/", TreeQuotaView.as_view(), name="tree-quota"),
]
