"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, FolderPlus, FilePlus } from 'lucide-react';
import CreateTaskModal from '../modals/create-task-modal';
import CreateIdeaModal from '../modals/create-idea-modal';
import { cn } from '@/lib/utils';

export default function Fab() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const fabRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fabRef.current && !fabRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (pathname === '/ideias') {
    return (
      <CreateIdeaModal>
         <Button size="icon" className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50">
            <Plus className="h-7 w-7" />
            <span className="sr-only">Criar Nova Ideia</span>
        </Button>
      </CreateIdeaModal>
    );
  }

  // Reversed order for visual stacking
  const speedDialOptions = [
    {
      label: 'Nova Tarefa',
      icon: FilePlus,
      action: 'task_modal',
      delay: 'delay-75'
    },
    {
      label: 'Novo Projeto',
      icon: FolderPlus,
      action: '/projetos/novo',
      delay: 'delay-150'
    }
  ];

  return (
    <div ref={fabRef} className="fixed bottom-6 right-6 z-50">
        <div className="relative flex flex-col items-center gap-4">
            
            {/* Speed Dial Options */}
            <div className={cn(
                "flex flex-col-reverse items-center gap-4 transition-all duration-300 ease-in-out",
                isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            )}>
              {speedDialOptions.map((option) => (
                    <div 
                        key={option.label}
                        className={cn(
                            "flex items-center gap-3 w-max",
                             `transition-all duration-300 ease-in-out ${option.delay}`,
                        )}
                    >
                        <span className="bg-card text-card-foreground text-sm font-medium py-1 px-3 rounded-md shadow-sm">
                            {option.label}
                        </span>
                        {option.action === 'task_modal' ? (
                            <CreateTaskModal onTaskCreated={() => setIsOpen(false)}>
                                <Button size="icon" className="rounded-full shadow-lg h-12 w-12" onClick={() => setIsOpen(false)}>
                                    <option.icon className="h-6 w-6" />
                                </Button>
                            </CreateTaskModal>
                        ) : (
                            <Button asChild size="icon" className="rounded-full shadow-lg h-12 w-12">
                                <Link href={option.action}>
                                    <option.icon className="h-6 w-6" />
                                </Link>
                            </Button>
                        )}
                    </div>
                ))}
            </div>
            
            {/* Main FAB button */}
             <Button
              size="icon"
              className="h-14 w-14 rounded-full shadow-lg z-10"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
            >
              <Plus
                className={cn(
                  'h-7 w-7 transition-transform duration-300 ease-in-out',
                  isOpen && 'rotate-45'
                )}
              />
              <span className="sr-only">{isOpen ? 'Fechar menu' : 'Criar Novo'}</span>
            </Button>
        </div>
    </div>
  );
}
