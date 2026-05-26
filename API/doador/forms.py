from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User, Group
from django.core.exceptions import ValidationError
from .models import Doador
from django.utils import timezone


class CadastroDoadorForm(UserCreationForm):
    tipo = forms.ChoiceField(
        choices=Doador.TIPO_DOADOR_CHOICES,
        label='Tipo de Doador',
        widget=forms.Select(attrs={'class': 'form-select'})
    )
    nome = forms.CharField(
        max_length=100,
        label='Nome/Razão Social',
        widget=forms.TextInput(attrs={'class': 'form-control'})
    )
    cpf = forms.CharField(
        max_length=14,
        required=False,
        label='CPF',
        widget=forms.TextInput(attrs={'class': 'form-control'})
    )
    cnpj = forms.CharField(
        max_length=18,
        required=False,
        label='CNPJ',
        widget=forms.TextInput(attrs={'class': 'form-control'})
    )
    telefone = forms.CharField(
        max_length=15,
        required=False,
        label='Telefone',
        widget=forms.TextInput(attrs={'class': 'form-control'})
    )
    endereco = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={'class': 'form-control'})
    )
    email = forms.EmailField(
        label='Email',
        widget=forms.EmailInput(attrs={'class': 'form-control'}),
        required=True
    )

    class Meta(UserCreationForm.Meta):
        model = User
        fields = (
            'username',
            'password1',
            'password2',
            'tipo',
            'nome',
            'cpf',
            'cnpj',
            'telefone',
            'endereco',
        )

    def clean(self):
        cleaned_data = super().clean()
        tipo = cleaned_data.get('tipo')
        cpf = cleaned_data.get('cpf')
        cnpj = cleaned_data.get('cnpj')

        if tipo == 'PF' and not cpf:
            self.add_error('cpf', 'CPF é obrigatório para Pessoa Física.')
        elif tipo == 'PJ' and not cnpj:
            self.add_error('cnpj', 'CNPJ é obrigatório para Pessoa Jurídica.')

        return cleaned_data

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if email and User.objects.filter(email=email).exists():
            raise ValidationError("Este email já existe.")
        return email

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data.get('email', '')

        if commit:
            user.save()
            DOADORES_group, _ = Group.objects.get_or_create(name='DOADORES')
            user.groups.add(DOADORES_group)

            Doador.objects.create(
                usuario=user,
                email=user.email,
                tipo=self.cleaned_data.get('tipo'),
                nome=self.cleaned_data.get('nome'),
                cpf=self.cleaned_data.get('cpf'),
                cnpj=self.cleaned_data.get('cnpj'),
                telefone=self.cleaned_data.get('telefone'),
                endereco=self.cleaned_data.get('endereco'),
                
                data_cadastro=timezone.now()
            )

        return user


class EditarDoadorForm(forms.ModelForm):
    email = forms.EmailField(
        label='Email do Usuário',
        widget=forms.EmailInput(attrs={'class': 'form-control'})
    )

    class Meta:
        model = Doador
        fields = ['tipo', 'nome', 'cpf', 'cnpj', 'telefone', 'endereco']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        if self.instance and self.instance.usuario:
            self.initial['email'] = self.instance.usuario.email

        if getattr(self.instance, 'tipo', None) == 'PF':
            self.fields.pop('cnpj', None)
        elif getattr(self.instance, 'tipo', None) == 'PJ':
            self.fields.pop('cpf', None)

    def save(self, commit=True):
        doador = super().save(commit=False)

        if commit:
            doador.save()

            email_novo = self.cleaned_data.get('email')
            if email_novo and doador.usuario and doador.usuario.email != email_novo:
                doador.usuario.email = email_novo
                doador.usuario.save()

        return doador
