
"use client";

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { users, tagColors } from '@/lib/data';
import { cn } from '@/lib/utils';
import type { Task } from '@/lib/data';
import { format } from 'date-fns';
import { ChevronRight } from 'lucide-react';
import TaskDetails from './task-details';

interface TaskListItemProps {
  task: Task;
  allTasks: Task[];
  onUpdateTaskTags: (taskId: string, tag: string) => void;
  draggedOverTaskId: string | null;
  setDraggedOverTaskId: (id: string | null) => void;
  onTaskSelect: (task: Task) => void;
  selectedTaskId: string | null;
}

function TaskListItem({ task, allTasks, onUpdateTaskTags, draggedOverTaskId, setDraggedOverTaskId, onTaskSelect, selectedTaskId }: TaskListItemProps) {
  const subtasks = allTasks.filter(t => t.parentId === task.id);
  const hasSubtasks = subtasks.length > 0;
  const assignee = users.find(u => u.id === task.assigneeId);
  const isDraggedOver = draggedOverTaskId === task.id;
  const isSelected = selectedTaskId === task.id;

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const tag = e.dataTransfer.getData('text/plain');
    if (tag && task.id) {
      onUpdateTaskTags(task.id, tag);
    }
    setDraggedOverTaskId(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setDraggedOverTaskId(task.id);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
    setDraggedOverTaskId(null);
  }

  return (
     <Card 
      onClick={() => onTaskSelect(task)}
      className={cn(
        "transition-all rounded-lg cursor-pointer",
        isDraggedOver && "border-primary border-2 border-dashed bg-primary/10",
        isSelected && "ring-2 ring-primary bg-primary/5"
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      <AccordionItem value={task.id} className="border-b-0">
        <div className="flex items-center p-2 group">
          <Checkbox id={`task-${task.id}`} checked={task.status === 'Concluído'} className="mr-3" />
          <AccordionTrigger className="p-0 hover:no-underline flex-1 text-left">
            <div className="flex items-center w-full">
              <div className="flex items-center gap-3 flex-1">
                <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 text-muted-foreground group-data-[state=open]:rotate-90" />
                <div className="flex flex-col items-start gap-1">
                  <label htmlFor={`task-${task.id}`} className="font-medium text-left cursor-pointer">{task.title}</label>
                  <div className="flex items-center gap-1">
                    {task.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className={cn('text-xs', tagColors[tag])}>{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground ml-auto pl-4">
                {assignee && (
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={assignee.avatarUrl} alt={assignee.name} />
                    <AvatarFallback className="text-xs">{assignee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                )}
                {task.dueDate && <span>{format(new Date(task.dueDate), "yyyy-MM-dd")}</span>}
              </div>
            </div>
          </AccordionTrigger>
        </div>
        <AccordionContent>
          {hasSubtasks && (
            <div className="pl-6 space-y-2">
              <Accordion type="multiple" className="space-y-2">
                {subtasks.map(subtask => (
                  <TaskListItem 
                    key={subtask.id}
                    task={subtask}
                    allTasks={allTasks}
                    onUpdateTaskTags={onUpdateTaskTags}
                    draggedOverTaskId={draggedOverTaskId}
                    setDraggedOverTaskId={setDraggedOverTaskId}
                    onTaskSelect={onTaskSelect}
                    selectedTaskId={selectedTaskId}
                  />
                ))}
              </Accordion>
            </div>
          )}
          <TaskDetails task={task} />
        </AccordionContent>
      </AccordionItem>
    </Card>
  );
}


interface TaskListProps {
  tasks: Task[];
  onUpdateTaskTags: (taskId: string, tag: string) => void;
  onTaskSelect: (task: Task) => void;
  selectedTaskId: string | null;
}

export default function TaskList({ tasks, onUpdateTaskTags, onTaskSelect, selectedTaskId }: TaskListProps) {
  const parentTasks = tasks.filter(task => !task.parentId);
  const [draggedOverTaskId, setDraggedOverTaskId] = useState<string | null>(null);

  return (
    <Accordion type="multiple" className="space-y-2">
      {parentTasks.map((task) => (
        <TaskListItem
          key={task.id}
          task={task}
          allTasks={tasks}
          onUpdateTaskTags={onUpdateTaskTags}
          draggedOverTaskId={draggedOverTaskId}
          setDraggedOverTaskId={setDraggedOverTaskId}
          onTaskSelect={onTaskSelect}
          selectedTaskId={selectedTaskId}
        />
      ))}
    </Accordion>
  );
}
