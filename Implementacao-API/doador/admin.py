from django.contrib import admin
from doador.models import Doador
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin


class DoadorInline(admin.StackedInline):
    model = Doador
    can_delete = False  
    verbose_name_plural = 'Perfil do Doador'
    fields = ('nome', 'cpf', 'cnpj', 'email', 'telefone', 'endereco', 'usuario')    
    
class CustomUserAdmin(BaseUserAdmin):
    inlines = (DoadorInline,)
try:
    admin.site.unregister(User)
except admin.sites.NotRegistered:
    pass
admin.site.register(User, CustomUserAdmin)
admin.site.register(Doador)