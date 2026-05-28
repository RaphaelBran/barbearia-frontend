# Barbearia 3 Monkeys - Site de Agendamento

Site estático (Single Page Application) para a Barbearia 3 Monkeys com estética de quadrinhos/comics.

## 🎨 Características

- **Estilo Comic Book:** Design inspirado em HQs com bordas pretas grossas e sombras duras
- **Paleta de Cores:** Fundo grafite escuro com vermelho vivo, amarelo neon e azul cyan
- **Mobile-First:** Responsivo para todos os dispositivos
- **3 Barbeiros:** Eduardo, Caique e Jorge
- **Modal Interativo:** Carrossel de serviços e tabela de preços
- **Integração WhatsApp:** Botão fixo para confirmação de agendamento
- **Integração Instagram:** Link direto para o perfil da barbearia

## 📁 Estrutura de Arquivos

```
barbearia/
├── index.html          # Estrutura principal
├── styles.css          # Estilos customizados (efeitos HQ)
├── script.js           # Lógica JavaScript e dados dos barbeiros
├── server.js           # Servidor HTTP simples (Node.js)
├── assets/             # Diretório de imagens
│   ├── README.md       # Instruções para adicionar imagens
│   ├── logo.png        # Logo da 3 Monkeys
│   ├── barber-eduardo.jpg
│   ├── barber-caique.jpg
│   ├── barber-jorge.jpg
│   ├── service-1.jpg
│   ├── service-2.jpg
│   ├── service-3.jpg
│   ├── service-4.jpg
│   └── service-5.jpg
└── README.md           # Este arquivo
```

## 🚀 Como Usar

### Opção 1: Servidor Node.js (Recomendado)

1. Certifique-se de ter o Node.js instalado
2. No terminal, execute:
   ```bash
   node server.js
   ```
3. Abra o navegador em: `http://localhost:8000`

### Opção 2: Abrir Diretamente no Navegador

1. Abra o arquivo `index.html` diretamente no navegador
2. Nota: Algumas funcionalidades podem não funcionar perfeitamente sem um servidor

## 📝 Como Editar

### Alterar Informações dos Barbeiros

Edite o arquivo `script.js` e modifique o array `barbers`:

```javascript
const barbers = [
    {
        id: 1,
        name: "Eduardo",
        photo: "assets/barber-eduardo.jpg",
        calendarLink: "https://calendar.google.com/calendar/u/0/r?pli=1",
        services: [
            { name: "Corte", price: 50 },
            { name: "Barba", price: 50 },
            { name: "Combo", price: 90 }
        ]
    },
    // ... outros barbeiros
];
```

### Alterar Número do WhatsApp

Edite o arquivo `script.js` e modifique a variável:

```javascript
const whatsappNumber = "5515991932175";
```

### Alterar Link do Instagram

Edite o arquivo `index.html` e procure pelo link do Instagram no header.

### Alterar Preços dos Serviços

Edite o arquivo `index.html` e modifique a tabela de preços na seção do modal.

## 🖼️ Como Adicionar Imagens Reais

1. Adicione as imagens no diretório `assets/`
2. Mantenha os nomes dos arquivos conforme especificado em `assets/README.md`
3. Recomendações:
   - Logo: PNG com fundo transparente
   - Fotos dos barbeiros: Formato quadrado (mínimo 300x300px)
   - Fotos dos serviços: Formato paisagem (mínimo 400x300px)

## 🎯 Funcionalidades

### Grid de Barbeiros
- Cards estilo painel de HQ
- Foto circular do barbeiro
- Nome em balão de fala
- Clique para abrir modal

### Modal
- Carrossel com 5 fotos de serviços
- Tabela de preços (Corte: R$50, Barba: R$50, Combo: R$90)
- Botão para Google Calendar (placeholder)

### WhatsApp
- Botão fixo no rodapé
- Gera mensagem pré-definida com dados do agendamento
- Link direto para o WhatsApp da barbearia

## 📱 Responsividade

O site é totalmente responsivo e funciona em:
- Smartphones (mobile-first)
- Tablets
- Desktops

## 🔧 Tecnologias Utilizadas

- HTML5
- Tailwind CSS (via CDN)
- JavaScript (Vanilla)
- Google Fonts (Bangers, Roboto)
- Node.js (para servidor local)

## 📞 Contato

- **WhatsApp:** +55 15 991932175
- **Instagram:** @barbearia3monkeys

---

Desenvolvido para Barbearia 3 Monkeys - Sorocaba/SP
