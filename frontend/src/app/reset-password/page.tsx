
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { HardHat, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                 <div className="flex justify-center items-center gap-2 mb-2">
                    <HardHat className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold">DevMinder</h1>
                </div>
                <CardTitle className="text-2xl">Crie uma Nova Senha</CardTitle>
                <CardDescription>
                    A sua nova senha deve ser diferente das senhas utilizadas anteriormente.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="new-password">Nova Senha</Label>
                        <div className="relative">
                            <Input id="new-password" type={showPassword ? 'text' : 'password'} placeholder="Sua nova senha" required />
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
                     <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                         <div className="relative">
                            <Input id="confirm-password" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirme sua nova senha" required />
                             <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-0 right-0 h-full px-3"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                <span className="sr-only">{showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}</span>
                            </Button>
                        </div>
                    </div>
                    <Button type="submit" className="w-full">Redefinir Senha</Button>
                </form>
            </CardContent>
        </Card>
    </div>
  );
}
