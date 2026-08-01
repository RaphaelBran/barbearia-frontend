// Configuração Centralizada dos Barbeiros - Sua Barbearia

// URL do Backend - Detecta automaticamente (localhost ou produção)
const API_BASE_URL = window.location.origin;

// Número do WhatsApp para confirmação de agendamento (formato: 5511999999999)
const NUMERO_WHATSAPP = '5515991932175';

const BARBEIROS_CONFIG = {
  barbeiro1: {
    nome: "Barbeiro 1",
    whatsapp: "5515991932175",
    instagram: "https://instagram.com",
    instagramHandle: "@instagram",
    foto: "https://ui-avatars.com/api/?name=Barbeiro+1&background=6c757d&color=fff&size=300",
    trabalhos: [
      "assets/work-1.jpg",
      "assets/work-2.jpg",
      "assets/work-3.jpg",
      "assets/work-4.jpg",
      "assets/work-5.jpg"
    ]
  },
  barbeiro2: {
    nome: "Barbeiro 2",
    whatsapp: "5511999999999",
    instagram: "https://instagram.com",
    instagramHandle: "@instagram",
    foto: "https://ui-avatars.com/api/?name=Barbeiro+2&background=6c757d&color=fff&size=300",
    trabalhos: [
      "assets/work-1.jpg",
      "assets/work-2.jpg",
      "assets/work-3.jpg",
      "assets/work-4.jpg",
      "assets/work-5.jpg"
    ]
  },
  barbeiro3: {
    nome: "Barbeiro 3",
    whatsapp: "5511999999999",
    instagram: "https://instagram.com",
    instagramHandle: "@instagram",
    foto: "https://ui-avatars.com/api/?name=Barbeiro+3&background=6c757d&color=fff&size=300",
    trabalhos: [
      "assets/work-1.jpg",
      "assets/work-2.jpg",
      "assets/work-3.jpg",
      "assets/work-4.jpg",
      "assets/work-5.jpg"
    ]
  }
};

// Variáveis globais
let currentBarberKey = null;
let currentBarber = null;
let bookingData = {
    service: null,
    price: null,
    date: null,
    time: null,
    clientName: null,
    clientPhone: null
};
let currentCalendarDate = new Date();
let carouselIndex = 0;

// Horários disponíveis
const availableTimeSlots = [
    "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
];

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Fechar modal de barbeiro ao clicar fora
    const barberModal = document.getElementById('barber-modal');
    if (barberModal) {
        barberModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeBarberModal();
            }
        });
    }
    
    // Fechar modal de agendamento ao clicar fora
    const bookingModal = document.getElementById('booking-modal');
    if (bookingModal) {
        bookingModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeBookingModal();
            }
        });
    }
    
    // Inicializar máscara de telefone
    initPhoneMask();

    // Menu hamburguer
    const menuToggle = document.getElementById('menuToggle');
    const siteNav = document.getElementById('siteNav');
    if (menuToggle && siteNav) {
        menuToggle.addEventListener('click', function() {
            siteNav.classList.toggle('active');
            const isOpen = siteNav.classList.contains('active');
            menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
        });
        // Fechar menu ao clicar em link
        siteNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                siteNav.classList.remove('active');
                menuToggle.setAttribute('aria-label', 'Abrir menu');
            });
        });
        // Fechar menu ao clicar fora
        document.addEventListener('click', function(e) {
            if (!siteNav.contains(e.target) && !menuToggle.contains(e.target)) {
                siteNav.classList.remove('active');
                menuToggle.setAttribute('aria-label', 'Abrir menu');
            }
        });
    }
});

// ===== FUNÇÕES DO MODAL DE PERFIL DO BARBEIRO =====

// Abrir modal de perfil do barbeiro
function openBarberProfile(barberKey) {
    currentBarberKey = barberKey;
    currentBarber = BARBEIROS_CONFIG[barberKey];

    if (!currentBarber) {
        showToast('Erro: Barbeiro não encontrado', 'error');
        return;
    }

    // Preencher dados do modal
    document.getElementById('barber-modal-img').src = currentBarber.foto;
    document.getElementById('barber-modal-name').textContent = currentBarber.nome;
    document.getElementById('barber-modal-instagram').href = currentBarber.instagram;
    document.getElementById('barber-modal-instagram-text').textContent = currentBarber.instagramHandle;

    // Resetar carrossel
    carouselIndex = 0;
    document.getElementById('carousel-section').classList.remove('active');

    // Mostrar modal
    document.getElementById('barber-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Fechar modal de perfil do barbeiro
function closeBarberModal() {
    document.getElementById('barber-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
    currentBarberKey = null;
    currentBarber = null;
}

// Toggle do carrossel de trabalhos
function toggleCarousel() {
    const carouselSection = document.getElementById('carousel-section');
    carouselSection.classList.toggle('active');
    
    if (carouselSection.classList.contains('active')) {
        initCarousel();
    }
}

// ===== FUNÇÕES DO CARROSSEL =====

// Inicializar carrossel
function initCarousel() {
    const track = document.getElementById('carousel-track');
    const container = document.querySelector('.carousel-container');
    const nav = document.getElementById('carousel-nav');
    
    // Limpar carrossel anterior
    track.innerHTML = '';
    nav.innerHTML = '';
    
    // Criar slides
    currentBarber.trabalhos.forEach((foto, index) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.innerHTML = `<img src="${foto}" alt="Trabalho ${index + 1}" onerror="this.src='assets/logo.png'">`;
        track.appendChild(slide);
        
        // Criar botão de navegação
        const navBtn = document.createElement('button');
        navBtn.className = index === 0 ? 'active' : '';
        navBtn.onclick = () => goToSlide(index);
        nav.appendChild(navBtn);
    });
    
    carouselIndex = 0;
    updateCarousel();
    
    // Touch events para swipe no carrossel
    // AbortController para evitar acúmulo de listeners (memory leak)
    if (container._touchAbort) container._touchAbort.abort();
    container._touchAbort = new AbortController();
    const { signal } = container._touchAbort;

    let touchStartX = 0;
    let touchEndX = 0;
    
    container.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true, signal });
    
    container.addEventListener('touchmove', function(e) {
        touchEndX = e.changedTouches[0].screenX;
    }, { passive: true, signal });
    
    container.addEventListener('touchend', function() {
        const delta = touchStartX - touchEndX;
        if (Math.abs(delta) > 50) {
            if (delta > 0 && carouselIndex < currentBarber.trabalhos.length - 1) {
                goToSlide(carouselIndex + 1);
            } else if (delta < 0 && carouselIndex > 0) {
                goToSlide(carouselIndex - 1);
            }
        }
    }, { passive: true, signal });
}

// Ir para slide específico
function goToSlide(index) {
    carouselIndex = index;
    updateCarousel();
}

// Atualizar carrossel
function updateCarousel() {
    const track = document.getElementById('carousel-track');
    const navBtns = document.querySelectorAll('.carousel-nav button');
    
    track.style.transform = `translateX(-${carouselIndex * 100}%)`;
    
    navBtns.forEach((btn, index) => {
        btn.classList.toggle('active', index === carouselIndex);
    });
}

// ===== FUNÇÕES DO MODAL DE AGENDAMENTO =====

// Abrir modal de agendamento
function openBookingModal() {
    bookingData = {
        service: null,
        price: null,
        date: null,
        time: null,
        clientName: null,
        clientPhone: null
    };
    
    document.getElementById('booking-title').textContent = `Agendar com ${currentBarber.nome}`;
    showBookingScreen(1);
    
    document.getElementById('booking-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Fechar modal de agendamento
function closeBookingModal() {
    document.getElementById('booking-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Limpar dados ao fechar
    bookingData = {
        service: null,
        price: null,
        date: null,
        time: null,
        clientName: null,
        clientPhone: null
    };
}

// Mostrar tela específica do agendamento
function showBookingScreen(screenNumber) {
    for (let i = 1; i <= 5; i++) {
        const screen = document.getElementById(`booking-screen-${i}`);
        if (screen) {
            screen.classList.add('hidden');
        }
    }
    
    const targetScreen = document.getElementById(`booking-screen-${screenNumber}`);
    if (targetScreen) {
        targetScreen.classList.remove('hidden');
    } else {
        console.error(`Tela ${screenNumber} não encontrada!`);
    }
    
    // Renderizar botão Voltar (telas 2, 3 e 4)
    renderBackButton(screenNumber);
    
    // Renderizar stepper de progresso (telas 1-4)
    renderStepper(screenNumber);
    
    if (screenNumber === 2) {
        initCalendar();
    } else if (screenNumber === 3) {
        initTimeSlots();
    }
}

// Renderizar botão Voltar dinamicamente
function renderBackButton(screenNumber) {
    const bookingBody = document.querySelector('.booking-body');
    // Remover botão existente se houver
    const existingBtn = bookingBody.querySelector('.booking-back-btn');
    if (existingBtn) existingBtn.remove();
    
    // Só mostrar nas telas 2, 3 e 4
    if (screenNumber >= 2 && screenNumber <= 4) {
        const backBtn = document.createElement('button');
        backBtn.className = 'booking-back-btn';
        backBtn.innerHTML = '← Voltar';
        backBtn.onclick = () => showBookingScreen(screenNumber - 1);
        bookingBody.insertBefore(backBtn, bookingBody.firstChild.nextSibling || bookingBody.firstChild);
        // Inserir após o container do stepper
        const progressContainer = document.getElementById('booking-progress-container');
        if (progressContainer && progressContainer.nextSibling) {
            bookingBody.insertBefore(backBtn, progressContainer.nextSibling);
        } else {
            bookingBody.insertBefore(backBtn, bookingBody.firstChild);
        }
    }
}

// Renderizar stepper de progresso
function renderStepper(screenNumber) {
    const container = document.getElementById('booking-progress-container');
    if (!container) return;
    container.innerHTML = '';
    
    // Só mostrar nas telas 1-4
    if (screenNumber < 1 || screenNumber > 4) return;
    
    const steps = [
        { num: 1, label: 'Serviço' },
        { num: 2, label: 'Data' },
        { num: 3, label: 'Horário' },
        { num: 4, label: 'Dados' }
    ];
    
    const stepper = document.createElement('div');
    stepper.className = 'booking-progress';
    
    steps.forEach((step, index) => {
        // Step circle + label
        const stepEl = document.createElement('div');
        stepEl.className = 'progress-step';
        if (step.num === screenNumber) {
            stepEl.classList.add('active');
        } else if (step.num < screenNumber) {
            stepEl.classList.add('completed');
        }
        
        const circle = document.createElement('div');
        circle.className = 'step-circle';
        circle.textContent = step.num < screenNumber ? '✓' : step.num;
        
        const label = document.createElement('div');
        label.className = 'step-label';
        label.textContent = step.label;
        
        stepEl.appendChild(circle);
        stepEl.appendChild(label);
        stepper.appendChild(stepEl);
        
        // Linha conectora (exceto após o último)
        if (index < steps.length - 1) {
            const line = document.createElement('div');
            line.className = 'progress-line';
            if (step.num < screenNumber) {
                line.classList.add('completed');
            }
            stepper.appendChild(line);
        }
    });
    
    container.appendChild(stepper);
}

// Seleção de Serviço
function selectService(serviceName, price) {
    bookingData.service = serviceName;
    bookingData.price = price;
    showBookingScreen(2);
}

// ===== FUNÇÕES DO CALENDÁRIO =====

function initCalendar() {
    currentCalendarDate = new Date();
    renderCalendar();
}

function renderCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    const currentMonthEl = document.getElementById('current-month');
    
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    currentMonthEl.textContent = `${monthNames[month]} ${year}`;
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    calendarGrid.innerHTML = '';
    
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    weekDays.forEach(day => {
        const dayEl = document.createElement('div');
        dayEl.style.fontWeight = '600';
        dayEl.style.color = '#4a4a4a';
        dayEl.style.fontSize = '14px';
        dayEl.textContent = day;
        calendarGrid.appendChild(dayEl);
    });
    
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        calendarGrid.appendChild(emptyDay);
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayEl = document.createElement('button');
        
        const isPast = date < today;
        
        dayEl.className = 'calendar-day';
        if (isPast) {
            dayEl.classList.add('disabled');
        }
        dayEl.textContent = day;
        
        if (!isPast) {
            dayEl.onclick = () => selectDate(date);
        }
        
        calendarGrid.appendChild(dayEl);
    }
}

function changeMonth(delta) {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + delta);
    renderCalendar();
}

function selectDate(date) {
    bookingData.date = date;
    showBookingScreen(3);
    
    // Mostrar loading state na área dos horários
    const timeGrid = document.getElementById('time-grid');
    timeGrid.innerHTML = '<div class="time-grid-loading"><div class="spinner"></div><span>Carregando horários...</span></div>';
    
    // Consultar horários ocupados para esta data em background
    const formattedDate = date.toISOString().split('T')[0];
    const barberId = getBarberId(currentBarberKey);
    
    fetch(`${API_BASE_URL}/api/booking/available/${barberId}/${formattedDate}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                bookingData.bookedTimes = data.bookedTimes;
                // Re-renderizar horários com os dados atualizados
                initTimeSlots();
            }
        })
        .catch(error => {
            console.error('Erro ao verificar horários disponíveis:', error);
            // Em caso de erro, mostrar horários vazios
            initTimeSlots();
        });
}

// ===== FUNÇÕES DE HORÁRIOS =====

function initTimeSlots() {
    const timeGrid = document.getElementById('time-grid');
    timeGrid.innerHTML = '';
    
    const bookedTimes = bookingData.bookedTimes || [];
    
    availableTimeSlots.forEach(time => {
        const timeBtn = document.createElement('button');
        timeBtn.className = 'time-slot';
        timeBtn.textContent = time;
        
        // Verificar se o horário está ocupado
        if (bookedTimes.includes(time)) {
            timeBtn.classList.add('disabled');
            timeBtn.disabled = true;
            timeBtn.title = 'Horário já ocupado';
        } else {
            timeBtn.onclick = () => selectTime(time);
        }
        
        timeGrid.appendChild(timeBtn);
    });
}

function selectTime(time) {
    bookingData.time = time;
    showBookingScreen(4);
}

// ===== FUNÇÕES DE CONFIRMAÇÃO =====

function confirmBooking() {
    const clientName = document.getElementById('client-name').value;
    const clientPhone = document.getElementById('client-phone').value;
    
    if (!clientName || !clientPhone) {
        showToast('Por favor, preencha todos os campos', 'error');
        return;
    }
    
    bookingData.clientName = clientName;
    bookingData.clientPhone = clientPhone;
    
    // Formatar data para YYYY-MM-DD
    const formattedDate = bookingData.date.toISOString().split('T')[0];
    
    // Formatar mensagem para WhatsApp (independente da API)
    const formattedDateBR = bookingData.date.toLocaleDateString('pt-BR');
    // Mensagem para WhatsApp (usada como fallback se API falhar)
    const message = `Olá! Confirmo meu agendamento:\n\n` +
        `🔹Cliente: ${bookingData.clientName}\n` +
        `🔹Serviço: ${bookingData.service}\n` +
        `🔹Data: ${formattedDateBR}\n` +
        `🔹Horário: ${bookingData.time}\n` +
        `🔹Valor: R$ ${bookingData.price}`;
    
    // Mostrar toast de sucesso
    showToast('Agendamento confirmado com sucesso!', 'success');
    
    // Mostrar tela de sucesso (screen 5)
    showBookingScreen(5);
    
    // Enviar agendamento para o backend em background (não bloqueia o fluxo)
    const barberId = getBarberId(currentBarberKey);
    
    const bookingPayload = {
        barber_id: barberId,
        client_name: clientName,
        client_phone: clientPhone,
        service: bookingData.service,
        price: bookingData.price,
        booking_date: formattedDate,
        booking_time: bookingData.time
    };
    
    // Não fechar modais automaticamente - usuário verá tela de sucesso
    // Os dados serão limpos quando o usuário clicar Fechar
    
    fetch(`${API_BASE_URL}/api/booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Agendamento criado com sucesso
        } else {
            console.error('Erro ao criar agendamento:', data);
        }
    })
    .catch(error => {
        console.error('Erro ao enviar agendamento:', error);
        // Fallback: abrir WhatsApp se API falhar
        const whatsappUrl = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(message)}`;
        const link = document.createElement('a');
        link.href = whatsappUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.click();
        showToast('Erro ao conectar ao servidor. Redirecionando para WhatsApp...', 'error');
    });
}

// Mapeamento de barbeiro para ID do banco de dados
function getBarberId(barberKey) {
    const barberIds = {
        'barbeiro1': 1,
        'barbeiro2': 2,
        'barbeiro3': 3
    };
    return barberIds[barberKey] || 1;
}

// ===== TOAST NOTIFICATION =====

function showToast(message, type = '') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = 'toast';
    if (type) toast.classList.add(type);
    
    // Forçar reflow para reiniciar animação
    void toast.offsetWidth;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// ===== MÁSCARA DE TELEFONE =====

function initPhoneMask() {
    const phoneInput = document.getElementById('client-phone');
    if (!phoneInput) return;
    
    phoneInput.addEventListener('input', function(e) {
        // Remover tudo que não é dígito
        let value = e.target.value.replace(/\D/g, '');
        // Limitar a 11 dígitos
        value = value.slice(0, 11);
        
        // Formatar progressivamente
        if (value.length > 7) {
            value = `(${value.slice(0,2)}) ${value.slice(2,7)}-${value.slice(7)}`;
        } else if (value.length > 2) {
            value = `(${value.slice(0,2)}) ${value.slice(2)}`;
        } else if (value.length > 0) {
            value = `(${value}`;
        }
        
        e.target.value = value;
    });
}

// ===== FECHAR MODAIS COM ESC =====

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeBarberModal();
        closeBookingModal();
    }
});
