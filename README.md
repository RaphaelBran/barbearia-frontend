# Sistema de Agendamento para Barbearia

Sistema completo de agendamento para barbearias com frontend moderno e backend em Node.js. Suporta Neon (PostgreSQL) e Google Calendar.

## 🎨 Funcionalidades

- **Design Moderno:** Interface limpa e responsiva (mobile-first)
- **Agendamento em 5 Etapas:** serviço → data → horário → dados → confirmação
- **3 Barbeiros:** Configuração genérica para até 3 barbeiros
- **Google Calendar:** Sincronização automática de eventos (opcional)
- **Banco de Dados:** Neon (PostgreSQL) ou SQLite

## 📁 Estrutura do Projeto

```
barbearia-frontend/
├── index.html              # Frontend principal
├── styles.css              # Estilos customizados
├── script.js               # Lógica JS e dados dos barbeiros
├── server.js               # Servidor Express (raiz, opcional)
├── api/index.js            # API serverless (Vercel)
├── assets/                 # Imagens
├── cmd/                    # Backend
│   ├── server.js           # Servidor principal
│   ├── init-db.js          # Inicialização do banco
│   ├── config/             # Configurações
│   │   ├── database.js     # Conexão com banco (Neon/SQLite)
│   │   ├── google.js       # Google Calendar
│   │   └── google-service.js # Service Account
│   ├── routes/             # Rotas da API
│   │   ├── booking.js      # Agendamentos
│   │   ├── auth.js         # Autenticação Google
│   │   └── calendar.js     # Google Calendar
│   └── .env.example        # Modelo de variáveis
├── .env.example            # Modelo alternativo (raiz)
├── Dockerfile              # Container Docker
├── vercel.json             # Configuração Vercel
└── package.json            # Dependências raiz
```

## 🚀 Como Usar Localmente

### Pré-requisitos

- Node.js 18+
- (Opcional) Conta no [Neon](https://neon.tech) para banco PostgreSQL
- (Opcional) Conta no [Google Cloud Console](https://console.cloud.google.com) para Google Calendar

### Instalação

```bash
# 1. Clone o repositório
git clone <seu-repositorio>
cd barbearia-frontend

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp cmd/.env.example cmd/.env
```

### Configuração Mínima (sem Google Calendar)

Para rodar apenas com SQLite local, edite o arquivo `cmd/.env`:

```env
PORT=3000
```

### Executar

```bash
npm start
```

Acesse em: **http://localhost:3000**

O banco SQLite será criado automaticamente na primeira execução.

---

## ⚙️ Configuração Completa

### Banco de Dados Neon (PostgreSQL)

1. Crie uma conta gratuita em [Neon](https://neon.tech)
2. Crie um projeto e copie a `POSTGRES_URL`
3. Adicione no `cmd/.env`:

```env
POSTGRES_URL=postgres://user:password@ep-example.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### Google Calendar (OAuth2)

> Ideal para ambientes com poucos barbeiros onde cada um autoriza individualmente.

#### 1. Configurar Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um projeto → "APIs & Services" → "Library"
3. Habilite a **Google Calendar API**
4. Vá em "OAuth consent screen" → External → Preencha os dados
5. Vá em "Credentials" → "Create Credentials" → "OAuth client ID"
6. **Application type:** Web application
7. **Authorized redirect URIs:**
   - `http://localhost:3000/auth/google/callback`
8. Copie o **Client ID** e **Client Secret**

#### 2. Adicionar usuários de teste

No OAuth consent screen → "Test users" → adicione os emails dos barbeiros.

#### 3. Configurar .env

```env
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
```

#### 4. Autorizar cada barbeiro

- Eduardo: `http://localhost:3000/auth/google?barber_id=1`
- Caique: `http://localhost:3000/auth/google?barber_id=2`
- Jorge: `http://localhost:3000/auth/google?barber_id=3`

### Google Calendar (Service Account)

> Ideal para produção. Usa uma conta de serviço com acesso ao calendário.

#### 1. Criar Service Account

1. Google Cloud Console → "IAM & Admin" → "Service Accounts"
2. Crie uma service account e baixe a chave JSON
3. Compartilhe um calendário com o email da service account (com permissão de escrita)

#### 2. Configurar .env

```env
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"..."}
GOOGLE_CALENDAR_ID=seu-email@gmail.com
```

### Inicializar o Banco

```bash
node cmd/init-db.js
```

---

## 🔌 API Endpoints

### Autenticação
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/auth/google` | Iniciar autorização OAuth2 |
| GET | `/auth/google/callback` | Callback do OAuth2 |

### Agendamentos
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/booking` | Criar agendamento |
| GET | `/api/booking/barber/:barber_id` | Listar agendamentos |

### Calendário
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/calendar/event` | Criar evento no Google Calendar |

### Exemplo de requisição

```json
POST /api/booking
{
  "barber_id": 1,
  "client_name": "João Silva",
  "client_phone": "15999999999",
  "service": "Corte",
  "price": 50,
  "booking_date": "2024-05-21",
  "booking_time": "14:00"
}
```

---

## 📝 Personalização

### Barbeiros

Edite `script.js` → objeto `BARBEIROS_CONFIG`:

```javascript
const BARBEIROS_CONFIG = {
  barbeiro1: {
    nome: "Nome do Barbeiro",
    whatsapp: "5511999999999",
    instagram: "https://instagram.com/seu_perfil",
    foto: "assets/barber-eduardo.jpg",
    trabalhos: ["assets/work-1.jpg"]
  }
};
```

### Serviços e Preços

Edite `index.html` na seção do modal de agendamento (Screen 1).

### Imagens

Adicione em `assets/`:
- **Logo:** PNG com fundo transparente (200×200px)
- **Fotos dos barbeiros:** Formato quadrado (300×300px+)
- **Fotos de trabalhos:** Formato paisagem (400×300px+)

---

## ☁️ Deploy

### Railway (Recomendado)

1. Crie conta em [Railway](https://railway.app) e conecte ao GitHub
2. "New Project" → "Deploy from GitHub repo"
3. Configure:
   - **Root Directory:** `./`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Adicione variáveis de ambiente (PORT, GOOGLE_CLIENT_ID, etc.)
5. Configure um volume para persistir o `database.sqlite`

### Render

1. Crie conta em [Render](https://render.com) e conecte ao GitHub
2. "New +" → "Web Service"
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. Adicione um "Disk" com 1GB montado para persistência

### Vercel (Serverless)

O projeto já inclui `vercel.json` e `api/index.js` para deploy serverless na Vercel.

### VPS Própria

```bash
git clone <seu-repositorio>
cd barbearia-frontend
npm install
cp cmd/.env.example cmd/.env
# edite o .env
npm install -g pm2
pm2 start cmd/server.js --name barbearia
pm2 save
pm2 startup
```

---

## 🛠️ Tecnologias

**Frontend:** HTML5, CSS3, JavaScript (Vanilla)
**Backend:** Node.js, Express, SQLite3 / Neon (PostgreSQL)
**Integração:** Google Calendar API (OAuth2 / Service Account)

---

## 🔍 Solução de Problemas

| Erro | Causa / Solução |
|------|----------------|
| `GOOGLE_SERVICE_ACCOUNT_KEY não configurado` | Verifique se a variável está no `.env` e o JSON é válido |
| `Erro ao conectar ao banco` | Verifique a `POSTGRES_URL` e se o Neon está ativo |
| `Connection refused` | Verifique se o servidor está rodando |
| `Invalid credentials` | Verifique as credenciais do Google no `.env` |
| `Barbeiro não autorizou Google Calendar` | O barbeiro precisa acessar a URL de autorização |
| `Erro ao criar evento no Google Calendar` | Verifique se o calendário foi compartilhado com a service account |

---

## 🔒 Segurança

- `.env` está no `.gitignore` (nunca commite credenciais)
- `database.sqlite` está no `.gitignore`
- Variáveis de ambiente para todas as credenciais sensíveis