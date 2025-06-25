from rest_framework import permissions
from backend.projects.models import ProjectMember, Task


class IsMemberOrOwner(permissions.BasePermission):
    
    def has_object_permission(self, request, view, obj):
        # Se for uma Task, verifica permissões no projeto relacionado
        if isinstance(obj, Task):
            project = obj.project
        else:
            project = obj
        if project.owner == request.user:
            return True
        return project.members.filter(pk=request.user.pk).exists()


class IsProjectAdminOrOwner(permissions.BasePermission):
    
    def has_object_permission(self, request, view, obj):
        # Se for uma Task, verifica permissões no projeto relacionado
        if isinstance(obj, Task):
            project = obj.project
        else:
            project = obj
        if project.owner == request.user:
            return True
        try:
            member = ProjectMember.objects.get(project=project, user=request.user)
            return member.role == ProjectMember.Role.ADMIN
        except ProjectMember.DoesNotExist:
            return False
