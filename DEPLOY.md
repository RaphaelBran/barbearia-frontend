# Instruções de Deploy Gratuito

## Backend - Railway

> O backend (repositório `barbearia-backend`) está hospedado no **Railway**.
> URL atual de produção: `https://barbearia-backend-production-a5ef.up.railway.app`

### Passo 1: Criar conta no Railway
1. Acesse: https://railway.app
2. Crie uma conta gratuita
3. Conecte com GitHub

### Passo 2: Fazer upload do código
1. Crie um repositório no GitHub com o código do backend (`barbearia-backend`)
2. Suba os arquivos do backend para o GitHub

### Passo 3: Criar o serviço no Railway
1. No Railway, clique em "New Project" → "Deploy from GitHub repo"
2. Selecione o repositório do backend
3. O Railway detecta o Node.js automaticamente:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js` (ou `npm start`)
4. Em "Variables", adicione as variáveis de ambiente:
   - `GOOGLE_CLIENT_ID`: Seu Client ID do Google
   - `GOOGLE_CLIENT_SECRET`: Seu Client Secret do Google
   - `GOOGLE_REDIRECT_URI`: `https://seu-backend-url.up.railway.app/auth/google/callback`
   - `DATABASE_URL`: Sua URL do PostgreSQL/Supabase
   - `PORT`: 3000
5. Faça o deploy

### Passo 4: Obter URL do Backend
1. Em "Settings" → "Networking", clique em "Generate Domain"
2. O Railway fornece uma URL como: `https://barbearia-backend-production-a5ef.up.railway.app`
3. Copie essa URL

## Frontend - Vercel.com

### Passo 1: Criar conta no Vercel
1. Acesse: https://vercel.com
2. Crie uma conta gratuita
3. Conecte com GitHub

### Passo 2: Modificar script.js
1. Abra `script.js`
2. Mude a linha 4:
   ```javascript
   const API_BASE_URL = 'https://seu-backend-url.up.railway.app';
   ```
   (substitua pela URL do seu backend no Railway)

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
   - `https://seu-backend-url.up.railway.app/auth/google/callback`
5. Salve

### Passo 2: Atualizar variáveis no Railway
1. No Railway, vá em "Variables" do seu serviço
2. Atualize a variável `GOOGLE_REDIRECT_URI` com a URL correta

## Testar

1. Acesse a URL do Vercel
2. Tente fazer um agendamento
3. Verifique se funciona corretamente

## URLs Finais

- **Frontend:** `https://seu-projeto.vercel.app`
- **Backend:** `https://barbearia-backend-production-a5ef.up.railway.app`
- **Google Calendar:** Integrado automaticamente

## Dicas

- O Railway oferece um crédito mensal gratuito (uso limitado); acompanhe o consumo no painel
- O Vercel é gratuito para uso pessoal
- Ambos são ideais para apresentação/demo
- Para produção, considere planos pagos para melhor performance
