from rest_framework import viewsets, permissions
from django.db.models import Q
from backend.projects.models import Project, ProjectMember
from backend.projects.serializers import ProjectListSerializer, ProjectDetailSerializer
from backend.projects.permissions import IsMemberOrOwner, IsProjectAdminOrOwner

class ProjectViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerir Projetos.
    - List: Mostra todos os projetos em que o utilizador é membro ou dono.
    - Retrieve: Mostra os detalhes de um projeto se o utilizador for membro.
    - Create: Permite que qualquer utilizador autenticado crie um projeto.
    - Update/Destroy: Permite alterações apenas por Admins ou pelo Dono.
    """
    def get_queryset(self):
        """
        Filtra o queryset para retornar apenas os projetos associados
        ao utilizador autenticado (seja como dono ou membro).
        Retorna todos os projetos para superutilizadores.
        """
        user = self.request.user
        if user.is_superuser:
            return Project.objects.all()
        
        # Filtra por projetos onde o utilizador é dono OU membro.
        return Project.objects.filter(
            Q(owner=user) | Q(members=user)
        ).distinct().order_by('-created_at')

    def get_serializer_class(self):
        """
        Retorna um serializer diferente para a ação 'list' (mais leve)
        e para as outras ações (mais detalhado).
        """
        if self.action == 'list':
            return ProjectListSerializer
        return ProjectDetailSerializer

    def get_permissions(self):
        """
        Define permissões diferentes com base na ação.
        - `IsAuthenticated` para criar ou listar.
        - `IsMemberOrOwner` para ver detalhes.
        - `IsProjectAdminOrOwner` para editar ou apagar.
        """
        if self.action in ['list', 'create']:
            self.permission_classes = [permissions.IsAuthenticated]
        elif self.action in ['retrieve']:
            self.permission_classes = [IsMemberOrOwner]
        elif self.action in ['update', 'partial_update', 'destroy']:
            self.permission_classes = [IsProjectAdminOrOwner]
        return super().get_permissions()

    def perform_create(self, serializer):
        """
        Ao criar um novo projeto, define o utilizador atual como o dono
        e adiciona-o automaticamente como um membro Admin.
        """
        project = serializer.save(owner=self.request.user)
        ProjectMember.objects.create(
            project=project,
            user=self.request.user,
            role=ProjectMember.Role.ADMIN
        )
