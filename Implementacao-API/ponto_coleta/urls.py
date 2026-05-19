from django.urls import path
from . import views
from rest_framework import routers

urlpatterns = [
    path('', views.ponto_full_list, name='ponto_full_list'), 
    path('confirmar/<int:pk>/', views.confirmar_coleta, name='ponto_confirmar'), 
    path('adicionar/', views.ponto_create, name='ponto_create'),
    path('<int:pk>/', views.ponto_detail, name='ponto_detail'),
    path('<int:pk>/editar/', views.ponto_update, name='ponto_update'),
    path('<int:pk>/excluir/', views.ponto_delete, name='ponto_delete'),
    path('disponiveis/', views.ponto_list, name='ponto_list_doador'), 
]