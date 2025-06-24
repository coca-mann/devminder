import { Button } from '@/components/ui/button';
import { Pencil, Paperclip } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { users } from '@/lib/data';
import type { Task } from '@/lib/data';
import EditTaskModal from '../modals/edit-task-modal';
import { Textarea } from '@/components/ui/textarea';

interface TaskDetailsProps {
    task: Task;
}

export default function TaskDetails({ task }: TaskDetailsProps) {
    const loggedInUser = users[0];

    return (
        <div className="pb-4 pl-12 pr-4 space-y-6">
            <div className="flex justify-between items-center pt-4">
                <h3 className="text-lg font-semibold">Detalhes da Tarefa</h3>
                <EditTaskModal task={task}>
                    <Button variant="outline" size="sm">
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                    </Button>
                </EditTaskModal>
            </div>
            
            <div className="space-y-6 text-sm">
                <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground"></span>
                        Descrição
                    </h4>
                    <p className="text-foreground pl-4">{task.description}</p>
                </div>

                {task.attachments && task.attachments.length > 0 && (
                    <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2 text-muted-foreground">
                             <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground"></span>
                            Anexos
                        </h4>
                        <div className="pl-4 space-y-2">
                            {task.attachments.map(attachment => (
                                <a key={attachment.id} href={attachment.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                                    <Paperclip className="h-4 w-4" />
                                    <span>{attachment.fileName}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
                
                {task.comments && task.comments.length > 0 && (
                     <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2 text-muted-foreground">
                            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground"></span>
                            Comentários
                        </h4>
                        <div className="pl-4 space-y-4">
                            {task.comments.map(comment => {
                                const author = users.find(u => u.id === comment.userId);
                                return (
                                    <div key={comment.id} className="flex items-start gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={author?.avatarUrl} alt={author?.name}/>
                                            <AvatarFallback>{author?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-foreground">{author?.name}</span>
                                                <span className="text-xs text-muted-foreground">{new Date(comment.timestamp).toLocaleString()}</span>
                                            </div>
                                            <p className="text-muted-foreground mt-1">{comment.content}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                <div>
                     <h4 className="font-semibold mb-2">Adicionar Comentário</h4>
                     <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={loggedInUser?.avatarUrl} alt={loggedInUser.name} />
                            <AvatarFallback>{loggedInUser?.name.slice(0,2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                            <Textarea placeholder="Adicionar um comentário..." />
                            <div className="flex items-center gap-2">
                                <Button>Comentar</Button>
                                <Button variant="ghost" size="icon">
                                    <Paperclip className="h-4 w-4" />
                                    <span className="sr-only">Anexar arquivo</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
