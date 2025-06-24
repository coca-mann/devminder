
"use client";

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { projects, users, tasks as initialTasks, feedbacks as allFeedbacks, type Task, type Attachment as ProjectAttachment } from '@/lib/data';
import TaskList from '@/components/projetos/task-list';
import TagPalette from '@/components/projetos/tag-palette';
import { Link2, Trash2, Target, CheckCircle2, CalendarDays, Users, Plus, Paperclip, FileUp } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import CreateTaskModal from '@/components/modals/create-task-modal';
import AttachmentCard from '@/components/projetos/attachment-card';
import FeedbackList from '@/components/feedback/feedback-list';

export default function ProjetoViewPage() {
  const project = projects[0];
  const projectMembers = users.filter((user) => project.team.includes(user.id));

  const [projectTasks, setProjectTasks] = useState<Task[]>(
    initialTasks.filter((task) => task.projectId === project.id)
  );

  const [attachments, setAttachments] = useState<ProjectAttachment[]>(project.attachments || []);
  const [attachmentToDelete, setAttachmentToDelete] = useState<string | null>(null);

  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');
  
  const isDeleteButtonDisabled = deleteConfirmationInput !== project.name;

  const completedTasks = projectTasks.filter(
    (task) => task.status === 'Concluído'
  ).length;
  const totalTasks = projectTasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const daysRemaining = project.dueDate ? differenceInDays(new Date(project.dueDate), new Date()) : 0;

  const projectFeedbacks = allFeedbacks.filter(fb => fb.projectId === project.id);


  const handleAddTaskTag = (taskId: string, tag: string) => {
    setProjectTasks(currentTasks => 
      currentTasks.map(task => {
        if (task.id === taskId && !task.tags.includes(tag)) {
          return { ...task, tags: [...task.tags, tag] };
        }
        return task;
      })
    );
  };
  
  const handleDeleteAttachment = () => {
    if (!attachmentToDelete) return;
    setAttachments(currentAttachments => currentAttachments.filter(att => att.id !== attachmentToDelete));
    setAttachmentToDelete(null);
  };

  return (
    <div className="space-y-6">
      <header>
        <div className="flex items-center gap-4">
          <h1 className="text-4xl font-bold">{project.name}</h1>
          <Badge variant="outline" className="text-base border-sky-500 text-sky-500">
            {project.status}
          </Badge>
        </div>
        <p className="mt-2 text-lg text-muted-foreground">
          {project.description}
        </p>
      </header>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="tasks">Tarefas</TabsTrigger>
          <TabsTrigger value="attachments">
            <Paperclip className="mr-2 h-4 w-4" />
            Anexos
          </TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                      <CardTitle className="text-sm font-medium">Progresso</CardTitle>
                      <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">{progress}%</div>
                      <p className="text-xs text-muted-foreground">do total concluído</p>
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                      <CardTitle className="text-sm font-medium">Tarefas</CardTitle>
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">{completedTasks} / {totalTasks}</div>
                      <p className="text-xs text-muted-foreground">concluídas</p>
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                      <CardTitle className="text-sm font-medium">Dias restantes</CardTitle>
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">{daysRemaining > 0 ? daysRemaining : 0}</div>
                      <p className="text-xs text-muted-foreground">{daysRemaining >= 0 ? 'para o prazo' : 'atrasado'}</p>
                  </CardContent>
              </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                  <Card>
                      <CardHeader>
                          <CardTitle>Descrição do Projeto</CardTitle>
                      </CardHeader>
                      <CardContent className="text-muted-foreground">
                          {project.fullDescription}
                      </CardContent>
                  </Card>
              </div>
              <div>
                  <Card>
                      <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                              <Users className="h-5 w-5" />
                              Equipe do Projeto
                          </CardTitle>
                      </CardHeader>
                      <CardContent>
                          <div className="space-y-4">
                              {projectMembers.map(member => (
                                  <div key={member.id} className="flex items-center gap-3">
                                      <Avatar>
                                          <AvatarImage src={member.avatarUrl} alt={member.name} />
                                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                      </Avatar>
                                      <div>
                                          <p className="font-medium">{member.name}</p>
                                          <p className="text-sm text-muted-foreground">{member.role}</p>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </CardContent>
                  </Card>
              </div>
          </div>
        </TabsContent>
        <TabsContent value="tasks" className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Lista de Tarefas</h2>
                 <CreateTaskModal initialData={{ projectId: project.id }}>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nova Tarefa
                    </Button>
                </CreateTaskModal>
            </div>
            <TaskList tasks={projectTasks} onUpdateTaskTags={handleAddTaskTag} />
            <TagPalette />
        </TabsContent>
        <TabsContent value="attachments" className="mt-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Upload de Arquivos</CardTitle>
                    <CardDescription>Anexe documentos, imagens e outros arquivos importantes para o projeto.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                        <FileUp className="h-10 w-10 text-muted-foreground mb-4" />
                        <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Arraste e solte</span> os arquivos aqui, ou
                        </p>
                        <Button size="sm">Selecionar Arquivos</Button>
                    </div>
                </CardContent>
            </Card>

            <div>
                <h3 className="text-xl font-semibold mb-4">Arquivos Anexados</h3>
                {attachments.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {attachments.map(attachment => (
                            <AttachmentCard 
                                key={attachment.id} 
                                attachment={attachment}
                                onDelete={() => setAttachmentToDelete(attachment.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-lg">
                        <Paperclip className="h-12 w-12 text-muted-foreground" />
                        <p className="mt-4 font-semibold">Nenhum anexo ainda</p>
                        <p className="text-muted-foreground text-sm">Comece fazendo o upload de um arquivo acima.</p>
                    </div>
                )}
            </div>
        </TabsContent>
        <TabsContent value="feedback" className="mt-6">
          <FeedbackList initialFeedbacks={projectFeedbacks} showProjectName={false} />
        </TabsContent>
        <TabsContent value="settings" className="mt-6">
          <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Informações Gerais</CardTitle>
                    <CardDescription>Atualize os detalhes do seu projeto.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="projectName">Nome do Projeto</Label>
                        <Input id="projectName" defaultValue={project.name} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="projectDescription">Descrição</Label>
                        <Textarea id="projectDescription" defaultValue={project.description} rows={3} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="repoUrl">URL do Repositório</Label>
                        <div className="relative flex items-center">
                            <Link2 className="absolute left-3 h-4 w-4 text-muted-foreground" />
                            <Input id="repoUrl" className="pl-10" defaultValue="https://github.com/exemplo/devminder" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="prodUrl">URL em Produção</Label>
                        <div className="relative flex items-center">
                            <Link2 className="absolute left-3 h-4 w-4 text-muted-foreground" />
                            <Input id="prodUrl" className="pl-10" defaultValue="https://devminder.app" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="projectStatus">Status do Projeto</Label>
                        <Select defaultValue={project.status}>
                            <SelectTrigger id="projectStatus">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                                <SelectItem value="Planejamento">Planejamento</SelectItem>
                                <SelectItem value="Concluído">Concluído</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button>Salvar Alterações</Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Gerenciamento de Membros</CardTitle>
                    <CardDescription>Adicione ou remova membros deste projeto.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2 mb-6">
                        <Input placeholder="Convidar por e-mail..." />
                        <Button>Convidar</Button>
                    </div>
                    <div className="space-y-4">
                        {projectMembers.map((member, index) => (
                            <div key={member.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={member.avatarUrl} alt={member.name} />
                                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium flex items-center gap-2">
                                            {member.name}
                                            {index === 0 && <Badge variant="secondary">Dono</Badge>}
                                        </div>
                                        <p className="text-sm text-muted-foreground">{member.role}</p>
                                    </div>
                                </div>
                                {index !== 0 && (
                                    <Button variant="ghost" size="icon">
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                        <span className="sr-only">Remover membro</span>
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            
            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
                    <CardDescription>Ações perigosas e irreversíveis para o projeto.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg gap-4">
                        <div>
                            <h4 className="font-semibold">Arquivar este projeto</h4>
                            <p className="text-sm text-muted-foreground">Marque o projeto como arquivado e remova-o da lista de projetos ativos.</p>
                        </div>
                        <Button variant="outline" className="w-full md:w-auto shrink-0">Arquivar projeto</Button>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border border-destructive/50 rounded-lg bg-destructive/5 gap-4">
                         <div>
                            <h4 className="font-semibold text-destructive">Apagar este projeto</h4>
                            <p className="text-sm text-muted-foreground">Esta ação não pode ser desfeita. Todo o conteúdo será perdido.</p>
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="w-full md:w-auto shrink-0">Apagar projeto</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta ação não pode ser desfeita. Isso excluirá permanentemente o projeto <strong>{project.name}</strong>, incluindo todas as tarefas, comentários e anexos associados.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="space-y-2 py-2">
                                     <Label htmlFor="delete-confirm" className="text-sm font-semibold">
                                        Para confirmar, por favor, digite <strong className="text-foreground">{project.name}</strong> abaixo:
                                     </Label>
                                     <Input 
                                        id="delete-confirm"
                                        value={deleteConfirmationInput}
                                        onChange={(e) => setDeleteConfirmationInput(e.target.value)}
                                     />
                                </div>
                                <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setDeleteConfirmationInput('')}>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                        disabled={isDeleteButtonDisabled}
                                        onClick={() => {
                                            // Handle deletion here
                                            setDeleteConfirmationInput('');
                                        }}
                                        className="bg-destructive hover:bg-destructive/90"
                                    >
                                        Eu entendo, apagar este projeto
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      <AlertDialog open={!!attachmentToDelete} onOpenChange={(open) => !open && setAttachmentToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Apagar Anexo?</AlertDialogTitle>
                <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Você tem certeza que deseja apagar este anexo?
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAttachment} className="bg-destructive hover:bg-destructive/90">
                    Sim, apagar
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
