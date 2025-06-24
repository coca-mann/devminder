
"use client";

import Link from 'next/link';
import { HardHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
                 <div className="flex justify-center items-center gap-2 mb-2">
                    <HardHat className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold">DevMinder</h1>
                </div>
                <CardTitle className="text-2xl">Crie a sua conta</CardTitle>
                <CardDescription>É rápido e fácil. Comece a gerenciar seus projetos hoje mesmo.</CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="first-name">Nome</Label>
                            <Input id="first-name" placeholder="Seu nome" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last-name">Apelido</Label>
                            <Input id="last-name" placeholder="Seu apelido" required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input id="email" type="email" placeholder="seu@email.com" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input id="password" type="password" placeholder="Crie uma senha forte" required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirmar Senha</Label>
                        <Input id="confirm-password" type="password" placeholder="Confirme sua senha" required />
                    </div>
                    <Button type="submit" className="w-full">Criar Conta</Button>
                </form>
                <div className="mt-6 text-center text-sm">
                    Já tem uma conta?{' '}
                    <Link href="/" passHref>
                        <Button variant="link" className="p-0 h-auto">Faça o login</Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
