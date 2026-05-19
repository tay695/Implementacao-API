from django.db import models

# Classe principal do item no estoque
class Item(models.Model):
    CATEGORIAS = [
        ('AL', 'Alimentos'),
        ('HG', 'Higiene'),
        ('LM', 'Limpeza'),
        ('VD', 'Vestuário'),
        ('OT', 'Outros'),
    ]
    nome = models.CharField(max_length=100)
    quantidade = models.IntegerField()
    unidade_medida = models.CharField(max_length=20)
    categoria = models.CharField(max_length=2, choices=CATEGORIAS, default='OT')

    # Atualiza o estoque quando há entrada
    def registrar_entrada(self, quantidade):
        if quantidade > 0:
            self.quantidade += quantidade
            self.save()

    # Atualiza o estoque quando há saída
    def registrar_saida(self, quantidade):
        if quantidade > 0 and quantidade <= self.quantidade:
            self.quantidade -= quantidade
            self.save()
        else:
            print("Quantidade insuficiente em estoque.")

    def __str__(self):
        return f"{self.nome} - {self.quantidade} {self.unidade_medida} ({self.categoria})"


# Classe para registrar entradas de produtos
class EntradaEstoque(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantidade = models.IntegerField()
    data_entrada = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        """Quando salvar uma entrada, atualiza o estoque automaticamente."""
        super().save(*args, **kwargs)
        self.item.registrar_entrada(self.quantidade)

    def __str__(self):
        return f"Entrada de {self.quantidade} {self.item.unidade_medida} de {self.item.nome}"


# Classe para registrar saídas de produtos
class SaidaEstoque(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantidade = models.IntegerField()
    data_saida = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        """Quando salvar uma saída, atualiza o estoque automaticamente."""
        super().save(*args, **kwargs)
        self.item.registrar_saida(self.quantidade)

    def __str__(self):
        return f"Saída de {self.quantidade} {self.item.unidade_medida} de {self.item.nome}"

