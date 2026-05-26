from django.db import models
from django.contrib.auth.models import User
from django.db import models
from django.contrib.auth.models import User


class Doador(models.Model):
    TIPO_DOADOR_CHOICES = [
        ('PF', 'Pessoa Física'),
        ('PJ', 'Pessoa Jurídica'),
    ]

    usuario = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='doador', null=True, blank=True
    )
    tipo = models.CharField(
        max_length=2, choices=TIPO_DOADOR_CHOICES, default='PF', verbose_name='Tipo de Doador'
    )
    nome = models.CharField(max_length=100, verbose_name='Nome/Razão Social')
    cpf = models.CharField(max_length=14, blank=True, null=True)
    cnpj = models.CharField(max_length=18, blank=True, null=True)
    email = models.EmailField(unique=True)
    telefone = models.CharField(max_length=15, blank=True, null=True)
    endereco = models.TextField(blank=True, null=True)
    data_cadastro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nome} - {self.email}"

