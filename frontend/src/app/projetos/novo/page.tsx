
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  FolderPlus,
  Link2,
} from "lucide-react";

import { allTags, tagColors } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const projectSchema = z
  .object({
    name: z.string().min(3, "O nome do projeto deve ter pelo menos 3 caracteres."),
    description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres."),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    tags: z.array(z.string()).optional(),
    budget: z.coerce.number().optional(),
    repoUrl: z.string().url("Por favor, insira uma URL válida.").optional().or(z.literal('')),
    prodUrl: z.string().url("Por favor, insira uma URL válida.").optional().or(z.literal('')),
  })
  .refine((data) => {
    if (data.startDate && data.endDate) {
      return data.endDate >= data.startDate;
    }
    return true;
  }, {
    message: "A data de término não pode ser anterior à data de início.",
    path: ["endDate"],
  });

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function CreateProjectPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      tags: [],
      repoUrl: "",
      prodUrl: "",
    },
  });

  const handleNextStep = async () => {
    const isValid = await form.trigger(["name", "description"]);
    if (isValid) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  function onSubmit(data: ProjectFormValues) {
    console.log(data);
    toast({
      title: "Projeto Criado!",
      description: `O projeto "${data.name}" foi criado com sucesso.`,
    });
    router.push("/projetos");
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Vamos começar um novo projeto
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Preencha os detalhes abaixo para dar o pontapé inicial na sua próxima
          grande ideia.
        </p>
      </div>

      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>
                Passo {step} de 2: {step === 1 ? "Definição" : "Detalhes"}
              </CardTitle>
              <Progress value={step === 1 ? 50 : 100} className="mt-2" />
            </CardHeader>

            <CardContent className="space-y-6">
              {step === 1 && (
                <>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Projeto</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: App de E-commerce"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva o objetivo principal, os recursos e o público-alvo do seu projeto."
                            rows={6}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {step === 2 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Data de Início</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP", { locale: ptBR })
                                  ) : (
                                    <span>Escolha uma data</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Data de Término Prevista</FormLabel>
                           <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP", { locale: ptBR })
                                  ) : (
                                    <span>Escolha uma data</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                   <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                          <Controller
                            control={form.control}
                            name="tags"
                            render={({ field: { onChange, value = [] } }) => (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className="w-full justify-between font-normal h-auto"
                                  >
                                    <div className="flex gap-1 flex-wrap">
                                      {value.length > 0 ? (
                                        value.map(tag => (
                                          <Badge key={tag} variant="secondary" className={cn(tagColors[tag] || '')}>
                                            {tag}
                                          </Badge>
                                        ))
                                      ) : (
                                        "Selecione as tags..."
                                      )}
                                    </div>
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                  <Command>
                                    <CommandInput placeholder="Buscar tags..." />
                                    <CommandList>
                                      <CommandEmpty>Nenhuma tag encontrada.</CommandEmpty>
                                      <CommandGroup>
                                        {allTags.map((tag) => (
                                          <CommandItem
                                            key={tag}
                                            onSelect={() => {
                                              const newValue = value.includes(tag)
                                                ? value.filter((t) => t !== tag)
                                                : [...value, tag];
                                              onChange(newValue);
                                            }}
                                          >
                                            <Check
                                              className={cn(
                                                "mr-2 h-4 w-4",
                                                value.includes(tag) ? "opacity-100" : "opacity-0"
                                              )}
                                            />
                                            {tag}
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            )}
                          />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Orçamento (Opcional)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="R$ 5.000,00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="repoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL do Repositório</FormLabel>
                          <div className="relative flex items-center">
                            <Link2 className="absolute left-3 h-4 w-4 text-muted-foreground" />
                            <FormControl>
                              <Input className="pl-10" placeholder="https://github.com/exemplo/meu-projeto" {...field} />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="prodUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL em Produção</FormLabel>
                          <div className="relative flex items-center">
                            <Link2 className="absolute left-3 h-4 w-4 text-muted-foreground" />
                            <FormControl>
                              <Input className="pl-10" placeholder="https://meu-projeto.com" {...field} />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}
            </CardContent>

            <CardFooter className="justify-end gap-2 pt-6">
              {step === 1 ? (
                <Button type="button" onClick={handleNextStep}>
                  Próximo Passo
                </Button>
              ) : (
                <>
                  <Button type="button" variant="outline" onClick={handlePrevStep}>
                    Voltar
                  </Button>
                  <Button type="submit">Criar Projeto!</Button>
                </>
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
