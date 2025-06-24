
"use client";

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { users, activities } from "@/lib/data";
import { Camera, Mail, CalendarDays, Briefcase, User, MessageSquare, CheckCircle } from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';


export default function ProfilePage() {
    const user = users[0];
    const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');

    const isDeleteButtonDisabled = deleteConfirmationInput !== 'senha123'; // Placeholder for actual password check

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna da Esquerda */}
            <div className="lg:col-span-1">
                <Card>
                    <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="relative group mb-4">
                            <Avatar className="h-32 w-32">
                                <AvatarImage src={user.avatarUrl} alt={user.name} />
                                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <Camera className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold">{user.name}</h1>
                        <p className="text-muted-foreground">{user.role}</p>
                        <p className="mt-4 text-sm text-muted-foreground">{user.bio}</p>

                        <div className="mt-6 w-full text-left space-y-3">
                             <div className="flex items-center gap-3 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{user.email}</span>
                            </div>
                             <div className="flex items-center gap-3 text-sm">
                                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                <span>Membro desde {format(new Date(user.joinDate), "MMMM 'de' yyyy", { locale: ptBR })}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Coluna da Direita */}
            <div className="lg:col-span-2">
                <Tabs defaultValue="edit-profile">
                    <TabsList>
                        <TabsTrigger value="edit-profile">Editar Perfil</TabsTrigger>
                        <TabsTrigger value="activity">Atividade</TabsTrigger>
                        <TabsTrigger value="security">Segurança</TabsTrigger>
                    </TabsList>
                    <TabsContent value="edit-profile">
                        <Card>
                            <CardHeader>
                                <CardTitle>Editar Informações</CardTitle>
                                <CardDescription>Atualize seus dados pessoais e de perfil.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nome</Label>
                                        <Input id="name" defaultValue={user.name} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="nickname">Apelido</Label>
                                        <Input id="nickname" placeholder="Seu apelido" />
                                    </div>
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="job">Cargo</Label>
                                    <Input id="job" defaultValue={user.role} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bio">Biografia</Label>
                                    <Textarea id="bio" defaultValue={user.bio} rows={4} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="timezone">Fuso Horário</Label>
                                    <Select>
                                        <SelectTrigger id="timezone">
                                            <SelectValue placeholder="Selecione seu fuso horário" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="gmt-3">(GMT-03:00) Brasília</SelectItem>
                                            <SelectItem value="gmt-4">(GMT-04:00) Manaus</SelectItem>
                                            <SelectItem value="gmt-5">(GMT-05:00) Acre</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>Salvar Alterações</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="activity">
                        <div className="space-y-6">
                             <div className="grid gap-6 sm:grid-cols-3">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                        <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
                                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">3</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                        <CardTitle className="text-sm font-medium">Tarefas Concluídas</CardTitle>
                                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">25</div>
                                        <p className="text-xs text-muted-foreground">neste mês</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                        <CardTitle className="text-sm font-medium">Comentários</CardTitle>
                                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">112</div>
                                    </CardContent>
                                </Card>
                            </div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Atividades Recentes</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     {activities.slice(0, 4).map((activity) => (
                                        <div key={activity.id} className="flex items-start gap-4">
                                            <div className="bg-muted rounded-full p-2">
                                                <User className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm" dangerouslySetInnerHTML={{ __html: activity.content }} />
                                                <p className="text-xs text-muted-foreground">
                                                     {format(new Date(activity.timestamp), "dd/MM/yyyy 'às' HH:mm")}
                                                </p>
                                            </div>
                                        </div>
                                     ))}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                    <TabsContent value="security">
                         <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Alterar Senha</CardTitle>
                                    <CardDescription>Para sua segurança, escolha uma senha forte.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="current-password">Senha Atual</Label>
                                        <Input id="current-password" type="password" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="new-password">Nova Senha</Label>
                                        <Input id="new-password" type="password" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                                        <Input id="confirm-password" type="password" />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button>Atualizar Senha</Button>
                                </CardFooter>
                            </Card>
                            <Card className="border-destructive">
                                <CardHeader>
                                    <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
                                    <CardDescription>Ações permanentes e irreversíveis.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                     <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive">Apagar Minha Conta</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta e removerá seus dados de nossos servidores.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <div className="space-y-2 py-2">
                                                <Label htmlFor="delete-confirm-password">
                                                    Para confirmar, por favor, digite sua senha atual abaixo:
                                                </Label>
                                                <Input 
                                                    id="delete-confirm-password"
                                                    type="password"
                                                    value={deleteConfirmationInput}
                                                    onChange={(e) => setDeleteConfirmationInput(e.target.value)}
                                                />
                                            </div>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel onClick={() => setDeleteConfirmationInput('')}>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction
                                                    disabled={isDeleteButtonDisabled}
                                                    onClick={() => {
                                                        console.log("Conta apagada!");
                                                        setDeleteConfirmationInput('');
                                                    }}
                                                    className="bg-destructive hover:bg-destructive/90"
                                                >
                                                    Eu entendo, apagar minha conta permanentemente
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </CardContent>
                            </Card>
                         </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
