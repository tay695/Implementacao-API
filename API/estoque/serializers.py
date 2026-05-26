from rest_framework import serializers
from .models import Item, EntradaEstoque

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'

class EntradaEstoqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = EntradaEstoque
        fields = '__all__'
        read_only_fields = ['data_entrada']