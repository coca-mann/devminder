from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q
from django.contrib.contenttypes.models import ContentType
from backend.projects.models import Project, ProjectMember, Task, Tag, Attachment, Comment
from backend.projects.serializers import ProjectListSerializer, ProjectDetailSerializer, TaskListSerializer, TaskDetailSerializer, TaskTagActionSerializer, TagSerializer, CommentSerializer, AttachmentSerializer, CommentCreateSerializer, AttachmentCreateSerializer
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


class TagViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet somente de leitura para listar e obter tags.
    Qualquer utilizador autenticado pode ver as tags disponíveis.
    """
    queryset = Tag.objects.all().order_by('name')
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticated]


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
    
    @action(detail=True, methods=['post'], url_path='manage-tags')
    def manage_tags(self, request, pk=None):
        """
        Ação personalizada para adicionar ou remover uma tag de uma tarefa.
        Espera um JSON com {"action": "add|remove", "tag_id": <id>}.
        """
        task = self.get_object() # Obtém a tarefa pelo pk da URL
        serializer = TaskTagActionSerializer(data=request.data)

        if serializer.is_valid():
            tag_id = serializer.validated_data['tag_id']
            action = serializer.validated_data['action']
            
            try:
                tag = Tag.objects.get(pk=tag_id)
            except Tag.DoesNotExist:
                # Embora o serializer já valide, é uma boa prática ter isto.
                return Response(
                    {'error': 'Tag não encontrada'}, 
                    status=status.HTTP_404_NOT_FOUND
                )

            if action == 'add':
                task.tags.add(tag)
            elif action == 'remove':
                task.tags.remove(tag)

            # Retorna a tarefa atualizada para o frontend poder atualizar o seu estado.
            task_serializer = TaskDetailSerializer(task, context={'request': request})
            return Response(task_serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(
        detail=True,
        methods=['post'],
        url_path='add-comment',
        permission_classes=[IsMemberOrOwner]
    )
    def add_comment(self, request, pk=None):
        """
        Ação para adicionar um comentário a uma tarefa específica.
        """
        task = self.get_object() # Obtém a tarefa pelo pk da URL
        serializer = CommentCreateSerializer(data=request.data)

        if serializer.is_valid():
            # Associa os dados que não vêm do utilizador (autor e o objeto relacionado)
            serializer.save(
                author=request.user,
                content_object=task
            )
            # Retorna o comentário recém-criado para o frontend
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(
        detail=True, 
        methods=['post'], 
        url_path='add-attachment',
        permission_classes=[IsMemberOrOwner],
        # Define os parsers corretos para aceitar o upload de ficheiros
        parser_classes=[MultiPartParser, FormParser]
    )
    def add_attachment(self, request, pk=None):
        """
        Ação para adicionar um anexo a uma tarefa específica.
        """
        task = self.get_object()
        serializer = AttachmentCreateSerializer(data=request.data)

        if serializer.is_valid():
            # Associa o utilizador que fez o upload e o objeto relacionado
            attachment = serializer.save(
                uploaded_by=request.user,
                content_object=task
            )
            # Para retornar o anexo completo (com dados do utilizador), usamos o serializer de leitura
            response_serializer = AttachmentSerializer(attachment, context={'request': request})
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)