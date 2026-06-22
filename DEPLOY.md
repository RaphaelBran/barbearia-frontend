# Instruções de Deploy

Este projeto usa SQLite local, então o deploy deve ser feito em plataformas que suportem persistência de arquivos.

## Opção 1: Railway (Recomendado)

### Passo 1: Criar conta no Railway
1. Acesse: https://railway.app
2. Crie uma conta gratuita
3. Conecte com GitHub

### Passo 2: Fazer upload do código
1. Crie um repositório no GitHub com todo o projeto (incluindo pasta backend)
2. Suba todos os arquivos

### Passo 3: Criar projeto no Railway
1. No Railway, clique em "New Project" → "Deploy from GitHub repo"
2. Selecione seu repositório
3. Configure:
   - **Root Directory:** `./` (raiz do projeto)
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && node server.js`
4. Clique em "Deploy"

### Passo 4: Configurar variáveis de ambiente
1. No Railway, vá em "Variables"
2. Adicione as variáveis:
   - `PORT`: `3000`
   - `GOOGLE_CLIENT_ID`: (opcional, apenas se usar Google Calendar)
   - `GOOGLE_CLIENT_SECRET`: (opcional)
   - `GOOGLE_REDIRECT_URI`: `https://seu-projeto.railway.app/auth/google/callback`

### Passo 5: Configurar persistência de volume
1. No Railway, vá em "Volumes"
2. Crie um volume chamado `data`
3. Monte o volume em `/app` para persistir o arquivo `database.sqlite`

### Passo 6: Obter URL
1. Após o deploy, o Railway fornecerá uma URL como: `https://seu-projeto.railway.app`
2. Esta URL serve tanto o frontend quanto o backend

## Opção 2: Render

### Passo 1: Criar conta no Render
1. Acesse: https://render.com
2. Crie uma conta gratuita
3. Conecte com GitHub

### Passo 2: Fazer upload do código
1. Crie um repositório no GitHub com todo o projeto
2. Suba todos os arquivos

### Passo 3: Criar Web Service no Render
1. No Render, clique em "New +" → "Web Service"
2. Conecte com seu repositório GitHub
3. Configure:
   - **Name:** barbearia-sistema (ou o nome que quiser)
   - **Branch:** main
   - **Root Directory:** `./`
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && node server.js`
4. Clique em "Advanced"
5. Adicione as variáveis de ambiente:
   - `PORT`: `3000`
   - `GOOGLE_CLIENT_ID`: (opcional)
   - `GOOGLE_CLIENT_SECRET`: (opcional)
   - `GOOGLE_REDIRECT_URI`: `https://seu-projeto.onrender.com/auth/google/callback`
6. Clique em "Create Web Service"

### Passo 4: Configurar persistência (Disk)
1. No Render, vá nas configurações do Web Service
2. Em "Advanced", adicione um "Disk" com pelo menos 1GB
3. Monte o disco em `/app` para persistir o `database.sqlite`

### Passo 5: Obter URL
1. Após o deploy, o Render fornecerá uma URL como: `https://seu-projeto.onrender.com`

## Opção 3: VPS Própria

### Pré-requisitos
- VPS com Ubuntu/Debian
- Node.js instalado
- Git instalado

### Passos

1. Conecte-se ao seu VPS via SSH
2. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   cd seu-repositorio
   ```
3. Instale as dependências:
   ```bash
   cd backend
   npm install
   ```
4. Crie o arquivo `.env`:
   ```bash
   cp .env.example .env
   ```
5. Configure o `.env` com suas variáveis
6. Instale PM2 para gerenciar o processo:
   ```bash
   npm install -g pm2
   ```
7. Inicie o aplicativo com PM2:
   ```bash
   cd backend
   pm2 start server.js --name barbearia
   pm2 save
   pm2 startup
   ```
8. Configure um proxy reverso (Nginx) se necessário

## Configurar Google Calendar (Opcional)

Se você quiser usar a integração com Google Calendar:

### Google Cloud Console
1. Acesse: https://console.cloud.google.com
2. Crie um projeto ou use um existente
3. Habilite a API Google Calendar
4. Crie credenciais OAuth 2.0
5. Adicione o redirect URI da sua plataforma de deploy:
   - Railway: `https://seu-projeto.railway.app/auth/google/callback`
   - Render: `https://seu-projeto.onrender.com/auth/google/callback`
   - VPS: `https://seu-dominio.com/auth/google/callback`

### Variáveis de Ambiente
Adicione as credenciais nas variáveis de ambiente da sua plataforma:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`

## Testar o Deploy

1. Acesse a URL do seu projeto
2. Tente fazer um agendamento
3. Verifique se os dados são salvos corretamente
4. Se configurado, teste a integração com Google Calendar

## Notas Importantes

### Persistência de Dados
- O SQLite cria um arquivo `database.sqlite` que precisa ser persistido
- Em Railway e Render, configure volumes/disks para manter este arquivo
- Em VPS, o arquivo fica no disco do servidor

### Limitações do Plano Gratuito
- **Railway:** Plano gratuito com $5 de crédito/mês, servidor "dorme" após inatividade
- **Render:** Plano gratuito com limite de 750 horas/mês, servidor "dorme" após 15 minutos
- **VPS:** Depende do provedor, geralmente sem limites de inatividade

### Backup
- Faça backup regular do arquivo `database.sqlite`
- Em VPS, configure backups automáticos
- Em Railway/Render, exporte o banco periodicamente

## URLs Finais

Após o deploy, você terá uma única URL que serve:
- **Frontend:** Interface do usuário
- **Backend:** API REST
- **Banco de Dados:** SQLite local

Exemplo: `https://seu-projeto.railway.app`

## Suporte

Para problemas de deploy:
- Railway: https://docs.railway.app
- Render: https://render.com/docs
- Node.js: https://nodejs.org/docs
