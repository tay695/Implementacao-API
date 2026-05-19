from rest_framework import serializers
from doador.serializers import DoadorSerializer
from .models import Doacao

class DoacaoSerializer(serializers.ModelSerializer):
    doador = DoadorSerializer(read_only=True)        # leitura: objeto completo
    doador_id = serializers.PrimaryKeyRelatedField(  # escrita: só o id
        source='doador',
        queryset=__import__('doador.models', fromlist=['Doador']).Doador.objects.all(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Doacao
        fields = ['id', 'nome', 'quantidade', 'unidade_medida', 'categoria',
                  'ponto_coleta', 'doador', 'doador_id', 'data_doacao', 'coletada']
        read_only_fields = ['data_doacao']