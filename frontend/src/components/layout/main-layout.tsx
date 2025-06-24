
"use client";

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/header';
import Fab from '@/components/layout/fab';
import { Toaster } from "@/components/ui/toaster";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const authRoutes = ['/', '/register', '/forgot-password', '/reset-password'];
  const isAuthRoute = authRoutes.includes(pathname);

  if (isAuthRoute) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-foreground">
        {children}
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-foreground">
      <Header />
      <main className="flex-1 container mx-auto py-6 sm:py-8 lg:py-10">
        {children}
      </main>
      <Fab />
      <Toaster />
    </div>
  );
}
