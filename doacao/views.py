from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth.decorators import login_required, permission_required
from django.db.models import Count, Sum
from rest_framework import viewsets  # ← faltava

from doacao.forms import DoacaoForm
from doacao.models import Doacao
from doador.models import Doador
from .permissions import IsAdminOrOwner


def is_assistente_social(user):
    return user.is_superuser


@login_required
@permission_required('doacao.add_doacao')
def criar_doacao(request):
    user_is_admin = is_assistente_social(request.user)

    if request.method == "POST":
        form = DoacaoForm(request.POST, is_assistente_social=user_is_admin)
        if form.is_valid():
            doacao = form.save(commit=False)
            if not user_is_admin:
                try:
                    doador_logado = Doador.objects.get(usuario=request.user)
                    doacao.doador = doador_logado
                except Doador.DoesNotExist:
                    return redirect('criar_doacao')
            doacao.save()
            return redirect("listar_estoque" if user_is_admin else "dashboard_doacoes")
    else:
        form = DoacaoForm(is_assistente_social=user_is_admin)

    return render(request, "doacao/criar_doacao.html", {"form": form})


@login_required
@permission_required('doacao.view_doacao')
def dashboard_doacoes(request):
    stats = Doacao.objects.aggregate(
        total_doacoes=Count('id'),
        total_quantidade=Sum('quantidade'),
    )
    por_categoria = (
        Doacao.objects
        .values('categoria')
        .annotate(count=Count('id'), total_qtd=Sum('quantidade'))
        .order_by('-total_qtd')
    )
    ultimas_doacoes = Doacao.objects.all().order_by('-data_doacao')[:10]

    top_doadores = (
        Doacao.objects
        .values('doador__nome')           # ← ajustado para FK
        .annotate(total_qtd=Sum('quantidade'), count=Count('id'))
        .order_by('-total_qtd')[:5]
    )

    context = {
        'stats': stats,
        'por_categoria': list(por_categoria),
        'ultimas_doacoes': ultimas_doacoes,
        'top_doadores': list(top_doadores),
    }
    return render(request, "doacao/dashboard_doacoes.html", context)


@login_required
@permission_required('doacao.change_doacao')
def editar_doacao(request, id):
    doacao = get_object_or_404(Doacao, id=id)

    # ownership: doador só edita a própria
    if not request.user.is_staff:
        try:
            doador_logado = Doador.objects.get(usuario=request.user)
            if doacao.doador != doador_logado:
                return redirect('dashboard_doacoes')
        except Doador.DoesNotExist:
            return redirect('dashboard_doacoes')

    if request.method == "POST":
        form = DoacaoForm(request.POST, instance=doacao)
        if form.is_valid():
            form.save()
            return redirect("listar_estoque")
    else:
        form = DoacaoForm(instance=doacao)

    return render(request, "doacao/editar_doacao.html", {
        "form": form, "doacao": doacao, 'action_type': 'edit_doacao'
    })


@login_required
def confirmar_coleta(request, id):
    doacao = get_object_or_404(Doacao, id=id)
    doacao.coletada = True
    doacao.save()
    return redirect('dashboard_doacoes')


@login_required
@permission_required('doacao.delete_doacao')
def deletar_doacao(request, id):
    doacao = get_object_or_404(Doacao, id=id)

    # ownership: doador só deleta a própria
    if not request.user.is_staff:
        try:
            doador_logado = Doador.objects.get(usuario=request.user)
            if doacao.doador != doador_logado:
                return redirect('dashboard_doacoes')
        except Doador.DoesNotExist:
            return redirect('dashboard_doacoes')

    if request.method == "POST":
        doacao.delete()
        return redirect("listar_estoque")

    return render(request, "doacao/confirmar_delete.html", {
        "doacao": doacao, 'action_type': 'delete_doacao'
    })


class DoacaoViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrOwner]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Doacao.objects.all()
        return Doacao.objects.filter(doador__usuario=user) 