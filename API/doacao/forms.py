from django import forms

from ponto_coleta.models import PontoColeta
from .models import Doacao
class DoacaoForm(forms.ModelForm):
    class Meta:
        model = Doacao
        fields = [
            'nome',
            'categoria',
            'unidade_medida',
            'quantidade',
            'ponto_coleta',
            'doador',
        ]

    def __init__(self, *args, is_assistente_social=False, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields['ponto_coleta'].queryset = PontoColeta.objects.filter(status='ATIVO')

        self.fields['ponto_coleta'].empty_label = "Selecione um ponto de entrega" 
        self.fields['doador'].required = False 
        if not is_assistente_social:
            del self.fields['doador']
        else:
            self.fields['doador'].required = True    


       

