from django.db import models

class EntidadeBeneficiada(models.Model):
    PRIORIDADE_CHOICES = [
        ('BAIXA', 'Baixa'),
        ('MEDIA', 'Média'),
        ('ALTA', 'Alta'),
    ]

    id = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=255, verbose_name="ONG/Família")
    responsavel = models.CharField(max_length=255)
    endereco = models.CharField(max_length=255)
    prioridade = models.CharField(max_length=5, choices=PRIORIDADE_CHOICES, default='BAIXA')
    data_cadastro = models.DateField(auto_now_add=True)

    num_membros = models.PositiveIntegerField(
        default=1,
        verbose_name="Pessoas Atendidas / Membros da Família",
        help_text="Número de indivíduos que serão beneficiados pela doação."
    )

    def __str__(self):
        return self.nome

    class Meta:
        verbose_name = "Entidade Beneficiada"
        verbose_name_plural = "Entidades Beneficiadas"
