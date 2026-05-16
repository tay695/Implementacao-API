from rest_framework.permissions import BasePermission

class IsAdminOrOwner(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # admin vê tudo
        if request.user.is_staff:
            return True
        # doador vê só o próprio
        return obj.doador.usuario == request.user