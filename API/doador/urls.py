from django.urls import path
from doador import views
from rest_framework import routers

urlpatterns = [
    path('', views.listar_doador, name='listar_doador'),
    path('cadastro/', views.cadastro_doador, name='cadastro_doador'),
    path('perfil/<int:id>/', views.perfil_doador, name='perfil_doador'),
    path('editar/<int:id>/', views.editar_doador, name='editar_doador'),
    path('deletar/<int:id>/', views.deletar_doador, name='deletar_doador'),
]