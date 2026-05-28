// Configuração Centralizada dos Barbeiros - Barbearia 3 Monkeys

// URL do Backend - Mude para produção quando deployar
const API_BASE_URL = 'https://barbearia-backend-production-a5ef.up.railway.app';

const BARBEIROS_CONFIG = {
  eduardo: {
    nome: "Eduardo",
    whatsapp: "5515991932175",
    instagram: "https://www.instagram.com/de_lara_barber/",
    instagramHandle: "@de_lara_barber",
    foto: "assets/barber-eduardo.jpg",
    trabalhos: [
      "assets/work-1.jpg",
      "assets/work-2.jpg",
      "assets/work-3.jpg",
      "assets/work-4.jpg",
      "assets/work-5.jpg"
    ]
  },
  caique: {
    nome: "Caique",
    whatsapp: "5515999999999",
    instagram: "https://www.instagram.com/caique_de_lara/",
    instagramHandle: "@caique_de_lara",
    foto: "assets/barber-caique.jpg",
    trabalhos: [
      "assets/work-1.jpg",
      "assets/work-2.jpg",
      "assets/work-3.jpg",
      "assets/work-4.jpg",
      "assets/work-5.jpg"
    ]
  },
  jorge: {
    nome: "Jorge",
    whatsapp: "5515999999999",
    instagram: "https://www.instagram.com/barbeirogeorge/",
    instagramHandle: "@barbeirogeorge",
    foto: "assets/barber-jorge.jpg",
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
});

// ===== FUNÇÕES DO MODAL DE PERFIL DO BARBEIRO =====

// Abrir modal de perfil do barbeiro
function openBarberProfile(barberKey) {
    currentBarberKey = barberKey;
    currentBarber = BARBEIROS_CONFIG[barberKey];
    
    if (!currentBarber) {
        alert('Erro: Barbeiro não encontrado');
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
    }
    
    if (screenNumber === 2) {
        initCalendar();
    } else if (screenNumber === 3) {
        initTimeSlots();
    }
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
    
    // Consultar horários ocupados para esta data
    const formattedDate = date.toISOString().split('T')[0];
    const barberId = getBarberId(currentBarberKey);
    
    fetch(`${API_BASE_URL}/api/booking/available/${barberId}/${formattedDate}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                bookingData.bookedTimes = data.bookedTimes;
            }
            showBookingScreen(3);
        })
        .catch(error => {
            console.error('Erro ao verificar horários disponíveis:', error);
            showBookingScreen(3);
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
        alert('Por favor, preencha todos os campos');
        return;
    }
    
    bookingData.clientName = clientName;
    bookingData.clientPhone = clientPhone;
    
    // Formatar data para YYYY-MM-DD
    const formattedDate = bookingData.date.toISOString().split('T')[0];
    
    // Enviar agendamento para o backend
    fetch(`${API_BASE_URL}/api/booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            barber_id: getBarberId(currentBarberKey),
            client_name: bookingData.clientName,
            client_phone: bookingData.clientPhone,
            service: bookingData.service,
            price: bookingData.price,
            booking_date: formattedDate,
            booking_time: bookingData.time
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Agendamento criado com sucesso:', data.booking);
            
            // Criar evento no Google Calendar
            return fetch(`${API_BASE_URL}/api/calendar/event`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    barber_id: getBarberId(currentBarberKey),
                    client_name: bookingData.clientName,
                    service: bookingData.service,
                    booking_date: formattedDate,
                    booking_time: bookingData.time
                })
            });
        } else {
            throw new Error('Erro ao criar agendamento');
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Evento criado no Google Calendar:', data.eventId);
        } else {
            console.warn('Evento não criado no calendário, mas agendamento foi salvo');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        // Continuar mesmo se houver erro no calendário
    })
    .finally(() => {
        showBookingScreen(5);
        
        // Fechar modais automaticamente após 2 segundos
        setTimeout(() => {
            closeBookingModal();
            closeBarberModal();
        }, 2000);
    });
}

// Mapeamento de barbeiro para ID do banco de dados
function getBarberId(barberKey) {
    const barberIds = {
        'eduardo': 1,
        'caique': 2,
        'jorge': 3
    };
    return barberIds[barberKey] || 1;
}

// ===== FECHAR MODAIS COM ESC =====

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeBarberModal();
        closeBookingModal();
    }
});
