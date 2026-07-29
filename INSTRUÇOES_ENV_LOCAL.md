# Configuração de Ambiente Local

Para rodar o servidor localmente com banco Neon e Google Calendar, você precisa configurar as variáveis de ambiente no arquivo `.env`.

## Variáveis Necessárias

### 1. POSTGRES_URL (Banco de Dados Neon)
- Obtenha a URL de conexão do seu banco Neon na Vercel
- Vá em: Vercel Dashboard → Seu Projeto → Settings → Environment Variables → POSTGRES_URL
- Copie o valor real (não o [SENSITIVE])
- Formato: `postgres://user:password@host/database?options`

### 2. GOOGLE_SERVICE_ACCOUNT_KEY (Google Calendar Service Account)
- Obtenha a chave JSON da sua Service Account do Google Cloud Console
- Vá em: Vercel Dashboard → Seu Projeto → Settings → Environment Variables → GOOGLE_SERVICE_ACCOUNT_KEY
- Copie o valor real (deve ser um JSON completo)
- Formato: `{"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}`

### 3. GOOGLE_CALENDAR_ID (ID do Calendário)
- Obtenha o ID do calendário que você compartilhou com a Service Account
- Vá em: Vercel Dashboard → Seu Projeto → Settings → Environment Variables → GOOGLE_CALENDAR_ID
- Copie o valor real
- Formato: Pode ser o email do calendário ou um ID como `primary` ou `calendar_id@group.calendar.google.com`

## Como Configurar

1. Abra o arquivo `cmd/.env` na raiz do projeto
2. Substitua os valores `[SENSITIVE]` pelos valores reais obtidos acima
3. Salve o arquivo

## Exemplo de .env

```env
POSTGRES_URL=postgres://neondb_owner:abc123@ep-cool.us-east-2.aws.neon.tech/neondb?sslmode=require
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project","private_key_id":"key-id","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"your-service-account@your-project.iam.gserviceaccount.com","client_id":"123456789","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project.iam.gserviceaccount.com"}
GOOGLE_CALENDAR_ID=seu-email@gmail.com
```

## Como Rodar o Servidor Local

1. Certifique-se de que as dependências estão instaladas:
```bash
npm install
```

2. Inicie o servidor:
```bash
node cmd/server.js
```

3. O servidor tentará:
- Conectar ao banco Neon usando POSTGRES_URL
- Inicializar as tabelas (barbers e bookings)
- Inserir um barbeiro padrão (id=1) se a tabela estiver vazia
- Aceitar requisições de agendamento em `/api/booking`

## Testar Localmente

1. Abra o navegador em `http://localhost:3000`
2. Faça um agendamento completo
3. Verifique no console se:
   - O agendamento foi salvo no banco Neon
   - O evento foi criado no Google Calendar
   - Não há erros de conexão ou autenticação

## Solução de Problemas

### Erro: "GOOGLE_SERVICE_ACCOUNT_KEY não configurado"
- Verifique se a variável está definida no .env
- Verifique se o JSON está completo e válido
- Certifique-se de que as aspas estão corretas

### Erro: "Erro ao conectar ao banco"
- Verifique se POSTGRES_URL está correta
- Verifique se o banco Neon está ativo
- Verifique se a URL tem o formato correto

### Erro: "Cliente JWT não configurado"
- Verifique se GOOGLE_SERVICE_ACCOUNT_KEY é um JSON válido
- Verifique se a chave privada está correta
- Verifique se o email da service account está correto

### Erro: "Erro ao criar evento no Google Calendar"
- Verifique se o calendário foi compartilhado com a service account
- Verifique se GOOGLE_CALENDAR_ID está correto
- Verifique se a service account tem permissão de escrita no calendário
