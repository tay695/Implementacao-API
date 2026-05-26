from rest_framework import serializers
from .models import EntidadeBeneficiada

class EntidadeBeneficiadaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EntidadeBeneficiada
        fields = '__all__'