from django.shortcuts import get_object_or_404, redirect, render
from django.contrib.auth.decorators import login_required, permission_required
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser, IsAuthenticated

from doacao.models import Doacao
from estoque.models import Item
from .serializers import ItemSerializer          # ← criar serializers.py


# ── ViewSet API ──────────────────────────────────────────────
class EstoqueViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer
    queryset = Item.objects.all()

    def get_permissions(self):
        # doador só lê; admin faz tudo
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsAdminUser()]


# ── Views HTML ───────────────────────────────────────────────
@login_required
@permission_required('estoque.view_item')
def listar_estoque(request):
    items = Item.objects.all().order_by('categoria', 'nome', 'quantidade')
    return render(request, 'estoque/listar_estoque.html', {'items': items})


@login_required
@permission_required('estoque.add_item', raise_exception=True)
def adicionar_estoque(request):
    if request.method == 'POST':
        nome = request.POST.get('nome')
        quantidade = int(request.POST.get('quantidade'))
        unidade_medida = request.POST.get('unidade_medida')
        categoria = request.POST.get('categoria')

        item, created = Item.objects.get_or_create(
            nome=nome,
            unidade_medida=unidade_medida,
            categoria=categoria,
            defaults={'quantidade': 0}
        )
        item.registrar_entrada(quantidade)   # ← faltava
        return redirect('listar_estoque')

    return render(request, 'estoque/adicionar_estoque.html')


@login_required
@permission_required('estoque.change_item', raise_exception=True)
def editar_item(request, item_id):
    item = get_object_or_404(Item, id=item_id)
    if request.method == 'POST':
        item.nome = request.POST.get('nome')
        item.quantidade = int(request.POST.get('quantidade'))
        item.unidade_medida = request.POST.get('unidade_medida')
        item.categoria = request.POST.get('categoria')
        item.save()
        return redirect('listar_estoque')
    return render(request, 'estoque/editar_deletar.html', {'item': item, 'acao': 'editar'})


@login_required
@permission_required('estoque.delete_item', raise_exception=True)
def deletar_item(request, item_id):
    item = get_object_or_404(Item, id=item_id)
    if request.method == 'POST':
        item.delete()
        return redirect('listar_estoque')
    return render(request, 'estoque/editar_deletar.html', {'item': item, 'acao': 'deletar'})


@login_required
@permission_required('estoque.view_item')
def detalhar_item(request, item_id):
    item = get_object_or_404(Item, id=item_id)
    doacoes = Doacao.objects.filter(nome=item.nome)
    return render(request, 'estoque/detalhar_item.html', {'item': item, 'doacoes': doacoes})