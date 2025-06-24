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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ideas, users, type Idea, tagColors } from '@/lib/data';
import { cn } from '@/lib/utils';
import IdeaDetailsModal from '@/components/modals/idea-details-modal';
import { Lightbulb, Rocket } from 'lucide-react';
import { format } from 'date-fns';

export default function IdeiasPage() {
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);

  const getCategoryBadgeColor = (category: string) => {
    return tagColors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg flex items-center justify-center">
                <Lightbulb className="h-6 w-6 text-primary" />
            </div>
            <div>
                <h1 className="text-3xl font-bold">Ideias</h1>
                <p className="text-muted-foreground">
                    Explore e gerencie ideias inovadoras para futuros projetos.
                </p>
            </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ideas.map((idea) => {
            const author = users.find((user) => user.id === idea.authorId);
            return (
              <Card 
                key={idea.id} 
                className="flex flex-col hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => setSelectedIdea(idea)}
              >
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">{idea.title}</CardTitle>
                    <Badge variant="outline" className={cn('font-semibold', getCategoryBadgeColor(idea.category))}>
                      {idea.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                   <CardDescription className="line-clamp-3 min-h-[60px]">
                      {idea.description}
                   </CardDescription>
                    <div className="flex flex-wrap gap-2">
                        {idea.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="font-normal">{tag}</Badge>
                        ))}
                    </div>
                     {author && (
                        <div className="flex items-center gap-3 pt-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={author?.avatarUrl} alt={author?.name} />
                                <AvatarFallback>{author?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-medium">{author?.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {format(new Date(idea.createdAt), "dd/MM/yyyy")}
                                </p>
                            </div>
                        </div>
                     )}
                </CardContent>
                <CardFooter>
                    <Button className="w-full">
                        <Rocket className="mr-2" />
                        Promover para Projeto
                    </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      <IdeaDetailsModal 
        idea={selectedIdea}
        onClose={() => setSelectedIdea(null)}
      />
    </>
  );
}
