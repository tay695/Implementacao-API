from django.urls import path, include
from rest_framework import routers
from doacao import views

router = routers.DefaultRouter()
router.register(r'doacoes', views.DoacaoViewSet, basename='doacao')

urlpatterns = [
    path('nova_doacao/', views.criar_doacao, name='criar_doacao'),
    path('dashboard/', views.dashboard_doacoes, name='dashboard_doacoes'),
    path('confirmar/<int:id>/', views.confirmar_coleta, name='confirmar_coleta'),
    path('editar/<int:id>/', views.editar_doacao, name='editar_doacao'),
    path('deletar/<int:id>/', views.deletar_doacao, name='deletar_doacao'),
]