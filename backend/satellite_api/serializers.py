from rest_framework import serializers
from .models import Satellite, Prediction
import re

class SatelliteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Satellite
        fields = '__all__'

    def validate(self, data):
        tle_line1 = data.get('tle_line1', '')
        tle_line2 = data.get('tle_line2', '')

        # Improved TLE line format validation using regex
        # TLE line 1 starts with '1' followed by 4 digits (satellite number), then 54 characters (various allowed chars)
        tle_line1_pattern = r"^1\s*\d{5}.*$"
        # TLE line 2 starts with '2' followed by 4 digits (satellite number), then 54 characters (various allowed chars)
        tle_line2_pattern = r"^2\s*\d{5}.*$"

        if not re.match(tle_line1_pattern, tle_line1):
            raise serializers.ValidationError({"tle_line1": "Invalid TLE line 1 format."})
        if not re.match(tle_line2_pattern, tle_line2):
            raise serializers.ValidationError({"tle_line2": "Invalid TLE line 2 format."})

        return data

class PredictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prediction
        fields = '__all__'
