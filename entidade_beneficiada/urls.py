from django.urls import path
from . import views
from rest_framework import routers


urlpatterns = [
    path('', views.entidade_list, name='entidade_list'),
    path('adicionar/', views.entidade_create, name='entidade_create'),
    path('<int:pk>/editar/', views.entidade_update, name='entidade_update'),
    path('<int:pk>/', views.entidade_detail, name='entidade_detail'),
    path('<int:pk>/excluir/', views.entidade_delete, name='entidade_delete'),
]