from django.db import models
from django.contrib.auth.models import User

class Satellite(models.Model):
    name = models.CharField(max_length=100)
    norad_id = models.IntegerField(unique=True)
    tle_line1 = models.CharField(max_length=255)
    tle_line2 = models.CharField(max_length=255)
    last_updated = models.DateTimeField(auto_now=True)
    color = models.CharField(max_length=16, default="#ff6e7f")

class Prediction(models.Model):
    satellite1 = models.ForeignKey(Satellite, related_name='predictions_as_sat1', on_delete=models.CASCADE)
    satellite2 = models.ForeignKey(Satellite, related_name='predictions_as_sat2', on_delete=models.CASCADE)
    predicted_time = models.DateTimeField()
    min_distance_km = models.FloatField()
    collision_risk = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)