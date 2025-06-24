"use client";

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { projects, users, type Feedback } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Wrench, Bug, Lightbulb, AlertCircle, ChevronRight, MessageSquare } from 'lucide-react';
import CreateTaskModal from '@/components/modals/create-task-modal';
import { format } from 'date-fns';

interface FeedbackListProps {
  initialFeedbacks: Feedback[];
  showProjectName?: boolean;
}

export default function FeedbackList({ initialFeedbacks, showProjectName = true }: FeedbackListProps) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(initialFeedbacks);

  const handleTaskCreated = (feedbackId: string) => {
    setFeedbacks(currentFeedbacks =>
      currentFeedbacks.map(fb =>
        fb.id === feedbackId ? { ...fb, status: 'Planejado' } : fb
      )
    );
  };

  const getTypeIcon = (type: Feedback['type']) => {
    switch (type) {
      case 'Bug':
        return <Bug className="h-5 w-5 text-red-500 mt-1" />;
      case 'Melhoria':
        return <AlertCircle className="h-5 w-5 text-yellow-500 mt-1" />;
      case 'Feature':
         return <Lightbulb className="h-5 w-5 text-sky-500 mt-1" />;
      default:
        return null;
    }
  };
  
  const getPriorityColor = (priority: Feedback['priority']) => {
    switch (priority) {
      case 'Alta':
        return 'text-red-500';
      case 'Média':
        return 'text-yellow-600';
      case 'Baixa':
        return 'text-green-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTypeBadgeColor = (type: Feedback['type']) => {
    switch (type) {
      case 'Bug':
        return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-transparent hover:bg-red-200';
      case 'Melhoria':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-transparent hover:bg-blue-200';
      case 'Feature':
        return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-transparent hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-transparent hover:bg-gray-200';
    }
  };

  const getStatusBadgeColor = (status: Feedback['status']) => {
     switch (status) {
      case 'Recebido':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-transparent hover:bg-gray-200';
      case 'Em Análise':
         return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border-transparent hover:bg-yellow-200';
      case 'Em Desenvolvimento':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-transparent hover:bg-purple-200';
       case 'Resolvido':
        return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-transparent hover:bg-green-200';
       case 'Planejado':
        return 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300 border-transparent hover:bg-sky-200';
      default:
        return 'border-gray-500';
    }
  }
  
  if (feedbacks.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-lg">
            <MessageSquare className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 font-semibold">Nenhum feedback para este projeto ainda.</p>
            <p className="text-muted-foreground text-sm">Quando um feedback for adicionado, ele aparecerá aqui.</p>
        </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
        {feedbacks.map((feedback) => {
          const project = projects.find((p) => p.id === feedback.projectId);
          const author = users.find(u => u.id === feedback.authorId);

          return (
            <Card key={feedback.id}>
              <AccordionItem value={feedback.id} className="border-b-0">
                  <div className="p-4 flex justify-between items-start gap-4">
                      <AccordionTrigger className="flex-1 text-left p-0 hover:no-underline group" asChild>
                        <div className="flex items-start gap-3 cursor-pointer">
                          {getTypeIcon(feedback.type)}
                          <div className="flex-1 space-y-1.5">
                            <p className="font-semibold flex items-center gap-2 group-hover:text-primary transition-colors">
                              {feedback.summary}
                              <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
                            </p>
                            <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                {showProjectName && project && (
                                  <>
                                    <span>Projeto: <strong>{project?.name}</strong></span>
                                    <span className="hidden sm:inline">•</span>
                                  </>
                                )}
                                <span>{format(new Date(feedback.createdAt), "dd/MM/yyyy")}</span>
                                <span className="hidden sm:inline">•</span>
                                <span className={cn('font-medium', getPriorityColor(feedback.priority))}>{feedback.priority}</span>
                            </div>
                            <div className="flex items-center gap-2 pt-1">
                                <Badge variant="secondary" className={cn(getTypeBadgeColor(feedback.type))}>
                                {feedback.type}
                                </Badge>
                                <Badge variant="secondary" className={cn(getStatusBadgeColor(feedback.status))}>
                                {feedback.status}
                                </Badge>
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <div onClick={(e) => e.stopPropagation()}>
                          <CreateTaskModal
                              initialData={{
                                  title: feedback.summary,
                                  description: feedback.description,
                                  projectId: feedback.projectId,
                              }}
                              onTaskCreated={() => handleTaskCreated(feedback.id)}
                          >
                              <Button variant="outline" size="sm" className="shrink-0">
                                  <Wrench className="mr-2 h-4 w-4" />
                                  Criar Tarefa
                              </Button>
                          </CreateTaskModal>
                      </div>
                  </div>
                <AccordionContent className="pb-4 px-4 pl-12 space-y-4">
                   <p className="text-muted-foreground whitespace-pre-wrap">{feedback.description}</p>
                   {author && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                          <Avatar className="h-6 w-6">
                              <AvatarImage src={author?.avatarUrl} alt={author?.name} />
                              <AvatarFallback>{author?.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>Enviado por <strong>{author?.name}</strong></span>
                      </div>
                   )}
                </AccordionContent>
              </AccordionItem>
            </Card>
          );
        })}
    </Accordion>
  );
}
