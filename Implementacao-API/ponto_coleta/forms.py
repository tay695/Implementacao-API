
from django import forms
from .models import PontoColeta

class PontoColetaForm(forms.ModelForm):
    class Meta:
        model = PontoColeta
        fields = ['nome', 'endereco', 'status']