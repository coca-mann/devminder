
"use client";

import Link from 'next/link';
import { HardHat, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ForgotPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                 <div className="flex justify-center items-center gap-2 mb-2">
                    <HardHat className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold">DevMinder</h1>
                </div>
                <CardTitle className="text-2xl">Recuperar Senha</CardTitle>
                <CardDescription>
                    Sem problemas. Digite o seu endereço de e-mail abaixo e nós enviaremos um link para redefinir a sua senha.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input id="email" type="email" placeholder="seu@email.com" required />
                    </div>
                    <Button type="submit" className="w-full">Enviar Link de Recuperação</Button>
                </form>
                <div className="mt-6 text-center">
                    <Link href="/" passHref>
                       <Button variant="ghost">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar para o Login
                       </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
