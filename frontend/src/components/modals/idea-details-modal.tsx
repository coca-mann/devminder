"use client";

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { users, type Idea, tagColors } from '@/lib/data';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Rocket } from 'lucide-react';

interface IdeaDetailsModalProps {
  idea: Idea | null;
  onClose: () => void;
}

export default function IdeaDetailsModal({ idea, onClose }: IdeaDetailsModalProps) {
  if (!idea) {
    return null;
  }

  const author = users.find((user) => user.id === idea.authorId);
  const creationDate = format(new Date(idea.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  const getCategoryBadgeColor = (category: string) => {
    return tagColors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  return (
    <Dialog open={!!idea} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{idea.title}</DialogTitle>
          <div className="flex flex-wrap gap-2 pt-2">
               <Badge variant="outline" className={cn('font-semibold', getCategoryBadgeColor(idea.category))}>
                {idea.category}
              </Badge>
              {idea.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="font-normal">{tag}</Badge>
              ))}
          </div>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <p className="text-muted-foreground whitespace-pre-wrap">{idea.description}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4">
            <Avatar className="h-6 w-6">
                <AvatarImage src={author?.avatarUrl} alt={author?.name} />
                <AvatarFallback>{author?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>Criado por <strong>{author?.name}</strong> em {creationDate}</span>
          </div>
        </div>
        <DialogFooter>
          <Button>
            <Rocket className="mr-2 h-4 w-4" />
            Promover para Projeto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
