# Sistema de Agendamento para Barbearia

Landing page para barbearia com agendamento via WhatsApp. Frontend puro, sem backend, sem banco de dados.

## 📋 Funcionalidades

- **Perfil dos barbeiros** com foto, Instagram e carrossel de trabalhos
- **Agendamento em 5 etapas:** serviço → data → horário → dados → confirmação
- **WhatsApp Deep Link:** ao confirmar, abre o WhatsApp do barbeiro com a mensagem pronta
- **Design responsivo:** mobile-first, funciona em qualquer dispositivo

## 📁 Estrutura

```
barbearia-frontend/
├── index.html        # Página principal
├── styles.css        # Estilos
├── script.js         # Lógica JS e dados dos barbeiros
├── server.js         # Servidor estático (Node.js puro)
├── assets/           # Imagens (work-1.jpg ~ work-5.jpg)
└── package.json      # Configuração do projeto
```

## 🚀 Como usar

```bash
# Iniciar servidor
npm start

# Ou, se não quiser instalar nada:
npx serve .
```

Acesse em: **http://localhost:3000**

## 💬 Fluxo de agendamento

1. Clique em um barbeiro → veja o perfil
2. Clique em "Agendar Horário"
3. Escolha: **serviço** → **data** → **horário** → **seus dados**
4. Confirme → o **WhatsApp abre automaticamente** com a mensagem pronta

O barbeiro recebe a mensagem e combina o resto diretamente com o cliente. Simples e sem complicação.

## 📝 Personalizar barbeiros

Edite `script.js` → constante `BARBEIROS_CONFIG`:

```javascript
const BARBEIROS_CONFIG = {
  barbeiro1: {
    nome: "Eduardo",
    whatsapp: "5515991932175",   // Telefone com DDI
    instagram: "https://instagram.com/de_lara_barber/",
    instagramHandle: "@de_lara_barber",
    foto: "https://ui-avatars.com/api/?name=Eduardo&background=2d2d2d&color=fff&size=300",
    trabalhos: ["assets/work-1.jpg", "assets/work-2.jpg"]
  }
};
```

## 🖼️ Imagens

Coloque em `assets/`:
- Fotos de trabalhos: `work-1.jpg` ~ `work-5.jpg` (formato paisagem, 400×300px+)

## 🛠️ Tecnologias

HTML5, CSS3, JavaScript (Vanilla) — sem frameworks, sem dependências.

## 🔒 Segurança

- Nenhum dado é armazenado em servidor
- O agendamento vai direto para o WhatsApp do barbeiro
- Sem banco de dados, sem API, sem cadastro