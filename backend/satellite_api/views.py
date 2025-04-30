from django.shortcuts import render
from rest_framework import generics
from .models import Satellite, Prediction
from .serializers import SatelliteSerializer, PredictionSerializer
from sgp4.api import Satrec, jday
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import datetime
import math
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

class SatelliteListCreateAPIView(generics.ListCreateAPIView):
    queryset = Satellite.objects.all()
    serializer_class = SatelliteSerializer

class SatelliteDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Satellite.objects.all()
    serializer_class = SatelliteSerializer

class PredictionListAPIView(generics.ListAPIView):
    queryset = Prediction.objects.all()
    serializer_class = PredictionSerializer

class CollisionPredictionAPIView(APIView):
    def get(self, request):
        satellites = Satellite.objects.all()
        results = []
        threshold_km = 1.0  # collision threshold

        # Get current time in Julian date
        now = datetime.utcnow()
        jd, fr = jday(now.year, now.month, now.day, now.hour, now.minute, now.second)

        # Compute positions
        sat_positions = []
        for sat in satellites:
            s = Satrec.twoline2rv(sat.tle_line1, sat.tle_line2)
            e, r, v = s.sgp4(jd, fr)
            if e == 0:
                sat_positions.append((sat, r))  # r = [x, y, z] in km

        # Check all pairs
        for i in range(len(sat_positions)):
            for j in range(i + 1, len(sat_positions)):
                sat1, pos1 = sat_positions[i]
                sat2, pos2 = sat_positions[j]
                dist = math.sqrt(sum((a - b) ** 2 for a, b in zip(pos1, pos2)))
                if dist < threshold_km:
                    results.append({
                        "satellite1": sat1.name,
                        "satellite2": sat2.name,
                        "distance_km": dist,
                        "collision_risk": True,
                    })

        # Add this: return all satellites for debugging
        all_sats = Satellite.objects.all()
        all_sat_data = SatelliteSerializer(all_sats, many=True).data
        return Response({
            "collisions": results,
            "satellites": all_sat_data
        })

@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if not username or not password:
        return Response({'error': 'Username and password required.'}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)
    user = User.objects.create_user(username=username, password=password)
    return Response({'message': 'User registered successfully.'}, status=status.HTTP_201_CREATED)

