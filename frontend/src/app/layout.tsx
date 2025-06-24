import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import MainLayout from '@/components/layout/main-layout';

export const metadata: Metadata = {
  title: 'DevMinder',
  description: 'Gerenciamento de projetos para desenvolvedores.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased')}>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
