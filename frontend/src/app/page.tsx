
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { HardHat, Eye, EyeOff, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.223,0-9.651-3.358-11.303-8H4.897v8.42C8.216,41.428,15.56,44,24,44z"/>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.902,36.63,44,30.85,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
    </svg>
);

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <div className="flex justify-center items-center gap-2 mb-2">
                    <HardHat className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold">DevMinder</h1>
                </div>
                <CardTitle className="text-2xl">Bem-vindo de volta!</CardTitle>
                <CardDescription>Faça login para continuar na plataforma.</CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input id="email" type="email" placeholder="seu@email.com" required />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Senha</Label>
                            <Link href="/forgot-password" passHref>
                                <Button variant="link" className="h-auto p-0 text-sm">Esqueceu a sua senha?</Button>
                            </Link>
                        </div>
                        <div className="relative">
                            <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Sua senha" required />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-0 right-0 h-full px-3"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                <span className="sr-only">{showPassword ? 'Ocultar senha' : 'Mostrar senha'}</span>
                            </Button>
                        </div>
                    </div>
                    <Button type="submit" className="w-full">Entrar</Button>
                </form>

                <div className="relative my-6">
                    <Separator />
                    <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-card px-2 text-sm text-muted-foreground">ou</span>
                </div>

                <div className="space-y-3">
                    <Button variant="outline" className="w-full">
                        <GoogleIcon className="mr-2 h-5 w-5" />
                        Entrar com o Google
                    </Button>
                    <Button variant="outline" className="w-full">
                        <Github className="mr-2 h-5 w-5" />
                        Entrar com o GitHub
                    </Button>
                </div>

                <div className="mt-6 text-center text-sm">
                    Não tem uma conta?{' '}
                    <Link href="/register" passHref>
                       <Button variant="link" className="p-0 h-auto">Crie uma agora</Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
