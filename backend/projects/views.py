from rest_framework import viewsets, permissions
from django.db.models import Q
from backend.projects.models import Project, ProjectMember, Task
from backend.projects.serializers import ProjectListSerializer, ProjectDetailSerializer, TaskListSerializer, TaskDetailSerializer
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


class TaskViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerir Tarefas. Funciona tanto para rotas aninhadas
    (projects/1/tasks/) como para rotas diretas (tasks/42/).
    """
    serializer_class = TaskDetailSerializer # Usamos o serializer detalhado por padrão
    permission_classes = [IsMemberOrOwner]

    def get_queryset(self):
        """
        Filtra o queryset de forma inteligente.
        Se a URL for aninhada, retorna apenas as tarefas principais do projeto.
        Se a URL for direta, retorna todas as tarefas a que o utilizador tem acesso.
        """
        user = self.request.user
        
        # Queryset base: todas as tarefas de projetos em que o utilizador é membro ou dono.
        allowed_projects = Project.objects.filter(Q(owner=user) | Q(members=user))
        queryset = Task.objects.filter(project__in=allowed_projects)

        # Se for um pedido de lista aninhado (ex: /projects/1/tasks/)
        if 'project_pk' in self.kwargs and self.action == 'list':
            project_id = self.kwargs['project_pk']
            # Filtra apenas as tarefas de nível superior daquele projeto específico
            return queryset.filter(project_id=project_id, parent_task__isnull=True)
        
        return queryset

    def get_serializer_class(self):
        """
        Retorna o serializer leve para a lista e o pesado para os detalhes.
        """
        if self.action == 'list':
            # Para /projects/1/tasks/
            return TaskListSerializer
        # Para /tasks/42/ (retrieve, update, create)
        return TaskDetailSerializer

    def perform_create(self, serializer):
        """
        Associa a tarefa ao projeto correto ao ser criada.
        O ID do projeto vem do corpo do pedido, não mais da URL.
        """
        # A validação de que o utilizador pertence ao projeto deve
        # ser adicionada no serializer para maior segurança.
        serializer.save()
