
export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: string;
  bio: string;
  joinDate: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  status: 'Planejamento' | 'Em Andamento' | 'Concluído';
  team: string[];
  dueDate?: string;
  attachments?: Attachment[];
};

export type Comment = {
    id: string;
    userId: string;
    content: string;
    timestamp: string;
}

export type Attachment = {
    id: string;
    fileName: string;
    url: string;
    timestamp: string;
    size?: string;
    uploaderId?: string;
    fileType?: 'image' | 'pdf' | 'document' | 'archive' | 'other';
}

export type Task = {
  id: string;
  title: string;
  description: string;
  status: 'A Fazer' | 'Em Andamento' | 'Em Revisão' | 'Concluído';
  priority: 'Baixa' | 'Média' | 'Alta';
  dueDate?: string;
  assigneeId?: string;
  projectId: string;
  tags: string[];
  parentId?: string;
  comments?: Comment[];
  attachments?: Attachment[];
};

export type Activity = {
  id: string;
  userId: string;
  content: string;
  targetLink?: string;
  timestamp: string;
};

export type Idea = {
  id: string;
  title: string;
  description: string;
  authorId: string;
  createdAt: string;
  category: string;
  tags: string[];
};

export type Feedback = {
  id: string;
  summary: string;
  description: string;
  projectId: string;
  type: 'Bug' | 'Melhoria' | 'Feature';
  priority: 'Alta' | 'Média' | 'Baixa';
  status: 'Recebido' | 'Em Análise' | 'Em Desenvolvimento' | 'Resolvido' | 'Planejado';
  authorId: string;
  createdAt: string;
};

export type Notification = {
    id: string;
    text: string;
    link: string;
    timestamp: string;
    read: boolean;
    icon: 'comment' | 'task-completed' | 'project-created';
};

export const tagColors: { [key: string]: string } = {
  'Bug': 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-500/20',
  'Feature': 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-500/20',
  'Refactor': 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-500/20',
  'Docs': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-500/20',
  'DevOps': 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 border-orange-500/20',
  'Design': 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300 border-pink-500/20',
  'Backend': 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300 border-sky-500/20',
  'Frontend': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-500/20',
  'Urgente': 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-500/20',
  'Melhoria': 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300 border-sky-500/20',
  'Integração': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-500/20',
};

export const allTags = Object.keys(tagColors);

export const users: User[] = [
  { id: 'user-1', name: 'João Silva', email: 'joao.silva@devminder.com', avatarUrl: 'https://placehold.co/100x100/E2D5D5/502222.png', role: 'Desenvolvedor Backend', bio: 'Apaixonado por código limpo, arquitetura de software e café. Contribuindo para um mundo digital mais robusto e escalável.', joinDate: '2023-01-15T00:00:00.000Z' },
  { id: 'user-2', name: 'Maria Santos', email: 'maria.santos@devminder.com', avatarUrl: 'https://placehold.co/100x100/D5E2D8/22502B.png', role: 'Desenvolvedora Frontend', bio: 'Criando interfaces bonitas e funcionais que as pessoas amam usar.', joinDate: '2023-03-20T00:00:00.000Z' },
  { id: 'user-3', name: 'Pedro Costa', email: 'pedro.costa@devminder.com', avatarUrl: 'https://placehold.co/100x100/D5D8E2/222B50.png', role: 'UI/UX Designer', bio: 'Focado em resolver problemas complexos com design centrado no usuário.', joinDate: '2023-02-10T00:00:00.000Z' },
  { id: 'user-4', name: 'Ana Lima', email: 'ana.lima@devminder.com', avatarUrl: 'https://placehold.co/100x100/E2D5DF/502246.png', role: 'Engenheira de QA', bio: 'Garantindo que a qualidade seja parte de cada etapa do desenvolvimento.', joinDate: '2023-05-01T00:00:00.000Z' },
  { id: 'user-5', name: 'Carlos Oliveira', email: 'carlos.oliveira@devminder.com', avatarUrl: 'https://placehold.co/100x100/E2E0D5/504A22.png', role: 'Desenvolvedor Full-Stack', bio: 'Transitando entre o frontend e o backend para construir aplicações completas.', joinDate: '2022-11-25T00:00:00.000Z' },
  { id: 'user-6', name: 'Lucia Ferreira', email: 'lucia.ferreira@devminder.com', avatarUrl: 'https://placehold.co/100x100/D5E2E2/225050.png', role: 'Engenheira de QA', bio: 'Encontrando bugs antes que eles encontrem você.', joinDate: '2023-07-30T00:00:00.000Z' },
];

export const projects: Project[] = [
  {
    id: 'proj-1',
    name: 'E-commerce App',
    description: 'Desenvolvimento de uma aplicação completa de e-commerce com React, Node.js e PostgreSQL.',
    fullDescription: 'Este projeto visa criar uma plataforma de e-commerce moderna e escalável. A aplicação incluirá funcionalidades como catálogo de produtos, carrinho de compras, sistema de pagamento, painel administrativo e muito mais. Utilizamos as melhores práticas de desenvolvimento e tecnologias modernas para garantir performance e segurança.',
    status: 'Em Andamento',
    team: ['user-1', 'user-2', 'user-3', 'user-4'],
    dueDate: new Date(Date.now() + 86400000 * 15).toISOString(),
    attachments: [
        { id: 'attach-proj-1', fileName: 'mockup-homepage.png', url: '#', timestamp: new Date('2024-07-20T10:00:00Z').toISOString(), size: '1.2 MB', uploaderId: 'user-3', fileType: 'image' },
        { id: 'attach-proj-2', fileName: 'especificacao-funcional.pdf', url: '#', timestamp: new Date('2024-07-18T15:30:00Z').toISOString(), size: '850 KB', uploaderId: 'user-1', fileType: 'pdf' },
        { id: 'attach-proj-3', fileName: 'briefing-reuniao-kickoff.docx', url: '#', timestamp: new Date('2024-07-15T09:00:00Z').toISOString(), size: '45 KB', uploaderId: 'user-2', fileType: 'document' },
        { id: 'attach-proj-4', fileName: 'assets-design.zip', url: '#', timestamp: new Date('2024-07-21T11:45:00Z').toISOString(), size: '15.7 MB', uploaderId: 'user-3', fileType: 'archive' },
        { id: 'attach-proj-5', fileName: 'wireframe-checkout.jpg', url: '#', timestamp: new Date('2024-07-22T14:20:00Z').toISOString(), size: '980 KB', uploaderId: 'user-3', fileType: 'image' },
    ]
  },
  {
    id: 'proj-2',
    name: 'Fitness App',
    description: 'Criação de um app para monitoramento de atividades físicas.',
    fullDescription: 'O aplicativo mobile de fitness permitirá que os usuários registrem seus treinos, acompanhem o progresso, definam metas e participem de desafios. Haverá integração com wearables e redes sociais.',
    status: 'Em Andamento',
    team: ['user-1', 'user-4'],
    dueDate: new Date(Date.now() + 86400000 * 45).toISOString(),
  },
  {
    id: 'proj-3',
    name: 'CRM System',
    description: 'Modernização do sistema de ERP da empresa.',
    fullDescription: 'Este projeto foca na migração do sistema de gestão legado para uma nova plataforma baseada na web, com interface moderna, relatórios em tempo real e módulos customizáveis para RH, finanças e operações.',
    status: 'Planejamento',
    team: ['user-1', 'user-3', 'user-5'],
  },
   {
    id: 'proj-4',
    name: 'Website Redesign',
    description: 'Reformulação do website da empresa com foco em UX.',
    fullDescription: 'O novo website institucional terá um design moderno e responsivo, focado na experiência do usuário e na otimização para motores de busca (SEO). O objetivo é aumentar o engajamento e a geração de leads.',
    status: 'Concluído',
    team: ['user-2', 'user-4'],
  },
];

export const tasks: Task[] = [
  {
    id: 'task-today-1',
    title: 'Reunião de alinhamento semanal',
    description: 'Sincronizar com a equipe sobre o andamento do sprint atual e definir as próximas prioridades.',
    status: 'A Fazer',
    priority: 'Média',
    dueDate: new Date().toISOString(),
    assigneeId: 'user-1',
    projectId: 'proj-1',
    tags: [],
  },
  {
    id: 'task-today-2',
    title: 'Revisar Pull Request #123',
    description: 'Revisar as alterações de UI no componente de card de produto e fornecer feedback.',
    status: 'A Fazer',
    priority: 'Alta',
    dueDate: new Date().toISOString(),
    assigneeId: 'user-2',
    projectId: 'proj-1',
    tags: ['Frontend', 'Revisão'],
  },
  {
    id: 'task-today-3',
    title: 'Testar novo endpoint de checkout',
    description: 'Executar testes de integração no novo endpoint da API de checkout para garantir a funcionalidade.',
    status: 'Concluído',
    priority: 'Alta',
    dueDate: new Date().toISOString(),
    assigneeId: 'user-4',
    projectId: 'proj-1',
    tags: ['Backend', 'QA', 'Bug'],
  },
  {
    id: 'task-1',
    title: 'Implementar autenticação de usuários',
    description: 'Implementar sistema completo de autenticação incluindo login, registro, recuperação de senha e middleware de proteção de rotas.',
    status: 'A Fazer',
    priority: 'Alta',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
    assigneeId: 'user-1',
    projectId: 'proj-1',
    tags: ['Backend', 'Urgente'],
    comments: [
        {id: 'comment-1', userId: 'user-2', content: 'Já comecei a trabalhar na estrutura do JWT. Preciso de mais detalhes sobre os requisitos de segurança.', timestamp: new Date('2024-01-20T14:30:00Z').toISOString()},
        {id: 'comment-2', userId: 'user-1', content: 'Vou enviar a documentação de segurança por email.', timestamp: new Date('2024-01-20T15:45:00Z').toISOString()},
    ],
    attachments: [
        {id: 'attach-1', fileName: 'auth-requirements.pdf', url: '#', timestamp: new Date('2024-01-19T10:00:00Z').toISOString()},
        {id: 'attach-2', fileName: 'security-guidelines.docx', url: '#', timestamp: new Date('2024-01-19T11:00:00Z').toISOString()}
    ]
  },
   {
    id: 'subtask-1',
    title: 'Configurar JWT',
    description: 'Implementar os endpoints necessários para o novo fluxo.',
    status: 'Concluído',
    priority: 'Alta',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    assigneeId: 'user-2',
    projectId: 'proj-1',
    tags: ['Backend'],
    parentId: 'task-1'
  },
    {
    id: 'subtask-2',
    title: 'Criar middleware de autenticação',
    description: 'Middleware para proteger rotas da API.',
    status: 'A Fazer',
    priority: 'Alta',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
    assigneeId: 'user-1',
    projectId: 'proj-1',
    tags: ['Backend'],
    parentId: 'task-1'
  },
  {
    id: 'task-2',
    title: 'Design da interface do carrinho',
    description: 'Desenvolver o componente React para a visualização de detalhes do produto.',
    status: 'Concluído',
    priority: 'Alta',
    dueDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    assigneeId: 'user-3',
    projectId: 'proj-1',
    tags: ['Frontend', 'Design'],
  },
    {
    id: 'task-5',
    title: 'Corrigir bug no sistema de pagamento',
    description: 'Realizar testes end-to-end no fluxo de compra.',
    status: 'A Fazer',
    priority: 'Alta',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    assigneeId: 'user-2',
    projectId: 'proj-1',
    tags: ['Bug', 'Urgente'],
  },
  {
    id: 'task-3',
    title: 'Configurar pipeline de CI/CD',
    description: 'Automatizar o processo de build e deploy do projeto de fitness.',
    status: 'A Fazer',
    priority: 'Média',
    assigneeId: 'user-1',
    projectId: 'proj-2',
    tags: ['DevOps'],
  },
  {
    id: 'task-4',
    title: 'Documentar a API de usuários',
    description: 'Escrever a documentação da API usando o padrão OpenAPI.',
    status: 'Concluído',
    priority: 'Baixa',
    dueDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    assigneeId: 'user-1',
    projectId: 'proj-3',
    tags: ['Docs'],
  },
  {
    id: 'task-6',
    title: 'Definir paleta de cores',
    description: 'Criar a paleta de cores principal para o app de fitness.',
    status: 'Concluído',
    priority: 'Média',
    dueDate: new Date(Date.now() - 86400000 * 10).toISOString(),
    assigneeId: 'user-2',
    projectId: 'proj-2',
    tags: ['Design'],
  },
];

export const activities: Activity[] = [
  { id: 'act-1', userId: 'user-1', content: 'Comentou na tarefa <b>Refatorar autenticação</b>', targetLink: '/projetos/proj-1', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: 'act-2', userId: 'user-2', content: 'Adicionou um novo design à tarefa <b>Criar layout da página de produto</b>', targetLink: '/projetos/proj-1', timestamp: new Date(Date.now() - 3600000 * 3).toISOString() },
  { id: 'act-3', userId: 'user-4', content: 'Moveu a tarefa <b>Criar layout da página de produto</b> para "Em Revisão"', targetLink: '/projetos/proj-1', timestamp: new Date(Date.now() - 3600000 * 5).toISOString() },
  { id: 'act-4', userId: 'user-3', content: 'Criou o projeto <b>Sistema de Gestão Interna</b>', targetLink: '/projetos/proj-3', timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: 'act-5', userId: 'user-5', content: 'Concluiu a tarefa <b>Definir paleta de cores</b>', targetLink: '/projetos/proj-2', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() }
];

export const ideas: Idea[] = [
    {
        id: 'idea-1',
        title: 'Sistema de Notificações Push',
        description: 'Implementar um sistema completo de notificações push para melhorar o engajamento dos usuários.',
        authorId: 'user-1',
        createdAt: '2024-01-14T00:00:00.000Z',
        category: 'Feature',
        tags: ['Frontend', 'Backend', 'UX'],
    },
    {
        id: 'idea-2',
        title: 'Dashboard Analytics Avançado',
        description: 'Criar um dashboard com métricas avançadas e visualizações interativas para análise de dados.',
        authorId: 'user-2',
        createdAt: '2024-01-17T00:00:00.000Z',
        category: 'Melhoria',
        tags: ['Analytics', 'Dashboard', 'Visualização'],
    },
    {
        id: 'idea-3',
        title: 'Integração com Slack',
        description: 'Desenvolver integração nativa com Slack para notificações automáticas de atualizações.',
        authorId: 'user-3',
        createdAt: '2024-01-19T00:00:00.000Z',
        category: 'Integração',
        tags: ['Integração', 'Slack', 'Automação'],
    },
    {
        id: 'idea-4',
        title: 'App Mobile Nativo',
        description: 'Criar aplicativo mobile nativo para iOS e Android com funcionalidades offline.',
        authorId: 'user-4',
        createdAt: '2024-01-21T00:00:00.000Z',
        category: 'Feature',
        tags: ['Mobile', 'iOS', 'Android', 'Offline'],
    },
    {
        id: 'idea-5',
        title: 'Sistema de Templates',
        description: 'Implementar sistema de templates para projetos, permitindo reutilização de estruturas.',
        authorId: 'user-5',
        createdAt: '2024-01-24T00:00:00.000Z',
        category: 'Feature',
        tags: ['Templates', 'Produtividade', 'Automação'],
    },
    {
        id: 'idea-6',
        title: 'Modo Colaborativo em Tempo Real',
        description: 'Adicionar funcionalidade de edição colaborativa em tempo real para documentos e tarefas.',
        authorId: 'user-6',
        createdAt: '2024-01-27T00:00:00.000Z',
        category: 'Feature',
        tags: ['Colaboração', 'Tempo Real', 'WebSocket'],
    },
];


export const feedbacks: Feedback[] = [
    {id: 'fb-1', summary: 'Erro ao salvar tarefas com caracteres especiais', description: 'Descrição detalhada sobre o erro ao salvar tarefas que contêm caracteres especiais no título ou na descrição.', projectId: 'proj-1', type: 'Bug', priority: 'Alta', status: 'Em Análise', authorId: 'user-4', createdAt: new Date('2024-01-27').toISOString()},
    {id: 'fb-2', summary: 'Melhorar performance do carregamento do dashboard', description: 'O dashboard principal está demorando muito para carregar, especialmente em contas com muitos projetos e tarefas. Precisamos investigar e otimizar as queries e o rendering dos componentes.', projectId: 'proj-2', type: 'Melhoria', priority: 'Média', status: 'Recebido', authorId: 'user-2', createdAt: new Date('2024-01-26').toISOString()},
    {id: 'fb-3', summary: 'Adicionar filtros avançados na lista de projetos', description: 'Permitir que os usuários filtrem a lista de projetos por status, membro da equipe ou tags. Isso ajudaria a encontrar projetos específicos mais rapidamente.', projectId: 'proj-3', type: 'Feature', priority: 'Baixa', status: 'Em Desenvolvimento', authorId: 'user-1', createdAt: new Date('2024-01-25').toISOString()},
    {id: 'fb-4', summary: 'Interface não responsiva em tablets', description: 'A interface do aplicativo não se adapta bem a telas de tablets no modo paisagem. Alguns elementos quebram ou ficam sobrepostos.', projectId: 'proj-4', type: 'Bug', priority: 'Média', status: 'Resolvido', authorId: 'user-3', createdAt: new Date('2024-01-24').toISOString()},
];

export const notifications: Notification[] = [
    {
        id: 'notif-1',
        text: '<b>João Silva</b> comentou na sua tarefa: <strong>"Finalizar Relatório Mensal"</strong>.',
        link: '/projetos/proj-1',
        timestamp: 'há 5 minutos',
        read: false,
        icon: 'comment',
    },
    {
        id: 'notif-2',
        text: 'A tarefa <strong>"Deploy em Produção"</strong> foi concluída por <b>Maria Santos</b>.',
        link: '/projetos/proj-2',
        timestamp: 'há 1 hora',
        read: false,
        icon: 'task-completed',
    },
    {
        id: 'notif-3',
        text: '<b>Pedro Costa</b> convidou você para o projeto <strong>"Website Redesign"</strong>.',
        link: '/projetos/proj-4',
        timestamp: 'há 3 horas',
        read: true,
        icon: 'project-created',
    },
    {
        id: 'notif-4',
        text: 'Sua tarefa <strong>"Configurar pipeline de CI/CD"</strong> está com o prazo vencido.',
        link: '/projetos/proj-2',
        timestamp: 'há 1 dia',
        read: false,
        icon: 'task-completed'
    },
    {
        id: 'notif-5',
        text: 'Novo comentário de <b>Ana Lima</b> em <strong>"Corrigir bug no sistema de pagamento"</strong>.',
        link: '/projetos/proj-1',
        timestamp: 'há 2 dias',
        read: true,
        icon: 'comment',
    },
     {
        id: 'notif-6',
        text: '<b>Carlos Oliveira</b> criou um novo projeto: <strong>"Fitness App"</strong>.',
        link: '/projetos/proj-2',
        timestamp: 'há 4 dias',
        read: true,
        icon: 'project-created',
    }
];
