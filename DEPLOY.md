# Instruções de Deploy Gratuito

## Backend - Render.com

### Passo 1: Criar conta no Render
1. Acesse: https://render.com
2. Crie uma conta gratuita
3. Conecte com GitHub

### Passo 2: Fazer upload do código
1. Crie um repositório no GitHub com o código do backend
2. Suba a pasta `backend` para o GitHub

### Passo 3: Criar Web Service no Render
1. No Render, clique em "New +" → "Web Service"
2. Conecte com seu repositório GitHub
3. Configure:
   - **Name:** barbearia-backend (ou o nome que quiser)
   - **Branch:** main
   - **Root Directory:** backend
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. Clique em "Advanced"
5. Adicione as variáveis de ambiente:
   - `GOOGLE_CLIENT_ID`: Seu Client ID do Google
   - `GOOGLE_CLIENT_SECRET`: Seu Client Secret do Google
   - `GOOGLE_REDIRECT_URI`: `https://seu-backend-url.onrender.com/auth/google/callback`
   - `DATABASE_URL`: Sua URL do Supabase
   - `PORT`: 3000
6. Clique em "Create Web Service"

### Passo 4: Obter URL do Backend
1. Após o deploy, o Render vai fornecer uma URL como: `https://barbearia-backend.onrender.com`
2. Copie essa URL

## Frontend - Vercel.com

### Passo 1: Criar conta no Vercel
1. Acesse: https://vercel.com
2. Crie uma conta gratuita
3. Conecte com GitHub

### Passo 2: Modificar script.js
1. Abra `script.js`
2. Mude a linha 4:
   ```javascript
   const API_BASE_URL = 'https://seu-backend-url.onrender.com';
   ```
   (substitua pela URL do seu backend no Render)

### Passo 3: Fazer upload do código
1. Crie um repositório no GitHub com o código do frontend
2. Suba os arquivos (exceto pasta backend)

### Passo 4: Deploy no Vercel
1. No Vercel, clique em "Add New Project"
2. Conecte com seu repositório GitHub
3. Configure:
   - **Framework Preset:** Other
   - **Root Directory:** ./ (ou deixe vazio)
4. Clique em "Deploy"
5. Após o deploy, você terá uma URL como: `https://seu-projeto.vercel.app`

## Atualizar Google Cloud Console

### Passo 1: Atualizar Redirect URI
1. Acesse: https://console.cloud.google.com
2. Vá em APIs & Services → Credentials
3. Edite seu OAuth 2.0 Client ID
4. Adicione a URL do backend como Redirect URI autorizado:
   - `https://seu-backend-url.onrender.com/auth/google/callback`
5. Salve

### Passo 2: Atualizar .env no Render
1. No Render, vá nas configurações do seu Web Service
2. Atualize a variável `GOOGLE_REDIRECT_URI` com a URL correta

## Testar

1. Acesse a URL do Vercel
2. Tente fazer um agendamento
3. Verifique se funciona corretamente

## URLs Finais

- **Frontend:** `https://seu-projeto.vercel.app`
- **Backend:** `https://seu-backend-url.onrender.com`
- **Google Calendar:** Integrado automaticamente

## Dicas

- O Render tem plano gratuito com limites (o servidor "dorme" após 15 minutos de inatividade)
- O Vercel é gratuito para uso pessoal
- Ambos são ideais para apresentação/demo
- Para produção, considere planos pagos para melhor performance
