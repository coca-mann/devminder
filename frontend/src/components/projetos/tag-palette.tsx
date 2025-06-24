
"use client";

import { useState } from 'react';
import { Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { allTags, tagColors } from '@/lib/data';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function TagPalette() {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, tag: string) => {
    e.dataTransfer.setData('text/plain', tag);
  };

  return (
    <div className="hidden md:flex">
      <TooltipProvider>
        <div
          className="fixed top-1/2 right-0 -translate-y-1/2 z-20 flex items-start"
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          {/* Tags container */}
          <div className={cn(
            "mr-4 transition-all duration-300 ease-in-out",
            isExpanded ? 'w-32' : 'w-0'
          )}>
            <div className="space-y-2">
              {allTags.map((tag, index) => (
                <div
                  key={tag}
                  draggable
                  onDragStart={(e) => handleDragStart(e, tag)}
                  className={cn(
                    "cursor-grab transition-all duration-300 ease-out",
                    isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
                  )}
                  style={{ transitionDelay: isExpanded ? `${index * 40}ms` : '0ms' }}
                >
                  <Badge variant="outline" className={cn('w-full justify-center py-1', tagColors[tag])}>
                    {tag}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
          
          {/* Trigger button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="bg-card p-3 rounded-l-lg border-l border-t border-b shadow-lg cursor-pointer flex items-center justify-center -translate-x-px">
                <Tag className="h-6 w-6" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="left" hidden={isExpanded}>
              <p>Arraste as tags para as tarefas</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
}
