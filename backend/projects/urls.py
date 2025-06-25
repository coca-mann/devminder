from django.urls import path, include
from rest_framework_nested.routers import NestedDefaultRouter
from rest_framework.routers import DefaultRouter
from backend.projects.views import ProjectViewSet, TaskViewSet


router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'tasks', TaskViewSet, basename='task')

tasks_router = NestedDefaultRouter(router, r'projects', lookup='project')
tasks_router.register(r'tasks', TaskViewSet, basename='project-tasks')


urlpatterns = [
    path('', include(router.urls)),
    path('', include(tasks_router.urls)),
]
