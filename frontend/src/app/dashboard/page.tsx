
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { projects, tasks as initialTasks, activities, users, type Activity, type Task } from '@/lib/data';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [taskToComplete, setTaskToComplete] = useState<Task | null>(null);

  const [tasksForToday, setTasksForToday] = useState<Task[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const today = new Date();
      const todayTasks = tasks.filter(
        (task) =>
          task.dueDate &&
          new Date(task.dueDate).toDateString() === today.toDateString()
      );
      setTasksForToday(todayTasks);
    }
  }, [tasks, isClient]);


  const activeProjects = projects.filter(
    (project) => project.status === 'Em Andamento'
  );

  const handleCheckboxChange = (checked: boolean, task: Task) => {
    if (checked && task.status !== 'Concluído') {
      setTaskToComplete(task);
      setIsConfirmOpen(true);
    } else if (!checked && task.status === 'Concluído') {
      // Un-complete the task directly without confirmation
      setTasks(currentTasks =>
        currentTasks.map(t =>
          t.id === task.id ? { ...t, status: 'A Fazer' } : t
        )
      );
    }
  };

  const handleCompleteTask = () => {
    if (!taskToComplete) return;
    setTasks(currentTasks =>
      currentTasks.map(task =>
        task.id === taskToComplete.id ? { ...task, status: 'Concluído' } : task
      )
    );
    setIsConfirmOpen(false);
    setTaskToComplete(null);
  };

  const renderActivityContent = (activity: Activity) => {
    const { content, targetLink } = activity;
    if (!targetLink) {
      return <p className="text-sm" dangerouslySetInnerHTML={{ __html: content }} />;
    }
    
    const parts = content.split(/<b.*?>|<\/b>/);
    if (parts.length < 3) {
      return <p className="text-sm" dangerouslySetInnerHTML={{ __html: content }} />;
    }

    return (
      <p className="text-sm">
        {parts[0]}
        <Link href={targetLink} className="font-semibold text-primary hover:underline">
          {parts[1]}
        </Link>
        {parts[2]}
      </p>
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Minhas Tarefas para Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!isClient ? (
                <p className="text-sm text-muted-foreground">Carregando tarefas...</p>
              ) : tasksForToday.length > 0 ? (
                tasksForToday.map((task) => (
                  <div key={task.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={`task-${task.id}`}
                      checked={task.status === 'Concluído'}
                      onCheckedChange={(checked) => handleCheckboxChange(Boolean(checked), task)}
                    />
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex-1">
                            <label
                              htmlFor={`task-${task.id}`}
                              className={cn(
                                "font-medium cursor-pointer",
                                task.status === 'Concluído' && "line-through text-muted-foreground"
                              )}
                            >
                              {task.title}
                            </label>
                            <p className="text-sm text-muted-foreground">
                              {projects.find((p) => p.id === task.projectId)?.name}
                            </p>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="p-1 max-w-xs space-y-1">
                            <p className="font-bold">{task.title}</p>
                            {task.description && <p className="text-muted-foreground text-sm">{task.description}</p>}
                            {task.dueDate && <p className="text-xs">Prazo: {format(new Date(task.dueDate), 'dd/MM/yyyy')}</p>}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma tarefa para hoje. Bom descanso!</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Projetos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {activeProjects.map((project) => {
                const projectTasks = tasks.filter((t) => t.projectId === project.id);
                const completedTasks = projectTasks.filter(
                  (t) => t.status === 'Concluído'
                ).length;
                const progress =
                  projectTasks.length > 0
                    ? (completedTasks / projectTasks.length) * 100
                    : 0;
                return (
                  <div key={project.id}>
                    <div className="flex justify-between items-center mb-1">
                      <Link href={`/projetos/${project.id}`} className="font-medium hover:text-primary">{project.name}</Link>
                      <Badge
                        variant="outline"
                        className={cn(
                          project.status === 'Em Andamento' &&
                            'text-sky-600 border-sky-600',
                          project.status === 'Concluído' &&
                            'text-green-600 border-green-600'
                        )}
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">{`${completedTasks} / ${projectTasks.length} tarefas`}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.slice(0, 5).map((activity) => {
                const user = users.find((u) => u.id === activity.userId);
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                      <AvatarFallback>
                        {user?.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      {renderActivityContent(activity)}
                      <p className="text-xs text-muted-foreground">
                        {isClient ? format(new Date(activity.timestamp), 'dd/MM/yyyy') : <>&nbsp;</>}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Concluir Tarefa</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja marcar a tarefa "{taskToComplete?.title}" como concluída?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTaskToComplete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleCompleteTask}>
              Sim, concluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
