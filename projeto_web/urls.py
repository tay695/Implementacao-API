from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView  # ← adicionar

from estoque.views import EstoqueViewSet
from doacao.views import DoacaoViewSet
from doador.views import DoadorViewSet
from entidade_beneficiada.views import EntidadeBeneficiadaViewSet
from ponto_coleta.views import PontoColetaViewSet
from projeto_web.views import Index

router = routers.DefaultRouter()
router.register(r'item', EstoqueViewSet,  basename='estoque')
router.register(r'doacoes', DoacaoViewSet, basename='doacao')  
router.register(r'doadores', DoadorViewSet,  basename='doador')
router.register(r'entidades', EntidadeBeneficiadaViewSet,  basename='entidadeBeneficiada')
router.register(r'pontos-coleta', PontoColetaViewSet,  basename='pontoColeta')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('django.contrib.auth.urls')),
    path('sair/', auth_views.LogoutView.as_view(), name='logout'),
    path('', Index, name='index'),

    # API
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),      # ← login JWT
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),     # ← refresh

    # Templates HTML
    path('ponto/', include('ponto_coleta.urls')),
    path('estoque/', include('estoque.urls')),
    path('entidades/', include('entidade_beneficiada.urls')),
    path('doador/', include('doador.urls')),
    path('doacao/', include('doacao.urls')),
]