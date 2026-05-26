from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Doador


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class DoadorSerializer(serializers.ModelSerializer):
    usuario = UserSerializer(read_only=True)  # expõe dados do user sem senha

    class Meta:
        model = Doador
        fields = ['id', 'usuario', 'tipo', 'nome', 'cpf', 'cnpj',
                  'email', 'telefone', 'endereco', 'data_cadastro']
        read_only_fields = ['data_cadastro']