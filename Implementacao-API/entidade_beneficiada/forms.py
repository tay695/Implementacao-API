
from django import forms
from .models import EntidadeBeneficiada

class EntidadeBeneficiadaForm(forms.ModelForm):

    class Meta:
        model = EntidadeBeneficiada
        fields = ['nome', 'responsavel', 'endereco', 'prioridade', 'num_membros']

        widgets = {
            'nome': forms.TextInput(attrs={'class': 'form-control'}),
            'responsavel': forms.TextInput(attrs={'class': 'form-control'}),
            'endereco': forms.TextInput(attrs={'class': 'form-control'}),
            'prioridade': forms.Select(attrs={'class': 'form-control'}),
            'num_membros': forms.NumberInput(attrs={'class': 'form-control'}),
        }