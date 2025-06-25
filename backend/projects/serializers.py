from rest_framework import serializers
from backend.projects.models import Project, ProjectMember, Tag
from backend.accounts.models import Account


class TagSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Tag
        fields = ['id', 'name', 'color']


class MemberSerializer(serializers.ModelSerializer):
    
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = ProjectMember
        fields = ['id', 'user_id', 'full_name', 'email', 'role']


class ProjectListSerializer(serializers.ModelSerializer):
    
    owner_name = serializers.CharField(source='owner.get_full_name', read_only=True)
    
    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'status', 'is_archived', 'due_date', 'owner_name']


class ProjectDetailSerializer(serializers.ModelSerializer):
    
    owner = serializers.StringRelatedField(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    members = MemberSerializer(source='projectmember_set', many=True, read_only=True)
    
    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description', 'status', 'is_archived', 'owner',
            'start_date', 'due_date', 'budget', 'repository_url', 'live_url',
            'created_at', 'updated_at', 'tags', 'members'
        ]
