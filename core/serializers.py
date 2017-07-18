from rest_framework import serializers
from .models import HighScore

class HighScoreSerializer(serializers.ModelSerializer):
	class Meta:
		model = HighScore
		fields = ('user', 'highScore')