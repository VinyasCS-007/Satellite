from django.urls import path
from .views import SatelliteListCreateAPIView, PredictionListAPIView, CollisionPredictionAPIView, SatelliteDetailAPIView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import register

urlpatterns = [
    path('satellites/', SatelliteListCreateAPIView.as_view(), name='satellite-list-create'),
    path('satellites/<int:pk>/', SatelliteDetailAPIView.as_view(), name='satellite-detail'),
    path('predictions/', PredictionListAPIView.as_view(), name='prediction-list'),
    path('predict-collisions/', CollisionPredictionAPIView.as_view(), name='collision-prediction'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', register, name='register'),
]