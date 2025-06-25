from datetime import date
from rest_framework import serializers
from backend.projects.models import Project, ProjectMember, Tag, Task, Comment, Attachment
from backend.accounts.models import Account


class AssigneeSerializer(serializers.ModelSerializer):
    """Serializer leve para mostrar o responsável pela tarefa."""
    class Meta:
        model = Account
        fields = ['id', 'first_name', 'last_name', 'profile_picture']


class CommentSerializer(serializers.ModelSerializer):
    """Serializer para exibir os comentários de uma tarefa."""
    author = AssigneeSerializer(read_only=True)
    class Meta:
        model = Comment
        fields = ['id', 'text', 'author', 'created_at']


class AttachmentSerializer(serializers.ModelSerializer):
    """Serializer para exibir os anexos de uma tarefa."""
    uploaded_by = AssigneeSerializer(read_only=True)
    class Meta:
        model = Attachment
        fields = ['id', 'file', 'description', 'uploaded_by', 'uploaded_at']


class RecursiveField(serializers.Serializer):
    """
    Um campo especial para lidar com a recursividade das subtarefas.
    Ele chama o serializer pai para serializar os filhos.
    """
    def to_representation(self, value):
        serializer = self.parent.parent.__class__(value, context=self.context)
        return serializer.data


class TagSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Tag
        fields = ['id', 'name', 'color']


class TaskTagActionSerializer(serializers.Serializer):
    """
    Serializer para validar a ação de adicionar/remover uma tag
    de uma tarefa. Não está ligado a um modelo.
    """
    ACTION_CHOICES = ('add', 'remove')
    
    tag_id = serializers.IntegerField()
    action = serializers.ChoiceField(choices=ACTION_CHOICES)

    def validate_tag_id(self, value):
        """Verifica se a tag com o ID fornecido realmente existe."""
        if not Tag.objects.filter(pk=value).exists():
            raise serializers.ValidationError("A tag com o ID fornecido não existe.")
        return value


class TaskListSerializer(serializers.ModelSerializer):
    """
    Serializer 'LEVE' para a listagem inicial de tarefas.
    Inclui subtarefas de forma recursiva.
    """
    assignee = AssigneeSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    # Aqui está a magia da recursividade para as subtarefas
    subtasks = RecursiveField(many=True, read_only=True)

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'status', 'priority', 'due_date', 'updated_at',
            'assignee', 'tags', 'subtasks'
        ]


class TaskDetailSerializer(serializers.ModelSerializer):
    """
    Serializer 'PESADO' para os detalhes de UMA tarefa.
    Carrega os comentários e anexos.
    """
    assignee = AssigneeSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    # Serializa os comentários e anexos associados a esta tarefa
    comments = CommentSerializer(many=True, read_only=True)
    attachments = AttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'status', 'priority',
            'start_date', 'due_date', 'estimated_hours',
            'assignee', 'tags', 'comments', 'attachments', 'project', 'parent_task'
        ]


class MemberSerializer(serializers.ModelSerializer):
    
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = ProjectMember
        fields = ['id', 'user_id', 'full_name', 'email', 'role']


class ProjectMemberAvatarSerializer(serializers.ModelSerializer):
    
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    
    class Meta:
        model = Account
        fields = ['id', 'full_name', 'profile_picture']


class ProjectListSerializer(serializers.ModelSerializer):
    
    owner_name = serializers.CharField(source='owner.get_full_name', read_only=True)
    members = ProjectMemberAvatarSerializer(many=True, read_only=True)
    
    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'status', 'is_archived', 'due_date', 'owner_name', 'members']


class MemberDetailSerializer(serializers.ModelSerializer):
    
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    job_title = serializers.CharField(source='user.job_title', read_only=True)
    profile_picture = serializers.ImageField(source='user.profile_picture', read_only=True)

    class Meta:
        model = ProjectMember
        fields = ['user_id', 'full_name', 'email', 'job_title', 'profile_picture', 'role']


class ProjectDetailSerializer(serializers.ModelSerializer):
    
    owner = serializers.StringRelatedField(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    members = MemberSerializer(source='projectmember_set', many=True, read_only=True)
    
    progress_percentage = serializers.SerializerMethodField()
    tasks_summary = serializers.SerializerMethodField()
    days_remaining = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description', 'status', 'is_archived', 'owner',
            'start_date', 'due_date', 'budget', 'repository_url', 'live_url',
            'created_at', 'updated_at', 'tags', 'members',
            'progress_percentage', 'tasks_summary', 'days_remaining'
        ]
    
    def get_tasks_summary(self, obj):
        
        total_tasks = obj.tasks.count()
        completed_tasks = obj.tasks.filter(status=Task.Status.DONE).count()
        
        return {
            'completed': completed_tasks,
            'total': total_tasks
        }
    
    def get_progress_percentage(self, obj):
        
        summary = self.get_tasks_summary(obj)
        total = summary['total']
        completed = summary['completed']
        
        if total == 0:
            return 0
        
        return round((completed / total) * 100)
    
    def get_days_remaining(self, obj):
        
        if not obj.due_date:
            return None
        
        today = date.today()
        delta = obj.due_date - today
        return delta.days
