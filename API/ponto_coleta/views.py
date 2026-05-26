from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from django.contrib.auth.decorators import login_required, user_passes_test, permission_required
from .models import PontoColeta 
from .forms import PontoColetaForm
from doacao.models import Doacao
from doador.models import Doador
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from .serializers import PontoColetaSerializer

def is_assistente_social(user):
    return user.is_superuser

def is_doador(user):
    return hasattr(user, 'doador')

def get_doador_profile(user):
    try:
        return user.doador
    except Doador.DoesNotExist:
        return None


@login_required
@permission_required('ponto_coleta.view_pontocoleta')
def ponto_full_list(request):

    pontos = PontoColeta.objects.all().order_by('nome')

    is_admin = is_assistente_social(request.user)
    usuario_e_doador = is_doador(request.user)

    if not is_admin and usuario_e_doador:
        
        pontos_filtrados_com_doacoes = []
        objeto_doador = get_doador_profile(request.user)
        
        if objeto_doador:
            nome_doador_logado = objeto_doador.nome
        else:
            nome_doador_logado = ""

        for ponto in pontos:
            if nome_doador_logado:
               doacoes_do_usuario = ponto.doacao_set.filter(doador=objeto_doador)
            else:
                doacoes_do_usuario = Doacao.objects.none()

            ponto.doacoes_filtradas = doacoes_do_usuario
            
            if doacoes_do_usuario.exists():
                pontos_filtrados_com_doacoes.append(ponto)
        
        pontos = pontos_filtrados_com_doacoes

    context = {
        'pontos': pontos,
        'is_doador': usuario_e_doador,
        'is_admin': is_admin
    }

    return render(request, 'ponto_coleta/ponto_list.html', context)


@login_required
@permission_required('ponto_coleta.view_pontocoleta')
def ponto_list(request):
    return redirect('ponto_full_list')


@login_required
@user_passes_test(is_assistente_social)
@permission_required('ponto_coleta.add_pontocoleta')
def ponto_create(request):
    if request.method == 'POST':
        form = PontoColetaForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('ponto_full_list')
    else:
        form = PontoColetaForm()

    return render(
        request, 
        'ponto_coleta/ponto_form.html',
        {'form': form, 'acao': 'Criar'}
    )


@login_required
@user_passes_test(is_assistente_social)
@permission_required('ponto_coleta.view_pontocoleta')
def ponto_detail(request, pk):
    ponto = get_object_or_404(PontoColeta, pk=pk)
    return render(request, 'ponto_coleta/ponto_detail.html', {'ponto': ponto})


@login_required
@user_passes_test(is_assistente_social)
@permission_required('ponto_coleta.change_pontocoleta')
def ponto_update(request, pk):
    ponto = get_object_or_404(PontoColeta, pk=pk)
    if request.method == 'POST':
        form = PontoColetaForm(request.POST, instance=ponto)
        if form.is_valid():
            form.save()
            return redirect('ponto_full_list')
    else:
        form = PontoColetaForm(instance=ponto)

    return render(
        request,
        'ponto_coleta/ponto_form.html',
        {'form': form, 'acao': 'Editar'}
    )


@login_required
@user_passes_test(is_assistente_social)
@permission_required('ponto_coleta.delete_pontocoleta')
def ponto_delete(request, pk):
    ponto = get_object_or_404(PontoColeta, pk=pk)
    if request.method == 'POST':
        ponto.delete()
        return redirect('ponto_full_list')

    return render(request, 'ponto_coleta/ponto_delete.html', {'ponto': ponto})


@login_required
@user_passes_test(is_assistente_social)
@permission_required('ponto_coleta.change_pontocoleta')
def confirmar_coleta(request, pk):
    ponto = get_object_or_404(PontoColeta, pk=pk)
    ponto.coletado = True
    ponto.save()
    return redirect('ponto_full_list')


class PontoColetaViewSet(viewsets.ModelViewSet):
    serializer_class = PontoColetaSerializer
    queryset = PontoColeta.objects.all()

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsAdminUser()]