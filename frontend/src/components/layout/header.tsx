
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';
import { Bell, HardHat, Menu, MessageSquare, CheckCircle, FolderPlus } from 'lucide-react';
import { NavLink } from '../nav-link';
import { users, notifications as sampleNotifications, type Notification } from '@/lib/data';
import { ScrollArea } from '../ui/scroll-area';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/projects', label: 'Projetos' },
  { href: '/ideas', label: 'Ideias' },
  { href: '/feedback', label: 'Feedback' },
];

const getNotificationIcon = (iconName: Notification['icon']) => {
    const iconClass = "h-5 w-5 text-muted-foreground";
    switch (iconName) {
        case 'comment':
            return <MessageSquare className={iconClass} />;
        case 'task-completed':
            return <CheckCircle className="h-5 w-5 text-green-500" />;
        case 'project-created':
            return <FolderPlus className="h-5 w-5 text-blue-500" />;
        default:
            return <Bell className={iconClass} />;
    }
}

export default function Header() {
  const user = users[0];
  const hasUnreadNotifications = sampleNotifications.some(n => !n.read);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden mr-4">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px]">
             <div className="flex flex-col gap-4 py-6">
              <Link href="/dashboard" className="mb-4 flex items-center space-x-2 px-4">
                <HardHat className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">DevMinder</span>
              </Link>
              <nav className="flex flex-col gap-1 px-2">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <NavLink href={link.href} className="px-2 py-2 rounded-md">
                      {link.label}
                    </NavLink>
                  </SheetClose>
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>

        <Link href="/dashboard" className="mr-8 flex items-center space-x-2">
          <HardHat className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg hidden sm:inline-block">DevMinder</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {hasUnreadNotifications && (
                  <span className="absolute top-2 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                )}
                 <span className="sr-only">Notificações</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-96 p-0" align="end">
                <div className="flex justify-between items-center p-3 border-b">
                    <p className="font-semibold">Notificações</p>
                    <Button variant="link" size="sm" className="p-0 h-auto text-sm text-primary">
                      Marcar todas como lidas
                    </Button>
                </div>
                <ScrollArea className="h-[400px]">
                    {sampleNotifications.length > 0 ? (
                        <div className="divide-y">
                        {sampleNotifications.map((notif) => (
                            <Link key={notif.id} href={notif.link} className="block hover:bg-muted/50 transition-colors">
                                <div className="flex items-start gap-4 p-4">
                                     {!notif.read && <div className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />}
                                     {notif.read && <div className="mt-1.5 h-2 w-2 rounded-full bg-transparent flex-shrink-0" />}
                                    
                                    <div className="flex-shrink-0">
                                        {getNotificationIcon(notif.icon)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm" dangerouslySetInnerHTML={{ __html: notif.text }} />
                                        <p className="text-xs text-muted-foreground mt-1">{notif.timestamp}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                        </div>
                    ) : (
                        <div className="text-center text-sm text-muted-foreground py-16 px-4">
                            <Bell className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
                            <p className="font-semibold">Tudo em dia!</p>
                            <p className="text-xs">Novas notificações aparecerão aqui.</p>
                        </div>
                    )}
                </ScrollArea>
                 <div className="p-2 border-t">
                    <Button variant="ghost" className="w-full justify-center text-sm text-primary" asChild>
                        <Link href="#">Ver todas as notificações</Link>
                    </Button>
                </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="user avatar" />
                  <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">Meu Perfil</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
