from rest_framework import serializers
from .models import PontoColeta

class PontoColetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PontoColeta
        fields = '__all__'