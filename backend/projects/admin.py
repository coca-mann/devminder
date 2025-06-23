from django.contrib import admin
from django.contrib.contenttypes.admin import GenericTabularInline
from backend.projects.models import Project, Tag, Task, Idea, Feedback, Attachment, Comment


class CommentInline(GenericTabularInline):
    model = Comment
    extra = 1


class AttachmentInline(GenericTabularInline):
    model = Attachment
    extra = 1


class TaskInline(admin.TabularInline):
    model = Task
    extra = 1
    fields = ('title', 'assignee', 'status', 'priority', 'due_date')
    show_change_link = True


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'color')
    search_fields = ('name',)


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'status', 'created_at', 'due_date')
    list_filter = ('status', 'owner')
    search_fields = ('name', 'description')
    date_hierarchy = 'created_at'
    inlines = [TaskInline, CommentInline, AttachmentInline]


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'project', 'assignee', 'status', 'priority', 'due_date')
    list_filter = ('status', 'priority', 'project', 'assignee')
    search_fields = ('title', 'description')
    autocomplete_fields = ['project', 'assignee', 'tags']
    inlines = [CommentInline, AttachmentInline]


@admin.register(Idea)
class IdeaAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'status', 'created_at')
    list_filter = ('status', 'author')
    search_fields = ('title', 'description')


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('summary', 'project', 'feedback_type', 'status', 'submitted_by')
    list_filter = ('feedback_type', 'status', 'project')
    search_fields = ('summary', 'description')
    inlines = [CommentInline, AttachmentInline]
