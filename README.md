# Sistema de Agendamento para Barbearia

Sistema completo de agendamento para barbearias com frontend moderno e backend em Node.js com SQLite.

## 🎨 Características

- **Design Moderno:** Interface limpa e responsiva com mobile-first
- **Sistema de Agendamento:** Fluxo completo em 5 etapas (serviço, data, horário, dados, confirmação)
- **3 Barbeiros:** Configuração genérica para Barbeiro 1, Barbeiro 2 e Barbeiro 3
- **Integração Google Calendar:** Opcional, para sincronização automática
- **Banco de Dados SQLite:** Local, sem necessidade de serviços externos
- **Deploy Unificado:** Frontend e backend juntos em um único servidor

## 📁 Estrutura de Arquivos

```
barbearia/
├── index.html          # Frontend principal
├── styles.css          # Estilos customizados
├── script.js           # Lógica JavaScript e dados dos barbeiros
├── backend/            # Backend Node.js
│   ├── server.js       # Servidor Express
│   ├── config/         # Configurações
│   │   ├── database.js # SQLite
│   │   └── google.js   # Google Calendar OAuth
│   ├── routes/         # Rotas da API
│   │   ├── booking.js  # Agendamentos
│   │   ├── auth.js     # Autenticação Google
│   │   └── calendar.js # Google Calendar
│   ├── package.json    # Dependências
│   └── .env.example    # Modelo de variáveis de ambiente
├── assets/             # Diretório de imagens
│   ├── logo.png
│   ├── barber-eduardo.jpg
│   ├── barber-caique.jpg
│   ├── barber-jorge.jpg
│   └── work-*.jpg      # Fotos de trabalhos
├── .gitignore          # Arquivos ignorados
├── database.sqlite     # Banco de dados (gerado automaticamente)
└── README.md           # Este arquivo
```

## 🚀 Como Usar Localmente

### Pré-requisitos
- Node.js instalado (versão 14 ou superior)

### Instalação

1. Clone o repositório
2. Entre na pasta do backend:
   ```bash
   cd backend
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Crie o arquivo `.env` baseado no `.env.example`:
   ```bash
   cp .env.example .env
   ```
5. Configure as variáveis de ambiente no `.env` (opcional, apenas para Google Calendar)

### Executar

1. Inicie o servidor:
   ```bash
   npm start
   ```
2. Acesse no navegador: `http://localhost:3000`

O banco de dados SQLite será criado automaticamente na primeira execução.

## 📝 Como Personalizar

### Alterar Informações dos Barbeiros

Edite o arquivo `script.js` e modifique o objeto `BARBEIROS_CONFIG`:

```javascript
const BARBEIROS_CONFIG = {
  barbeiro1: {
    nome: "Nome do Barbeiro 1",
    whatsapp: "5511999999999",
    instagram: "https://www.instagram.com/seu_perfil/",
    instagramHandle: "@seu_perfil",
    foto: "assets/barber-eduardo.jpg",
    trabalhos: [
      "assets/work-1.jpg",
      // ...
    ]
  },
  // ...
};
```

### Alterar Preços dos Serviços

Edite o arquivo `index.html` na seção do modal de agendamento (Screen 1).

### Alterar Título e Instagram

Edite o arquivo `index.html`:
- Título na tag `<title>`
- Instagram no botão `.instagram-btn`

### Configurar Google Calendar (Opcional)

1. Crie um projeto no [Google Cloud Console](https://console.cloud.google.com)
2. Habilite a API Google Calendar
3. Crie credenciais OAuth 2.0
4. Configure o redirect URI para: `http://localhost:3000/auth/google/callback`
5. Preencha as variáveis no `.env`:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REDIRECT_URI`

## 🖼️ Como Adicionar Imagens

1. Adicione as imagens no diretório `assets/`
2. Recomendações:
   - Logo: PNG com fundo transparente (200x200px)
   - Fotos dos barbeiros: Formato quadrado (mínimo 300x300px)
   - Fotos de trabalhos: Formato paisagem (mínimo 400x300px)

## 🎯 Funcionalidades

### Sistema de Agendamento
- **Tela 1:** Seleção de serviço (Corte, Barba, Combo)
- **Tela 2:** Calendário interativo com navegação mensal
- **Tela 3:** Grade de horários disponíveis (09:00-20:00)
- **Tela 4:** Formulário de dados do cliente
- **Tela 5:** Confirmação de agendamento

### Integrações
- **Google Calendar:** Criação automática de eventos (opcional)
- **WhatsApp:** Botão para contato (configurável)
- **Instagram:** Link direto para o perfil (configurável)

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- Smartphones (mobile-first)
- Tablets
- Desktops

## 🔧 Tecnologias Utilizadas

### Frontend
- HTML5
- CSS3 (Custom)
- JavaScript (Vanilla)
- Google Fonts (Roboto)

### Backend
- Node.js
- Express.js
- SQLite3
- Google APIs (opcional)
- dotenv

## � Deploy em Produção

O projeto pode ser hospedado em plataformas como:
- **Railway:** Deploy unificado com persistência de arquivo
- **Render:** Web Service com build automático
- **Heroku:** Com addon de persistência
- **Qualquer VPS:** Node.js + SQLite

Consulte o arquivo `DEPLOY.md` para instruções detalhadas.

## 📊 Banco de Dados

O SQLite cria automaticamente duas tabelas:
- `barbers`: Informações dos barbeiros
- `bookings`: Agendamentos realizados

Os dados são persistidos localmente no arquivo `database.sqlite`.

## 🔒 Segurança

- Arquivo `.env` protegido no `.gitignore`
- Banco de dados SQLite protegido no `.gitignore`
- Variáveis de ambiente para credenciais sensíveis

---

**Sistema Genérico para Barbearias** - Personalizável para qualquer negócio
