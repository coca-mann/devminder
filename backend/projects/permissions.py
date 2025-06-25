from rest_framework import permissions
from backend.projects.models import ProjectMember


class IsMemberOrOwner(permissions.BasePermission):
    
    def has_object_permission(self, request, view, obj):
        if obj.owner == request.user:
            return True
        
        return obj.members.filter(pk=request.user.pk).exists()


class IsProjectAdminOrOwner(permissions.BasePermission):
    
    def has_object_permission(self, request, view, obj):
        if obj.owner == request.user:
            return True

        try:
            member = ProjectMember.objects.get(project=obj, user=request.user)
            return member.role == ProjectMember.role.ADMIN
        except ProjectMember.DoesNotExist:
            return False
