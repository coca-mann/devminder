# DevMinder 🧠

DevMinder é um gerenciador de projetos e tarefas pessoal, construído com Django, projetado para ajudar desenvolvedores a organizar ideias, gerenciar o fluxo de trabalho e acompanhar o progresso de múltiplos projetos de software em um só lugar.

---

## 📚 Tabela de Conteúdos

* [Sobre o Projeto](#sobre-o-projeto)
* [Principais Funcionalidades](#principais-funcionalidades-)
* [Tecnologias Utilizadas](#tecnologias-utilizadas-️)
* [Como Começar](#como-começar-)
* [Estrutura do Projeto](#estrutura-do-projeto-)
* [Roadmap](#roadmap-)
* [Como Contribuir](#como-contribuir-)
* [Licença](#licença-)
* [Autor](#autor-)

---

## 🎯 Sobre o Projeto

Este projeto nasceu da necessidade de uma ferramenta centralizada e customizável para gerenciar o ciclo de vida completo de projetos de desenvolvimento pessoal. Desde a faísca inicial de uma ideia até o registro de feedbacks pós-lançamento, o DevMinder visa fornecer uma visão clara e organizada de todas as atividades, eliminando a necessidade de usar múltiplas ferramentas desconectadas.

---

## ✨ Principais Funcionalidades

* **Gerenciamento de Projetos:** Crie e acompanhe projetos com status, datas e links relevantes.
* **Gerenciamento de Tarefas:** Quebre projetos em tarefas detalhadas com prioridades, prazos e responsáveis.
* **Subtarefas:** Crie hierarquias de tarefas para organizar trabalhos complexos.
* **Captura de Ideias:** Um espaço dedicado para registrar ideias de projetos futuros antes que eles entrem em desenvolvimento ativo.
* **Sistema de Feedback:** Permita que stakeholders (ou você mesmo) registrem sugestões, melhorias e bugs para projetos existentes.
* **Tags com Cores:** Organize projetos e tarefas com um sistema de tags flexível e visual.
* **Comentários e Anexos:** Facilite a colaboração com seções de comentários e a possibilidade de anexar arquivos a tarefas e projetos.
* **Perfis de Usuário:** Sistema de contas com perfis personalizáveis.

---

## 🛠️ Tecnologias Utilizadas

* **Backend:** Python, Django
* **API:** Django REST Framework (planejado)
* **Banco de Dados:** PostgreSQL (sugerido) / SQLite3 (desenvolvimento)
* **Logging de Auditoria:** `django-auditlog`
* **Frontend:** (A definir - Ex: Django Templates + HTMX, ou um SPA como React/Vue)

---

## 🚀 Como Começar

Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/coca-mann/devminder.git
    cd devminder
    ```

2.  **Crie e ative um ambiente virtual:**
    ```bash
    python -m venv venv
    # Windows
    .\venv\Scripts\activate
    # macOS/Linux
    source venv/bin/activate
    ```

3.  **Instale as dependências:**
    *(Você precisará criar este arquivo com `pip freeze > requirements.txt`)*
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure as variáveis de ambiente:**
    Crie um arquivo `.env` na raiz do projeto, baseado no arquivo `.env.example` (que você pode criar). Adicione no mínimo:
    ```
    SECRET_KEY='sua-chave-secreta-aqui'
    DEBUG=True
    ```

5.  **Execute as migrações do banco de dados:**
    ```bash
    python manage.py migrate
    ```

6.  **Crie um superusuário para acessar o Admin:**
    ```bash
    python manage.py createsuperuser
    ```

7.  **Execute o servidor de desenvolvimento:**
    ```bash
    python manage.py runserver
    ```
    O projeto estará disponível em `http://127.0.0.1:8000`.

---

## 📁 Estrutura do Projeto

O projeto segue uma estrutura padrão do Django, com a lógica de negócio separada em diferentes apps:

* `core/`: Configurações globais, comandos e funcionalidades base.
* `accounts/`: Gerenciamento do modelo de usuário personalizado (`Account`).
* `projects/`: Lógica principal para Projetos, Tarefas, Feedback, etc.
* `...`

---

## 🗺️ Roadmap

* [ ] Desenvolver a API REST com DRF.
* [ ] Definir e implementar a interface do Frontend.
* [ ] Escrever testes unitários e de integração.
* [ ] Configurar CI/CD para automação de testes e deploy.
* [ ] Implementar um sistema de notificações.

---

## 🤝 Como Contribuir

Este é um projeto pessoal, mas contribuições que melhorem a ferramenta são bem-vindas!

1.  Faça um **Fork** do projeto.
2.  Crie uma nova **Branch** (`git checkout -b feature/sua-feature-incrivel`).
3.  Faça o **Commit** de suas alterações (`git commit -m 'feat: Adiciona sua feature incrivel'`).
4.  Faça o **Push** para a Branch (`git push origin feature/sua-feature-incrivel`).
5.  Abra um **Pull Request**.

---

## 📜 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

*(Você pode criar um arquivo LICENSE e escolher a licença MIT, que é muito comum e permissiva)*.

---

## 👨‍💻 Autor

**Juliano Ostroski** - juliano.ostroski@gmail.com

Link do Projeto: [https://github.com/coca-mann/devminder](https://github.com/coca-mann/devminder)