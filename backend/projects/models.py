import os
import uuid
from django.db import models
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.utils.translation import gettext_lazy as _
from django.utils import timezone


class Tag(models.Model):
    name = models.CharField(
        _('Nome da Tag'),
        max_length=50,
        unique=True
    )
    color = models.CharField(
        _('Cor'),
        max_length=7,
        default='#808080',
        help_text=_('Cor em formato hexadecimal, ex: #FF5733')
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Tag')
        verbose_name_plural = _('Tags')
        ordering = ['name',]

    def __str__(self):
        return self.name


class ProjectMember(models.Model):


    class Role(models.TextChoices):
        ADMIN = 'ADMIN', _('Admin')
        DEVELOPER = 'DEVELOPER', _('Desenvolvedor')
        TESTER = 'TESTER', _('Tester')
        VIEWER = 'VIEWER', _('Leitor')

    project = models.ForeignKey(
        'Project',
        on_delete=models.CASCADE,
        verbose_name=_("Projeto")
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        verbose_name=_("Usuário")
    )
    role = models.CharField(
        _("Papel"),
        max_length=20,
        choices=Role.choices,
        default=Role.DEVELOPER
    )
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _("Membro do Projeto")
        verbose_name_plural = _("Membros dos Projetos")
        # Garante que um usuário não possa ser adicionado duas vezes ao mesmo projeto
        unique_together = ('project', 'user')
        ordering = ['-joined_at']

    def __str__(self):
        return f'{self.user} como {self.get_role_display()} em {self.project}'


class Project(models.Model):


    class Status(models.TextChoices):
        NOT_STARTED = 'NOT_STARTED', _('Não Iniciado')
        IN_PROGRESS = 'IN_PROGRESS', _('Em Andamento')
        ON_HOLD = 'ON_HOLD', _('Em Pausa')
        COMPLETED = 'COMPLETED', _('Concluído')
        CANCELED = 'CANCELED', _('Cancelado')

    name = models.CharField(
        _('Nome do Projeto'),
        max_length=200
    )
    description = models.TextField(
        _('Descrição'),
        blank=True
    )
    status = models.CharField(
        _('Status'),
        max_length=20,
        choices=Status.choices,
        default=Status.NOT_STARTED
    )
    is_archived = models.BooleanField(
        _("Arquivado"),
        default=False,
        help_text=_("Projetos arquivados são somente leitura e não aparecem nas listas principais.")
    )
    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        through=ProjectMember,
        related_name='projects_member_of',
        verbose_name=_("Membros")
    )
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='owned_projects',
        verbose_name=_('Dono')
    )
    tags = models.ManyToManyField(
        Tag,
        blank=True,
        verbose_name=_('Tags')
    )
    start_date = models.DateField(
        _('Data de Início'),
        null=True, blank=True
    )
    due_date = models.DateField(
        _('Data de Término Prevista'),
        null=True, blank=True
    )
    budget = models.DecimalField(
        _('Orçamento'),
        max_digits=12,
        decimal_places=2,
        null=True, blank=True
    )
    repository_url = models.URLField(
        _('URL do Repositório'),
        blank=True
    )
    live_url = models.URLField(
        _('URL em Produção'),
        blank=True
    )
    created_at = models.DateTimeField(
        _('Criado em'),
        auto_now_add=True
    )
    updated_at = models.DateTimeField(
        _('Atualizado em'),
        auto_now=True
    )


    class Meta:
        verbose_name = _('Projeto')
        verbose_name_plural = _('Projetos')
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class Feedback(models.Model):


    class FeedbackType(models.TextChoices):
        BUG = 'BUG', _("Bug")
        FEATURE = 'FEATURE', _("Sugestão de Funcionalidade")
        IMPROVEMENT = 'IMPROVEMENT', _("Melhoria")
    

    class Status(models.TextChoices):
        RECEIVED = 'RECEIVED', _('Recebido')
        IN_ANALYSIS = 'IN_ANALYSIS', _('Em Análise')
        PLANNED = 'PLANNED', _('Planejado')
        IMPLEMENTED = 'IMPLEMENTED', _('Implementado')
        REJECTED = 'REJECTED', _('Rejeitado')
    
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='feedbacks',
        verbose_name=_("Projeto")
    )
    summary = models.CharField(
        _("Resumo"),
        max_length=255
    )
    description = models.TextField(
        _("Descrição Completa"),
        blank=True
    )
    feedback_type = models.CharField(
        _("Tipo"),
        max_length=20,
        choices=FeedbackType.choices,
        default=FeedbackType.BUG
    )
    status = models.CharField(
        _("Status"),
        max_length=20,
        choices=Status.choices,
        default=Status.RECEIVED
    )
    submitted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='feedbacks_submitted',
        verbose_name=_("Enviado por")
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_("Criado em")
    )

    class Meta:
        verbose_name = _("Feedback")
        verbose_name_plural = _("Feedbacks")
        ordering = ['-created_at']

    def __str__(self):
        return self.summary


class Task(models.Model):
    

    class Status(models.TextChoices):
        TODO = 'TODO', _('A Fazer')
        IN_PROGRESS = 'IN_PROGRESS', _("Em Andamento")
        IN_REVIEW = 'IN_REVIEW', _("Em Revisão")
        DONE = 'DONE', _("Concluído")
        BLOCKED = 'BLOCKED', _("Bloqueado")
    

    class Priority(models.TextChoices):
        LOW = 'LOW', _("Baixa")
        MEDIUM = 'MEDIUM', _("Média")
        HIGH = 'HIGH', _("Alta")
        URGENT = 'URGENT', _("Urgente")
    
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='tasks',
        verbose_name=_("Projeto")
    )
    title = models.CharField(
        _("Título"),
        max_length=255
    )
    description = models.TextField(
        _("Descrição"),
        max_length=255
    )
    status = models.CharField(
        _("Status"),
        max_length=20,
        choices=Status.choices,
        default=Status.TODO
    )
    priority = models.CharField(
        _("Prioridade"),
        max_length=20,
        choices=Priority.choices,
        default=Priority.MEDIUM
    )
    assignee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='tasks',
        verbose_name=_("Responsável")
    )
    parent_task = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True, blank=True,
        related_name='subtasks',
        verbose_name=_("Tarefa Pai")
    )
    tags = models.ManyToManyField(
        Tag,
        blank=True,
        verbose_name=_("Tags")
    )
    start_date = models.DateTimeField(
        _("Data de Ínicio"),
        null=True, blank=True
    )
    due_date = models.DateField(
        _("Prazo Final"),
        null=True, blank=True
    )
    estimated_hours = models.DecimalField(
        _("Horas Estimadas"),
        max_digits=5,
        decimal_places=2,
        null=True, blank=True
    )
    originating_feedback = models.ForeignKey(
        Feedback,
        on_delete=models.SET_NULL,
        null=True, blank=True
    )
    created_at = models.DateTimeField(
        _('Criado em'),
        auto_now_add=True
    )
    updated_at = models.DateTimeField(
        _('Atualizado em'),
        auto_now=True
    )


    class Meta:
        verbose_name = _("Tarefa")
        verbose_name_plural = _("Tarefas")
        ordering = ['priority','-created_at']

    def __str__(self):
        return self.title


class Idea(models.Model):


    class Status(models.TextChoices):
        NEW = 'NEW', _("Nova")
        IN_ANALYSIS = 'IN_ANALYSIS', _("Em Analíse")
        APPROVED = 'APPROVED', _("Nova")
        ARCHIVED = 'ARCHIVED', _("Nova")
    
    title = models.CharField(
        _("Título da Ideia"),
        max_length=255
    )
    description = models.TextField(_("Descrição"))
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        blank=True, null=True,
        related_name='ideas',
        verbose_name=_("Autor")
    )
    status = models.CharField(
        _("Status"),
        max_length=20,
        choices=Status.choices,
        default=Status.NEW
    )
    created_at = models.DateTimeField(
        _('Criado em'),
        auto_now_add=True
    )
    updated_at = models.DateTimeField(
        _('Atualizado em'),
        auto_now=True
    )


    class Meta:
        verbose_name = _("Ideia")
        verbose_name_plural = _("Ideias")
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title


class Comment(models.Model):

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        verbose_name=_("Autor")
    )
    text = models.TextField(_("Texto do Comentário"))
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_("Criado em")
    )
    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE
    )
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    class Meta:
        ordering = ['created_at']
        verbose_name = _("Comentário")
        verbose_name_plural = _("Comentários")

    def __str__(self):
        return f'Comentário de {self.author} em {self.created_at.strftime("%d/%m/%Y")}'


def get_attachment_upload_path(instance, filename):
    """
    Gera um caminho único para o upload de anexos.
    O formato será: 'attachments/YYYY/MM/DD/uuid_aleatorio.extensao'
    """
    ext = filename.split('.')[-1]
    new_filename = f"{uuid.uuid4()}.{ext}"
    now = timezone.now()
    # Caminho relativo a MEDIA_ROOT
    return os.path.join('attachments', now.strftime('%Y/%m/%d'), new_filename)


class Attachment(models.Model):
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        verbose_name=_("Enviado por")
    )
    file = models.FileField(
        upload_to=get_attachment_upload_path
    )
    description = models.CharField(
        _("Descrição"),
        max_length=255,
        blank=True
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE
    )
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey(
        'content_type',
        'object_id'
    )

    class Meta:
        verbose_name = _("Anexo")
        verbose_name_plural = _("Anexos")

    def __str__(self):
        return os.path.basename(self.file.name)
